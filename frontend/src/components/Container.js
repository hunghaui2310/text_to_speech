import React from 'react';
import UploadFile from "./UploadFile";
import './custom-component.css';
import {LinkDownload} from "./LinkDownload";
import {TextToSpeech} from "./TextToSpeech";

const Container = () => {

  return (
    <div className="container">
      <TextToSpeech/>
      <LinkDownload/>
      <UploadFile/>
      {/*<Statistic/>*/}
      <div className="pt-100"/>
    </div>
  )
};

export default Container;
