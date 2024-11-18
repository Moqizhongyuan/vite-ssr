import path from "path";
import { Plugin } from "vite";
import fs from "fs-extra";

export default function trackerPlugin(): Plugin {
  // // 目标文件夹路径
  const uploadsDir = path.resolve(process.cwd(), "./src/ssr-server/uploads");
  return {
    name: "index-html-plugin",
    generateBundle(_, bundle) {
      // 遍历所有生成的文件
      for (const fileName in bundle) {
        const file = bundle[fileName];

        // 检查文件类型和文件扩展名
        if (file.type === "asset" && fileName.endsWith(".map")) {
          const sourceMapContent = file.source.toString();

          // 确保 uploads 文件夹存在
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
          }

          // // 将 .map 文件内容写入 uploads/assets 文件夹
          const destination = path.join(
            uploadsDir,
            fileName.split("/").pop() ?? ""
          );
          fs.writeFileSync(destination, sourceMapContent);

          // // 删除原始的 .map 文件
          delete bundle[fileName]; // 从打包结果中删除原文件
          break;
        }
      }
    },
  };
}
