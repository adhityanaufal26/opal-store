"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export interface Transaction {
  id: string;
  orderId: string;
  date: string;
  product: string;
  variant: string;
  quantity: number;
  total: number;
  paymentMethod: string;
  status: "pending" | "success" | "failed" | "cancelled";
  customerEmail: string;
  customerWhatsapp: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (trx: Transaction) => void;
  updateTransactionStatus: (orderId: string, status: Transaction["status"]) => void;
  cancelTransaction: (orderId: string) => void;
  getTransaction: (orderId: string) => Transaction | undefined;
  refreshTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: session } = useSession();

  // Get user email for API calls
  const getUserEmail = (): string | null => {
    // Priority 1: NextAuth session
    if (session?.user?.email) return session.user.email;
    // Priority 2: localStorage user
    try {
      const saved = localStorage.getItem("opalstore_user");
      if (saved) {
        const user = JSON.parse(saved);
        if (user.email) return user.email;
      }
    } catch {}
    return null;
  };

  // Fetch from MongoDB API
  const fetchFromAPI = async (email: string): Promise<Transaction[]> => {
    try {
      const res = await fetch("/api/transactions?userId=" + encodeURIComponent(email));
      const data = await res.json();
      if (data.success && data.data) {
        // Map MongoDB fields to frontend Transaction interface
        return data.data.map((t: any) => ({
          id: t._id || t.orderId,
          orderId: t.orderId,
          date: t.createdAt || t.date,
          product: t.productName || t.product,
          variant: t.variantName || t.variant,
          quantity: t.quantity,
          total: t.amount || t.total,
          paymentMethod: t.paymentMethod,
          status: t.status,
          customerEmail: t.email || t.customerEmail,
          customerWhatsapp: t.whatsappNumber || t.customerWhatsapp,
        }));
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch transactions from API:", err);
      return [];
    }
  };

  // Load transactions on mount: API only, no localStorage cross-account leak
  useEffect(() => {
    const loadTransactions = async () => {
      const email = getUserEmail();
      const cachedEmail = localStorage.getItem("opalstore_trx_email");

      // Account changed — clear stale localStorage immediately
      if (cachedEmail && email && cachedEmail !== email) {
        localStorage.removeItem("opalstore_transactions");
        setTransactions([]);
      }

      if (email) {
        // Always fetch from MongoDB API — single source of truth
        localStorage.setItem("opalstore_trx_email", email);
        const apiTransactions = await fetchFromAPI(email);
        setTransactions(apiTransactions);
        // Cache for offline/faster reload (same account only)
        localStorage.setItem("opalstore_transactions", JSON.stringify(apiTransactions));
      } else {
        // No email (logged out) — clear everything
        localStorage.removeItem("opalstore_transactions");
        localStorage.removeItem("opalstore_trx_email");
        setTransactions([]);
      }
      setIsLoaded(true);
    };

    loadTransactions();
  }, [session?.user?.email]);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("opalstore_transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (trx: Transaction) => {
    setTransactions((prev) => [trx, ...prev]);
  };

  const updateTransactionStatus = async (orderId: string, status: Transaction["status"]) => {
    // Update local state immediately
    setTransactions((prev) =>
      prev.map((trx) =>
        trx.orderId === orderId ? { ...trx, status } : trx
      )
    );
    
    // Also update in MongoDB
    try {
      await fetch("/api/transactions/" + encodeURIComponent(orderId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Failed to update transaction status in API:", err);
    }
  };

  const cancelTransaction = async (orderId: string) => {
    // Update local state immediately
    setTransactions((prev) =>
      prev.map((trx) =>
        trx.orderId === orderId && trx.status === "pending"
          ? { ...trx, status: "cancelled" }
          : trx
      )
    );
    
    // Also update in MongoDB
    try {
      await fetch("/api/transactions/" + encodeURIComponent(orderId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
    } catch (err) {
      console.error("Failed to cancel transaction in API:", err);
    }
  };

  const getTransaction = (orderId: string) => {
    return transactions.find((trx) => trx.orderId === orderId);
  };

  const refreshTransactions = async () => {
    const email = getUserEmail();
    if (email) {
      const apiTransactions = await fetchFromAPI(email);
      if (apiTransactions.length > 0) {
        setTransactions(apiTransactions);
      }
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading: !isLoaded,
        addTransaction,
        updateTransactionStatus,
        cancelTransaction,
        getTransaction,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}
