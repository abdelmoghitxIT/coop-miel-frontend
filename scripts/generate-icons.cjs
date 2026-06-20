const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');
const androidRes = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

async function generate() {
  const svg = fs.readFileSync(path.join(publicDir, 'logo.svg'), 'utf8');
  const icons = [
    { file: 'logo192.png', size: 192 },
    { file: 'logo512.png', size: 512 },
    { file: 'apple-touch-icon.png', size: 180 },
  ];
  for (const { file, size } of icons) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(publicDir, file));
    console.log(`✅ ${file}`);
  }
  fs.copyFileSync(path.join(publicDir, 'logo.svg'), path.join(publicDir, 'favicon.svg'));
  console.log('✅ favicon.svg');

  const splashSvg = fs.readFileSync(path.join(publicDir, 'splash.svg'), 'utf8');
  const splashDirs = [
    { dir: 'drawable', w: 720, h: 1280 },
    { dir: 'drawable-port-mdpi', w: 320, h: 569 },
    { dir: 'drawable-port-hdpi', w: 480, h: 853 },
    { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
    { dir: 'drawable-port-xxhdpi', w: 960, h: 1707 },
    { dir: 'drawable-port-xxxhdpi', w: 1280, h: 2276 },
    { dir: 'drawable-land-mdpi', w: 180, h: 320 },
    { dir: 'drawable-land-hdpi', w: 270, h: 480 },
    { dir: 'drawable-land-xhdpi', w: 405, h: 720 },
    { dir: 'drawable-land-xxhdpi', w: 540, h: 960 },
    { dir: 'drawable-land-xxxhdpi', w: 720, h: 1280 },
  ];

  for (const { dir, w, h } of splashDirs) {
    const dirPath = path.join(androidRes, dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    await sharp(Buffer.from(splashSvg)).resize(w, h).png().toFile(path.join(dirPath, 'splash.png'));
    console.log(`✅ ${dir}/splash.png`);
  }

  console.log('\n✔ Done!');
}

generate().catch(err => { console.error('❌', err.message); process.exit(1); });
