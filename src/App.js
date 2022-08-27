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
  faTrashCan,
  faAdd,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FileItem = ({ name, type, length }) => {
  return (
    <div class=" card bg-base-100  p-2 my-1 rounded-none border-b-2">
      <div className="flex flex-row justify-between items-center">
        <div>
          <FontAwesomeIcon
            icon={faFile}
            fixedWidth
            size="lg"
            className="text-neutral"
          />
          {name}
        </div>
        <div className="flex flex-row items-center">
          <span className="badge badge-success mx-2 p-3 ">255</span>
          <span className="badge badge-success-content mx-2 p-3 ">
            <FontAwesomeIcon icon={faClock} fixedWidth size="lg" />
            15 min
          </span>
          <div className="btn btn-square btn-outline btn-sm btn-error rounded-none ">
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
      className="  content-center items-center mb-3 mt-1 overflow-auto bg-base-100  px-3 rounded-lg p-2 "
    >
      <input {...getInputProps()} />
      {filesToConvert.length !== 0 ? (
        <div>
          <div className="flex flex-row justify-evenly my-2">
            <div className="btn btn-success btn-sm rounded-lg ">
              <div class="flex flex-row   items-center justify-center ">
                <FontAwesomeIcon icon={faAdd} fixedWidth size="lg" />
                <div>Add</div>
              </div>
            </div>
            <div className="btn btn-error btn-outline rounded-none  ">
              <div class="flex flex-row items-center justify-center ">
                <FontAwesomeIcon icon={faTrashCan} fixedWidth size="lg" />
                <div>Clear List</div>
              </div>
            </div>
          </div>
          {filesToConvert.map((file, index) => (
            <FileItem key={index} name={file.name} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed h-72 flex flex-col justify-center items-center ">
          <img
            src={require("./Images/text-to-speech.png")}
            width="128px"
            height="128px"
          />
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
    <div className="App bg-slate-200 ">
      <section className="z-0 bg-success"></section>
      <div className="flex flex-row justify-between items-center fixed top-0  bg-success   w-full  ">
        <div className="flex flex-row justify-start items-center p-2  ">
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
        <div className="title-bar  top-1 text-base-100 ">
          {" "}
          Speech to text...
        </div>
      </div>

      <div className="mx-2 pt-16 ">
        <div class="card">
          <div className=" stats stats-horizontal  shadow   mb-1  rounded-lg flex">
            <div className="stat  items-center ">
              <div className="justify-center items-center">
                <div className="btn btn-circle btn-success ">
                  <FontAwesomeIcon icon={faPlayCircle} fixedWidth size="lg" />
                </div>
              </div>
              <div className="mt-2 text-lg font-bold">Start</div>
            </div>
            <div className="stat">
              <div className="stat-title">Files</div>
              <div className="text-lg font-bold">66</div>
            </div>
            <div className="stat">
              <div className="stat-title">Estimated Time</div>
              <div className=" text-lg font-bold">1 Hr</div>
              <div className=" text-lg font-bold">40 Min</div>
            </div>
            <div className="stat">
              <div className="stat-title">Network</div>
              <div className="stat-title">Requests</div>
              <div className="text-lg font-bold">6</div>
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 rounded-lg   ">
          <div className="flex flex-row justify-between items-center">
            <div
              className="radial-progress text-success font-bold"
              style={{ "--value": 70, "--thickness": "15px", "--size": "5rem" }}
            >
              70%
            </div>
            TestFile.mp3
            <div className="mr-5">
              <ul class="steps steps-vertical">
                <li class="step step-success">
                  <div className="text-l ">
                    Split Audio files <span className="font-bold"> 5/320</span>
                  </div>
                </li>
                <li class="step step-neutral">
                  <div className="text-l ">Upload to server</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <MyDropzone />
      </div>
    </div>
  );
};

export default App;
