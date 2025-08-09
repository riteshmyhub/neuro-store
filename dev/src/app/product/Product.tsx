import { useEffect } from "react";
import { useDispatch } from "neuro-store";
import { useAppSelector } from "../store";
import { fetchProductsApi } from "./product.slice";

export default function Product() {
   const { fetchProducts } = useAppSelector((state) => state.product);
   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(fetchProductsApi.api(null));
   }, []);

   if (fetchProducts.isLoading) {
      return "isLoading...";
   }
   console.log(fetchProducts.data);

   return (
      <div>
         {fetchProducts?.data?.map((product, idx) => (
            <div key={idx}>{product?.title}</div>
         ))}
      </div>
   );
}
