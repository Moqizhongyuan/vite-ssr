import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { fetchData } from "./entry-server";
import ErrorBoundary from "./ErrorBoundary";
import { onError } from "./utils";

const rootDOM = document.getElementById("root");

// @ts-ignore
const data = window.__SSR_DATA__ ?? fetchData();

if (rootDOM) {
  hydrateRoot(
    rootDOM,
    <React.StrictMode>
      <ErrorBoundary>
        <App data={data} />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  throw new Error("hydrate error");
}

onError();

throw new Error("handle error");
