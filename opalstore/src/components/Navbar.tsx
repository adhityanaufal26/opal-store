"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/data";
import { useTransactions } from "@/lib/transaction-context";
import UserProfileModal from "./UserProfileModal";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: session } = useSession();
  const { transactions } = useTransactions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const navLinks: { href: string; label: string }[] = user || session ? [{ href: "/dashboard", label: "Dashboard" }] : [];

  const isActive = (path: string) => pathname === path;

  const displayName = session?.user?.name || user?.name || "User";
  const avatarUrl = session?.user?.image || null;
  const currentEmail = session?.user?.email || user?.email || "";
  const isUserAdmin = isAdmin(currentEmail);
  
  // Count pending transactions
  const pendingCount = transactions.filter(t => t.status === "pending").length;

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logo.jpg" alt="OpalStore" style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "contain", flexShrink: 0, aspectRatio: "1/1" }} />
              <span className="text-lg font-bold">OpalStore</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors ${isActive(link.href) ? "text-white" : "text-white/50 hover:text-white"}`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user || session ? (
                <>
                  {/* Transaction History Button */}
                  <Link 
                    href="/transactions" 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors relative"
                    style={{ color: isActive("/transactions") ? "#FF6B2C" : "rgba(255,255,255,0.5)" }}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="text-sm font-medium">Transaksi</span>
                    {pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 text-xs font-bold flex items-center justify-center" style={{ fontSize: "10px" }}>
                        {pendingCount}
                      </span>
                    )}
                  </Link>

                  {/* Admin Button - Only for admin */}
                  {isUserAdmin && (
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                      style={{ color: pathname === "/admin" ? "#FF6B2C" : "rgba(255,255,255,0.5)" }}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">Admin</span>
                    </Link>
                  )}

                  {/* User Avatar - Click to open profile */}
                  <button onClick={() => setProfileModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #e84393, #6c5ce7)" }}>
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-white/70">{displayName}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="px-5 py-2 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg, #e84393, #fd79a8)" }}>
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10" style={{ background: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)" }}>
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(link.href) ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-white/10 space-y-2">
                {user || session ? (
                  <>
                    {/* Transaction History - Mobile */}
                    <Link href="/transactions" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors relative">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Riwayat Transaksi
                      {pendingCount > 0 && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-yellow-500 text-xs font-bold flex items-center justify-center" style={{ fontSize: "10px" }}>
                          {pendingCount}
                        </span>
                      )}
                    </Link>

                    {/* Admin Link - Only for admin */}
                    {isUserAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { setProfileModalOpen(true); setMobileMenuOpen(false); }} className="w-full px-4 py-3 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                      Profil Saya
                    </button>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-center text-sm text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition-colors">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-center text-sm text-white font-semibold rounded-xl" style={{ background: "linear-gradient(135deg, #e84393, #fd79a8)" }}>
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <UserProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
}
