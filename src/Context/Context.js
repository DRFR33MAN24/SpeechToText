import React from "react";


const GlobalContext = React.createContext({
  currentFile,
  currentClip,
  numApiRequests,
  totalFiles,
  totalClipsInFile,
    setCurrentFile: () => {},
  setCurrentClip: () => {},
  setNumApiRequests: () => {},
  setTotalFiles: () => {},
  setTotalClipsInFile: () => {}
});

export default GlobalContext;