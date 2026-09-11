import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BudgetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [trip, setTrip] = useState(null);
  const [targetBudget, setTargetBudget] = useState(18000);

  useEffect(() => {
    const saved = localStorage.getItem('traveloop_trips');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const t = list.find((item) => item.id === id);
        if (t) {
          setTrip(t);
          setTargetBudget(t.budgetSpent || 18000);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback
    setTrip({
      id: id,
      name: 'Ahmedabad → Udaipur',
      startDate: '2026-08-14',
      endDate: '2026-08-16',
      from: 'Ahmedabad',
      to: 'Udaipur',
      transport: 'Car',
      tripType: 'family',
      tags: ['Family'],
      distanceKm: 262,
      budgetSpent: 18000,
    });
  }, [id]);

  if (!trip) {
    return <div className="p-8 text-center text-slate-500">Loading budget...</div>;
  }

  // Set actual cost based on trip budgetSpent or default to ₹19,400
  const actualCost = 19400;
  const isOver = actualCost > targetBudget;
  const diffPercent = Math.round(((actualCost - targetBudget) / targetBudget) * 100);

  const categories = [
    { label: 'Transport (Fuel/Tolls)', value: 5800, max: 10000, color: 'bg-blue-500' },
    { label: 'Accommodation', value: 8000, max: 10000, color: 'bg-emerald-500' },
    { label: 'Food & Meals', value: 4200, max: 10000, color: 'bg-amber-500' },
    { label: 'Activities & Entry', value: 1400, max: 10000, color: 'bg-purple-500' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">Traveloop</span>
          </div>
          <nav className="flex items-center gap-1">
            <button onClick={() => navigate('/dashboard')} className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">My Trips</button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">Discover</button>
            <button onClick={() => navigate(`/budget/${trip.id}`)} className="px-3 py-1.5 text-sm font-medium text-brand-650 font-semibold border-b-2 border-brand-500">Budget</button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">Profile</button>
          </nav>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 hover:border-brand-300 transition-all"
          >
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </button>
        </div>
      </header>

      {/* Sub Navigation Bar to link the trip pages */}
      <div className="flex border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 flex gap-6">
          <button
            onClick={() => navigate(`/itinerary/${trip.id}`)}
            className="py-3 text-sm font-semibold border-b-2 border-transparent text-slate-555 hover:text-slate-700"
          >
            📋 Itinerary
          </button>
          <button
            onClick={() => navigate(`/budget/${trip.id}`)}
            className="py-3 text-sm font-semibold border-b-2 border-brand-500 text-brand-600"
          >
            💰 Budget
          </button>
          <button
            onClick={() => navigate(`/checklist/${trip.id}`)}
            className="py-3 text-sm font-semibold border-b-2 border-transparent text-slate-555 hover:text-slate-700"
          >
            🎒 Packing Checklist
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Title HUD */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Budget — {trip.name}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              3-day trip · {trip.tripType} · {trip.transport}
            </p>
          </div>
          <button className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Targets + Categories) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Target Budget Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Target Budget</span>
                {isOver && (
                  <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                    ⚠️ {diffPercent}% over target
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="text-2xl font-black text-slate-800 bg-transparent border-b-2 border-dashed border-slate-200 focus:outline-none focus:border-brand-500 w-36 py-1"
                />
              </div>
              <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 bg-orange-500"
                  style={{ width: `${Math.min(100, (actualCost / targetBudget) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mt-2.5">
                <span>Spent: ₹{actualCost.toLocaleString()}</span>
                <span>Budget: ₹{targetBudget.toLocaleString()}</span>
              </div>
            </div>

            {/* Breakdown by Category */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-800 text-sm mb-6 uppercase tracking-wider text-slate-450">Breakdown by Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {categories.map((c) => (
                  <div key={c.label} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">{c.label}</span>
                      <span className="text-slate-800">₹{c.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.color}`}
                        style={{ width: `${(c.value / actualCost) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-6 font-medium">BUD-02 · Flag when estimate exceeds target</p>
            </div>
          </div>

          {/* Right Column (Day-by-Day) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h2 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wider text-slate-450">Breakdown by Day</h2>
            
            <div className="space-y-6">
              {/* Day 1 */}
              <div>
                <div className="flex justify-between items-center font-bold text-slate-800 text-xs border-b border-slate-150 pb-2 mb-3">
                  <span>Day 1 — {trip.from} to Vadodara</span>
                  <span className="text-slate-400">₹6,400</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Fuel</span>
                    <span className="font-medium">₹2,200</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Champaner entry</span>
                    <span className="font-medium">₹200</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Lunch</span>
                    <span className="font-medium">₹800</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Hotel</span>
                    <span className="font-medium">₹3,200</span>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div>
                <div className="flex justify-between items-center font-bold text-slate-800 text-xs border-b border-slate-150 pb-2 mb-3">
                  <span>Day 2 — Vadodara to {trip.to}</span>
                  <span className="text-slate-400">₹8,000</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Fuel</span>
                    <span className="font-medium">₹2,300</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Dungarpur stop</span>
                    <span className="font-medium">₹200</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Lunch</span>
                    <span className="font-medium">₹700</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Hotel</span>
                    <span className="font-medium">₹4,800</span>
                  </div>
                </div>
              </div>

              {/* Day 3 */}
              <div>
                <div className="flex justify-between items-center font-bold text-slate-800 text-xs border-b border-slate-150 pb-2 mb-3">
                  <span>Day 3 — {trip.to} Local</span>
                  <span className="text-slate-400">₹5,000</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Boat cruise</span>
                    <span className="font-medium">₹800</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Palace entry</span>
                    <span className="font-medium">₹400</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Dinner</span>
                    <span className="font-medium">₹1,200</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Hotel</span>
                    <span className="font-medium">₹2,600</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-6 pt-4 border-t border-slate-100 font-medium">BUD-01 · Auto estimate transport + accommodation + food</p>
          </div>
        </div>
      </main>
    </div>
  );
}
