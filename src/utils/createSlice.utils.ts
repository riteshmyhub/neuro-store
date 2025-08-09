import { produce } from "immer";

type ReducerFn<S> = (state: S, action: any) => void;

interface CreateSliceParams<S> {
   name: string;
   initialState: S;
   reducer: ReducerFn<S>;
}

export type ActionType<T> = {
   type: string;
   payload: T;
};

interface Slice<S> {
   name: string;
   initialState: S;
   reducer: (state: S, action: any) => S;
}

export function createSlice<S>({ name, initialState, reducer }: CreateSliceParams<S>): Slice<S> {
   const immerReducer = Object.assign(produce(reducer) as (state: S, action: any) => S, { initialState });

   return {
      name,
      initialState,
      reducer: immerReducer,
   };
}
