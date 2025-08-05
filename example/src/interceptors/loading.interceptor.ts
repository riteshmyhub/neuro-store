import type { AxiosInstance } from "axios";
import type { Interceptor, Req, Res } from "interceptor-builder";

export default class LoadingInterceptor implements Interceptor {
   public instance;

   constructor(instance: AxiosInstance) {
      this.instance = instance;
   }

   private setLoading(loading: boolean) {
      const event = new CustomEvent("loading", { detail: loading });
      window.dispatchEvent(event);
   }

   intercept(request: Req, response: Res) {
      request.use(
         (config) => {
            this.setLoading(true);
            return config;
         },
         (error) => {
            this.setLoading(false);
            return Promise.reject(error);
         }
      );

      response.use(
         (res) => {
            this.setLoading(false);
            return res;
         },
         (error) => {
            this.setLoading(false);
            return Promise.reject(error);
         }
      );

      return this.instance;
   }
}
