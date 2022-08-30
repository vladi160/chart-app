import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
const fs = require('fs');
export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  sendPath(channel: 'path', args: String) {
    ipcRenderer.send(channel, args);
  },
  saveSettings(channel: 'save-settings', key: String, val: String) {
    ipcRenderer.send(channel, key, val);
  },
  async getSetting(channel: 'get-setting', arg: String) {
    const setting = await ipcRenderer.invoke(channel, arg);
    return setting;
  }

  ,
  async getData(channel: 'get-data') {
    const data = await ipcRenderer.invoke(channel);
    return data;
  },

});
