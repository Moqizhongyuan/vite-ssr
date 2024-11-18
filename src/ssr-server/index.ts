import fs from "fs-extra";
import express, { RequestHandler, Express } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { ViteDevServer } from "vite";
import path from "path";
import serve from "serve-static";
import { Performance, PerformanceObserver } from "perf_hooks";

const perObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log("[performance]", entry.name, entry.duration.toFixed(2), "ms");
    performance.clearMarks();
  });
});

perObserver.observe({ entryTypes: ["measure"] });

function createMemoryFsRead() {
  const fileContentMap = new Map();
  return async (filePath: string) => {
    const cacheResult = fileContentMap.get(filePath);
    if (cacheResult) {
      return cacheResult;
    }
    const fileContent = await fs.readFile(filePath, "utf-8");
    fileContentMap.set(filePath, fileContent);
    return fileContent;
  };
}

const memoryFsRead = createMemoryFsRead();

const isProd = process.env.NODE_ENV === "production";
const cwd = process.cwd();

function resolveTemplatePath() {
  return isProd
    ? path.join(cwd, "dist/client/index.html")
    : path.join(cwd, "index.html");
}

function matchPageUrl(url: string) {
  if (url === "/") {
    return true;
  }
  return false;
}

async function loadSsrEntryModule(vite: ViteDevServer | null) {
  // 生产模式下直接 require 打包后的产物
  if (isProd) {
    const entryPath = path.join(cwd, "dist/server/entry-server.js");
    return await import(entryPath);
  }
  // 开发环境下通过 no-bundle 方式加载
  else {
    const entryPath = path.join(cwd, "src/entry-server.tsx");
    return vite!.ssrLoadModule(entryPath);
  }
}

async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
  let vite: ViteDevServer | null = null;
  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root: process.cwd(),
      appType: "custom",
      server: {
        middlewareMode: true,
      },
    });
    // 注册 Vite Middlewares
    // 主要用来处理客户端资源
    app.use(vite.middlewares);
  }
  return async (req, res, next) => {
    // SSR 的逻辑
    // 1. 加载服务端入口模块
    // 2. 数据预取
    // 3. 「核心」渲染组件
    // 4. 拼接 HTML，返回响应
    try {
      const url = req.originalUrl;
      if (!matchPageUrl(url)) {
        return await next();
      }
      const { ServerEntry, fetchData } = await loadSsrEntryModule(vite);
      const data = await fetchData();
      performance.mark("render-start");
      const appHtml = renderToString(
        React.createElement(ServerEntry, { data })
      );
      performance.mark("render-end");
      performance.measure("renderToString", "render-start", "render-end");
      const templatePath = resolveTemplatePath();
      let template = await memoryFsRead(templatePath);
      // 开发模式下需要注入 HMR、环境变量相关的代码，因此需要调用 vite.transformIndexHtml
      if (!isProd && vite) {
        template = await vite.transformIndexHtml(url, template);
      }
      const html = template
        .replace("<!-- SSR_APP -->", appHtml)
        // 注入数据标签，用于客户端 hydrate
        .replace(
          "<!-- SSR_DATA -->",
          `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`
        );
      res.status(200).setHeader("Content-Type", "text/html").end(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  };
}

async function createServer() {
  const app = express();
  // 加入 Vite SSR 中间件
  app.use(await createSsrMiddleware(app));
  if (isProd) {
    app.use(serve(path.join(cwd, "dist/client")));
  }

  app.listen(3000, () => {
    console.log("Node 服务器已启动~");
    console.log("http://localhost:3000");
  });
}

createServer();
