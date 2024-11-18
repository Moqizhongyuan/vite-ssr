import fs from "fs";
import {
  BasicSourceMapConsumer,
  IndexedSourceMapConsumer,
  RawIndexMap,
  RawSourceMap,
  SourceMapConsumer,
} from "source-map";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // 当前文件的完整路径
const __dirname = dirname(__filename); // 当前文件的目录路径

interface ISourceMap {
  [key: string]: string | RawSourceMap | RawIndexMap;
}

// 读取压缩代码和对应的source map
const arr = fs.readdirSync(path.resolve(__dirname, "../uploads"));
const sourceMap: ISourceMap = {};
for (let i = 0; i < arr.length; i++) {
  fs.readFile(
    path.resolve(__dirname, "../uploads", arr[i]),
    "utf-8",
    function (err: NodeJS.ErrnoException | null, data: string) {
      if (err) {
        return err;
      }
      sourceMap[arr[i]] = data;
    }
  );
}

export function handleErrorMessage(message: any) {
  console.log(message);
  const errorLine = message.lineno;
  const errorCol = message.colno;
  const jsName = message.source.split("/").pop();
  const sourceName = jsName + ".map";
  // 服务器因为是一直启动状态，所以如果是在启动后最新上传的文件，则需要事实进行读取对应的map文件
  if (!sourceMap[sourceName]) {
    sourceMap[sourceName] = fs.readFileSync(
      path.resolve(__dirname, "../uploads", sourceName),
      "utf-8"
    );
  }
  SourceMapConsumer.with(
    sourceMap[sourceName],
    null,
    (consumer: BasicSourceMapConsumer | IndexedSourceMapConsumer) => {
      // 在源码堆栈中定位报错位置
      const originalPosition = consumer.originalPositionFor({
        line: errorLine,
        column: errorCol,
      });

      console.log("Error occurred at:");
      console.log("file:" + originalPosition.source);
      console.log("line:" + originalPosition.line);
      console.log("column:" + originalPosition.column);
      console.log("message:" + message.message);
    }
  );
}
