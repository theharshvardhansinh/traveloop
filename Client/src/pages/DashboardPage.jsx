import { useState, useEffect } from 'react';
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

function tripDuration(start, end) {
  const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
  return `${days} day${days !== 1 ? 's' : ''}`;
}



const TRANSPORT_META = {
  Car:    { icon: '🚗', color: 'from-blue-500 to-blue-600' },
  Train:  { icon: '🚆', color: 'from-emerald-500 to-emerald-600' },
  Flight: { icon: '✈️', color: 'from-violet-500 to-violet-600' },
  Bus:    { icon: '🚌', color: 'from-amber-500 to-amber-600' },
};

const TYPE_COLOR = {
  solo:    { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-400' },
  couple:  { bg: 'bg-pink-100',   text: 'text-pink-700',   dot: 'bg-pink-400' },
  friends: { bg: 'bg-sky-100',    text: 'text-sky-700',    dot: 'bg-sky-400' },
  family:  { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400' },
};

const COVER_GRADIENTS = [
  'from-violet-500 via-purple-500 to-indigo-600',
  'from-blue-500 via-cyan-500 to-teal-500',
  'from-orange-400 via-rose-500 to-pink-600',
  'from-green-400 via-emerald-500 to-teal-600',
  'from-amber-400 via-orange-500 to-red-500',
];

const FILTER_TABS = ['All', 'Upcoming', 'Ongoing', 'Completed'];

/* ── TripCard ─────────────────────────────────────────────────────────────────── */
function TripCard({ trip, onView, index }) {
  const status = tripStatus(trip.startDate, trip.endDate);
  const [menuOpen, setMenuOpen] = useState(false);
  const transport = TRANSPORT_META[trip.transport] || TRANSPORT_META['Car'];
  const typeStyle = TYPE_COLOR[trip.tripType] || { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  const gradient = COVER_GRADIENTS[index % COVER_GRADIENTS.length];

  const statusConfig = {
    Upcoming:  { pill: 'bg-blue-500/15 text-blue-600 border border-blue-200',   dot: 'bg-blue-500' },
    Ongoing:   { pill: 'bg-green-500/15 text-green-600 border border-green-200', dot: 'bg-green-500 animate-pulse' },
    Completed: { pill: 'bg-slate-100 text-slate-500 border border-slate-200',    dot: 'bg-slate-400' },
  }[status] ?? { pill: 'bg-slate-100 text-slate-500 border border-slate-200', dot: 'bg-slate-400' };

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      onClick={() => onView(trip)}
    >
      {/* Cover gradient with emoji */}
      <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)'
        }} />
        <span className="text-5xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          {trip.coverEmoji || '🗺️'}
        </span>
        {/* Transport badge top right */}
        <div className={`absolute top-3 right-3 bg-gradient-to-r ${transport.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1`}>
          <span>{transport.icon}</span>
          <span>{trip.transport}</span>
        </div>
        {/* Status dot + pill top left */}
        <div className={`absolute top-3 left-3 ${statusConfig.pill} text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {status}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Route */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-slate-400">{trip.from}</span>
          <span className="flex-1 border-t border-dashed border-slate-200" />
          <span className="text-slate-300 text-xs">→</span>
          <span className="flex-1 border-t border-dashed border-slate-200" />
          <span className="text-[11px] font-semibold text-slate-400">{trip.to}</span>
        </div>
        <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1.5 group-hover:text-violet-700 transition-colors">
          {trip.name}
        </h3>
        <p className="text-[11px] text-slate-400 mb-3">{formatDateRange(trip.startDate, trip.endDate)}</p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
            {trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1)}
          </span>
          {trip.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {t}
            </span>
          ))}
        </div>

        {/* Footer stats */}
        <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs font-bold text-slate-800">{tripDuration(trip.startDate, trip.endDate)}</p>
            <p className="text-[10px] text-slate-400">Duration</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{trip.distanceKm} km</p>
            <p className="text-[10px] text-slate-400">Distance</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">₹{(trip.budgetSpent / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-slate-400">Budget</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── StatCard ─────────────────────────────────────────────────────────────────── */
function StatCard({ value, label, sub, icon, gradient }) {
  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white overflow-hidden flex-1 min-w-[130px]`}>
      <div className="absolute -top-4 -right-4 text-5xl opacity-20 select-none">{icon}</div>
      <p className="text-2xl font-black leading-none mb-1">{value}</p>
      <p className="text-xs font-semibold text-white/90">{label}</p>
      <p className="text-[10px] text-white/60 mt-0.5">{sub}</p>
    </div>
  );
}

/* ── Navbar ───────────────────────────────────────────────────────────────────── */
function Navbar({ user, onNewTrip }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
        : 'bg-white/80 backdrop-blur border-b border-slate-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0 mr-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-violet-500/30">
            T
          </div>
          <span className="font-extrabold text-slate-800 text-base tracking-tight">Traveloop</span>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {['My Trips', 'Discover', 'Budget', 'Profile'].map((item, i) => (
            <button
              key={item}
              id={`nav-${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                i === 0
                  ? 'text-violet-700 bg-violet-50 font-semibold'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* New trip button */}
          <button
            id="btn-new-trip-nav"
            onClick={onNewTrip}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/25 active:scale-95 transition-all"
          >
            <span className="text-base leading-none">+</span> New Trip
          </button>

          {/* Avatar */}
          <button
            id="btn-nav-avatar"
            onClick={handleLogout}
            title={`${user?.name ?? 'User'} (click to sign out)`}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── HeroBanner ───────────────────────────────────────────────────────────────── */
function HeroBanner({ user, tripCount, onNewTrip }) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-900 p-6 sm:p-8">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-violet-300 text-sm font-medium mb-1">
            ✈️ {greeting()}, {user?.name?.split(' ')[0] ?? 'Explorer'}!
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
            Your Travel<br className="sm:hidden" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm">
            {tripCount} trip{tripCount !== 1 ? 's' : ''} planned · AI-powered itinerary builder ready
          </p>
        </div>
        <button
          id="btn-hero-new-trip"
          onClick={onNewTrip}
          className="self-start sm:self-center flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 shadow-lg shadow-violet-500/30 active:scale-95 transition-all whitespace-nowrap"
        >
          <span className="text-lg">✨</span>
          Plan New Trip with AI
        </button>
      </div>
    </div>
  );
}

/* ── DashboardPage ────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const goToBuilder = () => navigate('/itinerary-builder');

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('traveloop_trips');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const filtered = trips.filter((t) => {
    if (filter === 'All') return true;
    return tripStatus(t.startDate, t.endDate) === filter;
  });

  const activeCount   = trips.filter((t) => ['Upcoming', 'Ongoing'].includes(tripStatus(t.startDate, t.endDate))).length;
  const totalDistKm   = trips.reduce((sum, t) => sum + (t.distanceKm || 0), 0);
  const totalBudget   = trips.reduce((sum, t) => sum + (t.budgetSpent || 0), 0);

  return (
    <div className="min-h-screen bg-[#f5f5fa]">
      <Navbar user={user} onNewTrip={goToBuilder} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Banner */}
        <HeroBanner user={user} tripCount={trips.length} onNewTrip={goToBuilder} />

        {/* Stats row */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
          <StatCard
            value={trips.length}
            label="Total Trips"
            sub="all time"
            icon="🗺️"
            gradient="from-violet-500 to-indigo-600"
          />
          <StatCard
            value={`${totalDistKm.toLocaleString()} km`}
            label="Distance"
            sub="lifetime traveled"
            icon="🛣️"
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            value={`₹${(totalBudget / 1000).toFixed(0)}K`}
            label="Total Spent"
            sub="estimated budget"
            icon="💳"
            gradient="from-orange-500 to-rose-500"
          />
          <StatCard
            value={activeCount}
            label="Active Trips"
            sub="ongoing & upcoming"
            icon="✈️"
            gradient="from-sky-500 to-blue-600"
          />
        </div>

        {/* Filter tabs + heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">My Trips</h2>
            <p className="text-xs text-slate-400">{filtered.length} trip{filtered.length !== 1 ? 's' : ''} shown</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                id={`filter-${tab.toLowerCase()}`}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
                  filter === tab
                    ? 'bg-slate-900 text-white border-slate-900 shadow'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Trip cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {filtered.map((trip, index) => (
              <TripCard
                key={trip.id}
                trip={trip}
                index={index}
                onView={(t) => navigate(`/itinerary/${t.id}`)}
              />
            ))}
            {/* Quick plan card */}
            <button
              onClick={goToBuilder}
              className="group border-2 border-dashed border-violet-200 rounded-2xl flex flex-col items-center justify-center gap-3 py-12 hover:border-violet-400 hover:bg-violet-50/50 transition-all duration-200 text-slate-400 hover:text-violet-600 min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center text-2xl transition-all">
                ✨
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">Plan New Trip</p>
                <p className="text-xs mt-0.5 opacity-70">AI itinerary in seconds</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 mb-8 bg-white rounded-2xl border border-slate-200">
            <span className="text-5xl mb-4">🗺️</span>
            <p className="font-bold text-slate-500 text-base">No {filter !== 'All' ? filter.toLowerCase() : ''} trips yet</p>
            <p className="text-sm mt-1 mb-5">Plan your next adventure with AI!</p>
            <button
              onClick={goToBuilder}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              ✨ Generate AI Itinerary
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
