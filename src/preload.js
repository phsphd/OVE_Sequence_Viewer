// tnr: We now only access the ipcRenderer from here and
// create a bridge called "api" to communicate back to the
// main process from renderer. I also am now setting the initial sequence data
// using a querystring - https://stackoverflow.com/questions/38335004/how-to-pass-parameters-from-main-process-to-render-processes-in-electron/38401579#38401579

const { ipcRenderer, contextBridge } = require("electron");
const querystring = require("querystring");

// Adds an object 'api' to the global window object:
contextBridge.exposeInMainWorld("api", {
  send: async (type, arg) => {
    return await ipcRenderer.invoke(type, arg);
  },
});

// Add the initial seq data to the renderer window
const query = querystring.parse(global.location.search);
try {
  const datastring = query["?initialSeqJson"];
  if (datastring) {
    const data = JSON.parse(datastring);
    contextBridge.exposeInMainWorld("initialSeqJson", data);
  }
} catch (error) {
  console.error(`error with initialSeqJson:`, error);
}
// Add the filepath to the renderer window
try {
  const datastring = query["?filePath"];
  if (datastring) {
    const data = JSON.parse(datastring);
    contextBridge.exposeInMainWorld("filePath", data);
  }
} catch (error) {
  console.error(`error with filePath:`, error);
}
