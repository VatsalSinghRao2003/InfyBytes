import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import { Search, Truck, Trash2, CheckCircle2, Clock, AlertCircle, FileText, MapPin, Calendar, User, Package, RefreshCw } from 'lucide-react';

export default function OrderTracker({ initialOrderId = '' }) {
  const [searchOrderId, setSearchOrderId] = useState(initialOrderId);
  const [orderDetails, setOrderDetails] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchOrderId || searchOrderId.trim() === '') return;

    setLoading(true);
    setActionMsg(null);
    setDeliveryStatus(null);

    // Call API endpoints CheckDeliveryStatus & GetOrderDetails
    const statusRes = await apiService.checkDeliveryStatus(searchOrderId);
    setDeliveryStatus(statusRes);

    const details = await apiService.getOrderDetailsById(searchOrderId);
    if (details && details.length > 0) {
      setOrderDetails(details[0]);
    } else {
      setOrderDetails(null);
    }

    setLoading(false);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm(`Are you sure you want to cancel Order #${orderId}?`)) return;

    setLoading(true);
    const res = await apiService.deleteOrderDetails(orderId);
    setLoading(false);

    if (res.success) {
      setActionMsg({ type: 'success', text: res.message || "Order Cancelled!" });
      setOrderDetails(null);
      setDeliveryStatus(null);
    } else {
      setActionMsg({ type: 'error', text: res.message || "Failed to cancel order." });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Title & Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/40 relative overflow-hidden">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order Tracking & Management</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Check delivery status, view order details, or cancel an order using Order ID.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="number"
              placeholder="Enter Order ID..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/80 text-white rounded-2xl border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track Order</span>
          </button>
        </form>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div className={`p-4 rounded-2xl border text-sm font-bold flex items-center space-x-3 ${
          actionMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* Results Display */}
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Fetching order details from backend service...</p>
        </div>
      ) : orderDetails ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6">
          
          {/* Header & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Order Reference</span>
              <h2 className="text-2xl font-black text-white flex items-center space-x-2">
                <span>Order #{orderDetails.OrderId || orderDetails.orderId}</span>
              </h2>
            </div>

            {/* Delivery Status Badge */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-400">Delivery Status:</span>
              {(orderDetails.DeliveryStatus === 'Delivered' || orderDetails.DeliveryStatus === 'DL') ? (
                <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Delivered (DL)</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-extrabold shadow-sm">
                  <Clock className="w-4 h-4" />
                  <span>Not Delivered! (NDL)</span>
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Info */}
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <User className="w-4 h-4" />
                <span>Customer Information</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{orderDetails.CustomerName || `Customer #${orderDetails.CustomerId || orderDetails.customerId}`}</p>
                <p className="text-xs text-slate-400">Customer ID: #{orderDetails.CustomerId || orderDetails.customerId}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">{orderDetails.DeliveryAddress || orderDetails.deliveryAddress}</p>
              </div>
            </div>

            {/* Food Order Details */}
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Package className="w-4 h-4" />
                <span>Food Item Details</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{orderDetails.ItemName || orderDetails.itemId}</p>
                <p className="text-xs text-slate-400">Item ID: [{orderDetails.ItemId || orderDetails.itemId}] • Qty: {orderDetails.Quantity || orderDetails.quantity}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Order Date: {orderDetails.OrderDate || orderDetails.orderDate}</span>
                </span>
                <span className="text-lg font-black text-amber-400">₹{(orderDetails.TotalPrice || orderDetails.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Action Toolbar */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => handleDeleteOrder(orderDetails.OrderId || orderDetails.orderId)}
              className="px-5 py-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-600/30 font-bold rounded-2xl transition-all text-xs flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Cancel / Delete Order #{orderDetails.OrderId || orderDetails.orderId}</span>
            </button>
          </div>

        </div>
      ) : searchOrderId && deliveryStatus && deliveryStatus.status === -1 ? (
        <div className="glass-panel p-10 rounded-3xl text-center space-y-3 border border-slate-800">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">Order Not Found</h3>
          <p className="text-slate-400 text-sm">No order exists for Order ID #{searchOrderId} in the database.</p>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 border border-slate-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">Enter an Order ID above to track delivery status and details.</p>
        </div>
      )}

    </div>
  );
}
