import HttpClient from "@/libs/interceptors";
import { asyncThunk } from "@/libs/state-manager";
import { produce } from "immer";

const initialState = {
   login: {
      isLoading: false,
      data: null,
      error: null,
   },
};

class AuthService extends HttpClient {
   login = {
      api: asyncThunk("login", async (credentials: { email: string; password: string }) => {
         const { data } = await authService.http.post("/auth/login", credentials);
         return data;
      }),
      reducer(state: typeof initialState, action: any) {
         if (action.type === this.api.pending) {
            state.login.error = null;
            state.login.isLoading = true;
         }
         if (action.type === this.api.fulfilled) {
            state.login.isLoading = false;
            state.login.data = action.payload;
            state.login.error = null;
         }
         if (action.type === this.api.rejected) {
            state.login.isLoading = false;
            state.login.error = action.error;
            state.login.data = null;
         }
      },
   };

   slice = {
      initialState: initialState,
      reducer: Object.assign(
         produce((state: typeof initialState, action: any) => {
            this.login.reducer(state, action);
         }),
         { initialState }
      ),
   };
}

export const authService = new AuthService();
export const authSlice = authService.slice;
