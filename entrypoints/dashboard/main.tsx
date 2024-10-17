import React from "react";
import ReactDOM from "react-dom/client";
import "@/assets/normalize.css";
import "@/assets/global.css";
import Dashboard from "./Dashboard.tsx";
import FontSwitcher from "@/components/FontSwitcher.tsx";
import ThemeSwitcher from "@/components/ThemeSwitcher.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Dashboard />
    <ThemeSwitcher />
    <FontSwitcher />
  </React.StrictMode>
);
