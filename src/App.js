import React, { useCallback } from 'react';
import logo from "./logo.svg";
import "./App.css";
import { useDropzone } from 'react-dropzone';

import {

  faPowerOff
}
  from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="content-center items-center p-8 border-2 border-dashed ">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

const App = () => {
  return (
    <div className='App bg-slate-600  p-3'>
      <div className='absolute top-3 left-3'>
        <FontAwesomeIcon icon={faPowerOff} fixedWidth size='lg' />
      </div>

      <MyDropzone />
    </div>
  )
}

export default App;
