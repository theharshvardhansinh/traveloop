import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const stats = [
    { label: 'Total Users',    value: '—', icon: '👥' },
    { label: 'Active Trips',   value: '—', icon: '✈️' },
    { label: 'Posts Today',    value: '—', icon: '📸' },
    { label: 'Bookings',       value: '—', icon: '🎫' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="bg-circle w-96 h-96 bg-white top-[-80px] right-[-80px] animate-pulse-slow" />
      <div className="bg-circle w-64 h-64 bg-accent-400 bottom-[-40px] left-[-40px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-3xl animate-fade-in-up">
        {/* Header card */}
        <div className="card p-8 mb-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg text-2xl font-bold text-white flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                <span className="inline-flex items-center gap-1.5 bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Admin
                </span>
              </div>
              <p className="text-slate-500 text-sm truncate">
                Signed in as <span className="font-medium text-slate-700">{user?.email}</span>
              </p>
            </div>
            <button
              id="btn-admin-logout"
              onClick={handleLogout}
              className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-bold text-slate-800 mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Placeholder sections */}
        <div className="card p-8 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            🛠️
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            Admin controls coming soon
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            User management, content moderation, analytics, and booking oversight 
            will be built on top of this foundation in future iterations.
          </p>
        </div>
      </div>
    </div>
  );
}
