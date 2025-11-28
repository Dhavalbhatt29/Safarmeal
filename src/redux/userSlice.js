import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopsInMyCity: null, // renamed for consistency
    itemsInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    searchItems: null,
    socket: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(i => i.id === cartItem.id);
      const quantityToAdd = cartItem.quantity || 1;

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
      } else {
        state.cartItems.push({ ...cartItem, quantity: quantityToAdd });
      }

      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
        0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find(i => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
        0
      );
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
        0
      );
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find(o => o._id === orderId);
      if (order && Array.isArray(order.shopOrders)) {
        const shopOrder = order.shopOrders.find(so => so.shop._id === shopId);
        if (shopOrder) shopOrder.status = status;
      }
    },
    updateRealtimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find(o => o._id === orderId);
      if (order && Array.isArray(order.shopOrders)) {
        const shopOrder = order.shopOrders.find(so => so.shop._id === shopId);
        if (shopOrder) shopOrder.status = status;
      }
    },
    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    }
  }
});

export const {
  setUserData,
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setShopsInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeCartItem,
  setTotalAmount,
  clearCart,
  setMyOrders,
  addMyOrder,
  updateOrderStatus,
  updateRealtimeOrderStatus,
  setSearchItems,
  setSocket
} = userSlice.actions;

export default userSlice.reducer;
