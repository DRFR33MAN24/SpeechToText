import React, { useCallback, useState,CSSProperties } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useDropzone } from "react-dropzone";

import {
  faPowerOff,
  faGear,
  faPlayCircle,
  faWindowClose,
  faFile
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileItem = ({ name, type, length }) => {
  return (
<div class=" card bg-base-100 shadow-xl p-2 my-1">
<div className="flex flex-row justify-between items-center">
   <div>
   <FontAwesomeIcon icon={faFile} fixedWidth size="lg" />
    {name}
  </div>
  <div>
    <div className="btn btn-circle btn-warning">
      <FontAwesomeIcon icon={faWindowClose} fixedWidth size="lg" />
    </div>

  </div>

</div>
 
</div>
  )
};

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
      className="  content-center items-center my-3 overflow-auto "
    >
      <input {...getInputProps()} />
      {filesToConvert.length !== 0 ? (
        <div>
          {filesToConvert.map((file, index) => (
            <FileItem key={index} name={file.name} />
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
    <div className="App bg-neutral  p-3">
      <div className=" bg-base-100  rounded-full p-2 fixed top-0 left-0">
        <FontAwesomeIcon icon={faPowerOff} fixedWidth size="lg" />
        <FontAwesomeIcon icon={faGear} fixedWidth size="lg" />
      </div>

      <div className="title-bar  top-1 bg-transparent "></div>

      <div className=" stats stats-horizontal  shadow my-3">
        <div className="stat content-center items-center">
          <div className="btn btn-circle btn-accent">
            <FontAwesomeIcon icon={faPlayCircle} fixedWidth size="lg" />
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Files</div>
          <div className="stat-value">66</div>
        </div>

        <div className="stat">
          <div className="stat-title">Estimated Time</div>
          <div className="">1 Hr 40 Min</div>
        </div>
        <div className="stat">
          <div className="stat-title">Failed Network Requests</div>
          <div className="stat-value">6</div>
        </div>
      </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="radial-progress" >70%</div>
        </div>
      <MyDropzone />
    </div>
  );
};

export default App;
