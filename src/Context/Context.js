import React from "react";

const GlobalContext = React.createContext({
  currentFile,
  currentClip,
  numApiRequests,
  totalFiles,
  totalClipsInFile,
  processStarted,
  filesToProcess,
  setProcessStarted: () => {},
  setCurrentFile: () => {},

  setCurrentClip: () => {},
  setNumApiRequests: () => {},
  setTotalFiles: () => {},
  setTotalClipsInFile: () => {},
  setFilesToProcess: () => {},
});

export default GlobalContext;
