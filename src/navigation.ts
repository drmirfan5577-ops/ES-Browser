export function resolveAddress(input: string, engine = 'google'): string {
  const value = input.trim();
  if (!value) throw new Error('Enter a web address or search term.');
  if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) throw new Error('Only HTTP and HTTPS web addresses are supported.');
  if (/^https?:\/\//i.test(value) || (/^[\w-]+(\.[\w-]+)+(\/|:|$)/.test(value) && !/\s/.test(value))) {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!url.hostname || url.username || url.password) throw new Error('Enter a valid web address without credentials.');
    return url.href;
  }
  return `${engine === 'duckduckgo' ? 'https://duckduckgo.com/?q=' : 'https://www.google.com/search?q='}${encodeURIComponent(value)}`;
}
