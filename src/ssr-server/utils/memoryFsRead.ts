import fs from "fs-extra";
export function createMemoryFsRead() {
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
