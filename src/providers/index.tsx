import { useReducer, type Dispatch, type ReactNode } from "react";
import type { createStore } from "../utils/index";
import { createContext } from "react";

/* --- [StoreContext] --- */
type StoreContextType = { state: ReturnType<typeof createStore>; dispatch: Dispatch<any> & { withPromise: (action: any) => Promise<any> } };
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

   const coreDispatch = [thunkMiddleware, ...(store.middlewares as any)].reduceRight(
      (next, mw) =>
         mw({
            dispatch: next,
            getState: () => state,
         })(next),
      baseDispatch
   );

   // Add unwrap functionality
   const dispatchWithPromise = Object.assign(coreDispatch, {
      withPromise: (action: any) => {
         try {
            const result = coreDispatch(action);
            if (result instanceof Promise) {
               return result;
            }
            return Promise.resolve(result);
         } catch (err) {
            return Promise.reject(err);
         }
      },
   });

   return (
      // @ts-ignore
      <StoreContext.Provider value={{ state, dispatch: dispatchWithPromise }}>{children}</StoreContext.Provider>
   );
};
