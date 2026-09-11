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
   Cities mapping for interactive maps
───────────────────────────────────────────────────────────────────────────── */
const CITIES = [
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', x: 150, y: 200 },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', x: 160, y: 160 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', x: 160, y: 280 },
  { id: 'goa', name: 'Goa', state: 'Goa', x: 170, y: 340 },
  { id: 'delhi', name: 'Delhi', state: 'NCR', x: 230, y: 90 },
  { id: 'manali', name: 'Manali', state: 'Himachal Pradesh', x: 250, y: 40 },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', x: 230, y: 320 },
  { id: 'coorg', name: 'Coorg', state: 'Karnataka', x: 200, y: 340 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', x: 200, y: 130 },
  { id: 'jodhpur', name: 'Jodhpur', state: 'Rajasthan', x: 130, y: 130 },
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
   Interactive Map Component with curved routes and animateMotion
───────────────────────────────────────────────────────────────────────────── */
function InteractiveMap({ startLocation, destination, onSelectStart, onSelectDest, step }) {
  const startCity = CITIES.find(c => c.name.toLowerCase() === (startLocation || '').trim().toLowerCase());
  const destCity = CITIES.find(c => c.name.toLowerCase() === (destination || '').trim().toLowerCase());

  const handleCityClick = (city) => {
    if (step === 1) {
      onSelectStart(city.name);
    } else if (step === 2) {
      onSelectDest(city.name);
    }
  };

  let routePath = '';
  if (startCity && destCity) {
    const midX = (startCity.x + destCity.x) / 2;
    const midY = (startCity.y + destCity.y) / 2;
    const dx = destCity.x - startCity.x;
    const dy = destCity.y - startCity.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ox = -dy / dist * 35;
    const oy = dx / dist * 35;
    routePath = `M ${startCity.x} ${startCity.y} Q ${midX + ox} ${midY + oy} ${destCity.x} ${destCity.y}`;
  }

  return (
    <div className="relative w-full h-[260px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-inner flex flex-col mb-4">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.35); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes routeDash {
          to { stroke-dashoffset: -20; }
        }
        .animate-route-path {
          stroke-dasharray: 6, 4;
          animation: routeDash 1.2s linear infinite;
        }
      `}</style>

      <svg className="w-full h-full" viewBox="0 0 380 380" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2,2">
          {CITIES.map((c1, i) => 
            CITIES.slice(i+1).map((c2) => {
              const dx = c1.x - c2.x;
              const dy = c1.y - c2.y;
              const d = Math.sqrt(dx*dx + dy*dy);
              if (d < 120) {
                return <line key={`${c1.id}-${c2.id}`} x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} />;
              }
              return null;
            })
          )}
        </g>

        {startCity && destCity && (
          <>
            <path
              d={routePath}
              fill="none"
              stroke="rgba(14, 165, 233, 0.2)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d={routePath}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-route-path"
            />
            <g>
              <circle r="4" fill="#fb923c" stroke="#fff" strokeWidth="1">
                <animateMotion
                  path={routePath}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </>
        )}

        {CITIES.map((city) => {
          const isStart = startCity && startCity.id === city.id;
          const isDest = destCity && destCity.id === city.id;
          
          let markerColor = 'rgba(255,255,255,0.3)';

          if (isStart) {
            markerColor = '#0ea5e9';
          } else if (isDest) {
            markerColor = '#f97316';
          }

          return (
            <g
              key={city.id}
              className="cursor-pointer select-none group"
              onClick={() => handleCityClick(city)}
            >
              {(isStart || isDest) && (
                <circle
                  cx={city.x}
                  cy={city.y}
                  r="16"
                  fill="none"
                  stroke={markerColor}
                  strokeWidth="2"
                  opacity="0.5"
                  style={{ transformOrigin: `${city.x}px ${city.y}px`, animation: 'pulse-ring 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite' }}
                />
              )}

              <circle
                cx={city.x}
                cy={city.y}
                r={isStart || isDest ? 6 : 4}
                fill={markerColor}
                stroke={isStart || isDest ? '#ffffff' : 'none'}
                strokeWidth="1.5"
                className="transition-all duration-300 group-hover:scale-125"
                style={{ transformOrigin: `${city.x}px ${city.y}px` }}
              />

              <text
                x={city.x}
                y={city.y - 12}
                textAnchor="middle"
                fill={isStart || isDest ? '#ffffff' : '#94a3b8'}
                fontSize={isStart || isDest ? '10px' : '8px'}
                fontWeight={isStart || isDest ? 'bold' : 'normal'}
                className="pointer-events-none transition-all duration-300 group-hover:fill-white font-sans tracking-wide"
              >
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700 pointer-events-none">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
          {step === 1 ? 'Start Point Mapping' : 'Destination Route Mapping'}
        </span>
      </div>

      {startCity && destCity && (
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700 pointer-events-none">
          <span className="text-[10px] text-slate-300 font-semibold font-mono">
            Route: {startCity.name} ➔ {destCity.name}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Step content panels
───────────────────────────────────────────────────────────────────────────── */

// Step 1 — Start Location
function StepStartLocation({ data, onChange }) {
  const [focused, setFocused] = useState(false);
  
  const filtered = CITIES.filter(c => 
    c.name.toLowerCase().includes((data.startLocation || '').toLowerCase())
  );

  return (
    <div className="relative">
      <h2 className="text-lg font-bold text-slate-800 mb-5">Where are you starting from?</h2>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">🔍</span>
        <input
          id="itin-start-search"
          type="text"
          value={data.startLocation}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onChange={(e) => onChange('startLocation', e.target.value)}
          placeholder="Search city, address, or landmark..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
        />

        {focused && filtered.length > 0 && (
          <div className="absolute top-[105%] left-0 right-0 z-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 max-h-48 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                type="button"
                onMouseDown={() => onChange('startLocation', c.name)}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-sm text-slate-700 font-medium border-b last:border-0 border-slate-50"
              >
                <span>📍</span>
                <div className="flex flex-col">
                  <span>{c.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{c.state}, India</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <InteractiveMap 
        startLocation={data.startLocation} 
        destination={data.destination}
        onSelectStart={(val) => onChange('startLocation', val)}
        onSelectDest={(val) => onChange('destination', val)}
        step={1}
      />
      
      <p className="text-xs text-slate-400 font-medium mt-3">
        ITIN-01 · Free text or map pin input
      </p>
    </div>
  );
}

// Step 2 — Destination
function StepDestination({ data, onChange }) {
  const [focused, setFocused] = useState(false);
  
  const filtered = CITIES.filter(c => 
    c.name.toLowerCase().includes((data.destination || '').toLowerCase())
  );

  return (
    <div className="relative">
      <h2 className="text-lg font-bold text-slate-800 mb-5">Where are you heading?</h2>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">📍</span>
        <input
          id="itin-dest-search"
          type="text"
          value={data.destination}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onChange={(e) => onChange('destination', e.target.value)}
          placeholder="Search destination..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
        />

        {focused && filtered.length > 0 && (
          <div className="absolute top-[105%] left-0 right-0 z-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 max-h-48 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                type="button"
                onMouseDown={() => onChange('destination', c.name)}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-sm text-slate-700 font-medium border-b last:border-0 border-slate-50"
              >
                <span>📍</span>
                <div className="flex flex-col">
                  <span>{c.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{c.state}, India</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <InteractiveMap 
        startLocation={data.startLocation} 
        destination={data.destination}
        onSelectStart={(val) => onChange('startLocation', val)}
        onSelectDest={(val) => onChange('destination', val)}
        step={2}
      />

      <p className="text-xs text-slate-400 font-medium mt-3">
        SRCH-01 · SRCH-02 · Keyword or map pin
      </p>
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
              className={`relative flex flex-col items-center gap-2 py-6 px-3 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                selected
                  ? 'border-brand-400 bg-brand-50 shadow-md shadow-brand-200/40 scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {selected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  ✓
                </span>
              )}
              <span className="text-4xl">{mode.icon}</span>
              <span className={`font-bold text-sm ${selected ? 'text-brand-700' : 'text-slate-800'}`}>
                {mode.label}
              </span>
              <span className={`text-xs ${selected ? 'text-brand-400' : 'text-slate-400'}`}>
                {mode.sub}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 font-medium mt-6">
        ITIN-01 · Daily coverage auto-adjusts by group type
      </p>
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
              className={`relative flex flex-col items-center gap-2 py-6 px-3 rounded-xl border-2 text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                selected
                  ? 'border-brand-400 bg-brand-50 shadow-md shadow-brand-200/40 scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {selected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  ✓
                </span>
              )}
              <span className="text-4xl">{g.icon}</span>
              <span className={`font-bold text-sm ${selected ? 'text-brand-700' : 'text-slate-800'}`}>
                {g.label}
              </span>
              <span className={`text-xs leading-relaxed ${selected ? 'text-brand-400' : 'text-slate-400'}`}>
                {g.desc}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 font-medium mt-6">
        GRP-01 · Itinerary pace and stays auto-adjust by group
      </p>
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
  const sliders = data.themeSliders || { spiritual: 40, nature: 30, adventure: 30 };
  
  const handleSliderChange = (key, val) => {
    onChange('themeSliders', {
      ...sliders,
      [key]: parseInt(val, 10)
    });
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-6">What kind of trip?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {THEMES.map((t) => {
          const selected = data.tripTheme === t.id;
          return (
            <button
              key={t.id}
              id={`itin-theme-${t.id}`}
              onClick={() => onChange('tripTheme', t.id)}
              className={`relative flex items-center gap-4 px-4 py-4 rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                selected
                  ? 'border-brand-400 bg-brand-50 shadow-md shadow-brand-200/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {selected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  ✓
                </span>
              )}
              <span className="text-3xl shrink-0">{t.icon}</span>
              <div className="min-w-0 pr-4">
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

      {data.tripTheme === 'combined' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5 space-y-4 animate-fade-in">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Adjust Theme Weights</p>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">🛕 Spiritual</span>
              <span className="text-violet-600">{sliders.spiritual}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={sliders.spiritual} 
              onChange={(e) => handleSliderChange('spiritual', e.target.value)}
              className="w-full h-1.5 rounded-lg bg-slate-200 accent-violet-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">🌿 Nature</span>
              <span className="text-green-600">{sliders.nature}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={sliders.nature} 
              onChange={(e) => handleSliderChange('nature', e.target.value)}
              className="w-full h-1.5 rounded-lg bg-slate-200 accent-green-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">⛰️ Adventure</span>
              <span className="text-orange-600">{sliders.adventure}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={sliders.adventure} 
              onChange={(e) => handleSliderChange('adventure', e.target.value)}
              className="w-full h-1.5 rounded-lg bg-slate-200 accent-orange-600 cursor-pointer"
            />
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 font-medium">
        ITIN-06 · POI filtering by theme
      </p>
    </div>
  );
}

// Step 6 — Mini Calendar Picker Component
function MiniCalendar({ startDate, endDate, onRangeSelect }) {
  const blanks = Array(6).fill(null);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getFullDateStr = (day) => {
    if (!day) return '';
    return `2026-08-${String(day).padStart(2, '0')}`;
  };

  const handleDateClick = (day) => {
    const clickedDate = getFullDateStr(day);
    if (!startDate || (startDate && endDate)) {
      onRangeSelect(clickedDate, '');
    } else {
      if (new Date(clickedDate) < new Date(startDate)) {
        onRangeSelect(clickedDate, '');
      } else {
        onRangeSelect(startDate, clickedDate);
      }
    }
  };

  const isSelected = (day) => {
    const dStr = getFullDateStr(day);
    return dStr === startDate || dStr === endDate;
  };

  const isInRange = (day) => {
    if (!startDate || !endDate || !day) return false;
    const dStr = getFullDateStr(day);
    const curr = new Date(dStr);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return curr > start && curr < end;
  };

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-slate-700">August 2026</span>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Select Range</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {weekdays.map(d => (
          <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map((_, idx) => (
          <div key={`blank-${idx}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const selected = isSelected(day);
          const range = isInRange(day);
          
          let btnClass = 'text-slate-600 hover:bg-slate-200 hover:text-slate-800';
          if (selected) {
            btnClass = 'bg-brand-500 text-white font-bold shadow-sm';
          } else if (range) {
            btnClass = 'bg-brand-100/70 text-brand-700 font-semibold';
          }

          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => handleDateClick(day)}
              className={`aspect-square w-full rounded-lg text-xs flex items-center justify-center transition-all ${btnClass}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Step 6 — Dates Panel
function StepDates({ data, onChange, onGenerate }) {
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all opacity-0 absolute inset-0 z-10"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all opacity-0 absolute inset-0 z-10"
            />
            <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 pointer-events-none">
              {fmt(data.endDate) || <span className="text-slate-300">dd mmm yyyy</span>}
            </div>
          </div>
        </div>
      </div>

      <MiniCalendar 
        startDate={data.startDate} 
        endDate={data.endDate} 
        onRangeSelect={(start, end) => {
          onChange('startDate', start);
          onChange('endDate', end);
        }}
      />

      {days && (
        <p className="text-xs text-slate-500 mb-3 font-semibold flex items-center gap-1.5">
          📅 <span>{days}-day trip</span>
        </p>
      )}

      <label className="flex items-center gap-2.5 text-sm text-slate-500 mb-5 cursor-pointer select-none">
        <input
          id="itin-flexible"
          type="checkbox"
          checked={data.flexible ?? false}
          onChange={(e) => onChange('flexible', e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 accent-brand-500"
        />
        Flexible – let system suggest optimal duration
      </label>

      <button
        id="btn-generate-cta"
        onClick={onGenerate}
        disabled={!data.startDate || !data.endDate}
        className="w-full py-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 font-semibold text-sm hover:bg-brand-100 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
      >
        Generate My Itinerary →
      </button>

      <p className="text-xs text-slate-400 font-medium">
        DATE-01 · DATE-02 · Departure and return dates
      </p>
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
  themeSliders: { spiritual: 40, nature: 30, adventure: 30 },
};

const STAGES = [
  'Analyzing travel preferences...',
  'Optimizing route mapping...',
  'Selecting boutique stays...',
  'Polishing day-by-day itinerary...'
];

export default function ItineraryBuilderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStage, setGenStage] = useState(0);

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

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenStage(0);
    
    // Progress stages
    const timer1 = setTimeout(() => setGenStage(1), 800);
    const timer2 = setTimeout(() => setGenStage(2), 1600);
    const timer3 = setTimeout(() => setGenStage(3), 2400);
    const timer4 = setTimeout(() => {
      const themeTag = data.tripTheme === 'combined' 
        ? `Combined (${data.themeSliders.spiritual}/${data.themeSliders.nature}/${data.themeSliders.adventure})`
        : data.tripTheme.charAt(0).toUpperCase() + data.tripTheme.slice(1);

      const newTrip = {
        id: Date.now().toString(),
        name: `${data.startLocation} → ${data.destination}`,
        startDate: data.startDate,
        endDate: data.endDate,
        transport: data.travelMode.charAt(0).toUpperCase() + data.travelMode.slice(1),
        tripType: data.groupType,
        tags: [themeTag],
        from: data.startLocation,
        to: data.destination,
        distanceKm: Math.floor(Math.random() * 300) + 220,
        budgetSpent: Math.floor(Math.random() * 25000) + 12000,
      };

      let currentTrips = [];
      const saved = localStorage.getItem('traveloop_trips');
      if (saved) {
        try {
          currentTrips = JSON.parse(saved);
        } catch {}
      }

      localStorage.setItem('traveloop_trips', JSON.stringify([newTrip, ...currentTrips]));
      setIsGenerating(false);
      navigate('/dashboard');
    }, 3200);
  };

  const handleNext = () => {
    if (step < STEPS.length) setStep((s) => s + 1);
    else {
      handleGenerate();
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
      case 6: return <StepDates          data={data} onChange={onChange} onGenerate={handleGenerate} />;
      default: return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-6">
        <style>{`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
        
        <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-brand-400 animate-spin" />
          <span className="text-4xl animate-spin-slow">🧭</span>
        </div>

        <h2 className="text-xl font-bold mb-3 tracking-wide text-slate-100">Generating Itinerary</h2>
        
        <div className="h-6 flex items-center justify-center">
          <p className="text-sm font-semibold text-brand-400 animate-pulse">
            {STAGES[genStage]}
          </p>
        </div>

        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-6">
          <div 
            className="h-full bg-brand-400 rounded-full transition-all duration-300"
            style={{ width: `${(genStage + 1) * 25}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar user={user} />

      <div className="sm:hidden bg-white border-b border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500">{currentStep.label}</p>
          <p className="text-xs text-slate-400">Step {step} of {STEPS.length}</p>
        </div>
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

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-8 pt-5 sm:pt-8 pb-4 min-h-[300px] sm:min-h-[340px]">
            {renderStep()}
          </div>

          <div className="px-4 sm:px-8 py-3 sm:py-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <p className="hidden sm:block text-xs text-slate-400 font-medium shrink-0">
              Step {step} of {STEPS.length}
            </p>

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
                onClick={step === STEPS.length ? handleGenerate : handleNext}
                disabled={!canProceed()}
                className={`flex-1 sm:flex-none px-5 sm:px-6 py-2.5 sm:py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${
                  canProceed()
                    ? 'bg-slate-800 hover:bg-slate-700 shadow-md'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                {step === STEPS.length ? 'Generate' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
