import type { AxiosInstance } from "axios";
import type { Interceptor, Req, Res } from "interceptor-builder";

export default class TokenInterceptor implements Interceptor {
   public instance;
   constructor(instance: AxiosInstance) {
      this.instance = instance;
   }

   private getToken = async () => {
      const token = {
         accessToken: (localStorage.getItem("accessToken") as string) || "",
         refreshToken: (localStorage.getItem("refreshToken") as string) || "",
      };
      return token;
   };

   intercept(request: Req, response: Res) {
      request.use(
         async (config) => {
            const token = await this.getToken();
            if (token) config.headers.Authorization = `bearer ${token.accessToken}`;
            return config;
         },
         (error) => Promise.reject(error)
      );

      response.use(
         (res) => res,
         (error) => Promise.reject(error)
      );
      return this.instance;
   }
}
