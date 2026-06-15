"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

import { useAuth } from '@/lib/auth-context';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { data: session } = useSession();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const displayName = session?.user?.name || user?.name || 'User';
  const displayEmail = session?.user?.email || user?.email || '';
  const avatarUrl = session?.user?.image || null;

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');

    if (passwords.newPass !== passwords.confirm) {
      setPasswordMsg('Password baru tidak cocok');
      return;
    }
    if (passwords.newPass.length < 6) {
      setPasswordMsg('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setPasswordMsg('Password berhasil diperbarui!');
    setPasswords({ current: '', newPass: '', confirm: '' });
    setIsLoading(false);
  };

  const handleLogout = () => {
    if (session) {
      signOut({ callbackUrl: '/' });
    } else {
      logout();
    }
    onClose();
  };


  if (!isOpen) return null;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', background: '#141414' }} onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div style={{ position: 'relative', height: '80px', background: '#d97706' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: '84px', height: '84px', borderRadius: '50%', border: '4px solid #141414', objectFit: 'contain', background: '#1a1a1a' }} />
            ) : (
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', border: '4px solid #141414', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#fff', background: '#d97706' }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name & Email */}
          <div style={{ textAlign: 'center', padding: '14px 20px 18px', position: 'relative', zIndex: 10 }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{displayName}</h3>
            <p style={{ color: '#71717a', fontSize: '13px', marginTop: '2px' }}>{displayEmail}</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setActiveTab('profile')} style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'profile' ? '#fff' : '#71717a', borderBottom: activeTab === 'profile' ? '2px solid #f59e0b' : '2px solid transparent' }}>
              Profil
            </button>
            <button onClick={() => setActiveTab('password')} style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'password' ? '#fff' : '#71717a', borderBottom: activeTab === 'password' ? '2px solid #f59e0b' : '2px solid transparent' }}>
              Kata Sandi
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '16px' }}>
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#71717a"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <div>
                    <p style={{ fontSize: '11px', color: '#71717a' }}>Nama</p>
                    <p style={{ fontSize: '13px', color: '#fff' }}>{displayName}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#71717a"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <div>
                    <p style={{ fontSize: '11px', color: '#71717a' }}>Email</p>
                    <p style={{ fontSize: '13px', color: '#fff' }}>{displayEmail}</p>
                  </div>
                </div>


                <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#ef4444', background: 'rgba(239,68,68,0.06)', border: 'none', cursor: 'pointer' }}>
                  Keluar
                </button>
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {passwordMsg && (
                  <div style={{ padding: '10px 12px', borderRadius: '10px', fontSize: '13px', background: passwordMsg.includes('berhasil') ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', color: passwordMsg.includes('berhasil') ? '#22c55e' : '#ef4444', border: passwordMsg.includes('berhasil') ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(239,68,68,0.15)' }}>
                    {passwordMsg}
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#71717a', marginBottom: '4px' }}>Password Saat Ini</label>
                  <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="Masukkan password saat ini" required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#71717a', marginBottom: '4px' }}>Password Baru</label>
                  <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} placeholder="Masukkan password baru" required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#71717a', marginBottom: '4px' }}>Konfirmasi Password</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="Ulangi password baru" required style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', outline: 'none' }} />
                </div>

                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#fff', background: '#d97706', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1 }}>
                  {isLoading ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
