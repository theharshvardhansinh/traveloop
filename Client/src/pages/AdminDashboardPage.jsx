import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DonutChart() {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative w-36 h-36">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-95">
          {/* Background circle */}
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
          
          {/* Car: 48% (color: #0ea5e9, dasharray: 114.5, offset: 0) */}
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0ea5e9" strokeWidth="12" 
                  strokeDasharray="114.5 238.7" strokeDashoffset="0" />
                  
          {/* Train: 28% (color: #10b981, dasharray: 66.8, offset: -114.5) */}
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="12" 
                  strokeDasharray="66.8 238.7" strokeDashoffset="-114.5" />
                  
          {/* Plane: 16% (color: #a855f7, dasharray: 38.2, offset: -181.3) */}
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#a855f7" strokeWidth="12" 
                  strokeDasharray="38.2 238.7" strokeDashoffset="-181.3" />
                  
          {/* Bike: 8% (color: #f97316, dasharray: 19.1, offset: -219.5) */}
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f97316" strokeWidth="12" 
                  strokeDasharray="19.1 238.7" strokeDashoffset="-219.5" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-slate-800">48,200</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total km</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Car (48%)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Train (28%)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Plane (16%)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Bike (8%)</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const metrics = [
    { label: 'Registered Users', value: '12,480', sub: '+230 this week', color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Trips', value: '3,821', sub: 'ongoing', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Distance Planned', value: '48,200 km', sub: 'all trips', color: 'text-purple-600 bg-purple-50' },
    { label: 'App Store Rating', value: '4.7 ★', sub: 'avg user rating', color: 'text-orange-600 bg-orange-50' },
  ];

  const destinations = [
    { name: 'Udaipur', count: 342, pct: 85 },
    { name: 'Goa', count: 298, pct: 74 },
    { name: 'Manali', count: 256, pct: 64 },
    { name: 'Jaipur', count: 212, pct: 53 },
    { name: 'Rishikesh', count: 178, pct: 44 },
  ];

  const recentUsers = [
    { name: 'Priya Sharma', email: 'priya@gmail.com', status: 'active', color: 'bg-green-100 text-green-700' },
    { name: 'Rohan Mehta', email: 'rohan@yahoo.com', status: 'active', color: 'bg-green-100 text-green-700' },
    { name: 'Anita Verma', email: 'anita@gmail.com', status: 'suspended', color: 'bg-red-100 text-red-700' },
    { name: 'Karan Patel', email: 'karan@gmail.com', status: 'active', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              Traveloop Admin
              <span className="text-[10px] bg-slate-800 text-white font-bold px-2 py-0.5 rounded-full">ADMIN</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {['Overview', 'Users', 'Trips', 'Analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
              <p className="text-xl sm:text-2xl font-black text-slate-800 leading-none mb-1">{m.value}</p>
              <p className="text-[11px] font-bold text-slate-650">{m.label}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Popular Destinations & Transport) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Popular Destinations */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
                <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">Popular Destinations</h2>
                <div className="space-y-3.5">
                  {destinations.map((d) => (
                    <div key={d.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{d.name}</span>
                        <span>{d.count} trips</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${d.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport Mode Usage */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
                <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Transport Mode Usage</h2>
                <DonutChart />
              </div>
            </div>

            {/* Bottom Row inside left column: Trip Duration */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Avg. Trip Duration By Mode</h2>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { mode: '🚲 Bike', val: '5.2d' },
                  { mode: '🚗 Car', val: '3.1d' },
                  { mode: '🚂 Train', val: '4.8d' },
                  { mode: '✈️ Plane', val: '6.4d' },
                ].map((item) => (
                  <div key={item.mode} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-sm font-black text-slate-800 mb-0.5">{item.val}</p>
                    <p className="text-[10px] font-bold text-slate-500">{item.mode}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Recent Users & Export) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            {/* Recent Users */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">Recent Users</h2>
                <button className="text-[10px] font-bold text-brand-600 hover:underline">View All</button>
              </div>

              <div className="space-y-3.5 flex-1">
                {recentUsers.map((u) => (
                  <div key={u.email} className="flex items-center justify-between gap-3 text-xs border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{u.email}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${u.color}`}>
                      {u.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Export */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Analytics Export</h2>
              <p className="text-[10px] text-slate-400 font-semibold mb-4 leading-relaxed">
                ADM-03 · CSV / PDF export of platform-wide analytics reports
              </p>
              <button className="w-full py-2.5 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-brand-650 font-bold text-xs active:scale-95 transition-all shadow-sm">
                Export Reports →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
