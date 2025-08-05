import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react";

/* --- Root reducer --- */
export function createStore<R, M>(store: { reducers: R; middlewares: M }) {
   function rootReducer<State>(reducers: any) {
      return (state: any, action: any) => {
         const nextState = {} as any;
         for (const key in reducers) {
            nextState[key] = reducers[key](state[key], action);
         }
         return nextState as State;
      };
   }
   // Extract initial state from each reducer slice
   const initialState = {} as any;
   for (const key in store.reducers) {
      initialState[key] = (store.reducers as any)[key].initialState;
   }
   return {
      initialState,
      reducers: rootReducer(store.reducers),
      middlewares: store.middlewares,
   };
}

/* --- [StoreContext] --- */
type StoreContextType = { state: ReturnType<typeof createStore>; dispatch: Dispatch<any> };
const StoreContext = createContext<StoreContextType>(undefined as any);

/* --- [StoreProvider] --- */
export const StoreProvider = ({ children, store }: { children: ReactNode; store: ReturnType<typeof createStore> }) => {
   const [state, baseDispatch] = useReducer(store.reducers, store.initialState);
   const dispatch = [thunkMiddleware, ...(store.middlewares as any)].reduceRight(
      (next, mw) =>
         mw({ dispatch: next,
            getState: () => state,
         })(next),
      baseDispatch
   );
   // @ts-ignore
   return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

/* --- [useDispatch hook] --- */
export const useDispatch = () => {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useDispatch must be used within a StoreProvider");
   }
   return context.dispatch;
};

/* --- [useSelector hook] --- */
export function useSelector<State, Selected>(selector: (state: State) => Selected): Selected {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useSelector must be used within a StoreProvider");
   }
   return selector(context.state as State);
}

/* ---  [async Thunk] --- */
function asyncThunk<T>(type: string, asyncFn: (arg: T, thunkAPI: { dispatch: any }) => Promise<any>) {
   const thunk = (arg: T) => async (dispatch: any) => {
      try {
         dispatch({ type: `${type}/pending` });
         const data = await asyncFn(arg, { dispatch });
         dispatch({ type: `${type}/fulfilled`, payload: data });
         return data;
      } catch (error) {
         dispatch({ type: `${type}/rejected`, error });
         throw error;
      }
   };
   return Object.assign(thunk, {
      pending: `${type}/pending`,
      fulfilled: `${type}/fulfilled`,
      rejected: `${type}/rejected`,
   });
}

export { asyncThunk };

/* ---  [Middlewares] --- */
const thunkMiddleware =
   ({ dispatch, getState }: any) =>
   (next: any) =>
   (action: any) => {
      if (typeof action === "function") {
         return action(dispatch, getState);
      }
      return next(action);
   };
