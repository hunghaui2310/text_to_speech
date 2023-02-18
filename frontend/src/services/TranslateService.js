import axios from "axios";
import {BASE_URL} from "./UploadService";

function testCallAPI() {
  return fetch(BASE_URL + '/to/todos/').then(res => res.json());
}

function translate(fileName, source, target) {
  return axios.get(BASE_URL + `/translate/${fileName}/${source}/${target}`);
}

function downloadWav(fileName, url, folderName) {
  return axios.post(BASE_URL + `/downloadWav/${fileName}/${folderName}`, {url});
}

function extractUrl(url) {
  return axios.post(BASE_URL + `/extractUrl`, {url});
}

export {
  testCallAPI,
  translate,
  downloadWav,
  extractUrl
}