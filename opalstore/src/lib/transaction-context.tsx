"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  addTransaction: (trx: Transaction) => void;
  updateTransactionStatus: (orderId: string, status: Transaction["status"]) => void;
  cancelTransaction: (orderId: string) => void;
  getTransaction: (orderId: string) => Transaction | undefined;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("opalstore_transactions");
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch {
        localStorage.removeItem("opalstore_transactions");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("opalstore_transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = (trx: Transaction) => {
    setTransactions((prev) => [trx, ...prev]);
  };

  const updateTransactionStatus = (orderId: string, status: Transaction["status"]) => {
    setTransactions((prev) =>
      prev.map((trx) =>
        trx.orderId === orderId ? { ...trx, status } : trx
      )
    );
  };

  const cancelTransaction = (orderId: string) => {
    setTransactions((prev) =>
      prev.map((trx) =>
        trx.orderId === orderId && trx.status === "pending"
          ? { ...trx, status: "cancelled" }
          : trx
      )
    );
  };

  const getTransaction = (orderId: string) => {
    return transactions.find((trx) => trx.orderId === orderId);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransactionStatus,
        cancelTransaction,
        getTransaction,
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
