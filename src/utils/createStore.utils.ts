/** [----createStore----]
 * @example
 * // basic middleware example
 *  const middleware = ({ dispatch, getState }: any) => (next: any) =>(action: any) => {
 *      if (typeof action === "function") {
 *            return action(dispatch, getState);
 *      }
 *     return next(action);
 *   };
 *  @example
 * // basic store
 *   const reducers = {
      auth: authSlice.reducer,
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
 *
 */

function createStore<S, R, M>(store: { reducers: R; middlewares: M }) {
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
      initialState: initialState as S,
      reducers: rootReducer(store.reducers),
      middlewares: store.middlewares,
   };
}

export { createStore };
