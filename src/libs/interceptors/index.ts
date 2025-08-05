import axios from "axios";
import TokenInterceptor from "./token.interceptor";
import LoadingInterceptor from "./loading.interceptor";
import InterceptorBuilder from "interceptor-builder";

export default class HttpClient {
   private instance = axios.create({
      baseURL: "https://api.escuelajs.co/api/v1",
      headers: {},
      // withCredentials: true,
   });

   get admin() {
      return new InterceptorBuilder(this.instance) //
         .use(LoadingInterceptor)
         .use(TokenInterceptor)
         .build();
   }

   get http() {
      return new InterceptorBuilder(this.instance) //
         .use(LoadingInterceptor)
         .build();
   }
}
