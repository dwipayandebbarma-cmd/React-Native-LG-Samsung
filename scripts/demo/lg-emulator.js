const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..');
const distDir = path.join(projectRoot, 'dist');
const ipkPath = path.join(projectRoot, 'com.smarttv.app_1.0.0_all.ipk');
const appId = 'com.smarttv.app';
const device = process.env.WEBOS_DEVICE || 'emulator';
const webosVersion = process.env.WEBOS_TV_VERSION || '6.0';
const simulatorPath =
  process.env.WEBOS_SIMULATOR_PATH ||
  '/home/dwipayan/Desktop/TataPlayBinge/TV/Simulator/webOS_TV_6.0_Simulator_1.4.1';

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: projectRoot });
}

function main() {
  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ missing. Run `npm run build:tv` first.');
  }

  console.log('LG webOS demo');
  console.log('- Device:', device);
  console.log('- App ID:', appId);

  if (device === 'simulator') {
    const wrapperScript = path.join(projectRoot, 'scripts/webos/fix-simulator-wrapper.sh');
    if (fs.existsSync(wrapperScript)) {
      run(`bash "${wrapperScript}"`);
    }
    console.log('\nLaunching webOS TV Simulator with hosted app directory...');
    run(
      `ares-launch -s ${webosVersion} -sp "${simulatorPath}" "${distDir}"`
    );
    return;
  }

  if (!fs.existsSync(ipkPath)) {
    console.log('IPK not found, packaging...');
    run('ares-package -n ./dist');
  }

  console.log('\nInstalling on webOS device/emulator...');
  run(`ares-install --device ${device} "${ipkPath}"`);

  console.log('\nLaunching app...');
  run(`ares-launch --device ${device} ${appId}`);
}

main();
