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

  const navLinks: { href: string; label: string }[] = [];

  const isActive = (path: string) => pathname === path;

  const displayName = session?.user?.name || user?.name || "User";
  const avatarUrl = session?.user?.image || null;
  const currentEmail = session?.user?.email || user?.email || "";
  const isUserAdmin = isAdmin(currentEmail);

  const pendingCount = transactions.filter(t => t.status === "pending").length;

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 z-50">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <img src="/logo.jpg" alt="OpalStore" style={{ width: "32px", height: "32px", borderRadius: "8px", objectFit: "cover" }} />
              <span style={{ fontSize: "17px", fontWeight: "700", color: "#fff" }}>OpalStore</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: "32px" }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: "14px", fontWeight: "500", color: isActive(link.href) ? "#fff" : "#71717a", textDecoration: "none", transition: "color 0.2s" }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex" style={{ alignItems: "center", gap: "12px" }}>
              {user || session ? (
                <>
                  <Link
                    href="/transactions"
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "10px", color: isActive("/transactions") ? "#d4aa7d" : "#71717a", textDecoration: "none", transition: "color 0.2s", position: "relative" }}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>Transaksi</span>
                    {pendingCount > 0 && (
                      <span style={{ position: "absolute", top: "-4px", right: "-4px", width: "18px", height: "18px", borderRadius: "50%", background: "#eab308", fontSize: "10px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
                        {pendingCount}
                      </span>
                    )}
                  </Link>

                  {isUserAdmin && (
                    <Link
                      href="/admin"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "10px", color: pathname === "/admin" ? "#d4aa7d" : "#71717a", textDecoration: "none", transition: "color 0.2s" }}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>Admin</span>
                    </Link>
                  )}

                  <button onClick={() => setProfileModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "10px", background: "none", border: "none", cursor: "pointer", transition: "background 0.2s" }}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", color: "#fff", background: "#c49a6c" }}>
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#a1a1aa" }}>{displayName}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" style={{ padding: "8px 16px", fontSize: "14px", fontWeight: "500", color: "#71717a", textDecoration: "none", transition: "color 0.2s" }}>
                    Login
                  </Link>
                  <Link href="/register" style={{ padding: "10px 20px", fontSize: "14px", fontWeight: "600", color: "#fff", background: "#c49a6c", borderRadius: "10px", textDecoration: "none", transition: "all 0.2s" }}>
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" style={{ padding: "8px", borderRadius: "8px", background: "none", border: "none", cursor: "pointer" }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#fff">
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
          <div className="md:hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)" }}>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", fontWeight: "500", color: isActive(link.href) ? "#fff" : "#71717a", textDecoration: "none", background: isActive(link.href) ? "rgba(255,255,255,0.05)" : "transparent", transition: "all 0.2s" }}>
                  {link.label}
                </Link>
              ))}

              <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {user || session ? (
                  <>
                    <Link href="/transactions" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", color: "#a1a1aa", textDecoration: "none", position: "relative" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                      Riwayat Transaksi
                      {pendingCount > 0 && (
                        <span style={{ marginLeft: "auto", width: "18px", height: "18px", borderRadius: "50%", background: "#eab308", fontSize: "10px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
                          {pendingCount}
                        </span>
                      )}
                    </Link>

                    {isUserAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", color: "#a1a1aa", textDecoration: "none" }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { setProfileModalOpen(true); setMobileMenuOpen(false); }} style={{ width: "100%", padding: "12px 16px", textAlign: "left", fontSize: "14px", color: "#a1a1aa", background: "none", border: "none", borderRadius: "10px", cursor: "pointer" }}>
                      Profil Saya
                    </button>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ width: "100%", padding: "12px 16px", textAlign: "left", fontSize: "14px", color: "#ef4444", background: "none", border: "none", borderRadius: "10px", cursor: "pointer" }}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "12px 16px", textAlign: "center", fontSize: "14px", color: "#71717a", textDecoration: "none", borderRadius: "10px" }}>
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "12px 16px", textAlign: "center", fontSize: "14px", fontWeight: "600", color: "#fff", background: "#c49a6c", borderRadius: "10px", textDecoration: "none" }}>
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
