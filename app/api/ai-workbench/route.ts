const env = process.env;
import {catalog} from '@/lib/catalog.mjs';
import {extractIsnad} from '@/lib/isnad-extractor.mjs';
import {researchQuestion} from '@/lib/ai-research.mjs';
import {nextExercise} from '@/lib/ai-tutor.mjs';
import {guardedInput,privateJson,featureError} from '@/lib/api-guard.mjs';

export async function POST(request:Request){
  try {
    const parsed=await guardedInput(request);if('response' in parsed)return parsed.response;
    const input=parsed.input;
    if(!['extract','research','learn'].includes(input.action)||!['ar','en'].includes(input.locale)||(input.modelId!==undefined&&(typeof input.modelId!=='string'||input.modelId.length>60)))return privateJson({error:'INPUT'},400);
    const result=input.action==='extract'?await extractIsnad(input,env):input.action==='research'?await researchQuestion(catalog,input,env):await nextExercise(catalog,input,env);
    return privateJson(result);
  }catch(error){return featureError(error);}
}
