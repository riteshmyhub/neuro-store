import { authService } from "./auth.service";
import { useAppSelector } from "../store";
import { useDispatch } from "state-box";

export default function Login() {
   const { login } = useAppSelector((state) => state.auth);
   const dispatch = useDispatch();
   const onLogin = () => {
      dispatch(authService.login.api({ email: "john@mail.com", password: "changeme" }));
   };
   return (
      <div>
         <p>{JSON.stringify(login.data)}</p>
         <button //
            onClick={onLogin}
            disabled={login.isLoading}>
            {login.isLoading ? "isLoading..." : "login"}
         </button>
         <p>{JSON.stringify(login.error)}</p>
      </div>
   );
}
