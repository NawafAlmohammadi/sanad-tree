import { publicModels } from '@/lib/providers.mjs';
const env = process.env;
export async function GET(){try{return Response.json({models:publicModels(env)},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({models:[{id:'local',label:'الإجابة من المصادر · دون نموذج خارجي',ready:true}]},{headers:{'Cache-Control':'no-store'}});}}
