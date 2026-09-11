import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── helpers ─────────────────────────────────────────────────────────────────── */
function formatDateRange(start, end) {
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  const s = new Date(start).toLocaleDateString('en-IN', opts);
  const e = new Date(end).toLocaleDateString('en-IN', opts);
  return `${s} – ${e}`;
}

function tripStatus(start, end) {
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (now < s) return 'Upcoming';
  if (now > e) return 'Completed';
  return 'Ongoing';
}

/* ── mock data ───────────────────────────────────────────────────────────────── */
const MOCK_TRIPS = [
  {
    id: '1',
    name: 'Ahmedabad → Udaipur',
    startDate: '2026-08-14',
    endDate: '2026-08-16',
    transport: 'Car',
    tripType: 'family',
    tags: ['Spiritual+Nature'],
    from: 'Ahmedabad',
    to: 'Udaipur',
    distanceKm: 262,
    budgetSpent: 18000,
  },
  {
    id: '2',
    name: 'Mumbai → Goa',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    transport: 'Train',
    tripType: 'friends',
    tags: ['Adventure'],
    from: 'Mumbai',
    to: 'Goa',
    distanceKm: 595,
    budgetSpent: 42000,
  },
  {
    id: '3',
    name: 'Delhi → Manali',
    startDate: '2026-10-20',
    endDate: '2026-10-27',
    transport: 'Car',
    tripType: 'couple',
    tags: ['Nature'],
    from: 'Delhi',
    to: 'Manali',
    distanceKm: 540,
    budgetSpent: 60000,
  },
  {
    id: '4',
    name: 'Bangalore → Coorg',
    startDate: '2025-12-20',
    endDate: '2025-12-23',
    transport: 'Car',
    tripType: 'friends',
    tags: ['Nature'],
    from: 'Bangalore',
    to: 'Coorg',
    distanceKm: 252,
    budgetSpent: 15000,
  },
  {
    id: '5',
    name: 'Jaipur → Jodhpur',
    startDate: '2025-11-10',
    endDate: '2025-11-13',
    transport: 'Car',
    tripType: 'solo',
    tags: ['Heritage'],
    from: 'Jaipur',
    to: 'Jodhpur',
    distanceKm: 335,
    budgetSpent: 9000,
  },
];

const STATS = {
  totalTrips: 12,
  distanceKm: 4820,
  totalSpent: '₹1.2L',
  coTravellers: 3,
};

const TYPE_COLOR = {
  solo:    'bg-purple-100 text-purple-700',
  couple:  'bg-pink-100 text-pink-700',
  friends: 'bg-sky-100 text-sky-700',
  family:  'bg-amber-100 text-amber-700',
};

const TAG_COLOR = {
  Adventure:           'bg-emerald-100 text-emerald-700',
  Nature:              'bg-green-100 text-green-700',
  Heritage:            'bg-orange-100 text-orange-700',
  'Spiritual+Nature':  'bg-violet-100 text-violet-700',
};

const TRANSPORT_ICON = { Car: '🚗', Train: '🚂', Flight: '✈️', Bus: '🚌' };
const FILTER_TABS = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Archived'];

/* ── MapPreview ──────────────────────────────────────────────────────────────── */
function MapPreview({ from, to }) {
  return (
    <div className="relative h-32 sm:h-36 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50 border border-slate-200 flex items-center justify-center mb-4">
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-brand-400 shadow-md shadow-brand-400/40" />
        <div className="flex-1 mx-3 border-t-2 border-dashed border-brand-300/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent-500 shadow-md shadow-accent-500/40" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl mb-1">🗺️</span>
        <span className="text-xs text-slate-400 font-medium tracking-wide">map preview</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2 text-[10px] text-slate-400 font-semibold pointer-events-none">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}

/* ── TripCard ─────────────────────────────────────────────────────────────────── */
function TripCard({ trip, onView, onEdit }) {
  const status = tripStatus(trip.startDate, trip.endDate);
  const [menuOpen, setMenuOpen] = useState(false);

  const statusPill = {
    Upcoming:  'bg-blue-50 text-blue-600',
    Ongoing:   'bg-green-50 text-green-600',
    Completed: 'bg-slate-100 text-slate-500',
  }[status] ?? 'bg-slate-100 text-slate-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="p-4 pb-0">
        <MapPreview from={trip.from} to={trip.to} />
      </div>
      <div className="px-4 pb-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug">{trip.name}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${statusPill}`}>{status}</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">{formatDateRange(trip.startDate, trip.endDate)}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600">
            {TRANSPORT_ICON[trip.transport]} {trip.transport}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLOR[trip.tripType] ?? 'bg-slate-100 text-slate-600'}`}>
            {trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1)}
          </span>
          {trip.tags.map((t) => (
            <span key={t} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLOR[t] ?? 'bg-slate-100 text-slate-500'}`}>
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <button
            id={`btn-view-trip-${trip.id}`}
            onClick={() => onView(trip)}
            className="flex-1 py-2 text-xs font-semibold rounded-lg border border-brand-200 text-brand-600 bg-brand-50 hover:bg-brand-100 active:scale-95 transition-all"
          >
            View
          </button>
          <button
            id={`btn-edit-trip-${trip.id}`}
            onClick={() => onEdit(trip)}
            className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
          >
            Edit
          </button>
          <div className="relative">
            <button
              id={`btn-menu-trip-${trip.id}`}
              onClick={() => setMenuOpen((p) => !p)}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 flex items-center justify-center text-sm leading-none active:scale-95 transition-all"
            >
              •••
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-9 z-20 bg-white border border-slate-200 rounded-xl shadow-xl py-1 w-36">
                {['Duplicate', 'Share', 'Archive', 'Delete'].map((action) => (
                  <button
                    key={action}
                    className={`w-full text-left px-3 py-2.5 text-xs font-medium transition-colors hover:bg-slate-50 ${action === 'Delete' ? 'text-red-500 hover:bg-red-50' : 'text-slate-700'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── StatCard ─────────────────────────────────────────────────────────────────── */
function StatCard({ value, label, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 min-w-0">
      <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-none mb-1">{value}</p>
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

/* ── NewTripModal ─────────────────────────────────────────────────────────────── */
function NewTripModal({ onClose }) {
  const [form, setForm] = useState({
    from: '', to: '', startDate: '', endDate: '', tripType: 'solo', transport: 'Car',
  });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-base">Plan a New Trip ✈️</h2>
          <button id="btn-close-new-trip" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none transition-colors p-1">✕</button>
        </div>
        <div className="px-5 sm:px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="auth-label">From</label>
              <input id="input-trip-from" className="auth-input" placeholder="Mumbai" value={form.from} onChange={set('from')} />
            </div>
            <div>
              <label className="auth-label">To</label>
              <input id="input-trip-to" className="auth-input" placeholder="Goa" value={form.to} onChange={set('to')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="auth-label">Start Date</label>
              <input id="input-trip-start" type="date" className="auth-input" value={form.startDate} onChange={set('startDate')} />
            </div>
            <div>
              <label className="auth-label">End Date</label>
              <input id="input-trip-end" type="date" className="auth-input" value={form.endDate} onChange={set('endDate')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="auth-label">Trip Type</label>
              <select id="select-trip-type" className="auth-input" value={form.tripType} onChange={set('tripType')}>
                {['solo', 'couple', 'friends', 'family'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 sm:px-6 pb-6">
          <button id="btn-cancel-new-trip" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button
            id="btn-create-trip"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-md shadow-brand-500/25 active:scale-95 transition-all"
          >
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Navbar ───────────────────────────────────────────────────────────────────── */
function Navbar({ user, onLogout }) {
  const NAV = ['My Trips', 'Discover', 'Budget', 'Profile'];
  const [active, setActive] = useState('My Trips');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">Traveloop</span>
          </div>
          <nav className="hidden sm:flex items-center gap-1 flex-1">
            {NAV.map((item) => (
              <button
                key={item}
                id={`nav-${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActive(item)}
                className={`px-3 py-1.5 text-sm font-medium transition-all ${
                  active === item ? 'text-brand-600 border-b-2 border-brand-500' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="flex-1 sm:hidden" />
          <button
            id="btn-nav-avatar"
            className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 hover:border-brand-300 transition-all"
            title={user?.name ?? 'Profile'}
            onClick={onLogout}
          >
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </button>
          <button
            id="btn-nav-hamburger"
            onClick={() => setMobileOpen((p) => !p)}
            className="sm:hidden flex flex-col items-center justify-center gap-1.5 w-9 h-9 rounded-lg hover:bg-slate-100 transition-all"
            aria-label="Toggle navigation"
          >
            <span className={`block w-5 h-0.5 bg-slate-600 transition-all duration-200 origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-slate-600 transition-all duration-200 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-slate-600 transition-all duration-200 origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV.map((item) => (
              <button
                key={item}
                onClick={() => { setActive(item); setMobileOpen(false); }}
                className={`w-full text-left px-5 py-3.5 text-sm font-medium border-b border-slate-50 last:border-0 transition-colors ${
                  active === item ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item}
              </button>
            ))}
            <div className="px-5 py-3 border-t border-slate-100">
              <button onClick={onLogout} className="text-sm text-red-500 font-medium">Sign out</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── DashboardPage ────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const goToBuilder = () => navigate('/itinerary-builder');

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('traveloop_trips');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('traveloop_trips', JSON.stringify(MOCK_TRIPS));
    return MOCK_TRIPS;
  });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const filtered = trips.filter((t) => {
    if (filter === 'All') return true;
    if (filter === 'Archived') return false;
    return tripStatus(t.startDate, t.endDate) === filter;
  });

  const activeCount   = trips.filter((t) => ['Upcoming', 'Ongoing'].includes(tripStatus(t.startDate, t.endDate))).length;
  const upcomingCount = trips.filter((t) => tripStatus(t.startDate, t.endDate) === 'Upcoming').length;
  const archivedCount = trips.filter((t) => tripStatus(t.startDate, t.endDate) === 'Completed').length;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800">My Trips</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {activeCount} active · {upcomingCount} upcoming · {archivedCount} archived
            </p>
          </div>
          <button
            id="btn-new-trip"
            onClick={goToBuilder}
            className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-brand-600 border border-brand-200 bg-white hover:bg-brand-50 shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            + New Trip
          </button>
        </div>
        <div className="flex items-center gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              id={`filter-${tab.toLowerCase()}`}
              onClick={() => setFilter(tab)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border whitespace-nowrap shrink-0 ${
                filter === tab
                  ? 'bg-slate-800 text-white border-slate-800 shadow'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {filtered.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onView={(t) => navigate(`/itinerary/${t.id}`)}
                onEdit={(t) => navigate(`/itinerary/${t.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-slate-400 mb-6 sm:mb-8">
            <span className="text-5xl mb-3">🗺️</span>
            <p className="font-semibold text-slate-500">No {filter !== 'All' ? filter.toLowerCase() : ''} trips yet</p>
            <p className="text-sm mt-1">Plan your next adventure!</p>
          </div>
        )}

        {/* Stats row */}
        <div className="flex gap-4 flex-wrap">
          <StatCard value={STATS.totalTrips}          label="Total Trips"       sub="all time" />
          <StatCard value={`${STATS.distanceKm} km`}  label="Distance Covered"  sub="lifetime" />
          <StatCard value={STATS.totalSpent}           label="Total Spent"       sub="estimated" />
          <StatCard value={STATS.coTravellers}         label="Co-travellers"     sub="active shares" />
        </div>
      </main>

      {showModal && <NewTripModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
