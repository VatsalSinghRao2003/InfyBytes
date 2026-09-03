import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Search, ShoppingCart, Tag, Flame, RefreshCw, AlertCircle } from 'lucide-react';

export default function CustomerMenu({ onSelectOrder }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    const catList = await apiService.getCategories();
    setCategories(catList || []);

    if (selectedCategory === 'All') {
      const data = await apiService.getAllItems();
      setItems(data || []);
    } else {
      const data = await apiService.getItemsByCategoryName(selectedCategory);
      setItems(data || []);
    }
    setLoading(false);
  };

  const filteredItems = items.filter(item =>
    (item.ItemName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.ItemId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (catId) => {
    const found = categories.find(c => c.CategoryId === catId);
    return found ? found.CategoryName : `Category #${catId}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-12 border border-slate-700/60 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-4">
            <Flame className="w-3.5 h-3.5" />
            <span>InfyBytes Doorstep Ordering</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Delicious meals delivered <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">hot & fresh</span>
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore our menu of pizzas, burgers, and sides. Place your order with instant price calculation and doorstep tracking.
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search food item (e.g. Cheese Burger, MAR, Pizza)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/80 text-white rounded-2xl border border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
            selectedCategory === 'All'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'glass-panel text-slate-300 hover:bg-slate-800'
          }`}
        >
          All Menu
        </button>
        {categories.map((cat) => (
          <button
            key={cat.CategoryId}
            onClick={() => setSelectedCategory(cat.CategoryName)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex items-center space-x-2 ${
              selectedCategory === cat.CategoryName
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'glass-panel text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>{cat.CategoryName === 'Pizza' ? '🍕' : cat.CategoryName === 'Burger' ? '🍔' : '🍲'}</span>
            <span>{cat.CategoryName}</span>
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 glass-panel rounded-3xl animate-pulse p-4 flex items-center justify-center text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Loading food items...</span>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-300 text-lg font-bold">No food items found.</p>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            No food item records were returned from the backend. Populate items using the Admin Portal or verify your Python REST API endpoint (<code className="text-rose-400">/api/Customer/GetAllItems</code>).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.ItemId}
              className="glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-800"
            >
              <div>
                {/* Food Image & Badge */}
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  <img
                    src={item.ImageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"}
                    alt={item.ItemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-slate-200 border border-slate-700/60 flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-rose-400" />
                    <span>ID: {item.ItemId}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-rose-600/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-white shadow-md">
                    {getCategoryName(item.CategoryId)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                        {item.ItemName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Category #{item.CategoryId} • Freshly prepared
                      </p>
                    </div>
                    <span className="text-xl font-extrabold text-amber-400">
                      ₹{typeof item.Price === 'number' ? item.Price.toFixed(2) : parseFloat(item.Price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectOrder(item)}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/20 transition-all group-hover:shadow-rose-600/40"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
