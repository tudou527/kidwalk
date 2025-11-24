
export function getLinkFromText(text: string): string {
  const regex = /(https?:\/\/[^\s]+)/g;
  const matches = Array.from(text.match(regex) || []);

  return matches[0];
}

export async function getPosition(query: string, region: string) {
  const apiKey = 'FYDOCK8BZaLHcqxdGOMYzEx2k6fRMCeE';
  const response = await fetch(`https://api.map.baidu.com/place/v3/region?query=${query}&region=${region}&ak=${apiKey}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());

  return response.results || [];
}