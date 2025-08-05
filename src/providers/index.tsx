import { useReducer, type Dispatch, type ReactNode } from "react";
import type { createStore } from "../utils/index";
import { createContext } from "react";

/* --- [StoreContext] --- */
type StoreContextType = { state: ReturnType<typeof createStore>; dispatch: Dispatch<any> };
export const StoreContext = createContext<StoreContextType>(undefined as any);

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

/* ---  [StoreProvider] --- */
export const StoreProvider = ({ children, store }: { children: ReactNode; store: ReturnType<typeof createStore> }) => {
   const [state, baseDispatch] = useReducer(store.reducers, store.initialState);

   const dispatch = [thunkMiddleware, ...(store.middlewares as any)] // apply middlewares
      .reduceRight(
         (next, mw) =>
            mw({
               dispatch: next,
               getState: () => state,
            })(next),
         baseDispatch
      );
   return (
      // @ts-ignore
      <StoreContext.Provider value={{ state, dispatch }}>
         {children}
      </StoreContext.Provider>
   );
};
