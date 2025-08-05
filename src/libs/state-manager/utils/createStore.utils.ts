function createStore<R, M>(store: { reducers: R; middlewares: M }) {
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

export { createStore };
