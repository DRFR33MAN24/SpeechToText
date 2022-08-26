import React, { useCallback, useState, CSSProperties } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useDropzone } from "react-dropzone";

import {
  faPowerOff,
  faGear,
  faPlayCircle,
  faWindowClose,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileItem = ({ name, type, length }) => {
  return (
    <div class=" card bg-base-100  p-2 my-1 rounded-none border-2">
      <div className="flex flex-row justify-between items-center">
        <div>
          <FontAwesomeIcon icon={faFile} fixedWidth size="lg" />
          {name}
        </div>
        <div className="flex flex-row items-center">
          <span className="badge badge-accent mx-2 p-3 ">255</span>
          <span className="badge badge-accent-content mx-2 p-3 ">15 min</span>
          <div className="btn btn-square btn-outline btn-sm btn-error rounded-none">
            <FontAwesomeIcon icon={faWindowClose} fixedWidth size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
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
      className="  content-center items-center mb-3 mt-1 overflow-auto bg-base-100  px-3 "
    >
      <input {...getInputProps()} />
      {filesToConvert.length !== 0 ? (
        <div>
          <div className="flex flex-row justify-evenly my-2">
            <button className="btn btn-accent rounded-none ">
              Add more files
            </button>
            <div className="btn btn-error btn-outline rounded-none ">
              Clear List
            </div>
          </div>
          {filesToConvert.map((file, index) => (
            <FileItem key={index} name={file.name} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed min-h-16">
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
      <div className="flex flex-row justify-start items-center p-2 fixed top-0 left-0 z-10 bg-neutral">
        <button className="btn btn-outline btn-square btn-error btn-sm">
          <FontAwesomeIcon
            icon={faPowerOff}
            fixedWidth
            size="lg"
            className="text-base"
          />
        </button>
        <div className="btn btn-outline btn-square border-white  btn-sm  mx-1">
          <FontAwesomeIcon
            icon={faGear}
            fixedWidth
            size="lg"
            className="text-white "
          />
        </div>
      </div>

      <div className="title-bar  top-1 bg-transparent "></div>

      <div className=" stats stats-horizontal  shadow mt-9 mb-1 rounded-none flex">
        <div className="stat  items-center ">
          <div className="justify-center items-center">
            <div className="btn btn-circle btn-accent ">
              <FontAwesomeIcon icon={faPlayCircle} fixedWidth size="lg" />
            </div>
          </div>
          <div className="mt-2 text-lg">Start</div>
        </div>

        <div className="stat">
          <div className="stat-title">Files</div>
          <div className="stat-value">66</div>
        </div>

        <div className="stat">
          <div className="stat-title">Estimated Time</div>
          <div className=" text-lg">1 Hr</div>
          <div className=" text-lg">40 Min</div>
        </div>
        <div className="stat">
          <div className="stat-title">Network requests</div>
          <div className="stat-value">6</div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl p-3 rounded-none ">
        <div className="flex flex-row justify-between items-center">
          <div
            className="radial-progress text-accent"
            style={{ "--value": 70, "--thickness": "10px", "--size": "5rem" }}
          >
            70%
          </div>
          TestFile.mp3
          <div className="mr-5">
            <ul class="steps steps-vertical">
              <li class="step step-accent">
                <div className="text-xl ">Split Audio files 5/320</div>
              </li>
              <li class="step step-neutral">
                <div className="text-xl ">Upload to server</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <MyDropzone />
    </div>
  );
};

export default App;
