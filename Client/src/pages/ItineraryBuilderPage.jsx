import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────────────────────────────────────
   Step definitions
───────────────────────────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: 1, label: 'Start Location',
    footer: 'ITIN-01 · Free text or map pin input',
  },
  {
    id: 2, label: 'Destination',
    footer: 'SRCH-01 · SRCH-02 · Keyword or map pin',
  },
  {
    id: 3, label: 'Travel Mode',
    footer: 'ITIN-01 · Daily coverage auto-adjusts by group type',
  },
  {
    id: 4, label: 'Group Type',
    footer: 'GRP-01 · Itinerary pace and stays auto-adjust by group',
  },
  {
    id: 5, label: 'Trip Theme',
    footer: 'ITIN-06 · POI filtering by theme',
  },
  {
    id: 6, label: 'Dates',
    footer: 'DATE-01 · DATE-02 · Departure and return dates',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Shared Navbar (same as Dashboard)
───────────────────────────────────────────────────────────────────────────── */
function Navbar({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const NAV = ['My Trips', 'Discover', 'Budget', 'Profile'];
  const [active, setActive] = useState('My Trips');

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">
        <div
          className="flex items-center gap-2 mr-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight">Traveloop</span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {NAV.map((item) => (
            <button
              key={item}
              id={`nav-itin-${item.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActive(item)}
              className={`px-3 py-1.5 text-sm font-medium transition-all ${
                active === item
                  ? 'text-brand-600 border-b-2 border-brand-500'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          id="btn-itin-avatar"
          className="w-8 h-8 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 hover:border-brand-300 transition-all"
          title={user?.name ?? 'Profile'}
          onClick={() => { logout(); navigate('/login', { replace: true }); }}
        >
          {user?.name?.charAt(0).toUpperCase() ?? 'U'}
        </button>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Map placeholder
───────────────────────────────────────────────────────────────────────────── */
function MapPlaceholder({ label }) {
  return (
    <div className="w-full h-52 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center mb-4">
      <span className="text-slate-400 text-sm font-medium tracking-wide">
        [ {label} ]
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Step content panels
───────────────────────────────────────────────────────────────────────────── */

// Step 1 — Start Location
function StepStartLocation({ data, onChange }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-5">Where are you starting from?</h2>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">🔍</span>
        <input
          id="itin-start-search"
          type="text"
          value={data.startLocation}
          onChange={(e) => onChange('startLocation', e.target.value)}
          placeholder="Search city, address, or landmark..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
        />
      </div>
      <MapPlaceholder label="Interactive Map – pin start location" />
    </div>
  );
}

// Step 2 — Destination
function StepDestination({ data, onChange }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-5">Where are you heading?</h2>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">📍</span>
        <input
          id="itin-dest-search"
          type="text"
          value={data.destination}
          onChange={(e) => onChange('destination', e.target.value)}
          placeholder="Search destination..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
        />
      </div>
      <MapPlaceholder label="Map with route preview" />
    </div>
  );
}

// Step 3 — Travel Mode
const TRAVEL_MODES = [
  { id: 'bike',  icon: '🚲', label: 'Bike',  sub: '150–250 km/day'  },
  { id: 'car',   icon: '🚗', label: 'Car',   sub: '300–400 km/day'  },
  { id: 'train', icon: '🚂', label: 'Train', sub: 'Per timetable'   },
  { id: 'plane', icon: '✈️',  label: 'Plane', sub: '1 day full route' },
];

function StepTravelMode({ data, onChange }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-6">How are you travelling?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TRAVEL_MODES.map((mode) => {
          const selected = data.travelMode === mode.id;
          return (
            <button
              key={mode.id}
              id={`itin-mode-${mode.id}`}
              onClick={() => onChange('travelMode', mode.id)}
              className={`flex flex-col items-center gap-2 py-6 px-3 rounded-xl border-2 transition-all duration-150 active:scale-95 ${
                selected
                  ? 'border-brand-400 bg-brand-50 shadow-md shadow-brand-200/50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-4xl">{mode.icon}</span>
              <span className={`font-bold text-sm ${selected ? 'text-brand-600' : 'text-slate-800'}`}>
                {mode.label}
              </span>
              <span className={`text-xs ${selected ? 'text-brand-400' : 'text-slate-400'}`}>
                {mode.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


// Step 4 — Group Type
const GROUP_TYPES = [
  { id: 'solo',    icon: '🧍', label: 'Solo',    desc: 'Budget stays · High activity'   },
  { id: 'couple',  icon: '👫', label: 'Couple',  desc: 'Boutique stays · Scenic pace'   },
  { id: 'family',  icon: '👨‍👩‍👧', label: 'Family',  desc: 'Slower pace · More stops'      },
  { id: 'friends', icon: '👯', label: 'Friends', desc: 'Group stays · Adventure'        },
];

function StepGroupType({ data, onChange }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-6">Who is travelling?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GROUP_TYPES.map((g) => {
          const selected = data.groupType === g.id;
          return (
            <button
              key={g.id}
              id={`itin-group-${g.id}`}
              onClick={() => onChange('groupType', g.id)}
              className={`flex flex-col items-center gap-2 py-6 px-3 rounded-xl border-2 text-center transition-all duration-150 active:scale-95 ${
                selected
                  ? 'border-brand-400 bg-brand-50 shadow-md shadow-brand-200/50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-4xl">{g.icon}</span>
              <span className={`font-bold text-sm ${selected ? 'text-brand-600' : 'text-slate-800'}`}>
                {g.label}
              </span>
              <span className={`text-xs leading-relaxed ${selected ? 'text-brand-400' : 'text-slate-400'}`}>
                {g.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Step 5 — Trip Theme
const THEMES = [
  { id: 'spiritual', icon: '🛕', label: 'Spiritual', desc: 'Temples · Ashrams · Pilgrimage sites'    },
  { id: 'nature',    icon: '🌿', label: 'Nature',    desc: 'National parks · Lakes · Wildlife'       },
  { id: 'adventure', icon: '⛰️',  label: 'Adventure', desc: 'Trekking · Water sports · Camping'       },
  { id: 'combined',  icon: '✨', label: 'Combined',  desc: 'Balanced mix with adjustable sliders'    },
];

function StepTripTheme({ data, onChange }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-6">What kind of trip?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {THEMES.map((t) => {
          const selected = data.tripTheme === t.id;
          return (
            <button
              key={t.id}
              id={`itin-theme-${t.id}`}
              onClick={() => onChange('tripTheme', t.id)}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl border-2 text-left transition-all duration-150 active:scale-[0.98] ${
                selected
                  ? 'border-brand-400 bg-brand-50 shadow-md shadow-brand-200/50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-3xl shrink-0">{t.icon}</span>
              <div className="min-w-0">
                <p className={`font-bold text-sm ${selected ? 'text-brand-700' : 'text-slate-800'}`}>
                  {t.label}
                </p>
                <p className={`text-xs mt-0.5 ${selected ? 'text-brand-400' : 'text-slate-400'}`}>
                  {t.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Step 6 — Dates
function StepDates({ data, onChange }) {
  const fmt = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const days =
    data.startDate && data.endDate && new Date(data.endDate) > new Date(data.startDate)
      ? Math.ceil((new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24))
      : null;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-5">When are you travelling?</h2>

      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
            Start Date
          </label>
          <div className="relative">
            <input
              id="itin-start-date"
              type="date"
              value={data.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all opacity-0 absolute inset-0"
            />
            <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pointer-events-none">
              {fmt(data.startDate) || <span className="text-slate-300">dd mmm yyyy</span>}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
            End Date
          </label>
          <div className="relative">
            <input
              id="itin-end-date"
              type="date"
              value={data.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all opacity-0 absolute inset-0"
            />
            <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pointer-events-none">
              {fmt(data.endDate) || <span className="text-slate-300">dd mmm yyyy</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Mini calendar placeholder */}
      <div className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 flex items-center justify-center mb-4 bg-slate-50">
        <span className="text-sm text-slate-400 font-medium tracking-wide">[ Mini calendar picker ]</span>
      </div>

      {/* Duration chip */}
      {days && (
        <p className="text-xs text-slate-400 mb-3 font-medium">
          📅 {days}-day trip
        </p>
      )}

      {/* Flexible checkbox */}
      <label className="flex items-center gap-2.5 text-sm text-slate-400 mb-5 cursor-pointer select-none">
        <input
          id="itin-flexible"
          type="checkbox"
          checked={data.flexible ?? false}
          onChange={(e) => onChange('flexible', e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 accent-brand-500"
        />
        Flexible – let system suggest optimal duration
      </label>

      {/* Generate CTA banner */}
      <button
        id="btn-generate-cta"
        onClick={() => {}}
        className="w-full py-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 font-semibold text-sm hover:bg-brand-100 active:scale-[0.99] transition-all"
      >
        Generate My Itinerary →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────────────────────── */
const INITIAL_DATA = {
  startLocation: '',
  destination: '',
  travelMode: '',
  groupType: '',
  tripTheme: '',
  startDate: '',
  endDate: '',
  flexible: false,
};

export default function ItineraryBuilderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);

  const onChange = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const canProceed = () => {
    switch (step) {
      case 1: return data.startLocation.trim().length > 0;
      case 2: return data.destination.trim().length > 0;
      case 3: return data.travelMode !== '';
      case 4: return data.groupType !== '';
      case 5: return data.tripTheme !== '';
      case 6: return data.startDate !== '' && data.endDate !== '';
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length) setStep((s) => s + 1);
    else {
      // TODO: submit / navigate to itinerary result
      console.log('Itinerary data:', data);
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else navigate('/dashboard');
  };

  const currentStep = STEPS[step - 1];

  const renderStep = () => {
    switch (step) {
      case 1: return <StepStartLocation data={data} onChange={onChange} />;
      case 2: return <StepDestination    data={data} onChange={onChange} />;
      case 3: return <StepTravelMode     data={data} onChange={onChange} />;
      case 4: return <StepGroupType      data={data} onChange={onChange} />;
      case 5: return <StepTripTheme      data={data} onChange={onChange} />;
      case 6: return <StepDates          data={data} onChange={onChange} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar user={user} />

      {/* Mobile step progress strip */}
      <div className="sm:hidden bg-white border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500">{currentStep.label}</p>
          <p className="text-xs text-slate-400">Step {step} of {STEPS.length}</p>
        </div>
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              disabled={s.id > step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.id === step
                  ? 'flex-1 bg-slate-800'
                  : s.id < step
                  ? 'flex-1 bg-emerald-400'
                  : 'flex-1 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 sm:flex gap-6 items-start">
        {/* ── Left sidebar — desktop only ───────────────────────────────── */}
        <aside className="hidden sm:block w-56 shrink-0">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">
            Guided Flow
          </p>

          <ul className="space-y-1">
            {STEPS.map((s) => {
              const isDone   = s.id < step;
              const isActive = s.id === step;
              const isFuture = s.id > step;

              return (
                <li key={s.id}>
                  <button
                    id={`sidebar-step-${s.id}`}
                    onClick={() => isDone && setStep(s.id)}
                    disabled={isFuture}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm'
                        : isDone
                        ? 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                        : 'text-slate-400 cursor-default'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-white text-slate-800'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : s.id}
                    </span>
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-slate-800 rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">Step {step} of {STEPS.length}</p>
          </div>
        </aside>

        {/* ── Main content card ─────────────────────────────────────────── */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Step body */}
          <div className="px-4 sm:px-8 pt-5 sm:pt-8 pb-4 min-h-[300px] sm:min-h-[340px]">
            {renderStep()}
          </div>

          {/* Footer bar */}
          <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {/* Code hint — hidden on mobile */}
            <p className="hidden sm:block text-xs text-slate-400 font-medium shrink-0">
              {currentStep.footer}
            </p>

            {/* Mobile: full-width button row */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:ml-auto">
              <button
                id="btn-itin-back"
                onClick={handleBack}
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all"
              >
                ← Back
              </button>
              <button
                id="btn-itin-next"
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${
                  canProceed()
                    ? 'bg-slate-800 hover:bg-slate-700 shadow-md'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {step === STEPS.length ? 'Generate →' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
