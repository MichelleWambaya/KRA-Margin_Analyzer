import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root";
import { initTheme } from "./utils/initTheme";
import "./index.css";

initTheme();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

