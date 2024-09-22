import React from "react";
import ReactDOM from "react-dom/client";
import Options from "./Options.tsx";
import "@/assets/normalize.css";
import "@/assets/global.css";
import FontSwitcher from "@/components/FontSwitcher.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Options />
    <ThemeSwitcher />
    <FontSwitcher />
  </React.StrictMode>
);
