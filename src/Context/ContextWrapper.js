import React, { useState } from "react";
import Context from "./Context";


export default function ContextWrapper(props) {
  const [numApiRequests, setNumApiRequests] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [currentClip, setCurrentClip] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalClipsInFile, setTotalClipsInFile] = useState(0);
  return (
    <Context.Provider
      value={{  numApiRequests,setNumApiRequests,  currentFile,
  currentClip,setCurrentFile,setCurrentClip,totalFiles,setTotalFiles,totalClipsInFile,setTotalClipsInFile}}
    >
      {props.children}
    </Context.Provider>
  );
}
