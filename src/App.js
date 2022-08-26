import React, { useCallback, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useDropzone } from "react-dropzone";

import { faPowerOff, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileItem = ({name,type,length})=>{
  return(
    <div>
      
    </div>
    )
}

function MyDropzone() {
  const [filesToConvert, setFilesToConvert] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    setFilesToConvert(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    useFsAccessApi: false,
    noClick: true,
  });

  return (
    <div
      {...getRootProps()}
      className="  content-center items-center p-8 m-4   "
    >
      <input {...getInputProps()} />
      {filesToConvert.length !== 0 ? (
        <div>
          {filesToConvert.map((file, index) => (
            <div className="border-1 bg-orange-500 my-1" key={index}>
              file.name
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      )}
    </div>
  );
}

const App = () => {
  return (
    <div className="App bg-slate-600  p-3">
      <div className="absolute top-4 left-5">
        <FontAwesomeIcon icon={faPowerOff} fixedWidth size="lg" />
        <FontAwesomeIcon icon={faGear} fixedWidth size="lg" />
      </div>

      <div className="title-bar  top-1 bg-transparent "></div>

      <div class="stats stats-horizontal  shadow">
  
  
     <div className="stat">
    <div className="stat-title">Downloads</div>
    <div className="stat-value">31K</div>
    <div className="stat-desc">Jan 1st - Feb 1st</div>
  </div>
  
  <div className="stat">
    <div className="stat-title">New Users</div>
    <div className="stat-value">4,200</div>
    <div className="stat-desc">↗︎ 400 (22%)</div>
  </div>
  
  <div className="stat">
    <div className="stat-title">New Registers</div>
    <div className="stat-value">1,200</div>
    <div className="stat-desc">↘︎ 90 (14%)</div>
  </div>
  
 
  
</div>
      <div className=" content-center justify-center flex flex-row  border-2 m-4">
        <div>total files </div>
        <div>failed attempts </div>
      </div>
      <MyDropzone />
    </div>
  );
};

export default App;
