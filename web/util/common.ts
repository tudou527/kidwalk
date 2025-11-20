
export function getLinkFromText(text: string): string[] {
  const regex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(regex);
  return Array.from(matches || []);
}


