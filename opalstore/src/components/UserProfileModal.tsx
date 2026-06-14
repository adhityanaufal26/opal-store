"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { data: session } = useSession();
  const { user, logout } = useAuth();
  const router = useRouter();
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

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 overflow-hidden" style={{ background: '#161b22' }} onClick={(e) => e.stopPropagation()}>
          <div className="relative h-24" style={{ background: 'linear-gradient(135deg, #e84393, #6c5ce7, #0984e3)' }}>
            <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center -mt-12">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-24 h-24 rounded-full border-4 border-[#161b22] object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-[#161b22] flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #e84393, #6c5ce7)' }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="text-center px-6 pt-3 pb-4">
            <h3 className="text-xl font-bold text-white">{displayName}</h3>
            <p className="text-white/50 text-sm mt-1">{displayEmail}</p>
          </div>

          <div className="flex border-b border-white/10">
            <button onClick={() => setActiveTab('profile')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-white border-b-2 border-purple-500' : 'text-white/40 hover:text-white/70'}`}>
              Profil
            </button>
            <button onClick={() => setActiveTab('password')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'password' ? 'text-white border-b-2 border-purple-500' : 'text-white/40 hover:text-white/70'}`}>
              Perbarui Kata Sandi
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-xs text-white/40">Nama</p>
                      <p className="text-sm text-white">{displayName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-xs text-white/40">Email</p>
                      <p className="text-sm text-white">{displayEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction History Button */}
                <button 
                  onClick={() => handleNavigate('/transactions')} 
                  className="w-full py-3 rounded-xl text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Riwayat Transaksi
                </button>

                <button onClick={handleLogout} className="w-full py-3 rounded-xl text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors">
                  Keluar
                </button>
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                {passwordMsg && (
                  <div className={`p-3 rounded-xl text-sm ${passwordMsg.includes('berhasil') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {passwordMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Password Saat Ini</label>
                  <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" placeholder="Masukkan password saat ini" required />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Password Baru</label>
                  <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" placeholder="Masukkan password baru" required />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Konfirmasi Password Baru</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" placeholder="Ulangi password baru" required />
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #e84393, #6c5ce7)' }}>
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
