const https = require('https');
const options = {
  hostname: 'www.crayola.com',
  path: '/free-coloring-pages/print/alphabet-a-coloring-page',
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const lines = data.split('\n');
    lines.forEach(l => {
      if(l.includes('29557') || l.includes('jpg') || l.includes('og:image')) {
        console.log(l.trim());
      }
    });
  });
});
