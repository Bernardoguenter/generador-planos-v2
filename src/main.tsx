import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ValuesProvider } from "./context/valuesContext/useValuesContext.tsx";
import { DrawProvider } from "./context/drawContext/useDrawContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ValuesProvider>
      <DrawProvider>
        <App />
      </DrawProvider>
    </ValuesProvider>
  </StrictMode>
);
