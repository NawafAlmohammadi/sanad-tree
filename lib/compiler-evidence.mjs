import {normalize} from './catalog.mjs';
import {names,compilers} from './language.mjs';
import {instructionAttempt} from './ai-safety.mjs';

// Query routing selects recorded compiler edges, never a historical list from memory.
export function compilerEvidence(data,question){
  if(typeof question!=='string'||question.length>500||instructionAttempt.test(question)||/weather|code|python|javascript|html|sql|password|secret|system|prompt|developer|ignore|override|طقس|برمج|برنامج|كود|تجاهل|فتوى/iu.test(question))return null;
  const q=normalize(question);
  if(!/شيوخ|مشايخ|حدث.*عن|روي.*عن|يروي.*عن|\b(?:teachers|narrat\w*.*from|heard.*from|transmit\w*.*from)/iu.test(q))return null;
  const compilerNames=[...new Set(data.hadiths.flatMap(h=>h.chains.map(c=>(c.compiler??h.compiler)?.name)).filter(Boolean))];
  const matched=compilerNames.filter(n=>[n,compilers[n],n.replace(/^الإمام\s+/u,''),...(n.includes('البخاري')?['البخاري','Bukhari','al-Bukhari']:[])].filter(Boolean).some(term=>q.includes(normalize(term))));
  if(matched.length!==1)return null;
  const selected=matched[0],records=[];
  for(const h of data.hadiths){
    const edges=h.chains.filter(c=>{const compiler=c.compiler??h.compiler;return compiler?.name===selected&&compiler.sourceIds?.length&&compiler.sourceIds.every(id=>data.sources.some(s=>s.id===id))&&data.narrators.some(n=>n.id===c.nodes[0]);});
    if(!edges.length)continue;
    const facts=edges.map(c=>{const compiler=c.compiler??h.compiler,n=data.narrators.find(n=>n.id===c.nodes[0]);return {id:`${h.id}/compiler-${c.id}`,text:`في الإسناد المسجل: ${compiler.name} يروي عن ${n.name}؛ صيغة النقل: ${compiler.wording}.`,displayEn:`In the recorded chain, ${compilers[compiler.name]||compiler.name} narrates FROM ${names[n.id]||n.name}. Recorded wording: ${compiler.wording}.`,narratorIds:[n.id],sourceIds:compiler.sourceIds};});
    records.push({id:`report-${h.id}`,label:h.title,hadithIds:[h.id],facts});
  }
  if(!records.length)return null;
  return {records,scope:'These are only direct compiler-to-narrator edges in this library. State this scope explicitly. Do not claim a complete list of the compiler’s historical teachers. Do not infer grades or hearing beyond the recorded wording.'};
}
