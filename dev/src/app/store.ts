import { createStore, useSelector, type MiddlewareType } from "neuro-store";
import productSlice from "./product/product.slice";
import middleware from "./middlewares";

const reducers = {
   product: productSlice.reducer,
};

type Reducers = typeof reducers;
type State = { [K in keyof Reducers]: ReturnType<Reducers[K]> };

const store = createStore<State, Reducers, MiddlewareType[]>({
   reducers: reducers,
   middlewares: [middleware],
});

const useAppSelector = <T>(selector: (state: State) => T) => useSelector(selector);

export { useAppSelector };
export default store;
