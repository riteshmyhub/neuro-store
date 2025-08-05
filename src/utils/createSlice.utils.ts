import { produce } from "immer";

type ReducerFn<S> = (state: S, action: any) => void;

interface CreateSliceParams<S> {
   name: string;
   initialState: S;
   reducer: ReducerFn<S>; // single reducer function
}

export function createSlice<S>({ name, initialState, reducer }: CreateSliceParams<S>) {
   const immerReducer = Object.assign(
      produce(reducer), // wrap your reducer with immer
      { initialState }
   );

   return {
      name,
      initialState,
      reducer: immerReducer,
   };
}
