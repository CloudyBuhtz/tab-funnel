import React from "react";
import ReactDOM from "react-dom/client";
import ReactMarkdown from "react-markdown";
import "@/assets/normalize.css";
import "@/assets/global.css";
import "@/assets/markdown.css";
import FontSwitcher from "@/components/FontSwitcher.tsx";
import versions from "./versions.md";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main>
      <ReactMarkdown skipHtml={true}>{versions}</ReactMarkdown>
    </main>
    <ThemeSwitcher />
    <FontSwitcher />
  </React.StrictMode >
);
