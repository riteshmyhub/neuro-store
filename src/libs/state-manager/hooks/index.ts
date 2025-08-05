import { useContext } from "react";
import { StoreContext } from "../providers";

/* --- [useDispatch hook] --- */
const useDispatch = () => {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useDispatch must be used within a StoreProvider");
   }
   return context.dispatch;
};

/* --- [useSelector hook] --- */
function useSelector<State, Selected>(selector: (state: State) => Selected): Selected {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useSelector must be used within a StoreProvider");
   }
   return selector(context.state as State);
}

export { useDispatch, useSelector };
