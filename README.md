# neuro-store

`neuro-store` is a lightweight, Redux-inspired state management library for React applications. It provides a simple and intuitive API for creating and managing application state, with built-in support for asynchronous actions and middleware.

## Installation

```bash
npm install neuro-store
```

## Core Concepts

`neuro-store` is built around three core concepts:

-  **Slice:** A modular way to organize your state and reducers.
-  **Store:** The single source of truth for your application's state.
-  **Actions:** Plain JavaScript objects that describe state changes.

## Usage

### 1. Create a Reducer sync & async

A slice is a collection of a reducer function, a name, and an initial state value.

```typescript
// product/product.slice.ts
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
```

### 2. Create a Store

The store brings together your slices and middleware.

```typescript
// app/store.ts
import { createStore, useSelector } from "neuro-store";
import productSlice from "./product/product.slice";

const reducers = {
   product: productSlice.reducer,
};

type Reducers = typeof reducers;
type State = {
   [K in keyof Reducers]: ReturnType<Reducers[K]>;
};
type Middleware = [];

const store = createStore<State, Reducers, Middleware>({
   reducers: reducers,
   middlewares: [],
});

const useAppSelector = <Selected>(selector: (state: typeof store.initialState) => Selected): Selected => {
   return useSelector<typeof store.initialState, Selected>(selector);
};

export { useAppSelector };
export default store;
```

### 3. Provide the Store

Wrap your application with the `StoreProvider` to make the store available to your components.

```typescript
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { StoreProvider } from "neuro-store";
import store from "./app/store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <StoreProvider store={store}>
      <App />
   </StoreProvider>
);
```

### 4. Use in Components

Use the `useSelector` and `useDispatch` hooks to interact with the store in your components.

```typescript
// product/Product.tsx
import { useEffect } from "react";
import { useDispatch } from "neuro-store";
import { useAppSelector } from "../store";
import { fetchProductsApi } from "./product.slice";

export default function Product() {
   const { fetchProducts } = useAppSelector((state) => state.product);
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(fetchProductsApi.api(null));
   }, []);

   if (fetchProducts.isLoading) {
      return "isLoading...";
   }
   console.log(fetchProducts.data);

   return (
      <div>
         {fetchProducts?.data?.map((product, idx) => (
            <div key={idx}>{product?.title}</div>
         ))}
      </div>
   );
}
```

```typescript
// product/Cart.tsx
function Cart() {
   const { cart } = useAppSelector((state) => state.product);
   const dispatch = useDispatch();

   return (
      <div>
         <p>Count: {cart.quantity}</p>
         <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
         <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
      </div>
   );
}
```

## API Reference

### `createStore(config)`

Creates a new store.

-  `config.reducers`: An object of slice reducers.
-  `config.middlewares`: An array of middleware functions.

### `createSlice(config)`

Creates a new slice.

-  `config.name`: The name of the slice.
-  `config.initialState`: The initial state of the slice.
-  `config.reducer`: The reducer function for the slice.

### `useSelector(selector)`

A React hook that allows you to extract data from the store state.

-  `selector`: A function that takes the store state and returns the desired data.

### `useDispatch()`

A React hook that returns the store's `dispatch` function.

### `asyncThunk(type, payloadCreator)`

A utility for creating asynchronous thunks.

-  `type`: A string that will be used to generate action types.
-  `payloadCreator`: A function that returns a promise.

## License

ISC
