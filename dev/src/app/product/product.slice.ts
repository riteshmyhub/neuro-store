import { asyncThunk, createSlice, type ActionType } from "neuro-store";

const initialState = {
   fetchProducts: {
      data: [] as any[],
      isLoading: true,
   },
   cart: {
      quantity: 0,
   },
};

//sync reducer
const cartReducer = (state: typeof initialState, action: any) => {
   if (action.type === "increment") {
      state.cart.quantity += 1;
   }
   if (action.type === "decrement") {
      state.cart.quantity -= 1;
   }
};

//async reducer
const fetchProductsApi = {
   api: asyncThunk("fetchProducts", async (_) => {
      const res = await fetch("https://api.escuelajs.co/api/v1/products");
      if (!res.ok) {
         throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return await res.json();
   }),
   reducer(state: typeof initialState, action: ActionType<any>) {
      if (action.type === fetchProductsApi.api.pending) {
         state.fetchProducts.isLoading = true;
      }
      if (action.type === fetchProductsApi.api.fulfilled) {
         state.fetchProducts.isLoading = false;
         state.fetchProducts.data = action.payload;
      }
      if (action.type === fetchProductsApi.api.rejected) {
         state.fetchProducts.isLoading = false;
         state.fetchProducts.data = [];
      }
   },
};

const productSlice = createSlice({
   name: "product",
   initialState: initialState,
   reducer: (...params) => {
      cartReducer(...params);
      fetchProductsApi.reducer(...params);
   },
});

export { fetchProductsApi };
export default productSlice;
