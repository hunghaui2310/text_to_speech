const EXTERNAL_URL = 'https://studio.ploonet.com/wp-json/ep/v1/console/projects/wav';

function createWavFromText(text, projectId = 58787, voiceId = 10) {
  return fetch(EXTERNAL_URL, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          'projectId': projectId,
          'voiceId': voiceId,
          'text': text
      })
  }).then(res => res.json());
}

export {
  createWavFromText
}