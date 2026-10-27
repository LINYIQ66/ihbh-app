export default function merchantUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && (/^(www\.)?amazon\.(com|com\.sg|sg|co\.uk|co\.jp|de|fr|ca|com\.au|in)$/.test(url.hostname) || url.hostname === 'amzn.to') ? url.href : null;
  } catch { return null; }
}