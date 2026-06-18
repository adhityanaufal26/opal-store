'use client';

import { useState, Suspense, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Turnstile from '@/components/Turnstile';
import '../auth.css';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { data: session, status } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  const urlError = searchParams?.get('error');
  const errorMsg = urlError === 'OAuthSignin' 
    ? 'Login Google gagal. Client ID belum dikonfigurasi.' 
    : urlError === 'OAuthCallback' 
    ? 'Login Google gagal. Terjadi kesalahan.' 
    : urlError 
    ? 'Login gagal: ' + urlError 
    : '';
  const [error, setError] = useState(errorMsg);

  const verifyTurnstile = async (): Promise<boolean> => {
    if (!turnstileToken) {
      setError('Verifikasi anti-bot diperlukan');
      return false;
    }
    try {
      const res = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const data = await res.json();
      if (!data.success) {
        setError('Verifikasi gagal. Silakan coba lagi.');
        setTurnstileToken(null);
        return false;
      }
      return true;
    } catch {
      setError('Verifikasi gagal. Silakan coba lagi.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const valid = await verifyTurnstile();
    if (!valid) return;
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!turnstileToken) {
      setError('Verifikasi anti-bot diperlukan');
      return;
    }
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Login Google gagal.');
      setIsLoading(false);
    }
  };

  const handleTurnstileError = useCallback(() => setError('Verifikasi anti-bot gagal'), []);

  return (
    <div className="auth-page">
      {/* Background Effects */}
      <div className="auth-bg-grid" />
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />
      <div className="auth-bg-glow auth-bg-glow-3" />

      {/* Floating Particles */}
      <div className="auth-particles">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className={`auth-particle auth-particle-${i}`} />
        ))}
      </div>

      {/* Animated Lines */}
      <div className="auth-lines">
        <div className="auth-line auth-line-1" />
        <div className="auth-line auth-line-2" />
        <div className="auth-line auth-line-3" />
      </div>

      {/* Main Content */}
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <h1 className="auth-branding-title">
            Selamat Datang
            <br />
            <span className="auth-branding-gradient">Kembali</span>
          </h1>
          <p className="auth-branding-desc">
            Dapatkan akses ke koleksi template, tools automation, AI prompts,
            dan resources premium untuk meningkatkan produktivitas bisnis Anda.
          </p>

        </div>

        {/* Right Side - Form */}
        <div className="auth-card">
          <div className="auth-card-inner">
            {/* Google Login — only show after Turnstile verification */}
            {turnstileToken && (
            <div className="auth-social">
              <button onClick={handleGoogleLogin} disabled={isLoading} className="auth-social-btn google">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Masuk dengan Google</span>
              </button>
            </div>
            )}

            {/* Divider */}
            <div className="auth-divider"><span>ATAU</span></div>

            {/* Error */}
            {error && (
              <div className="auth-error">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email" className="auth-label">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  EMAIL
                </label>
                <div className="auth-input-wrapper">
                  <input id="email" type="email" className="auth-input" placeholder="Masukkan email Anda" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                  <div className="auth-input-glow" />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password" className="auth-label">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  PASSWORD
                </label>
                <div className="auth-input-wrapper">
                  <input id="password" type={showPassword ? 'text' : 'password'} className="auth-input auth-input-password" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                  <button type="button" className="auth-password-toggle" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                  <div className="auth-input-glow" />
                </div>
              </div>

              <div className="auth-options">
                <label className="auth-checkbox-label" htmlFor="remember">
                  <input id="remember" type="checkbox" className="auth-checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span className="auth-checkbox-custom">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="auth-checkbox-text">Ingat saya</span>
                </label>
                <Link href="/forgot-password" className="auth-forgot-link">Lupa password?</Link>
              </div>

              {/* Turnstile */}
              <div className="auth-field">
                <label className="auth-label">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  VERIFIKASI KEAMANAN
                </label>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Turnstile onVerify={setTurnstileToken} onError={handleTurnstileError} />
                </div>
                {turnstileToken && (
                  <p style={{ color: '#00D68F', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Verifikasi berhasil
                  </p>
                )}
              </div>

              <button type="submit" disabled={isLoading || !turnstileToken} className="auth-submit">
                {isLoading ? (
                  <div className="auth-spinner" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Masuk
                  </>
                )}
              </button>
            </form>

            <div className="auth-register">
              <span>Belum punya akun?</span>
              <Link href="/register" className="auth-register-link">Daftar Sekarang</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-spinner" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
