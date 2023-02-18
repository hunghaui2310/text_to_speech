import React, {useEffect, useRef, useState} from 'react';
import {message, Upload, Spin, Button, Tooltip, Input } from 'antd';
import {CloseOutlined, DownloadOutlined, CheckOutlined, RightOutlined} from '@ant-design/icons';
import {BASE_URL, downloadFile} from "../services/UploadService";
import logoPPT from '../assets/images/ppt-icon-499.png';
import {downloadWav, extractUrl} from "../services/TranslateService";
import {createWavFromText} from "../services/ExternalService";

const { Search } = Input;

export const LinkDownload = () => {

  const [successFiles, setSuccessFiles] = useState([]);
  const [translating, setTranslating] = useState(false);
  const [inputs, setInputs] = useState([]);


  useEffect(() => {
    initInput();
  }, []);

  const initInput = () => {
    const inputs = [];
    for (let i= 0; i <= 10; i++) {
      inputs.push({
        status: '',
        id: i
      });
    }
    setInputs(inputs);
  };

  const changeStateDownload = (item) => {
    setSuccessFiles(successFiles.map(file => {
      if (file.id === item.id) {
        file.isDownloaded = true;
      }
      return file;
    }));
  };

  const onSearch = (value, item) => {
    if (!value || value === '') return;
    const newArr = inputs.map(inp => {
      if (inp.id === item.id) {
        inp.status = 'ready';
        inp.value = value;
      }
      return inp;
    });
    setInputs(newArr);
    extractDataFromUrls(newArr);
  };

  const extractDataFromUrls = (urls) => {
    if (!urls || urls.length === 0) return;
    const readyUrls = urls.filter(item => item.status === 'ready');
    readyUrls.forEach(item => {
      extractUrl(item.value).then(res => {
        const data = res.data;
        downloadWavExternal(data.title, 'title-' + data.fileName, data.fileName).then().catch();
        downloadWavExternal(data.text, data.fileName, data.fileName).then().catch();
      }).catch(err => {
        updateUrlError(urls, item);
      })
    });
  };

  const downloadWavExternal = (text, fileName, folderName) => {
    return createWavFromText(text, 66899, 5).then((resp) => {
          if (!resp || !resp.body) return;
          const url = resp.body.wavFilePath;
          downloadWav(fileName, url, folderName).then((resp1) => {
             setTranslating(false);
             message.success(`${fileName} success.`);
          })
        })
  }

  const updateUrlError = (urls, item) => {
    const arr = urls.map(url => {
          if (url.id === item.id) {
            url.status = 'error';
          }
          return url;
        });
        setInputs(arr);
  }

  const handleDownload = (item) => {
    downloadFile(item.name).then(res => {
      const file = new Blob([res.data]);
      let url = URL.createObjectURL(file);
      let a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', item.name);
      document.body.appendChild(a);
      a.click();
      // window.URL.revokeObjectURL(url);
      changeStateDownload(item);
      message.success(`${item.name} file downloaded successfully.`);
    }).catch((err) => {
      changeStateDownload(item);
      message.error(`${item.name} file download failed.`);
    });
  };

  return (
    <div className="d-flex pt-90 justify-content-between">
      <div className="m-2 w-40p">
        {inputs.map(item => {
          return <Search key={item.id} placeholder="Link here..." className="mb-2"
                         loading={item.status === 'loading'}
                         enterButton status={item.status} onSearch={(value, event) => onSearch(value, item)}/>
        })}
      </div>
      <div className="m-4 pt-190">
        {translating ? <Spin size="large"/> : <RightOutlined style={{fontSize: '50px'}}/>}
      </div>
      <div className="m-2 w-40p">
        <div className="mb-2">

        </div>
        <div className="upload-result">
          {successFiles && successFiles.map((item, index) =>
            <div className="upload-item m-2" key={index}>
              <div className="upload-item-image">
                <a>
                  <img height={40} src={logoPPT}/>
                </a>
                <Tooltip title={item.name}>
                  <p className="upload-title">{item.name}</p>
                </Tooltip>
              </div>
              <div className="upload-item-action">
                <Button shape="circle" type="primary" className="mr-1"
                        icon={item.isDownloaded ? <CheckOutlined/> : <DownloadOutlined/>}
                        ghost onClick={() => handleDownload(item)}/>
              </div>
            </div>)}
        </div>
      </div>
    </div>
  )
}