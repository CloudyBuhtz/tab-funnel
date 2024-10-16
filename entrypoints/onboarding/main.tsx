import React from "react";
import ReactDOM from "react-dom/client";
import ReactMarkdown from "react-markdown";
import "@/assets/normalize.css";
import "@/assets/global.css";
import "@/assets/markdown.css";
import FontSwitcher from "@/components/FontSwitcher.tsx";
import onboarding from "./onboarding.md";
import rehypeRaw from "rehype-raw";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main>
      <ReactMarkdown skipHtml={true} rehypePlugins={[rehypeRaw]}>{onboarding}</ReactMarkdown>
    </main>
    <ThemeSwitcher />
    <FontSwitcher />
  </React.StrictMode >
);
