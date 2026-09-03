// InfyBytes API Service Layer
// Connects directly to Python backend REST API endpoints

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Generic Fetch Helper
const handleFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      const errText = await res.text();
      let parsedErr = errText;
      try {
        const jsonErr = JSON.parse(errText);
        parsedErr = jsonErr.message || jsonErr.detail || errText;
      } catch (e) {
        // use raw text
      }
      return { success: false, error: parsedErr || `HTTP Error ${res.status}` };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    console.error(`API Error (${url}):`, err);
    return { success: false, error: err.message || "Failed to connect to backend server." };
  }
};

export const apiService = {
  // -------------------------------------------------------------
  // CUSTOMER CONTROLLER API METHODS (/api/Customer)
  // -------------------------------------------------------------

  // 1. GetAllItems
  getAllItems: async () => {
    const res = await handleFetch(`${BASE_URL}/api/Customer/GetAllItems`);
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  // 2. GetItemsByCategoryName
  getItemsByCategoryName: async (categoryName) => {
    if (!categoryName || categoryName === 'All') {
      return apiService.getAllItems();
    }
    const res = await handleFetch(`${BASE_URL}/api/Customer/GetAllItemsByCategoryNames?categoryName=${encodeURIComponent(categoryName)}`);
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  // 3. GetItemPrice
  getItemPrice: async (itemId) => {
    if (!itemId) return 0;
    const res = await handleFetch(`${BASE_URL}/api/Customer/GetItemPrice?itemId=${encodeURIComponent(itemId)}`);
    if (res.success) {
      return typeof res.data === 'number' ? res.data : (res.data.price || res.data.Price || 0);
    }
    return 0;
  },

  // 4. PlaceOrder
  placeOrder: async (orderPayload) => {
    // orderPayload: { customerId, itemId, quantity, deliveryAddress, orderDate }
    const res = await handleFetch(`${BASE_URL}/api/Customer/PlaceOrder`, {
      method: 'POST',
      body: JSON.stringify({
        customer_id: parseInt(orderPayload.customerId),
        item_id: orderPayload.itemId,
        quantity: parseInt(orderPayload.quantity),
        delivery_address: orderPayload.deliveryAddress,
        order_date: orderPayload.orderDate
      })
    });

    if (res.success) {
      return {
        success: true,
        orderId: res.data.orderId || res.data.OrderId,
        totalPrice: res.data.totalPrice || res.data.TotalPrice,
        message: res.data.message || res.data.Message || `Order placed successfully!`
      };
    }
    return { success: false, message: res.error || "Failed to place order." };
  },

  // -------------------------------------------------------------
  // ADMIN CONTROLLER API METHODS (/api/Admin)
  // -------------------------------------------------------------

  // 1. AddItem
  addItem: async (itemPayload) => {
    // itemPayload: { itemId, itemName, categoryId, price }
    const res = await handleFetch(`${BASE_URL}/api/Admin/AddItem`, {
      method: 'POST',
      body: JSON.stringify({
        item_id: itemPayload.itemId.toUpperCase(),
        item_name: itemPayload.itemName,
        category_id: parseInt(itemPayload.categoryId),
        price: parseFloat(itemPayload.price)
      })
    });

    if (res.success) {
      return {
        success: true,
        message: typeof res.data === 'string' ? res.data : (res.data.message || "Item added successfully!")
      };
    }
    return { success: false, message: res.error || "Failed to add item." };
  },

  // 2. UpdatePrice
  updatePrice: async (itemId, price) => {
    const res = await handleFetch(`${BASE_URL}/api/Admin/UpdatePrice`, {
      method: 'PUT',
      body: JSON.stringify({
        item_id: itemId,
        price: parseFloat(price)
      })
    });

    if (res.success) {
      return {
        success: true,
        message: typeof res.data === 'string' ? res.data : (res.data.message || "Price Updated successfully!")
      };
    }
    return { success: false, message: res.error || "Failed to update price." };
  },

  // 3. GetAllCategoryOrderDetails
  getAllCategoryOrderDetails: async (categoryId) => {
    const res = await handleFetch(`${BASE_URL}/api/Admin/GetAllCategoryOrderDetails?categoryId=${categoryId}`);
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  // -------------------------------------------------------------
  // COMMON CONTROLLER API METHODS (/api/Common)
  // -------------------------------------------------------------

  // 1. CheckDeliveryStatus
  checkDeliveryStatus: async (orderId) => {
    const res = await handleFetch(`${BASE_URL}/api/Common/CheckDeliveryStatus?orderId=${orderId}`);
    if (res.success) {
      if (typeof res.data === 'object') return res.data;
      return { message: res.data };
    }
    return { status: -1, message: res.error || "Order ID does not exist!" };
  },

  // 2. DeleteOrderDetails
  deleteOrderDetails: async (orderId) => {
    const res = await handleFetch(`${BASE_URL}/api/Common/DeleteOrderDetails?orderId=${orderId}`, {
      method: 'DELETE'
    });
    if (res.success) {
      return {
        success: true,
        message: typeof res.data === 'string' ? res.data : (res.data.message || "Order Cancelled!")
      };
    }
    return { success: false, message: res.error || "Failed to cancel order." };
  },

  // 3. GetAllOrderDetails (by OrderId)
  getOrderDetailsById: async (orderId) => {
    const res = await handleFetch(`${BASE_URL}/api/Common/GetAllOrderDetails?orderId=${orderId}`);
    if (res.success) {
      if (Array.isArray(res.data)) return res.data;
      if (res.data) return [res.data];
    }
    return [];
  },

  // 4. Fetch Categories list from backend or default categories
  getCategories: async () => {
    const res = await handleFetch(`${BASE_URL}/api/Common/GetCategories`);
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    // Fallback standard categories based on DB Spec if API endpoint is not implemented
    return [
      { CategoryId: 1, CategoryName: "Pizza" },
      { CategoryId: 2, CategoryName: "Burger" }
    ];
  }
};
