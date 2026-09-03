import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { ShoppingBag, X, CheckCircle2, AlertTriangle, Calculator, User, MapPin, Calendar, Hash } from 'lucide-react';

export default function PlaceOrderModal({ preSelectedItem, onClose, onSuccessOrder }) {
  const [items, setItems] = useState([]);

  // Form State
  const [customerId, setCustomerId] = useState('1001');
  const [selectedItemId, setSelectedItemId] = useState(preSelectedItem ? preSelectedItem.ItemId : '');
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

  // Dynamic Item Price
  const [unitPrice, setUnitPrice] = useState(preSelectedItem ? preSelectedItem.Price : 0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Status & Validation Error State
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(null);

  useEffect(() => {
    loadDropdowns();
  }, []);

  useEffect(() => {
    if (selectedItemId) {
      fetchPrice(selectedItemId);
    }
  }, [selectedItemId]);

  useEffect(() => {
    const qty = parseInt(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    setTotalPrice(Number((price * qty).toFixed(2)));
  }, [unitPrice, quantity]);

  const loadDropdowns = async () => {
    const itemList = await apiService.getAllItems();
    setItems(itemList || []);

    if (!selectedItemId && itemList && itemList.length > 0) {
      setSelectedItemId(itemList[0].ItemId);
    }
  };

  const fetchPrice = async (itemId) => {
    const price = await apiService.getItemPrice(itemId);
    setUnitPrice(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setResultSuccess(null);

    // Validations matching backend specification
    if (!customerId || isNaN(customerId) || parseInt(customerId) <= 0) {
      setErrorMsg("Please enter a valid numeric Customer ID!");
      return;
    }
    if (!selectedItemId) {
      setErrorMsg("Please enter or select an Item ID!");
      return;
    }
    if (!quantity || parseInt(quantity) <= 0) {
      setErrorMsg("Quantity must be greater than zero!");
      return;
    }
    if (!deliveryAddress || deliveryAddress.trim() === '') {
      setErrorMsg("Delivery Address is mandatory!");
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (orderDate < todayStr) {
      setErrorMsg("Order Date cannot be in the past! Must be current date or future date.");
      return;
    }

    setSubmitting(true);
    const response = await apiService.placeOrder({
      customerId: parseInt(customerId),
      itemId: selectedItemId,
      quantity: parseInt(quantity),
      deliveryAddress: deliveryAddress,
      orderDate: orderDate
    });
    setSubmitting(false);

    if (response.success) {
      setResultSuccess(response);
    } else {
      setErrorMsg(response.message || "Failed to place order.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-slate-700/80 p-6 md:p-8 shadow-2xl animate-scaleUp my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Place Food Order</h2>
              <p className="text-xs text-slate-400">Submit order details to backend service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Output Modal */}
        {resultSuccess ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
              <div className="p-4 glass-panel rounded-2xl border border-emerald-500/30 text-emerald-300 text-sm font-medium leading-relaxed">
                {resultSuccess.message}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left glass-panel p-4 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 block">Generated Order ID:</span>
                <span className="text-base font-bold text-white">#{resultSuccess.orderId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Amount Paid:</span>
                <span className="text-base font-bold text-amber-400">₹{typeof resultSuccess.totalPrice === 'number' ? resultSuccess.totalPrice.toFixed(2) : parseFloat(resultSuccess.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (onSuccessOrder) onSuccessOrder(resultSuccess.orderId);
                  onClose();
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition-all"
              >
                Track Order #{resultSuccess.orderId}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <User className="w-4 h-4 text-rose-400" />
                <span>Customer ID (Numeric PK)</span>
              </label>
              <input
                type="number"
                placeholder="Enter Customer ID (e.g. 1001, 1002)"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-semibold"
              />
            </div>

            {/* Item Selection & Unit Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Hash className="w-4 h-4 text-rose-400" />
                  <span>Item ID (CHAR(3))</span>
                </label>
                {items.length > 0 ? (
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-semibold"
                  >
                    {items.map((item) => (
                      <option key={item.ItemId} value={item.ItemId}>
                        [{item.ItemId}] {item.ItemName} - ₹{(item.Price || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="e.g. MAR, CBR"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-semibold"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Calculator className="w-4 h-4 text-rose-400" />
                  <span>Quantity (&gt; 0)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-bold"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Delivery Address (Mandatory)</span>
              </label>
              <textarea
                rows="2"
                placeholder="Enter delivery address (max 50 chars)"
                maxLength={50}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm"
              />
              <span className="text-[10px] text-slate-500 float-right mt-1">{deliveryAddress.length}/50 chars</span>
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>Order Date (Current or Future Date)</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-medium"
              />
            </div>

            {/* Summary Price Box */}
            <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Unit Price × Quantity</span>
                <span className="text-sm font-medium text-slate-300">
                  ₹{unitPrice.toFixed(2)} × {quantity || 0}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Price</span>
                <span className="text-2xl font-black text-amber-400">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 glass-panel hover:bg-slate-800 text-slate-300 font-semibold rounded-2xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition-all text-sm flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <span>Submitting Order...</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Confirm Order (₹{totalPrice.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
