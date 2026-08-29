const https = require('https');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public/crayola');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const START_ID = 29557; // A

function downloadImage(letterIndex) {
  const letter = String.fromCharCode(65 + letterIndex); // A is 0
  const id = START_ID + letterIndex;
  const url = `https://www.crayola.com/-/media/Crayola/Coloring-Page/coloring_pages/${id}.jpg`;
  const dest = path.join(publicDir, `${letter}.jpg`);
  
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Saved ${letter}.jpg`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  const promises = [];
  for (let i = 0; i < 26; i++) {
    promises.push(downloadImage(i));
  }
  await Promise.all(promises);
  console.log("Done downloading all 26 images!");
}

main();
