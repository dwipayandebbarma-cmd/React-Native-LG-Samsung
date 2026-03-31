const fs = require('fs');
const path = require('path');

function writePlaceholderPng(filePath) {
  if (fs.existsSync(filePath)) return;
  // 1x1 transparent PNG
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/af2F2cAAAAASUVORK5CYII=',
    'base64'
  );
  fs.writeFileSync(filePath, png);
}

function main() {
  // __dirname = <project>/scripts/webos
  const projectRoot = path.resolve(__dirname, '../..');
  const distDir = path.join(projectRoot, 'dist');
  const appinfoPath = path.join(distDir, 'appinfo.json');
  const indexPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ not found. Run `npm run build` first.');
  }
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found. Run `npm run build` first.');
  }

  // webOS app manifest (project default).
  const appinfo = {
    id: 'com.smarttv.app',
    version: '1.0.0',
    vendor: 'SmartTV',
    type: 'web',
    main: 'index.html',
    title: 'Smart TV App',
    icon: 'icon.png',
    largeIcon: 'icon.png',
  };

  fs.writeFileSync(appinfoPath, JSON.stringify(appinfo, null, 2) + '\n', 'utf8');

  // webOS helper scripts (optional but commonly used).
  const pathJs =
    `// webOS build helper: resolve app base path\n` +
    `(function () {\n` +
    `  try {\n` +
    `    window.__APP_BASE__ = './';\n` +
    `  } catch (e) {}\n` +
    `})();\n`;

  const deviceInfoJs =
    `// webOS build helper: basic device info + webapis presence\n` +
    `(function () {\n` +
    `  try {\n` +
    `    var info = {\n` +
    `      userAgent: navigator.userAgent,\n` +
    `      hasWebOS: typeof window.webOS !== 'undefined',\n` +
    `      hasWebapis: typeof window.webapis !== 'undefined'\n` +
    `    };\n` +
    `    window.__DEVICE_INFO__ = info;\n` +
    `  } catch (e) {}\n` +
    `})();\n`;

  fs.writeFileSync(path.join(distDir, 'path.js'), pathJs, 'utf8');
  fs.writeFileSync(path.join(distDir, 'device-info.js'), deviceInfoJs, 'utf8');

  // Icons/splash:
  // Put your real files here:
  // - assets/webos/icon.png
  // - assets/webos/splash.png
  // The script will copy them into dist/ (or create a tiny placeholder if missing).
  const assetsWebosDir = path.join(projectRoot, 'assets', 'webos');
  const srcIcon = path.join(assetsWebosDir, 'icon.png');
  const srcSplash = path.join(assetsWebosDir, 'splash.png');
  const outIcon = path.join(distDir, 'icon.png');
  const outSplash = path.join(distDir, 'splash.png');

  if (fs.existsSync(srcIcon)) {
    fs.copyFileSync(srcIcon, outIcon);
  } else {
    writePlaceholderPng(outIcon);
  }

  if (fs.existsSync(srcSplash)) {
    fs.copyFileSync(srcSplash, outSplash);
  } else {
    writePlaceholderPng(outSplash);
  }

  // Ensure webOS bootstrap scripts are present in index.html before app bundle.
  let html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('$WEBAPIS/webapis/webapis.js')) {
    const inject =
      '  <script type="text/javascript" src="$WEBAPIS/webapis/webapis.js"></script>\n' +
      '  <script src="./path.js"></script>\n' +
      '  <script src="./device-info.js"></script>\n';

    // Insert before the main Expo bundle script.
    html = html.replace(/(\s*<script\s+src=\"bundles\/[^"]+\"\s*><\/script>)/, inject + '$1');
    // Fallback: if script tag formatting differs, inject before </body>.
    if (!html.includes('./device-info.js')) {
      html = html.replace(/<\/body>/, inject + '</body>');
    }
    fs.writeFileSync(indexPath, html, 'utf8');
  }
}

main();

