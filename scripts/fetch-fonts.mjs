// Fetch only font assets and their licences from official Google Fonts sources.
// Optional maintenance script: the checked-in files are used at runtime.
import {mkdir,writeFile} from 'node:fs/promises';
const directory=new URL('../public/fonts/',import.meta.url);await mkdir(directory,{recursive:true});
const cssUrl='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap';
const response=await fetch(cssUrl,{headers:{'user-agent':'Mozilla/5.0 Chrome/120.0.0.0'}});if(!response.ok)throw Error('Could not fetch font CSS');
let css=await response.text();const urls=[...new Set([...css.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)]+/g)].map(m=>m[0]))];
for(const [i,url] of urls.entries()){const font=await fetch(url);if(!font.ok)throw Error('Could not fetch font');const file=`font-${i}.woff2`;await writeFile(new URL(file,directory),new Uint8Array(await font.arrayBuffer()));css=css.replaceAll(url,`/fonts/${file}`);}
await writeFile(new URL('fonts.css',directory),css);
for(const name of ['ibmplexsansarabic','notonaskharabic','sourcesans3']){const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${name}/OFL.txt`);if(!license.ok)throw Error(`Missing licence: ${name}`);await writeFile(new URL(`${name}-OFL.txt`,directory),await license.text());}
console.log(`Saved ${urls.length} official font assets and three licences.`);
