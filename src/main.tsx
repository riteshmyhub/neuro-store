import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import store from "./app/store.ts";
import { StoreProvider } from "./libs/state-manager/providers";

createRoot(document.getElementById("root")!).render(
   <StoreProvider store={store}>
      <App />
   </StoreProvider>
);
