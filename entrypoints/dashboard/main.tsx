import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard.tsx";
import "@/assets/normalize.css";
import "@/assets/global.css";
import FontSwitcher from "@/components/FontSwitcher.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Dashboard />
    <ThemeSwitcher />
    <FontSwitcher />
  </React.StrictMode>
);
