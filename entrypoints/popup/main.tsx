import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup.tsx";
import "@/assets/normalize.css";
import "@/assets/global.css";
import FontSwitcher from "@/components/FontSwitcher.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
    <ThemeSwitcher />
    <FontSwitcher />
  </React.StrictMode>
);
