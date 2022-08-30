import React from "react";

const GlobalContext = React.createContext({
  currentFile: "",
  currentClip: 0,
  numApiRequests: 0,
  totalFiles: 0,
  totalClipsInFile: 0,
  processStarted: false,
  filesToProcess: [],
  setProcessStarted: () => {},
  setCurrentFile: () => {},

  setCurrentClip: () => {},
  setNumApiRequests: () => {},
  setTotalFiles: () => {},
  setTotalClipsInFile: () => {},
  setFilesToProcess: () => {},
});

export default GlobalContext;
