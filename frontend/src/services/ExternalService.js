const EXTERNAL_URL = 'https://studio.ploonet.com/wp-json/ep/v1/console/projects/wav';

function createWavFromText(text, projectId = 58787, voiceId = 10, tempo = 0.9) {
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
          'tempo': tempo
      })
  }).then(res => res.json());
}

export {
  createWavFromText
}