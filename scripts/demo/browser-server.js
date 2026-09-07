const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '../..');
const distDir = path.join(projectRoot, 'dist');
const port = process.env.PORT || '8080';

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('dist/index.html not found. Run: npm run build');
  process.exit(1);
}

const lanIp = getLanIp();

console.log('\nSmart TV browser demo (Android TV equivalent)\n');
console.log('Desktop Chrome:');
console.log(`  http://localhost:${port}`);
if (lanIp) {
  console.log('\nAndroid TV / phone on same Wi-Fi:');
  console.log(`  http://${lanIp}:${port}`);
  console.log('  (Open in Chrome or the TV browser app)\n');
}
console.log('Android TV emulator browser:');
console.log(`  http://10.0.2.2:${port}\n`);
console.log('Desktop tips: F11 fullscreen, F12 → 1920x1080, arrow keys = D-pad\n');
console.log(`Serving ${distDir}\n`);

const server = spawn('python3', ['-m', 'http.server', port, '--directory', distDir], {
  stdio: 'inherit',
  cwd: projectRoot,
});

server.on('exit', (code) => process.exit(code ?? 0));
