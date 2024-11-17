import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { fetchData } from "./entry-server";

const rootDOM = document.getElementById("root");

// @ts-ignore
const data = window.__SSR_DATA__ ?? fetchData();

if (rootDOM) {
  hydrateRoot(
    rootDOM,
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
} else {
  throw new Error("hydrate error");
}
