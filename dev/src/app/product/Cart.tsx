import { useDispatch } from "neuro-store";
import { useAppSelector } from "../store";

export default function Cart() {
   const { cart } = useAppSelector((state) => state.product);
   const dispatch = useDispatch();

   return (
      <div>
         <p>Count: {cart.quantity}</p>
         <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
         <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
      </div>
   );
}
