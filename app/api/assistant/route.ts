import { catalog } from '@/lib/catalog.mjs';
import { answerQuestion } from '@/lib/assistant.mjs';
const env = process.env;
const buckets = new Map<string,{count:number,expires:number}>();
export async function POST(request:Request) {
  const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
  const origin=request.headers.get('origin');if(origin && origin!==new URL(request.url).origin)return json({error:'طلب غير مسموح'},403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'صيغة الطلب غير صحيحة'},415);
  const now=Date.now();for(const [k,v] of buckets)if(v.expires<now)buckets.delete(k);
  const ip=request.headers.get('cf-connecting-ip') || 'local';const bucket=buckets.get(ip) || {count:0,expires:now+60000};
  if(bucket.count>=20 || buckets.size>5000)return json({error:'انتظر قليلًا قبل إرسال سؤال آخر'},429);
  bucket.count++;buckets.set(ip,bucket);
  try {
    const reader=request.body?.getReader();if(!reader)return json({error:'الطلب فارغ'},400);
    let size=0;const parts:Uint8Array[]=[];
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();return json({error:'الطلب طويل جدًا'},413);}parts.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.length;}
    const input=JSON.parse(new TextDecoder().decode(bytes));
    if(!input || typeof input.question!=='string'||input.question.length<1||input.question.length>500||(input.hadithId!==undefined&&typeof input.hadithId!=='string')||(input.chainId!==undefined&&typeof input.chainId!=='string')||((input.hadithId===undefined)!==(input.chainId===undefined))||(input.narratorId!==undefined&&typeof input.narratorId!=='string')||(input.modelId!==undefined&&typeof input.modelId!=='string')||(input.locale!==undefined&&!['ar','en'].includes(input.locale)))return json({error:'تحقق من السؤال والحديث المختار'},400);
    if(input.history!==undefined&&(!Array.isArray(input.history)||input.history.length>3||input.history.some((q:unknown)=>typeof q!=='string'||q.length>500)))return json({error:'تحقق من السؤال والحديث المختار'},400);
    if(input.allPaths!==undefined&&typeof input.allPaths!=='boolean')return json({error:'تحقق من السؤال والحديث المختار'},400);
    if(input.unified!==undefined&&typeof input.unified!=='boolean')return json({error:'تحقق من السؤال والحديث المختار'},400);
    return json(await answerQuestion(catalog,input,env));
  } catch { return json({error:'تعذر معالجة السؤال. أعد المحاولة.'},400); }
}
