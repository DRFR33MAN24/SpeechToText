import React, { useCallback, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useDropzone } from "react-dropzone";

import {
  faPowerOff,
  faGear,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileItem = ({ name, type, length }) => {
  return <div className="shadow flex flex-row">file</div>;
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
      className="  content-center items-center p-8 m-4   "
    >
      <input {...getInputProps()} />
      {filesToConvert.length !== 0 ? (
        <div>
          {filesToConvert.map((file, index) => (
            <FileItem key={index} />
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
      <div className="absolute top-4 left-5">
        <FontAwesomeIcon icon={faPowerOff} fixedWidth size="lg" />
        <FontAwesomeIcon icon={faGear} fixedWidth size="lg" />
      </div>

      <div className="title-bar  top-1 bg-transparent "></div>

      <div class="stats stats-horizontal  shadow my-3">
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
      <div className=" content-center justify-center flex flex-row  border-2 m-4">
        <div>total files </div>
        <div>failed attempts </div>
      </div>
      <MyDropzone />
    </div>
  );
};

export default App;
