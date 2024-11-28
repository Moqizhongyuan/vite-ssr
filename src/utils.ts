import axios from "axios";

export function onError() {
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
}

export function upLoadTryCatchErr(error: Error) {
  const stackTrace = error.stack;

  // 从堆栈信息中提取行号和列号
  if (stackTrace) {
    const match = stackTrace.match(/at\s.*\((.*):(\d+):(\d+)\)/);
    if (match) {
      const [, fileName, lineNumber, columnNumber] = match;
      console.log(
        "错误发生在：",
        fileName,
        "的第",
        lineNumber,
        "行，第",
        columnNumber,
        "列"
      );
      axios
        .post("http://localhost:3000/sendErrorLog", {
          message: error.message,
          lineno: Number(lineNumber),
          colno: Number(columnNumber),
          source: fileName,
        })
        .then((data) => {
          console.log(data);
        });
    }
  }
}
