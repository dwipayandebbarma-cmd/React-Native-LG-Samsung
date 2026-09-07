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

function stripLgWebOsScripts(html) {
  return html
    .replace(/<script[^>]*\$WEBAPIS\/webapis\/webapis\.js[^>]*><\/script>\s*/g, '')
    .replace(/<script[^>]*\.\/path\.js[^>]*><\/script>\s*/g, '')
    .replace(/<script[^>]*\.\/device-info\.js[^>]*><\/script>\s*/g, '');
}

function writePlaceholderPng(filePath) {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/af2F2cAAAAASUVORK5CYII=',
    'base64'
  );
  fs.writeFileSync(filePath, png);
}

function main() {
  const projectRoot = path.resolve(__dirname, '../..');
  const distDir = path.join(projectRoot, 'dist');
  const tizenDir = path.join(projectRoot, 'tizen-dist');
  const indexPath = path.join(tizenDir, 'index.html');
  const skipConfig = process.env.TIZEN_KEEP_CONFIG === '1';
  const syncTarget = process.env.TIZEN_SYNC_TARGET;

  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error('dist/ not found. Run `npm run build` first.');
  }

  fs.rmSync(tizenDir, { recursive: true, force: true });
  fs.mkdirSync(tizenDir, { recursive: true });
  copyRecursive(distDir, tizenDir);

  // Remove LG-only files from Samsung package.
  for (const file of ['appinfo.json', 'device-info.js', 'path.js', 'metadata.json']) {
    const p = path.join(tizenDir, file);
    if (fs.existsSync(p)) fs.rmSync(p);
  }

  let html = fs.readFileSync(indexPath, 'utf8');
  html = stripLgWebOsScripts(html);
  fs.writeFileSync(indexPath, html, 'utf8');

  const iconPath = path.join(tizenDir, 'icon.png');
  if (!fs.existsSync(iconPath)) {
    writePlaceholderPng(iconPath);
  }

  if (!skipConfig) {
    const configXml = `<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="http://smarttv.app/ott" version="1.0.0" viewmodes="maximized">
    <tizen:application id="com.smarttv.app" package="com.smarttv" required_version="6.0"/>
    <content src="index.html"/>
    <feature name="http://tizen.org/feature/screen.size.normal.1080.1920"/>
    <name>Smart TV App</name>
    <icon src="icon.png"/>
    <tizen:privilege name="http://tizen.org/privilege/internet"/>
    <tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>
    <access origin="*" subdomains="true"/>
    <tizen:profile name="tv-samsung"/>
    <tizen:setting screen-orientation="landscape" context-menu="enable" background-support="disable" encryption="disable" install-location="auto" hwkey-event="enable"/>
</widget>
`;
    fs.writeFileSync(path.join(tizenDir, 'config.xml'), configXml, 'utf8');
    fs.writeFileSync(
      path.join(tizenDir, 'config.xml.example'),
      configXml,
      'utf8'
    );
  } else {
    console.log('Skipped writing config.xml (TIZEN_KEEP_CONFIG=1).');
  }

  if (syncTarget) {
    const target = path.resolve(syncTarget);
    if (!fs.existsSync(target)) {
      throw new Error(`TIZEN_SYNC_TARGET not found: ${target}`);
    }
    for (const entry of ['index.html', 'icon.png', 'bundles', 'assets']) {
      const src = path.join(tizenDir, entry);
      const dest = path.join(target, entry);
      if (!fs.existsSync(src)) continue;
      fs.rmSync(dest, { recursive: true, force: true });
      copyRecursive(src, dest);
    }
    console.log(`Synced app files to ${target} (kept existing config.xml there).`);
  }

  console.log(`Tizen package root ready at ${tizenDir}`);
  console.log('Package: cd <project> && tizen package -t wgt -s <profile> -- .');
  console.log('Tip: use TIZEN_SYNC_TARGET=/path/to/RNPOC to copy only web assets into your IDE project.');
}

main();
