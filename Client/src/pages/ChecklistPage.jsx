import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CHECKLIST = {
  documents: [
    { id: 'd1', label: 'Aadhar Card / ID proof', checked: false },
    { id: 'd2', label: 'Trip itinerary printout', checked: false },
    { id: 'd3', label: 'Hotel booking confirmations', checked: false },
    { id: 'd4', label: 'Emergency contacts', checked: false },
  ],
  toiletries: [
    { id: 't1', label: 'Sunscreen SPF 50+', checked: false },
    { id: 't2', label: 'Insect repellent', checked: false },
    { id: 't3', label: 'Hand sanitizer', checked: false },
    { id: 't4', label: 'Medicines / first aid', checked: false },
  ],
  food: [
    { id: 'f1', label: 'Water bottles x 4', checked: false },
    { id: 'f2', label: 'Energy bars', checked: false },
    { id: 'f3', label: 'Dry fruits', checked: false },
  ],
  clothing: [
    { id: 'c1', label: 'Cotton shirts x 4', checked: false },
    { id: 'c2', label: 'Comfortable walking shoes', checked: false },
    { id: 'c3', label: 'Light jacket / shawl', checked: false },
    { id: 'c4', label: 'Sandals', checked: false },
  ],
  gadgets: [
    { id: 'g1', label: 'Phone + charger', checked: false },
    { id: 'g2', label: 'Power bank', checked: false },
    { id: 'g3', label: 'Car charger', checked: false },
    { id: 'g4', label: 'Camera', checked: false },
  ],
};

export default function ChecklistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [trip, setTrip] = useState(null);
  
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem(`traveloop_checklist_${id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_CHECKLIST;
  });

  const [newItems, setNewItems] = useState({
    documents: '', toiletries: '', food: '', clothing: '', gadgets: ''
  });

  const [activeInput, setActiveInput] = useState(null);

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
    // If trip not found, keep null
  }, [id]);

  useEffect(() => {
    if (id) {
      localStorage.setItem(`traveloop_checklist_${id}`, JSON.stringify(checklist));
    }
  }, [checklist, id]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex flex-col items-center justify-center p-8 text-center">
        <span className="text-5xl mb-4">📋</span>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Trip Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">We couldn't find the checklist for this trip.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleCheck = (category, itemId) => {
    setChecklist((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const handleAddItem = (category) => {
    const text = newItems[category].trim();
    if (!text) return;

    const newItem = {
      id: `${category}-${Date.now()}`,
      label: text,
      checked: false
    };

    setChecklist((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem]
    }));

    setNewItems((prev) => ({
      ...prev,
      [category]: ''
    }));
    setActiveInput(null);
  };

  // Calculate stats
  let totalItems = 0;
  let packedItems = 0;
  Object.keys(checklist).forEach((cat) => {
    totalItems += checklist[cat].length;
    packedItems += checklist[cat].filter((item) => item.checked).length;
  });

  const categories = [
    { key: 'documents', label: 'Documents' },
    { key: 'toiletries', label: 'Toiletries' },
    { key: 'food', label: 'Food & Snacks' },
    { key: 'clothing', label: 'Clothing' },
    { key: 'gadgets', label: 'Gadgets' },
  ];

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
            className="py-3 text-sm font-semibold border-b-2 border-transparent text-slate-555 hover:text-slate-700"
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
            className="py-3 text-sm font-semibold border-b-2 border-brand-500 text-brand-600"
          >
            🎒 Packing Checklist
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Title HUD */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Packing Checklist</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {trip.name} · {trip.transport} · {trip.tripType}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-black text-slate-800">
              {packedItems}/{totalItems}
            </span>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">packed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const items = checklist[c.key] || [];
            const packedCount = items.filter(i => i.checked).length;
            
            return (
              <div key={c.key} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[220px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-xs uppercase tracking-wider text-slate-400">{c.label}</h2>
                  <span className="text-[10px] font-bold text-slate-450 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {packedCount}/{items.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {items.map((item) => (
                    <label key={item.id} className="flex items-start gap-2.5 text-xs text-slate-650 cursor-pointer select-none py-0.5">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleCheck(c.key, item.id)}
                        className="w-4 h-4 rounded border-slate-300 accent-brand-500 mt-0.5 shrink-0"
                      />
                      <span className={item.checked ? 'line-through text-slate-400 font-medium' : 'font-medium'}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                {activeInput === c.key ? (
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      placeholder="Add item..."
                      value={newItems[c.key]}
                      onChange={(e) => setNewItems(prev => ({ ...prev, [c.key]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem(c.key)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400"
                    />
                    <button
                      onClick={() => handleAddItem(c.key)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveInput(c.key)}
                    className="text-left text-[11px] font-semibold text-brand-600 hover:text-brand-700 mt-4 transition-colors pt-2 border-t border-slate-50"
                  >
                    + Add Item
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
