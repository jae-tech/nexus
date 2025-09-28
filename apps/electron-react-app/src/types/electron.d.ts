// Electron API 타입 선언
declare global {
  interface Window {
    electronAPI: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

// Electron 관련 유틸리티 타입
export interface ElectronAppInfo {
  name: string;
  version: string;
  platform: string;
}

export interface ElectronThemeInfo {
  shouldUseDarkColors: boolean;
  platform: string;
}

// IPC 채널 타입 정의
export type IPCChannels =
  | 'app:get-version'
  | 'app:get-name'
  | 'theme:get'
  | 'window:minimize'
  | 'window:maximize'
  | 'window:close';

export {};