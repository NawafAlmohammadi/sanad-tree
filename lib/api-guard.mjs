const buckets=new Map();
export const privateJson=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function guardedInput(request,limit=65536){
  const fail=(error,status)=>({response:privateJson({error},status)});
  const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return fail('ORIGIN',403);
  if(!request.headers.get('content-type')?.startsWith('application/json'))return fail('FORMAT',415);
  const now=Date.now();for(const [k,v] of buckets)if(v.expires<now)buckets.delete(k);
  const key=request.headers.get('cf-connecting-ip')||'local',bucket=buckets.get(key)||{count:0,expires:now+60000};
  if(bucket.count>=12||buckets.size>5000)return fail('RATE_LIMIT',429);bucket.count++;buckets.set(key,bucket);
  const reader=request.body?.getReader();if(!reader)return fail('INPUT',400);
  const parts=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();return fail('SIZE',413);}parts.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const p of parts){bytes.set(p,offset);offset+=p.length;}
  try {const input=JSON.parse(new TextDecoder().decode(bytes));if(!input||typeof input!=='object'||Array.isArray(input))return fail('INPUT',400);return {input};}catch{return fail('INPUT',400);}
}
export function featureError(error){
  const code=error?.code||'SERVICE';
  console.warn('AI feature unavailable',{code,stage:error?.stage||null,httpStatus:error?.providerStatus||null});
  return privateJson({status:code==='GROUNDING'?'unverified':'unavailable',error:code},code==='INPUT'?400:code==='GROUNDING'?422:code==='RATE_LIMIT'?429:503);
}
