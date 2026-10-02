const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE = 'C:\\Users\\youss\\AppData\\Local\\Temp\\chrome_cdp_profile';
const BRAIN_DIR = 'C:\\Users\\youss\\.gemini\\antigravity\\brain\\44295bec-7c80-4bb0-87bb-b3f2f894b26b';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Launching Chrome...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9333',
    `--user-data-dir=${TEMP_PROFILE}`,
    '--window-size=1920,1080',
    '--hide-scrollbars',
    '--disable-gpu',
    'about:blank'
  ]);

  await sleep(2000);

  let wsUrl = null;
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9333/json');
      const tabs = await res.json();
      if (tabs.length && tabs[0].webSocketDebuggerUrl) {
        wsUrl = tabs[0].webSocketDebuggerUrl;
        break;
      }
    } catch (e) {
      await sleep(500);
    }
  }

  if (!wsUrl) {
    console.error('Failed to get WebSocket debugger URL');
    chrome.kill();
    process.exit(1);
  }

  console.log('Connecting CDP WebSocket:', wsUrl);
  const ws = new WebSocket(wsUrl);

  let msgId = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data.result);
      callbacks.delete(data.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to http://localhost:8899/index.html...');
  await send('Page.navigate', { url: 'http://localhost:8899/index.html' });

  // Wait for 3D model and loader to finish
  console.log('Waiting for loader to complete...');
  for (let i = 0; i < 20; i++) {
    const evalRes = await send('Runtime.evaluate', {
      expression: 'document.getElementById("loader") && document.getElementById("loader").classList.contains("loaded")'
    });
    if (evalRes && evalRes.result && evalRes.result.value === true) {
      console.log('Loader complete!');
      break;
    }
    await sleep(500);
  }
  await sleep(1500);

  // Take screenshot 1: Hero View
  console.log('Capturing Hero view...');
  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  const heroPath = path.join(BRAIN_DIR, 'hero_view_verified.png');
  fs.writeFileSync(heroPath, Buffer.from(heroShot.data, 'base64'));
  console.log('Hero screenshot saved to:', heroPath);

  // Navigate to Laptop Screen Tab 2 (Documentations)
  console.log('Switching to Tab 2 (Documentations)...');
  await send('Runtime.evaluate', {
    expression: 'window.setActiveTab(2); window.glideToScreen();'
  });
  await sleep(1800);

  // Take screenshot 2: Screen Tab 2
  console.log('Capturing Laptop Screen Tab 2...');
  const tab2Shot = await send('Page.captureScreenshot', { format: 'png' });
  const tab2Path = path.join(BRAIN_DIR, 'screen_tab2_verified.png');
  fs.writeFileSync(tab2Path, Buffer.from(tab2Shot.data, 'base64'));
  console.log('Tab 2 screenshot saved to:', tab2Path);

  ws.close();
  chrome.kill();
  console.log('Done!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
