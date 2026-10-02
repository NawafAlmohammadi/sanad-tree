// Optional maintenance task. Fonts and licences are bundled, not fetched at runtime.
import {readFile, writeFile} from 'node:fs/promises';
const directory=new URL('../public/fonts/',import.meta.url);
const response=await fetch('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap',{headers:{'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}});
if(!response.ok)throw Error('Could not fetch official English font styles');
let css=await response.text();
const urls=[...new Set([...css.matchAll(/https:\/\/fonts\.gstatic\.com\/[^)]+/g)].map(match=>match[0]))];
for(const [index,url] of urls.entries()){
 const font=await fetch(url);if(!font.ok)throw Error('Could not fetch font asset');
 const bytes=new Uint8Array(await font.arrayBuffer());
 const format=String.fromCharCode(...bytes.slice(0,4))==='wOF2'?'woff2':'ttf';
 const file=`english-${index}.${format}`;
 await writeFile(new URL(file,directory),bytes);css=css.replaceAll(url,`/fonts/${file}`);
}
await writeFile(new URL('english.css',directory),css);
for(const name of ['dmsans','cormorantgaramond']){
 const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${name}/OFL.txt`);
 if(!license.ok)throw Error('Missing official font licence');
 await writeFile(new URL(`${name}-OFL.txt`,directory),await license.text());
}
const base=await readFile(new URL('fonts.css',directory),'utf8');
const globals=new URL('../app/globals.css',import.meta.url);
const style=(await readFile(globals,'utf8')).slice((await readFile(globals,'utf8')).indexOf(':root{'));
await writeFile(globals,base+'\n'+css+'\n'+style);
console.log(`Bundled ${urls.length} English font assets and both OFL licences.`);
