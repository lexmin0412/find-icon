import React from "react";
import {BrowserRouter, Route} from "pure-react-router";
import {ConfigProvider} from "antd";
import zhCN from "antd/locale/zh_CN";
import { routes } from "./routers";
import { setTwoToneColor } from "@ant-design/icons";
import "./App.css";

// 设置全局双色图标主色
setTwoToneColor("#1688ff");

function App() {
  return (
    <React.StrictMode>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: "#1688ff",
          },
        }}
      >
        <BrowserRouter routes={routes} basename="/find-icon">
          <Route />
        </BrowserRouter>
      </ConfigProvider>
    </React.StrictMode>
  );
}

export default App;
