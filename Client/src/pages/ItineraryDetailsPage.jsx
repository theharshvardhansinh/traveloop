import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CITIES = [
  { id: 'ahmedabad', name: 'Ahmedabad', x: 150, y: 200 },
  { id: 'udaipur', name: 'Udaipur', x: 160, y: 160 },
  { id: 'mumbai', name: 'Mumbai', x: 160, y: 280 },
  { id: 'goa', name: 'Goa', x: 170, y: 340 },
  { id: 'delhi', name: 'Delhi', x: 230, y: 90 },
  { id: 'manali', name: 'Manali', x: 250, y: 40 },
  { id: 'bangalore', name: 'Bangalore', x: 230, y: 320 },
  { id: 'coorg', name: 'Coorg', x: 200, y: 340 },
  { id: 'jaipur', name: 'Jaipur', x: 200, y: 130 },
  { id: 'jodhpur', name: 'Jodhpur', x: 130, y: 130 },
];

const getItineraryData = (from, to, daysCount) => {
  const pois = {
    udaipur: [
      { name: 'Akshardham Temple', type: 'Spiritual', desc: 'Spiritual temple complex · 1.5 hrs' },
      { name: 'City Palace Udaipur', type: 'Historical', desc: 'Majestic palace overlooking Lake Pichola · 2.5 hrs' },
      { name: 'Lake Pichola Boat Ride', type: 'Scenic', desc: 'Sunset cruise to Jag Mandir · 1 hr' },
      { name: 'Sajjangarh Monsoon Palace', type: 'Nature', desc: 'Hilltop palace with sunset views · 2 hrs' },
      { name: 'Fateh Sagar Lake', type: 'Leisure', desc: 'Beautiful lakeside walk and street food · 1.5 hrs' }
    ],
    goa: [
      { name: 'Calangute Beach Walk', type: 'Leisure', desc: 'Scenic beach walk and water sports · 2 hrs' },
      { name: 'Fort Aguada', type: 'Historical', desc: '17th-century Portuguese lighthouse & fort · 1.5 hrs' },
      { name: 'Basilica of Bom Jesus', type: 'Spiritual', desc: 'UNESCO world heritage church · 1 hr' },
      { name: 'Anjuna Flea Market', type: 'Shopping', desc: 'Famous beachside shopping bazaar · 2.5 hrs' },
      { name: 'Dudhsagar Waterfalls', type: 'Adventure', desc: 'Majestic four-tiered waterfall trek · 4 hrs' }
    ],
    manali: [
      { name: 'Hadimba Temple', type: 'Spiritual', desc: 'Wooden temple in cedar forest · 1 hr' },
      { name: 'Solang Valley Adventure', type: 'Adventure', desc: 'Paragliding and scenic viewpoints · 3 hrs' },
      { name: 'Jogini Waterfalls', type: 'Nature', desc: 'Short trek through pine forests · 2 hrs' },
      { name: 'Vashisht Hot Water Springs', type: 'Spiritual', desc: 'Natural hot sulphur baths · 1.5 hrs' },
      { name: 'Rohtang Pass Snow Point', type: 'Adventure', desc: 'High mountain pass with snow sports · 4 hrs' }
    ],
    coorg: [
      { name: 'Abbey Falls', type: 'Nature', desc: 'Scenic waterfall inside coffee plantation · 1 hr' },
      { name: 'Dubare Elephant Camp', type: 'Adventure', desc: 'Elephant bathing and river rafting · 3 hrs' },
      { name: 'Raja\'s Seat', type: 'Scenic', desc: 'Beautiful garden with seasonal flowers & sunset · 1.5 hrs' },
      { name: 'Golden Temple (Namdroling)', type: 'Spiritual', desc: 'Stunning Tibetan monastery · 2 hrs' },
      { name: 'Madikeri Fort', type: 'Historical', desc: '19th-century palace and museum · 1.5 hrs' }
    ],
    jodhpur: [
      { name: 'Mehrangarh Fort', type: 'Historical', desc: 'Huge museum and fort with city views · 3 hrs' },
      { name: 'Jaswant Thada', type: 'Historical', desc: 'Beautiful white marble cenotaph · 1 hr' },
      { name: 'Umaid Bhawan Palace', type: 'Historical', desc: 'Royal residence and museum · 2 hrs' },
      { name: 'Kalyana Lake Picnic', type: 'Scenic', desc: 'Peaceful lake sunset view · 1.5 hrs' },
      { name: 'Sardar Market Clock Tower', type: 'Shopping', desc: 'Bustling bazaar walk · 2 hrs' }
    ]
  };

  const defaultPois = [
    { name: 'Local Marketplace', type: 'Shopping', desc: 'Explore regional crafts and food · 2 hrs' },
    { name: 'Central Museum', type: 'Historical', desc: 'Learn regional history and heritage · 1.5 hrs' },
    { name: 'Botanical Gardens', type: 'Nature', desc: 'Relaxing walk amongst local flora · 1.5 hrs' },
    { name: 'Sunset Viewpoint', type: 'Scenic', desc: 'Best views of the city at dusk · 1 hr' },
    { name: 'Traditional Dinner Show', type: 'Leisure', desc: 'Local cuisine with cultural performance · 2.5 hrs' }
  ];

  const selectedPois = pois[to.toLowerCase()] || defaultPois;

  const itineraryDays = [];
  for (let d = 1; d <= daysCount; d++) {
    const dayPois = [];
    const poi1 = selectedPois[(d * 2 - 2) % selectedPois.length];
    const poi2 = selectedPois[(d * 2 - 1) % selectedPois.length];

    dayPois.push({
      time: '07:00',
      title: `Depart ${d === 1 ? from : 'Midpoint'}`,
      type: 'Start',
      desc: 'Fuel + breakfast near transit center'
    });

    dayPois.push({
      time: '09:30',
      title: poi1.name,
      type: poi1.type,
      desc: poi1.desc
    });

    dayPois.push({
      time: '12:45',
      title: 'Lunch stop',
      type: 'Meal',
      desc: 'Haveli Restaurant · ⭐ 4.3'
    });

    dayPois.push({
      time: '16:00',
      title: poi2.name,
      type: poi2.type,
      desc: poi2.desc
    });

    dayPois.push({
      time: '19:30',
      title: `Stay - ${to}`,
      type: 'Hotel',
      desc: 'The Surya Palace · Family rooms · ₹8,200/night'
    });

    itineraryDays.push({
      dayNum: d,
      title: `Day ${d} — ${d === 1 ? from : 'Midpoint'} to ${d === daysCount ? to : 'Next stop'}`,
      activities: dayPois
    });
  }

  return itineraryDays;
};

export default function ItineraryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('traveloop_trips');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const t = list.find((item) => item.id === id);
        if (t) {
          setTrip(t);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback if not found
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
    return <div className="p-8 text-center text-slate-500">Loading trip details...</div>;
  }

  const aiDays = trip.aiItinerary?.days || [];
  const hasAi = aiDays.length > 0;
  const daysCount = hasAi ? aiDays.length : Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)));
  
  const fallbackDays = getItineraryData(trip.from, trip.to, daysCount);

  // Parse AI itinerary or fallback
  const daysData = hasAi
    ? aiDays.map((d, i) => ({
        dayNum: d.dayNumber || i + 1,
        title: d.title || `Day ${i + 1} — ${trip.to}`,
        theme: d.theme || 'Explore',
        weather: d.weatherSummary || 'Pleasant, 26°C',
        stay: d.nightStay?.name ? `${d.nightStay.name} (${d.nightStay.category || 'Hotel'})` : null,
        activities: (d.activities || []).map((act) => ({
          time: act.timeSlot?.split('(')[1]?.split(')')[0] || '10:00 AM',
          title: act.title,
          type: act.category || 'Sightseeing',
          desc: `${act.description} · Est. ₹${act.estimatedCostINR || 300}`,
        })).concat(
          d.lunchStop ? [{
            time: '01:30 PM',
            title: `Lunch: ${d.lunchStop.name}`,
            type: 'Meal',
            desc: `${d.lunchStop.cuisine || 'Local'} cuisine · Est. ₹${d.lunchStop.estimatedCostINR || 500}`
          }] : []
        )
      }))
    : fallbackDays;

  const currentDayData = daysData[activeDay - 1] || daysData[0];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const startCity = CITIES.find(c => c.name.toLowerCase() === trip.from.toLowerCase());
  const destCity = CITIES.find(c => c.name.toLowerCase() === trip.to.toLowerCase());

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
            <button onClick={() => navigate(`/budget/${trip.id}`)} className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">Budget</button>
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
            className="py-3 text-sm font-semibold border-b-2 border-brand-500 text-brand-600"
          >
            📋 Itinerary
          </button>
          <button
            onClick={() => navigate(`/budget/${trip.id}`)}
            className="py-3 text-sm font-semibold border-b-2 border-transparent text-slate-555 hover:text-slate-700"
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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Itinerary details</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {trip.name} · {trip.transport} · {trip.tripType}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Day Selector */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Day Plan</p>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {daysData.map((d) => (
                <button
                  key={d.dayNum}
                  onClick={() => setActiveDay(d.dayNum)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all shrink-0 sm:shrink ${
                    activeDay === d.dayNum
                      ? 'bg-slate-800 border-slate-850 text-white shadow'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">Day {d.dayNum}</p>
                  <p className="text-xs font-medium truncate mt-0.5">{d.title.split('—')[1] || trip.to}</p>
                </button>
              ))}
            </div>
            <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors">
              + Override day
            </button>
          </div>

          {/* Timeline Center */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800 text-base">{currentDayData.title}</h2>
              <div className="flex gap-2">
                <button className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 active:scale-95 transition-all">Regenerate</button>
                <button className="px-2.5 py-1.5 text-[11px] font-semibold text-brand-600 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 active:scale-95 transition-all">Add Activity</button>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-6">
              {currentDayData.activities.map((act, index) => {
                let badgeColor = 'bg-slate-100 text-slate-600';
                if (act.type === 'Start') badgeColor = 'bg-blue-100 text-blue-700';
                if (act.type === 'Spiritual' || act.type === 'Historical') badgeColor = 'bg-purple-100 text-purple-700';
                if (act.type === 'Meal') badgeColor = 'bg-amber-100 text-amber-700';
                if (act.type === 'Hotel') badgeColor = 'bg-indigo-50 text-indigo-700';

                return (
                  <div key={index} className="relative group">
                    <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 ring-slate-100 ${
                      act.type === 'Start' ? 'bg-blue-500' : act.type === 'Hotel' ? 'bg-indigo-500' : 'bg-brand-400'
                    }`} />
                    
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-slate-505">{act.time}</span>
                          <h3 className="font-bold text-slate-800 text-sm">{act.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                            {act.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{act.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-md flex flex-col">
              <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Route Map</span>
                <span className="text-[10px] text-brand-400 font-semibold font-mono">Day {activeDay} Route</span>
              </div>
              <div className="relative h-48 w-full bg-slate-900">
                <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="grid-mini" width="15" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-mini)" />
                  {startCity && destCity && (
                    <>
                      <line x1={startCity.x/2} y1={startCity.y/2} x2={destCity.x/2} y2={destCity.y/2} stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
                      <circle cx={startCity.x/2} cy={startCity.y/2} r="4" fill="#0ea5e9" />
                      <circle cx={destCity.x/2} cy={destCity.y/2} r="4" fill="#f97316" />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-500 font-semibold font-mono">[ Map View ]</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400 mb-4">Day Summary</h3>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Distance</span>
                  <span className="font-bold text-slate-700">112 km</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Meal stops</span>
                  <span className="font-bold text-slate-700">2</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">POI stops</span>
                  <span className="font-bold text-slate-700">2</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center text-sm font-bold pt-1">
                  <span className="text-slate-800">Est. cost</span>
                  <span className="text-brand-600">₹9,600</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
