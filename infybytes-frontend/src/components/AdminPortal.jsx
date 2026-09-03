import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { ShieldCheck, PlusCircle, Edit3, ListOrdered, CheckCircle2, AlertTriangle, Hash, Tag, DollarSign, Layers } from 'lucide-react';

export default function AdminPortal() {
  const [activeSubTab, setActiveSubTab] = useState('add'); // 'add', 'update', 'categoryOrders'
  
  // Data lists
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  // Add Item State
  const [addItemForm, setAddItemForm] = useState({
    itemId: '',
    itemName: '',
    categoryId: '1',
    price: ''
  });

  // Update Price State
  const [updatePriceForm, setUpdatePriceForm] = useState({
    itemId: '',
    price: ''
  });

  // Category Orders State
  const [selectedCategoryId, setSelectedCategoryId] = useState('1');
  const [categoryOrders, setCategoryOrders] = useState([]);

  // Feedback Messages
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'categoryOrders') {
      loadCategoryOrders(selectedCategoryId);
    }
  }, [activeSubTab, selectedCategoryId]);

  const loadInitialData = async () => {
    const cats = await apiService.getCategories();
    setCategories(cats || []);
    const itemList = await apiService.getAllItems();
    setItems(itemList || []);
    if (itemList && itemList.length > 0) {
      setUpdatePriceForm({ itemId: itemList[0].ItemId, price: (itemList[0].Price || 0).toString() });
    }
  };

  const loadCategoryOrders = async (catId) => {
    setLoading(true);
    const orders = await apiService.getAllCategoryOrderDetails(catId);
    setCategoryOrders(orders || []);
    setLoading(false);
  };

  // Submit Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!addItemForm.itemId || addItemForm.itemId.length !== 3) {
      setMsg({ type: 'error', text: "Item ID must be exactly 3 characters (CHAR(3))!" });
      return;
    }
    if (!addItemForm.itemName || addItemForm.itemName.length < 4 || addItemForm.itemName.length > 50) {
      setMsg({ type: 'error', text: "Item Name is mandatory and must be between 4 and 50 characters!" });
      return;
    }
    if (!addItemForm.price || parseFloat(addItemForm.price) <= 0) {
      setMsg({ type: 'error', text: "Price must be greater than zero!" });
      return;
    }

    setLoading(true);
    const res = await apiService.addItem(addItemForm);
    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: res.message || "Item added successfully!" });
      setAddItemForm({ itemId: '', itemName: '', categoryId: '1', price: '' });
      loadInitialData();
    } else {
      setMsg({ type: 'error', text: res.message || "Failed to add item." });
    }
  };

  // Submit Update Price
  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!updatePriceForm.itemId) {
      setMsg({ type: 'error', text: "Please select or enter an Item ID!" });
      return;
    }
    if (!updatePriceForm.price || parseFloat(updatePriceForm.price) <= 0) {
      setMsg({ type: 'error', text: "Price must be greater than zero!" });
      return;
    }

    setLoading(true);
    const res = await apiService.updatePrice(updatePriceForm.itemId, updatePriceForm.price);
    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: res.message || "Price Updated successfully!" });
      loadInitialData();
    } else {
      setMsg({ type: 'error', text: res.message || "Failed to update price." });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Title Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950/40">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Management Portal</h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Add food items, update item prices, and monitor category-wise customer orders.
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-800/80 pb-px">
          <button
            onClick={() => { setActiveSubTab('add'); setMsg(null); }}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeSubTab === 'add'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
          <button
            onClick={() => { setActiveSubTab('update'); setMsg(null); }}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeSubTab === 'update'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Update Item Price</span>
          </button>
          <button
            onClick={() => { setActiveSubTab('categoryOrders'); setMsg(null); }}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeSubTab === 'categoryOrders'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Category Orders</span>
          </button>
        </div>
      </div>

      {/* Response Message Toast */}
      {msg && (
        <div className={`p-4 rounded-2xl border text-sm font-bold flex items-center space-x-3 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* 1. ADD NEW FOOD ITEM FORM */}
      {activeSubTab === 'add' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-rose-500" />
            <span>Add New Food Item Details</span>
          </h2>

          <form onSubmit={handleAddItem} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Item ID */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Hash className="w-4 h-4 text-rose-400" />
                  <span>Item ID (CHAR(3) Primary Key)</span>
                </label>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="e.g. CBR, CFA, MAR, ZPS"
                  value={addItemForm.itemId}
                  onChange={(e) => setAddItemForm({ ...addItemForm, itemId: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-mono tracking-widest font-bold"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Must be exactly 3 uppercase letters</span>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Tag className="w-4 h-4 text-rose-400" />
                  <span>Item Name (4 to 50 Chars)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cheese Burger, Veg Delight"
                  value={addItemForm.itemName}
                  onChange={(e) => setAddItemForm({ ...addItemForm, itemName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm"
                />
              </div>

              {/* Category ID Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-rose-400" />
                  <span>Category</span>
                </label>
                <select
                  value={addItemForm.categoryId}
                  onChange={(e) => setAddItemForm({ ...addItemForm, categoryId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-semibold"
                >
                  {categories.map((cat) => (
                    <option key={cat.CategoryId} value={cat.CategoryId}>
                      Category #{cat.CategoryId} - {cat.CategoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <DollarSign className="w-4 h-4 text-rose-400" />
                  <span>Price (&gt; 0 Mandatory)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="e.g. 145.00"
                  value={addItemForm.price}
                  onChange={(e) => setAddItemForm({ ...addItemForm, price: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-bold text-amber-400"
                />
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition-all text-sm flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Item to Backend Database</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. UPDATE PRICE FORM */}
      {activeSubTab === 'update' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-rose-500" />
            <span>Update Existing Food Item Price</span>
          </h2>

          <form onSubmit={handleUpdatePrice} className="space-y-6 max-w-xl">
            {/* Select or Enter Item ID */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Tag className="w-4 h-4 text-rose-400" />
                <span>Item ID (CHAR(3))</span>
              </label>
              {items.length > 0 ? (
                <select
                  value={updatePriceForm.itemId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const item = items.find(i => i.ItemId === id);
                    setUpdatePriceForm({ itemId: id, price: item ? (item.Price || 0).toString() : '' });
                  }}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-semibold"
                >
                  {items.map((item) => (
                    <option key={item.ItemId} value={item.ItemId}>
                      [{item.ItemId}] {item.ItemName} — Current Price: ₹{(item.Price || 0).toFixed(2)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  maxLength={3}
                  placeholder="Enter Item ID (e.g. CBR)"
                  value={updatePriceForm.itemId}
                  onChange={(e) => setUpdatePriceForm({ ...updatePriceForm, itemId: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-mono tracking-widest font-bold"
                />
              )}
            </div>

            {/* New Price */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <DollarSign className="w-4 h-4 text-rose-400" />
                <span>New Price (&gt; 0 Mandatory)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="Enter new price"
                value={updatePriceForm.price}
                onChange={(e) => setUpdatePriceForm({ ...updatePriceForm, price: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-2xl outline-none focus:border-rose-500 text-sm font-bold text-amber-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Update Item Price</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. CATEGORY ORDER DETAILS TABLE */}
      {activeSubTab === 'categoryOrders' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <ListOrdered className="w-5 h-5 text-sky-400" />
                <span>Category Food Order Details</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Fetches all order details for a selected Category ID</p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-300">Category:</span>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="px-4 py-2 bg-slate-900 border border-slate-700 text-white text-sm font-bold rounded-xl outline-none focus:border-sky-500"
              >
                {categories.map((c) => (
                  <option key={c.CategoryId} value={c.CategoryId}>
                    ID #{c.CategoryId} - {c.CategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              <p>Loading category order details...</p>
            </div>
          ) : categoryOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No order details found for this food category in backend database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Item Name</th>
                    <th className="p-3.5">Qty</th>
                    <th className="p-3.5">Total Price</th>
                    <th className="p-3.5">Delivery Address</th>
                    <th className="p-3.5">Order Date</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {categoryOrders.map((o) => (
                    <tr key={o.OrderId || o.orderId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">#{o.OrderId || o.orderId}</td>
                      <td className="p-3.5 font-semibold text-rose-400">{o.CustomerName || o.customerName} <span className="text-[10px] text-slate-500">(#{o.CustomerId || o.customerId})</span></td>
                      <td className="p-3.5 font-semibold">{o.ItemName || o.itemName} <span className="text-[10px] text-slate-500">[{o.ItemId || o.itemId}]</span></td>
                      <td className="p-3.5 font-bold">{o.Quantity || o.quantity}</td>
                      <td className="p-3.5 font-extrabold text-amber-400">₹{(o.TotalPrice || o.totalPrice || 0).toFixed(2)}</td>
                      <td className="p-3.5 text-slate-300 max-w-xs truncate">{o.DeliveryAddress || o.deliveryAddress}</td>
                      <td className="p-3.5 font-medium">{o.OrderDate || o.orderDate}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          (o.DeliveryStatus === 'Delivered' || o.DeliveryStatus === 'DL') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {o.DeliveryStatus || o.deliveryStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
