import { createRoot } from "react-dom/client";
import App from "./app/App";
import { StoreProvider } from "state-box";
import store from "./app/store";

createRoot(document.getElementById("root")!).render(
   <StoreProvider store={store}>
      <App />
   </StoreProvider>
);
