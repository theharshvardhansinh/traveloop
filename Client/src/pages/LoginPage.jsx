import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

// ─── Icons ────────────────────────────────────────────────────────────────────
const LogoIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const features = [
  'Personalized day-wise itinerary',
  'Auto budget estimation',
  'Trip sharing & collaboration',
  'Packing checklist generator',
];

const travelPreferences = ['Adventure', 'Beach', 'Cultural', 'City Break', 'Nature', 'Road Trip'];

// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const { login, isAuthenticated, role }   = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  // Default tab from URL param e.g. /login?tab=register
  const defaultTab = new URLSearchParams(location.search).get('tab') === 'register' ? 'register' : 'signin';
  const [tab, setTab] = useState(defaultTab);

  // ── Sign-in state ──────────────────────────────────────────────────────────
  const [signIn, setSignIn]         = useState({ email: '', password: '' });
  const [signInErrors, setSignInErrors] = useState({});
  const [showSignInPass, setShowSignInPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ── Register state ─────────────────────────────────────────────────────────
  const [reg, setReg] = useState({
    name: '', email: '', phone: '',
    password: '', confirmPassword: '', travelPref: '',
  });
  const [regErrors, setRegErrors]     = useState({});
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // ── Shared ─────────────────────────────────────────────────────────────────
  const [apiError, setApiError]   = useState('');
  const [loading, setLoading]     = useState(false);

  const switchTab = (t) => { setTab(t); setApiError(''); setSignInErrors({}); setRegErrors({}); };

  // ── Sign-in validation ─────────────────────────────────────────────────────
  const validateSignIn = () => {
    const e = {};
    if (!signIn.email.trim())           e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(signIn.email)) e.email = 'Enter a valid email.';
    if (!signIn.password)               e.password = 'Password is required.';
    setSignInErrors(e);
    return !Object.keys(e).length;
  };

  // ── Register validation ────────────────────────────────────────────────────
  const validateReg = () => {
    const e = {};
    if (!reg.name.trim())               e.name = 'Full name is required.';
    if (!reg.email.trim())              e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(reg.email)) e.email = 'Enter a valid email.';
    if (!reg.password)                  e.password = 'Password required.';
    else if (reg.password.length < 6)   e.password = 'Min 6 characters.';
    if (reg.password !== reg.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setRegErrors(e);
    return !Object.keys(e).length;
  };

  // ── Sign In submit ──────────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateSignIn()) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/login', {
        email: signIn.email,
        password: signIn.password,
      });
      if (data.success) {
        login(data.token, data.user);
        navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Register submit ─────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateReg()) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/signup', {
        name: reg.name,
        email: reg.email,
        password: reg.password,
      });
      if (data.success) {
        login(data.token, data.user);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const siClass = (f) => `auth-input ${signInErrors[f] ? 'border-red-400 focus:ring-red-300' : ''}`;
  const rClass  = (f) => `auth-input ${regErrors[f]    ? 'border-red-400 focus:ring-red-300' : ''}`;

  return (
    <div className="min-h-screen flex bg-white" style={{ background: 'white' }}>

      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a5c 0%, #1e4976 50%, #16355a 100%)' }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Decorative glow blobs */}
        <div className="absolute top-20 right-[-40px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
        <div className="absolute bottom-20 left-[-20px] w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #fb923c, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <LogoIcon />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">Traveloop</span>
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Plan every journey,<br />not just the destination.
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed mb-12">
            Create personalized travel itineraries, track budgets, and share adventures with friends.
          </p>

          {/* Features */}
          <ul className="space-y-3.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#38bdf8' }} />
                <span className="text-blue-100 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom badges */}
        <div className="relative z-10 flex gap-2 flex-wrap">
          {['AUTH-01: Email/Google/Apple OAuth', 'AUTH-02: JWT Session'].map((b) => (
            <span key={b} className="text-xs px-3 py-1.5 rounded-md font-mono"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#93c5fd', border: '1px solid rgba(255,255,255,0.12)' }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 overflow-y-auto"
        style={{ background: '#fafbfc' }}>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1a3a5c' }}>
            <LogoIcon />
          </div>
          <span className="font-bold text-slate-800 text-lg">Traveloop</span>
        </div>

        <div className="w-full max-w-md">

          {/* Tab toggle */}
          <div className="flex border border-slate-200 rounded-xl overflow-hidden mb-8 shadow-sm">
            <button
              id="tab-signin"
              type="button"
              onClick={() => switchTab('signin')}
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
                tab === 'signin'
                  ? 'text-white shadow-sm'
                  : 'bg-white text-slate-500 hover:text-slate-700'
              }`}
              style={tab === 'signin' ? { background: '#1a3a5c' } : {}}
            >
              Sign In
            </button>
            <button
              id="tab-register"
              type="button"
              onClick={() => switchTab('register')}
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
                tab === 'register'
                  ? 'text-white shadow-sm'
                  : 'bg-white text-slate-500 hover:text-slate-700'
              }`}
              style={tab === 'register' ? { background: '#1a3a5c' } : {}}
            >
              Register
            </button>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {apiError}
            </div>
          )}

          {/* ── SIGN IN FORM ───────────────────────────────────────────────── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} noValidate className="animate-fade-in-up">
              <div className="mb-4">
                <label htmlFor="si-email" className="auth-label">EMAIL / PHONE</label>
                <input
                  id="si-email" type="email" autoComplete="email"
                  placeholder="user@example.com"
                  value={signIn.email}
                  onChange={(e) => { setSignIn(p => ({ ...p, email: e.target.value })); setSignInErrors(p => ({ ...p, email: '' })); }}
                  className={siClass('email')}
                />
                {signInErrors.email && <p className="err-txt">{signInErrors.email}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="si-password" className="auth-label">PASSWORD</label>
                <div className="relative">
                  <input
                    id="si-password" type={showSignInPass ? 'text' : 'password'} autoComplete="current-password"
                    placeholder="••••••••"
                    value={signIn.password}
                    onChange={(e) => { setSignIn(p => ({ ...p, password: e.target.value })); setSignInErrors(p => ({ ...p, password: '' })); }}
                    className={`${siClass('password')} pr-10`}
                  />
                  <button type="button" onClick={() => setShowSignInPass(!showSignInPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <EyeIcon open={showSignInPass} />
                  </button>
                </div>
                {signInErrors.password && <p className="err-txt">{signInErrors.password}</p>}
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-700" />
                  <span className="text-xs text-slate-500">Remember me</span>
                </label>
                <button type="button" className="text-xs font-medium" style={{ color: '#1a3a5c' }}>
                  Forgot password?
                </button>
              </div>

              <button id="btn-signin-submit" type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95 disabled:opacity-60 mb-6"
                style={{ background: 'linear-gradient(135deg, #1a3a5c, #1e5a8a)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : 'Sign In'}
              </button>

              {/* Social login */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">or continue with</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" id="btn-google-signin"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-150">
                  <GoogleIcon /> Google
                </button>
                <button type="button" id="btn-apple-signin"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-150">
                  <AppleIcon /> Apple
                </button>
              </div>

              {/* Admin link */}
              <p className="mt-6 text-center text-xs text-slate-400">
                Admin?{' '}
                <button type="button" onClick={() => navigate('/admin/signup')}
                  className="font-semibold hover:underline" style={{ color: '#1a3a5c' }}>
                  Register with secret key
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ──────────────────────────────────────────────── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} noValidate className="animate-fade-in-up">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label htmlFor="reg-name" className="auth-label">FULL NAME</label>
                  <input id="reg-name" type="text" autoComplete="name" placeholder="Full Name"
                    value={reg.name}
                    onChange={(e) => { setReg(p => ({ ...p, name: e.target.value })); setRegErrors(p => ({ ...p, name: '' })); }}
                    className={rClass('name')} />
                  {regErrors.name && <p className="err-txt">{regErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="reg-email" className="auth-label">EMAIL</label>
                  <input id="reg-email" type="email" autoComplete="email" placeholder="Email"
                    value={reg.email}
                    onChange={(e) => { setReg(p => ({ ...p, email: e.target.value })); setRegErrors(p => ({ ...p, email: '' })); }}
                    className={rClass('email')} />
                  {regErrors.email && <p className="err-txt">{regErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label htmlFor="reg-phone" className="auth-label">PHONE</label>
                  <input id="reg-phone" type="tel" autoComplete="tel" placeholder="Phone"
                    value={reg.phone}
                    onChange={(e) => setReg(p => ({ ...p, phone: e.target.value }))}
                    className="auth-input" />
                </div>
                <div>
                  <label htmlFor="reg-password" className="auth-label">PASSWORD</label>
                  <div className="relative">
                    <input id="reg-password" type={showRegPass ? 'text' : 'password'} placeholder="Password"
                      value={reg.password}
                      onChange={(e) => { setReg(p => ({ ...p, password: e.target.value })); setRegErrors(p => ({ ...p, password: '' })); }}
                      className={`${rClass('password')} pr-8`} />
                    <button type="button" onClick={() => setShowRegPass(!showRegPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <EyeIcon open={showRegPass} />
                    </button>
                  </div>
                  {regErrors.password && <p className="err-txt">{regErrors.password}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label htmlFor="reg-confirm" className="auth-label">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <input id="reg-confirm" type={showRegConfirm ? 'text' : 'password'} placeholder="Confirm Password"
                      value={reg.confirmPassword}
                      onChange={(e) => { setReg(p => ({ ...p, confirmPassword: e.target.value })); setRegErrors(p => ({ ...p, confirmPassword: '' })); }}
                      className={`${rClass('confirmPassword')} pr-8`} />
                    <button type="button" onClick={() => setShowRegConfirm(!showRegConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <EyeIcon open={showRegConfirm} />
                    </button>
                  </div>
                  {regErrors.confirmPassword && <p className="err-txt">{regErrors.confirmPassword}</p>}
                </div>
                <div>
                  <label htmlFor="reg-pref" className="auth-label">TRAVEL PREFERENCE</label>
                  <select id="reg-pref" value={reg.travelPref}
                    onChange={(e) => setReg(p => ({ ...p, travelPref: e.target.value }))}
                    className="auth-input text-slate-500">
                    <option value="">Travel Preference</option>
                    {travelPreferences.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <button id="btn-register-submit" type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95 disabled:opacity-60 mb-6"
                style={{ background: 'linear-gradient(135deg, #1a3a5c, #1e5a8a)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : 'Create Account'}
              </button>

              {/* Social register */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">or register with</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" id="btn-google-register"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 active:scale-95 transition-all duration-150">
                  <GoogleIcon /> Google
                </button>
                <button type="button" id="btn-apple-register"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 active:scale-95 transition-all duration-150">
                  <AppleIcon /> Apple
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
