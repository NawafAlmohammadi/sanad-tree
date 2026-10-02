import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
export const root=fileURLToPath(new URL('../',import.meta.url));
export function loadApiConfig(){
  const preferred=new URL('../API.env',import.meta.url);
  const standard=new URL('../.env',import.meta.url);
  const file=fs.existsSync(preferred)?preferred:fs.existsSync(standard)?standard:null;
  if(file)process.loadEnvFile(fileURLToPath(file));
}
