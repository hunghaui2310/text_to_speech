const EXTERNAL_URL = 'https://studio.ploonet.com/wp-json/ep/v1/console/projects/wav';
const EXTERNAL_URL_CHINA = 'https://studio.ploonet.com/wp-json/ep/v1/node/projects/translate/wav';

function createWavFromText(text, projectId = 58787, voiceId = 10, tempo = 0.95) {
  return fetch(EXTERNAL_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'projectId': projectId,
      'voiceId': voiceId,
      'text': text,
      'tempo': tempo,
    })
  }).then(res => res.json());
}

function createWavFromTextChina(text, projectId = 58787, voiceId = 10, language = '', tempo = 0.95) {
  return fetch(EXTERNAL_URL_CHINA + '?' + new URLSearchParams({
    'projectId': projectId,
    'voiceId': voiceId,
    'text': text,
    'tempo': tempo,
    'targetLang': language
  }), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },

  }).then(res => res.json());
}

export {
  createWavFromText,
  createWavFromTextChina
}