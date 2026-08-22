import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

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

export default function AdminSignupPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', adminSecret: '' });
  const [show, setShow] = useState({ pass: false, confirm: false, secret: false });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (f) => (e) => {
    setForm(p => ({ ...p, [f]: e.target.value }));
    setErrors(p => ({ ...p, [f]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name = 'Full name is required.';
    if (!form.email.trim())   e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)       e.password = 'Password required.';
    else if (form.password.length < 6) e.password = 'Min 6 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!form.adminSecret.trim()) e.adminSecret = 'Admin secret key is required.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/auth/admin/signup', {
        name: form.name, email: form.email, password: form.password, adminSecret: form.adminSecret,
      });
      if (data.success) {
        login(data.token, data.user);
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const cls = (f) => `auth-input ${errors[f] ? 'border-red-400 focus:ring-red-300' : ''}`;

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a3a5c 0%, #1e4976 50%, #16355a 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-20 right-[-40px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
        <div className="absolute bottom-20 left-[-20px] w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #fb923c, transparent)' }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <LogoIcon />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">Traveloop</span>
          </div>

          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(251,146,60,0.2)', color: '#fdba74', border: '1px solid rgba(251,146,60,0.3)' }}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Restricted Access
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Admin Registration
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed mb-10">
            This page is protected. You must have a valid admin secret key issued by the system to register an admin account.
          </p>

          <div className="space-y-4">
            {[
              { icon: '🛡️', label: 'Full platform moderation' },
              { icon: '📊', label: 'Analytics & reporting' },
              { icon: '👥', label: 'User management' },
              { icon: '⚙️', label: 'System configuration' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-base">{icon}</span>
                <span className="text-blue-100 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex gap-2">
          {['AUTH-01: Admin Secret', 'AUTH-02: Role: admin'].map(b => (
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

        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1a3a5c' }}>
            <LogoIcon />
          </div>
          <span className="font-bold text-slate-800 text-lg">Traveloop</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Create Admin Account</h2>
            <p className="text-slate-500 text-sm">Fill in your details and provide the admin secret key.</p>
          </div>

          {apiError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="animate-fade-in-up">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="a-name" className="auth-label">Full Name</label>
                <input id="a-name" type="text" autoComplete="name" placeholder="Admin Name"
                  value={form.name} onChange={handleChange('name')} className={cls('name')} />
                {errors.name && <p className="err-txt">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="a-email" className="auth-label">Email</label>
                <input id="a-email" type="email" autoComplete="email" placeholder="admin@traveloop.com"
                  value={form.email} onChange={handleChange('email')} className={cls('email')} />
                {errors.email && <p className="err-txt">{errors.email}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="a-pass" className="auth-label">Password</label>
                <div className="relative">
                  <input id="a-pass" type={show.pass ? 'text' : 'password'} placeholder="Min 6 characters"
                    value={form.password} onChange={handleChange('password')} className={`${cls('password')} pr-8`} />
                  <button type="button" onClick={() => setShow(p => ({ ...p, pass: !p.pass }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <EyeIcon open={show.pass} />
                  </button>
                </div>
                {errors.password && <p className="err-txt">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="a-confirm" className="auth-label">Confirm Password</label>
                <div className="relative">
                  <input id="a-confirm" type={show.confirm ? 'text' : 'password'} placeholder="Repeat password"
                    value={form.confirmPassword} onChange={handleChange('confirmPassword')} className={`${cls('confirmPassword')} pr-8`} />
                  <button type="button" onClick={() => setShow(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <EyeIcon open={show.confirm} />
                  </button>
                </div>
                {errors.confirmPassword && <p className="err-txt">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Admin secret */}
            <div className="mb-6">
              <label htmlFor="a-secret" className="auth-label">
                Admin Secret Key
                <span className="ml-1 normal-case tracking-normal text-red-400">*</span>
              </label>
              <div className="relative">
                <input id="a-secret" type={show.secret ? 'text' : 'password'} placeholder="Enter the admin secret key"
                  value={form.adminSecret} onChange={handleChange('adminSecret')} className={`${cls('adminSecret')} pr-10`} />
                <button type="button" onClick={() => setShow(p => ({ ...p, secret: !p.secret }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <EyeIcon open={show.secret} />
                </button>
              </div>
              {errors.adminSecret && <p className="err-txt">{errors.adminSecret}</p>}
              <p className="text-xs text-slate-400 mt-1.5">This key is configured by the system administrator.</p>
            </div>

            <button id="btn-admin-signup-submit" type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95 disabled:opacity-60 mb-4"
              style={{ background: 'linear-gradient(135deg, #1a3a5c, #1e5a8a)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering…
                </span>
              ) : 'Register as Admin'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')}
                className="font-semibold hover:underline" style={{ color: '#1a3a5c' }}>
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
