import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { fetchData } from "./entry-server";
import axios from "axios";

const rootDOM = document.getElementById("root");

// @ts-ignore
const data = window.__SSR_DATA__ ?? fetchData();

window.onerror = function (message, source, lineno, colno) {
  axios
    .post("http://localhost:3000/sendErrorLog", {
      message,
      lineno,
      colno,
      source,
    })
    .then((data) => {
      console.log(data);
    });
};

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
