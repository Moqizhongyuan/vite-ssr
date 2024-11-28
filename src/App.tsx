import logo from "./logo.svg";
import "./App.css";
import { Helmet } from "react-helmet";
import { upLoadTryCatchErr } from "./utils";

export interface AppProps {
  data: any;
}

function App(props: AppProps) {
  const { data } = props;
  // const a = undefined;
  // a.foo;
  // @ts-ignore

  return (
    <div className="App">
      <Helmet>
        <title>{data.user}的页面</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <header className="App-header">
        <button
          onClick={() => {
            try {
              throw new Error("aaa");
            } catch (error) {
              // 如果你希望在此处捕获错误并处理，可以通过
              // 可以将错误传递给 ErrorBoundary 或做其他处理
              upLoadTryCatchErr(error as Error);
            }
          }}
        >
          error
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
