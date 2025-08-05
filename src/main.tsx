import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { StoreProvider } from "./libs/state-manager";
import store from "./app/store.ts";

createRoot(document.getElementById("root")!).render(
   <StoreProvider store={store}>
      <App />
   </StoreProvider>
);
