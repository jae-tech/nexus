import { contextBridge } from "electron";

// 안전하게 렌더러에 API 노출
contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => "pong",
});
