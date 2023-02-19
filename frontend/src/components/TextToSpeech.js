import React, {useEffect, useRef, useState} from 'react';
import {message, InputNumber, Spin, Button, Select, Input, Col, Row, Slider} from 'antd';
import {RightOutlined} from '@ant-design/icons';
import {createWavFromText, createWavFromTextChina} from "../services/ExternalService";

const {TextArea} = Input;

export const TextToSpeech = () => {

  const [translating, setTranslating] = useState(false);
  const [value, setValue] = useState('');
  const [projectId, setProjectId] = useState(66899);
  const [sourceUrl, setSourceUrl] = useState('');
  const [language, setLanguage] = useState('');
  const [tempo, setTempo] = useState(0.95);


  useEffect(() => {
  }, []);

  const TTSKorea = () => {
    createWavFromText(value, projectId, 5, tempo).then((resp) => {
      if (!resp || !resp.body) return;
      const url = resp.body.wavFilePath;
      setTranslating(false);
      setSourceUrl('http://studio.ploonet.com/' + url.substring(14));
    }).catch(() => {
      message.error(`Convert failed.`);
      setTranslating(false);
    });
  }

  const TTSChina = () => {
    createWavFromTextChina(value, projectId, 6, language, tempo).then((resp) => {
      if (!resp || !resp.body) return;
      const url = resp.body.wavFilePath;
      setTranslating(false);
      setSourceUrl('http://studio.ploonet.com/' + url.substring(14));
    }).catch(() => {
      message.error(`Convert failed.`);
      setTranslating(false);
    });
  }

  const convertToSpeech = () => {
    setTranslating(true);
    setSourceUrl('');
    if (language === '') {
      TTSKorea();
    } else if (language === 'zh-cn') {
      TTSChina();
    }
  };

  const onChangeLanguage = (value) => {
    setLanguage(value);
  };

  return (
    <div className="d-flex pt-90 justify-content-between">
      <div className="m-2 w-40p">
        <Row className="mb-1">
          <Col span={3}>Speed</Col>
          <Col span={15}>
            <Slider min={0} max={1.5} onChange={(value) => setTempo(value)} step={0.05}
                    value={typeof tempo === 'number' ? tempo : 0}
            />
          </Col>
          <Col span={4}>
            <InputNumber min={0} max={1.5} step={0.05}
                         style={{margin: '0 16px'}} value={tempo}
                         onChange={(value) => setTempo(value)}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-between">
          <div>
            <label className="mb-2">Project Id
              <InputNumber min={0} defaultValue={projectId}
                           onChange={(value) => setProjectId(value)}/></label>
          </div>
          <Select
            defaultValue=""
            placeholder="Select language"
            onChange={onChangeLanguage}
            options={[
              {
                value: '',
                label: 'Korean',
              },
              {
                value: 'zh-cn',
                label: 'China',
              }
            ]}
          />
        </div>
        <TextArea rows={18} placeholder="Insert script here to convert to speech..." allowClear
                  value={value} onChange={(e) => setValue(e.target.value)}/>
      </div>
      <div className="m-4 pt-190">
        {translating ? <Spin size="large"/> :
          <Button onClick={convertToSpeech} size='large' icon={<RightOutlined/>}>
          </Button>
        }
      </div>
      <div className="m-2 w-40p mt-5">
        <div className="upload-result mt-5 p-4">
          {sourceUrl && <audio controls>
            <source src={sourceUrl} type="audio/wav"/>
          </audio>}
        </div>
      </div>
    </div>
  )
}