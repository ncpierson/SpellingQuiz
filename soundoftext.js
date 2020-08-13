const api = 'https://api.soundoftext.com';

const request = ({text, voice}) =>
  fetch(`${api}/sounds`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'SoundOfTextClient',
    },
    body: JSON.stringify({engine: 'Google', data: {text, voice}}),
  }).then(res => res.json());

const status = ({id}) => fetch(`${api}/sounds/${id}`).then(res => res.json());

const location = ({id, timeout = 1000}) =>
  client.status({id}).then(res => {
    if (res.status === 'Error') throw res.message;
    if (res.status === 'Done') return res.location;
    if (timeout > 30 * 100) throw 'Operation timed out';

    return retry(() => location({id, timeout: timeout * 2}), timeout);
  });

const create = ({text, voice}) =>
  client.request({text, voice}).then(client.location);

const retry = (func, timeout) =>
  new Promise(resolve => setTimeout(() => resolve(func()), timeout));

const client = {
  create,
  location,
  request,
  status,
};

export default client;
