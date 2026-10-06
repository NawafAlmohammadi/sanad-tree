import {aiError} from './ai-safety.mjs';
import {approvedReferenceUrl} from './reference-policy.mjs';
export const MCP_ENDPOINT='https://mcp.islamiccontent.org/mcp';
export function referenceSearchQuery(value){
 const quote=String(value).match(/[«“"]([^»”"]{4,500})[»”"]/u);
 if(quote)return quote[1].trim();
 const q=String(value).replace(/^(?:ابحث(?:\s+في\s+المراجع\s+المعتمدة)?\s+عن\s+|اشرح\s+(?:لي\s+)?(?:حديث\s+)?|شرح\s+حديث\s+|search\s+(?:the\s+approved\s+references\s+)?for\s+|explain\s+(?:the\s+hadith\s+)?)/iu,'').replace(/\s+(?:من|في)\s+المراجع\s+المعتمدة\s*$/u,'').trim();
 return q.length>=4?q:String(value);
}
export async function boundedText(response,limit=600000){
 if(!response.body)throw aiError('SOURCE_UNAVAILABLE');const reader=response.body.getReader(),parts=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw aiError('SOURCE_UNAVAILABLE');}parts.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.length;}return new TextDecoder().decode(bytes);
}
async function request(url,init,fetcher){let r;try{r=await fetcher(url,{...init,redirect:'manual',signal:AbortSignal.timeout(12000)});}catch{throw aiError('SOURCE_UNAVAILABLE');}if(!r.ok)throw aiError('SOURCE_UNAVAILABLE');return r;}
export async function contentTool(name,args,fetcher=fetch){
 if(!['search','fetch','get_hadith'].includes(name))throw aiError('INPUT');
 const id='sanad-'+name;
 const r=await request(MCP_ENDPOINT,{method:'POST',headers:{'content-type':'application/json',accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id,method:'tools/call',params:{name,arguments:args}})},fetcher);
 const text=await boundedText(r);let envelope;
 try{if(r.headers.get('content-type')?.includes('text/event-stream')){const events=text.split(/\r?\n\r?\n/).map(e=>e.split(/\r?\n/).filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trim()).join('\n')).filter(Boolean).map(JSON.parse);envelope=events.find(e=>e.id===id);}else envelope=JSON.parse(text);}catch{throw aiError('SOURCE_UNAVAILABLE');}
 if(envelope?.id!==id||envelope.jsonrpc!=='2.0'||envelope.error||envelope.result?.isError)throw aiError('SOURCE_UNAVAILABLE');
 const result=envelope.result;let structured=result?.structuredContent;
 if(!structured){try{structured=JSON.parse(result.content.find(c=>c.type==='text').text);}catch{throw aiError('SOURCE_UNAVAILABLE');}}
 if(!structured||typeof structured!=='object')throw aiError('SOURCE_UNAVAILABLE');return structured;
}
export async function searchApprovedContent(query,locale='ar',fetcher=fetch){
 if(typeof query!=='string'||query.trim().length<4||query.length>500)throw aiError('INPUT');
 const result=await contentTool('search',{query:referenceSearchQuery(query),sources:['hadith'],language:locale==='en'?'en':'ar',limit:6},fetcher);
 if(!Array.isArray(result.results))throw aiError('SOURCE_UNAVAILABLE');
 const rows=result.results.filter(r=>(typeof r.id==='string'||typeof r.id==='number')&&typeof r.title==='string'&&approvedReferenceUrl(r.url)).slice(0,4),records=[];
 for(const row of rows){
  const r=await contentTool('fetch',{id:row.id},fetcher);
  if(String(r.id)!==String(row.id)||r.url!==row.url||!approvedReferenceUrl(r.url)||typeof r.text!=='string'||r.text.length<20||r.text.length>30000)continue;
  let text=r.text,grade,attribution;
  const hadith=new URL(r.url).pathname.match(/^\/(ar|en)\/browse\/hadith\/(\d+)$/);
  if(new URL(r.url).hostname==='hadeethenc.com'&&hadith){
   const metadata=r.metadata;
   const original=String(metadata?.hadith_id)===hadith[2]&&metadata?.language===hadith[1]&&metadata?.grade&&metadata?.attribution?metadata:await publishedHadith(hadith[2],hadith[1],fetcher);
   if(typeof original.grade!=='string'||!original.grade.trim()||typeof original.attribution!=='string'||!original.attribution.trim())continue;
   grade=original.grade;attribution=original.attribution;
   text+='\n'+(hadith[1]==='en'?'Publisher grade: ':'حكم الناشر: ')+grade+'\n'+(hadith[1]==='en'?'Publisher attribution: ':'تخريج الناشر: ')+attribution;
  }
  records.push({id:'external-'+records.length,title:r.title||row.title,url:r.url,text,grade,attribution,provider:'islamiccontent',retrievedAt:new Date().toISOString()});
 }
 return records;
}
export async function publishedHadith(id,locale='ar',fetcher=fetch){
 if(!/^\d{1,9}$/.test(String(id)))throw aiError('INPUT');const r=await request('https://hadeethenc.com/api/v1/hadeeths/one/?language='+(locale==='en'?'en':'ar')+'&id='+id,{headers:{accept:'application/json'}},fetcher);
 let row;try{row=JSON.parse(await boundedText(r));}catch{throw aiError('SOURCE_UNAVAILABLE');}
 if(String(row.id)!==String(id)||typeof row.hadeeth!=='string'||row.hadeeth.length<20)throw aiError('SOURCE_UNAVAILABLE');return row;
}
export async function dorarSearch(query,fetcher=fetch){
 if(typeof query!=='string'||query.trim().length<4||query.length>500)throw aiError('INPUT');
 const r=await request('https://dorar.net/dorar_api.json?skey='+encodeURIComponent(query),{headers:{accept:'application/json'}},fetcher);
 let row;try{row=JSON.parse(await boundedText(r));}catch{throw aiError('SOURCE_UNAVAILABLE');}
 if(!row.ahadith||typeof row.ahadith!=='object')throw aiError('SOURCE_UNAVAILABLE');return row;
}
