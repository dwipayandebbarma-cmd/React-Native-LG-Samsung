const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

function main() {
  const projectRoot = path.resolve(__dirname, '../..');
  const distDir = path.join(projectRoot, 'dist');
  const assetsDir = path.join(projectRoot, 'android-tv', 'app', 'src', 'main', 'assets', 'www');

  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ not found. Run `npm run build:tv` first.');
  }
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error('dist/index.html not found. Run `npm run build:tv` first.');
  }

  fs.rmSync(assetsDir, { recursive: true, force: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  copyRecursive(distDir, assetsDir);

  console.log(`Synced web TV bundle to ${assetsDir}`);
}

main();
