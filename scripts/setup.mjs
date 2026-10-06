import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {root} from './env.mjs';
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<13))throw Error('Install Node.js 22.13+ first.');
const target=new URL('../API.env',import.meta.url);
if(!fs.existsSync(target)){
  fs.copyFileSync(new URL('../API.env.example',import.meta.url),target,fs.constants.COPYFILE_EXCL);
  console.log('Created API.env. Add a valid provider API key before using AI features.');
}else console.log('Kept your existing API.env unchanged.');
console.log('Project directory:',root);
console.log('Install dependencies once: npm ci');
console.log('Required for AI: configure AI_KEY_GEMINI or another supported provider key in API.env.');
console.log('Then run: npm run dev');
