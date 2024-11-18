import trackerPlugin from "./trackerPlugin";
import { Plugin } from "vite";

export function createPlugins(): Plugin[] {
  return [trackerPlugin()];
}
