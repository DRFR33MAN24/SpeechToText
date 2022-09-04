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
  apiKey: "1234",
  interfaceLanguage: "ar",
  outputDirectory: "",
  currentSubtitle: "",
  loading: false,
  conversionEngine: "wit",
  error: "",
  setSpeechLanguage: () => {},
  setApiKey: () => {},
  setInterfaceLanguage: () => {},
  setOutputDirectory: () => {},
  setConversionEngine: () => {},
  setProcessStarted: () => {},
  setCurrentFile: () => {},
  setCurrentSubtitle: () => {},
  setLoading: () => {},

  setCurrentClip: () => {},
  setNumApiRequests: () => {},
  setTotalFiles: () => {},
  setTotalClipsInFile: () => {},
  setFilesToProcess: () => {},
  setStep: () => {},
  setTimePerClip: () => {},
  resetStats: () => {},
  resetStats: () => {},
  setError: () => {},
});

export default GlobalContext;
