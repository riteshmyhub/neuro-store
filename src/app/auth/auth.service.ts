import HttpClient from "@/libs/interceptors";
import { asyncThunk, createSlice } from "@/libs/state-manager/utils";

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

   slice = createSlice({
      name: "AuthService",
      initialState: initialState,
      reducer: (...params) => {
         this.login.reducer(...params);
      },
   });
}

export const authService = new AuthService();
export const authSlice = authService.slice;
