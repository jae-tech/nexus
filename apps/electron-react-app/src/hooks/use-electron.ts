import { useState, useEffect } from 'react';
import type { ElectronAppInfo, ElectronThemeInfo, IPCChannels } from '@/types/electron';

/**
 * Electron API가 사용 가능한지 확인
 */
export const useElectronAvailable = () => {
  return typeof window !== 'undefined' && window.electronAPI;
};

/**
 * Electron IPC 통신을 위한 훅
 */
export const useElectronAPI = () => {
  const isElectron = useElectronAvailable();

  const invoke = async (channel: IPCChannels, ...args: any[]) => {
    if (!isElectron) {
      console.warn('Electron API not available');
      return null;
    }
    try {
      return await window.electronAPI.invoke(channel, ...args);
    } catch (error) {
      console.error(`Failed to invoke ${channel}:`, error);
      return null;
    }
  };

  return { isElectron, invoke };
};

/**
 * 앱 정보를 가져오는 훅
 */
export const useElectronAppInfo = () => {
  const [appInfo, setAppInfo] = useState<ElectronAppInfo | null>(null);
  const { isElectron, invoke } = useElectronAPI();

  useEffect(() => {
    if (!isElectron) return;

    const fetchAppInfo = async () => {
      const [name, version] = await Promise.all([
        invoke('app:get-name'),
        invoke('app:get-version'),
      ]);

      if (name && version) {
        setAppInfo({
          name,
          version,
          platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
        });
      }
    };

    fetchAppInfo();
  }, [isElectron, invoke]);

  return appInfo;
};

/**
 * 시스템 테마 정보를 가져오는 훅
 */
export const useElectronTheme = () => {
  const [themeInfo, setThemeInfo] = useState<ElectronThemeInfo | null>(null);
  const { isElectron, invoke } = useElectronAPI();

  useEffect(() => {
    if (!isElectron) return;

    const fetchThemeInfo = async () => {
      const info = await invoke('theme:get');
      if (info) {
        setThemeInfo(info);
      }
    };

    fetchThemeInfo();
  }, [isElectron, invoke]);

  return themeInfo;
};