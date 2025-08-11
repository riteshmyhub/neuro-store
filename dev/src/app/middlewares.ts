import type { MiddlewareType } from "neuro-store";

const middleware: MiddlewareType = (_) => (next) => (action) => {
   // _.dispatch
   // _.getState
   console.log(action);
   return next(action);
};
export default middleware;
