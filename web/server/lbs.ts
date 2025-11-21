const apiKey = 'FYDOCK8BZaLHcqxdGOMYzEx2k6fRMCeE';

export async function getPosition(query: string, region: string) {
  console.log('>>>>> query: ', query, region);
  return fetch(`https://api.map.baidu.com/place/v3/region?query=${query}&region=${region}&ak=${apiKey}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
}