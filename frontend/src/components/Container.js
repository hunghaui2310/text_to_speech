import React from 'react';
import UploadFile from "./UploadFile";
import './custom-component.css';
import {LinkDownload} from "./LinkDownload";

const Container = () => {

  return (
    <div className="container">
      <LinkDownload/>
      <UploadFile/>
      {/*<Statistic/>*/}
      <div className="pt-100"/>
    </div>
  )
};

export default Container;
