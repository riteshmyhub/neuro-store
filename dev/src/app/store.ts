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
