import { useSelector, createStore } from "state-box";
import { authSlice } from "./auth/auth.service";

type Reducer = { auth: typeof authSlice.reducer };
type Middleware = [];

const store = createStore<Reducer, Middleware>({
   reducers: {
      auth: authSlice.reducer,
   },
   middlewares: [],
});

export const useAppSelector = <Selected>(selector: (state: typeof store.initialState) => Selected): Selected => useSelector<typeof store.initialState, Selected>(selector);

export default store;
