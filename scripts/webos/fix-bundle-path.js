const fs = require('fs');
const path = require('path');

function main() {
  const projectRoot = path.resolve(__dirname, '../..');
  const indexPath = path.join(projectRoot, 'dist', 'index.html');

  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found. Run `npm run build` first.');
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  // Make bundle + asset URLs relative so they work under webOS app local origin.
  html = html.replace(/src=\"\/bundles\//g, 'src="bundles/');
  html = html.replace(/href=\"\/bundles\//g, 'href="bundles/');
  html = html.replace(/src=\"\/assets\//g, 'src="assets/');
  html = html.replace(/href=\"\/assets\//g, 'href="assets/');

  // Ensure a base href so any remaining relative paths resolve.
  if (!/<base\s+href=/.test(html)) {
    html = html.replace(/<head>/, '<head>\n    <base href="./" />');
  }

  fs.writeFileSync(indexPath, html, 'utf8');
}

main();

