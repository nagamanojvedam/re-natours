import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { NatoursProvider } from "./context/ToursContext.jsx";

createRoot(document.getElementById("root")).render(
  <NatoursProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </NatoursProvider>
);
