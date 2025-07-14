import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { NatoursProvider } from "./context/ToursContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <NatoursProvider>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        toastClassName="toast-container"
        bodyClassName="toast-body"
        progressClassName="toast-progress"
        errorClassName="toast-error"
      />
    </BrowserRouter>
  </NatoursProvider>
);
