import React from "react";

const GlobalContext = React.createContext({
  currentFile: "_____.mp3",
  currentClip: 0,
  numApiRequests: 0,
  totalFiles: 0,
  totalClipsInFile: 0,
  step: -1,
  timePerClip: 0,
  processStarted: false,
  filesToProcess: [],
  speechLanguage: "ar",
  apiKey: "",
  interfaceLanguage: "ar",
  outputDirectory: "",
  conversionEngine: "wit",
  setSpeechLanguage: () => {},
  setApiKey: () => {},
  setInterfaceLanguage: () => {},
  setOutputDirectory: () => {},
  setConversionEngine: () => {},
  setProcessStarted: () => {},
  setCurrentFile: () => {},

  setCurrentClip: () => {},
  setNumApiRequests: () => {},
  setTotalFiles: () => {},
  setTotalClipsInFile: () => {},
  setFilesToProcess: () => {},
  setStep: () => {},
  setTimePerClip: () => {},
});

export default GlobalContext;
