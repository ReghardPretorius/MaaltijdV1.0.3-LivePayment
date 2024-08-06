import { createSlice } from '@reduxjs/toolkit';

const items =
  localStorage.getItem("cartItems") !== null
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const totalAmount =
  localStorage.getItem("totalAmount") !== null
    ? JSON.parse(localStorage.getItem("totalAmount"))
    : 0;

const totalQuantity =
  localStorage.getItem("totalQuantity") !== null
    ? JSON.parse(localStorage.getItem("totalQuantity"))
    : 0;

const cashAmount =
localStorage.getItem("totalQuantity") !== null
  ? JSON.parse(localStorage.getItem("totalQuantity"))
  : 0;

const walletAmount =
localStorage.getItem("totalQuantity") !== null
  ? JSON.parse(localStorage.getItem("totalQuantity"))
  : 0;

const promoAmount =
localStorage.getItem("totalQuantity") !== null
  ? JSON.parse(localStorage.getItem("totalQuantity"))
  : 0;

const setItemFunc = (item, totalAmount, totalQuantity) => {
  localStorage.setItem("cartItems", JSON.stringify(item));
  localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
  localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
  localStorage.setItem("cashAmount", JSON.stringify(totalQuantity));
  localStorage.setItem("walletAmount", JSON.stringify(totalQuantity));
  localStorage.setItem("promoAmount", JSON.stringify(totalQuantity));
};

const initialState = {
  cartItems: items,
  totalQuantity: totalQuantity,
  totalAmount: totalAmount,
  cashAmount: cashAmount,
  walletAmount: walletAmount,
  promoAmount: promoAmount,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  
  reducers: {
    // =========== add item ============
    addItem(state, action) {
      const newItem = action.payload;
      const id = action.payload.id;
      const extraIngredients = action.payload.extraIngredients;
      const existingItem = state.cartItems.find((item) => item.id === id);

      
      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          title: newItem.title,
          image01: newItem.image01,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          extraIngredients: newItem.extraIngredients
        });
        state.totalQuantity++;

      } else if(existingItem && (JSON.stringify(existingItem.extraIngredients) === JSON.stringify(extraIngredients)))  {
        state.totalQuantity++;
        existingItem.quantity++;
        console.log(`existingItem.totalPrice: ${existingItem.totalPrice}`);
        console.log(`newItem.price: ${newItem.price}`);
        existingItem.totalPrice =  existingItem.totalPrice + newItem.price; 
      } else {

        const value = JSON.parse(localStorage.getItem("cartItems"));
        let index = value.findIndex(s => s.id === existingItem.id);
        //console.log(`existingItem.totalPrice: ${existingItem.totalPrice}`);
        const newValue = {
        id: existingItem.id,
        title: existingItem.title,
        image01: existingItem.image01,
        price: existingItem.price,
        quantity: 1,
        totalPrice: existingItem.totalPrice,
        extraIngredients: extraIngredients
      }
        state.cartItems.splice(index, 1, newValue); 
        state.totalQuantity = state.cartItems.reduce(
          (total, item) => total + Number(item.quantity),
          0
        );
      }
     
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      if (state.totalQuantity  < 3 && state.totalQuantity > 0){
        state.totalAmount = state.totalAmount + 20;
      };


      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },

   

    // ========= remove item ========

    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) - Number(existingItem.price);
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      if (state.totalQuantity  < 3 && state.totalQuantity > 0){
        state.totalAmount = state.totalAmount + 20;
      };

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },

    //============ delete item ===========

    deleteItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      if (state.totalQuantity  < 3 && state.totalQuantity > 0){
        state.totalAmount = state.totalAmount + 20;
      };

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },

        //============ add wallet ===========

        addWallet(state, action) {
          const id = action.payload;
          const existingItem = state.cartItems.find((item) => item.id === id);
    
          if (existingItem) {
            state.cartItems = state.cartItems.filter((item) => item.id !== id);
            state.totalQuantity = state.totalQuantity - existingItem.quantity;
          }
    
          state.totalAmount = state.cartItems.reduce(
            (total, item) => total + Number(item.price) * Number(item.quantity),
            0
          );
    
          if (state.totalQuantity  < 3 && state.totalQuantity > 0){
            state.totalAmount = state.totalAmount + 20;
          };
    
          setItemFunc(
            state.cartItems.map((item) => item),
            state.totalAmount,
            state.totalQuantity,
            state.totalQuantity,
            state.totalQuantity,
            state.totalQuantity,
          );
        },

            //============ add promo code ===========

    addPromoCode(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      if (state.totalQuantity  < 3 && state.totalQuantity > 0){
        state.totalAmount = state.totalAmount + 20;
      };

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },

    // ========== Clear cart after transaction ==========
    clearCart(state) {
        state.cartItems = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
    
        // Update localStorage (optional)
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("totalAmount", JSON.stringify(0));
        localStorage.setItem("totalQuantity", JSON.stringify(0));
        },


  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;