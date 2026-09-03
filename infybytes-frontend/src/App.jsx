import React, { useState } from 'react';
import Header from './components/Header';
import CustomerMenu from './components/CustomerMenu';
import PlaceOrderModal from './components/PlaceOrderModal';
import OrderTracker from './components/OrderTracker';
import AdminPortal from './components/AdminPortal';
import { ShoppingBag } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'order', 'track', 'admin'
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [trackOrderId, setTrackOrderId] = useState('');

  const handleOpenOrderModal = (foodItem = null) => {
    setSelectedFoodItem(foodItem);
    setShowOrderModal(true);
  };

  const handleSuccessOrder = (generatedOrderId) => {
    setTrackOrderId(generatedOrderId.toString());
    setActiveTab('track');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'menu' && (
          <CustomerMenu onSelectOrder={handleOpenOrderModal} />
        )}

        {activeTab === 'order' && (
          <div className="max-w-2xl mx-auto py-6">
            <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-slate-800">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto text-rose-400 border border-rose-500/20">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Ready to Order Food?</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Place an order by selecting customer ID, item ID, quantity, delivery address, and order date.
              </p>
              <button
                onClick={() => handleOpenOrderModal(null)}
                className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition-all text-sm inline-flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Open Order Form</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <OrderTracker initialOrderId={trackOrderId} />
        )}

        {activeTab === 'admin' && (
          <AdminPortal />
        )}

      </main>

      {/* Place Order Modal */}
      {showOrderModal && (
        <PlaceOrderModal
          preSelectedItem={selectedFoodItem}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedFoodItem(null);
          }}
          onSuccessOrder={handleSuccessOrder}
        />
      )}

      {/* Global Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">InfyBytes</span>
            <span>— Doorstep Online Food Delivery Application</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              Python Backend REST API Integration
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
