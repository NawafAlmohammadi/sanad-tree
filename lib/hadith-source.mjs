import {catalog,normalize} from './catalog.mjs';
import {englishMatn,verifiedTitles} from './hadith-english.mjs';
import {aiError} from './ai-safety.mjs';
import {approvedReferenceUrl} from './reference-policy.mjs';
import {boundedText,searchApprovedContent,publishedHadith,dorarSearch} from './approved-content-api.mjs';
const books=new Set(['1681','1435','1198','8609','10906','8681']);
export function sourceUrl(value){try{const u=new URL(value);if(!approvedReferenceUrl(value)||u.search||u.hash)return null;
 const page=u.pathname.match(/^\/book\/(\d+)\/(\d+)$/);if(u.hostname==='shamela.ws'&&page&&books.has(page[1]))return u.href;
 if(u.hostname==='hadeethenc.com'&&/^\/(?:ar|en)\/browse\/hadith\/\d+$/.test(u.pathname))return u.href;
 if(u.hostname==='dorar.net'&&/^\/h\/[A-Za-z0-9]+$/.test(u.pathname))return u.href;
 return null;}catch{return null;}}
export function plainHtml(h){return h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
export function arabicPassage(html){const start=/<div\b[^>]*class=["'][^"']*\bnass\b[^"']*["'][^>]*>/i.exec(html);if(!start)return null;let depth=1,end=start.index+start[0].length;const tags=/<\/?div\b[^>]*>/gi;tags.lastIndex=end;let m;while((m=tags.exec(html))){depth+=m[0].startsWith('</')?-1:1;if(depth===0){end=m.index;break;}}if(depth!==0)return null;const text=plainHtml(html.slice(start.index+start[0].length,end));return text.length>=20&&text.length<=12000?text:null;}
export async function readSource(url,fetcher=fetch){if(!sourceUrl(url))throw aiError('INPUT');let r;try{r=await fetcher(url,{redirect:'manual',headers:{accept:'text/html'},signal:AbortSignal.timeout(12000)});}catch{throw aiError('SOURCE_UNAVAILABLE');}if(!r.ok)throw aiError('SOURCE_UNAVAILABLE');const h=await boundedText(r);if(/Just a moment|cf_chl_opt/i.test(h))throw aiError('SOURCE_UNAVAILABLE');return h;}
export async function readOfficialSource(url,_env={},fetcher=fetch){
 const accepted=sourceUrl(url);if(!accepted)throw aiError('SOURCE_UNAVAILABLE');const u=new URL(accepted);
 if(u.hostname==='shamela.ws'){const text=arabicPassage(await readSource(accepted,fetcher));return text?{url:accepted,text,provider:'shamela'}:null;}
 if(u.hostname==='hadeethenc.com'){const r=await publishedHadith(u.pathname.split('/').at(-1),'ar',fetcher);return{url:accepted,text:r.hadeeth,provider:'hadeethenc'};}
 return null;
}
export function libraryMatch(input){const q=normalize(input);if(q.length<4)return null;const matches=catalog.hadiths.filter(h=>[h.title,h.matn,verifiedTitles[h.id],englishMatn(h)].filter(Boolean).some(t=>normalize(t)===q||q.length>=14&&normalize(t).includes(q)));if(matches.length!==1)return null;const h=matches[0],people=new Set(h.chains.flatMap(c=>c.nodes));return {status:'recorded',engine:'source',sourceText:h.chains.map(c=>c.isnad||'').join('\n')+'\n'+h.matn,data:{hadiths:[h],narrators:catalog.narrators.filter(n=>people.has(n.id)),sources:catalog.sources}};}
const explicitChain=t=>/(?:حدثنا|حدثني|اخبرنا|اخبرني).{2,160}(?:حدثنا|حدثني|اخبرنا|اخبرني|عن)/u.test(normalize(t));
export async function findHadithSource(input,fetcher=fetch,_env={},_modelId){
 const direct=sourceUrl(input.trim());if(/^https?:/i.test(input.trim())&&!direct)throw aiError('INPUT');
 if(direct){const r=await readOfficialSource(direct,{},fetcher);return r&&explicitChain(r.text)?r:null;}
 const query=normalize(input);if(query.length<4||query.length>500)throw aiError('INPUT');
 // Search hits only locate records. A fetched original must match the supplied
 // text and contain an explicit chain. A translation cannot supply an isnad.
 let records;try{records=await searchApprovedContent(input,'ar',fetcher);}catch{
   const result=await dorarSearch(input,fetcher);records=Object.values(result.ahadith).filter(r=>r&&typeof r.th==='string').map(r=>({text:plainHtml(r.th),url:'https://dorar.net/hadith',provider:'dorar'}));
 }
 for(const r of records){if(!normalize(r.text).includes(query))continue;
   if(explicitChain(r.text))return{url:r.url,text:r.text,provider:r.provider};
   const url=sourceUrl(r.url);if(url&&new URL(url).hostname==='shamela.ws'){const p=await readOfficialSource(url,{},fetcher);if(p&&normalize(p.text).includes(query)&&explicitChain(p.text))return p;}
 }
 return null;
}
