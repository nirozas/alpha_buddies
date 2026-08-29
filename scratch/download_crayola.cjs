const fs = require('fs');
const https = require('https');
const path = require('path');

const publicDir = path.join(__dirname, '../public/crayola');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  for (const letter of letters) {
    try {
      console.log(`Processing ${letter}...`);
      const url = `https://www.crayola.com/free-coloring-pages/print/alphabet-${letter}-coloring-page`;
      const html = await fetchHtml(url);
      
      // Look for the main image URL
      // E.g., <img src="/-/media/Crayola/Coloring-Page/coloring_pages/29557.jpg"
      const match = html.match(/src="(\/-\/media\/Crayola\/Coloring-Page\/coloring_pages\/[^"]+\.jpg)"/i);
      if (match && match[1]) {
        const imgUrl = 'https://www.crayola.com' + match[1];
        const dest = path.join(publicDir, `${letter}.jpg`);
        await downloadImage(imgUrl, dest);
        console.log(`Saved ${letter}.jpg`);
      } else {
        console.log(`Could not find image for ${letter}`);
      }
    } catch (e) {
      console.error(`Error for ${letter}:`, e.message);
    }
  }
  console.log("Done!");
}

main();
