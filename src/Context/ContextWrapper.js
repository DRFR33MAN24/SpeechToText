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
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
