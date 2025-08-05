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
