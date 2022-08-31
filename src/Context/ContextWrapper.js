import React, { useEffect, useState } from "react";
import Context from "./Context";

export default function ContextWrapper(props) {
  const [numApiRequests, setNumApiRequests] = useState(0);
  const [currentFile, setCurrentFile] = useState("____.mp3");
  const [currentClip, setCurrentClip] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalClipsInFile, setTotalClipsInFile] = useState(0);
  const [step, setStep] = useState(-1);
  const [timePerClip, setTimePerClip] = useState(0);
  const [filesToProcess, setFilesToProcess] = useState([]);

  const [speechLanguage, setSpeechLanguage] = useState(
    localStorage.getItem("speechLanguage")
  );
  const [conversionEngine, setConversionEngine] = useState(
    localStorage.getItem("conversionEnginge")
  );
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey"));
  const [interfaceLanguage, setInterfaceLanguage] = useState(
    localStorage.getItem("interfaceLanguage")
  );
  const [outputDirectory, setOutputDirectory] = useState(
    localStorage.getItem("outputDirectory")
  );

  useEffect(() => {
    localStorage.setItem("speechLanguage", speechLanguage);
    localStorage.setItem("conversionEngine", conversionEngine);
    localStorage.setItem("interfaceLanguage", interfaceLanguage);
    localStorage.setItem("outputDirectory", outputDirectory);
    localStorage.setItem("apiKey", apiKey);
  }, [
    speechLanguage,
    conversionEngine,
    apiKey,
    interfaceLanguage,
    outputDirectory,
  ]);

  useEffect(() => {
    setTotalFiles(filesToProcess.length);
  }, [filesToProcess]);

  return (
    <Context.Provider
      value={{
        numApiRequests,
        setNumApiRequests,
        currentFile,
        currentClip,
        setCurrentFile,
        setCurrentClip,
        totalFiles,
        setTotalFiles,
        totalClipsInFile,
        setTotalClipsInFile,
        filesToProcess,
        setFilesToProcess,
        step,
        setStep,
        timePerClip,
        setTimePerClip,
        speechLanguage,
        setSpeechLanguage,
        apiKey,
        setApiKey,
        interfaceLanguage,
        setInterfaceLanguage,
        outputDirectory,
        setOutputDirectory,
        conversionEngine,
        setConversionEngine,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
