const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'logo.svg');

async function generate() {
  const svg = fs.readFileSync(svgPath, 'utf8');

  const sizes = [
    { file: 'logo192.png', size: 192 },
    { file: 'logo512.png', size: 512 },
    { file: 'apple-touch-icon.png', size: 180 },
  ];

  for (const { file, size } of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, file));
    console.log(`✅ ${file} (${size}x${size})`);
  }

  fs.copyFileSync(svgPath, path.join(publicDir, 'favicon.svg'));
  console.log('✅ favicon.svg');
  console.log('\n✔ Done!');
}

generate().catch(err => { console.error(err.message); process.exit(1); });
