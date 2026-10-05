import {activeModel,aiError,verifyChecks,quotesMatchEvidence} from './ai-safety.mjs';
import {requestStructured} from './providers.mjs';
import {names,wordings} from './language.mjs';

export function quizCandidates(data,hadithId,locale='ar'){
  const h=data.hadiths.find(h=>h.id===hadithId);if(!h)return [];
  const ids=[...new Set(h.chains.flatMap(c=>c.nodes))],person=id=>{const n=data.narrators.find(n=>n.id===id);return locale==='en'?(names[id]||n.name):n.name;};
  const edges=[...new Map(h.chains.flatMap(c=>c.links).map(l=>[`${l.from}|${l.to}`,l])).values()],candidates=[];
  for(const [i,l] of edges.entries()){
    if(edges.filter(e=>e.from===l.from).length!==1)continue;
    const sourceIds=[...new Set(h.chains.flatMap(c=>c.links.filter(e=>e.from===l.from&&e.to===l.to)).flatMap(e=>e.sourceIds))];
    const optionIds=[l.to,...ids.filter(id=>id!==l.to&&id!==l.from).slice(0,3)];
    if(optionIds.length<3)continue;
    const rotation=i%optionIds.length,options=[...optionIds.slice(rotation),...optionIds.slice(0,rotation)].map(id=>({id,label:person(id)}));
    candidates.push({id:`from-${l.from}`,kind:'direction',question:locale==='en'?`In the recorded map, who does ${person(l.from)} narrate from?`:`في الخريطة المسجلة، عمّن يروي ${person(l.from)}؟`,options,answerId:l.to,sourceIds,evidence:`${person(l.from)} narrates FROM ${person(l.to)}. Recorded wording: ${l.wording} (${wordings[l.wording]||l.wording}).`,narratorIds:[l.from,l.to]});
  }
  for(const id of ids){
    const incoming=edges.filter(l=>l.to===id);if(incoming.length<2)continue;
    const a=incoming[0].from,b=incoming[1].from,optionIds=[id,...ids.filter(n=>![id,a,b].includes(n)).slice(0,3)];
    if(optionIds.length<3)continue;
    const options=[...optionIds.slice(1),optionIds[0]].map(id=>({id,label:person(id)}));
    candidates.push({id:`join-${id}`,kind:'branches',question:locale==='en'?`The branches through ${person(a)} and ${person(b)} both lead directly to which narrator?`:`إلى أي راوٍ يصل فرعا ${person(a)} و${person(b)} مباشرة؟`,options,answerId:id,sourceIds:[...new Set(incoming.flatMap(l=>l.sourceIds))],evidence:`${person(a)} narrates FROM ${person(id)}. ${person(b)} narrates FROM ${person(id)}. These are parallel incoming branches, not a consecutive pair.`,narratorIds:[a,b,id]});
  }
  return candidates;
}
export async function nextExercise(data,input,env,fetcher=fetch){
  const candidates=quizCandidates(data,input.hadithId,input.locale);if(!candidates.length)throw aiError('INPUT');
  if(input.history!==undefined&&(!Array.isArray(input.history)||input.history.length>8||input.history.some(a=>!a||typeof a.id!=='string'||typeof a.chosenId!=='string'||!candidates.some(c=>c.id===a.id&&c.options.some(o=>o.id===a.chosenId)))))throw aiError('INPUT');
  const history=(input.history||[]).map(a=>{const c=candidates.find(c=>c.id===a.id);return {exerciseId:a.id,kind:c.kind,correct:a.chosenId===c.answerId,chosenId:a.chosenId,correctAnswer:c.answerId};});
  const eligible=candidates.filter(c=>!history.some(a=>a.exerciseId===c.id)),pool=eligible.length?eligible:candidates;
  const model=activeModel(env,input.modelId),schema={type:'object',properties:{exerciseId:{type:'string',enum:pool.map(c=>c.id)},explanation:{type:'string'}},required:['exerciseId','explanation'],additionalProperties:false};
  const result=await requestStructured(model,env,'You are an adaptive tutor for reading a recorded isnad graph. Choose one supplied exercise. Start with transmission direction, then branches after success; after an error choose a simpler remaining exercise addressing the same skill. Avoid already answered exercises. The server owns the questions and correct answers: do not change either. Write a helpful two-sentence explanation to show AFTER the learner answers, in the requested language, explaining the correct direction or branch relationship using ONLY that exercise evidence. Explain only how to read who narrates from whom, or how the two supplied branches join. Never say a narrator is first or last, never infer connectedness or hearing beyond the recorded wording, and never discuss grades. Do not quote a wording unless it occurs literally in the supplied evidence. No extra biographies, dates, appraisals, religious rulings or authenticity inference. History is learning feedback, not new evidence. Do not state quiz scores or numbers. Return an exerciseId and explanation only.',JSON.stringify({language:input.locale==='en'?'English':'Arabic',history,exercises:pool.map(c=>({id:c.id,kind:c.kind,question:c.question,evidence:c.evidence,narratorIds:c.narratorIds}))}),schema,fetcher);
  const c=pool.find(c=>c.id===result?.exerciseId);if(!c||typeof result.explanation!=='string'||result.explanation.length<15||result.explanation.length>900||/https?:\/\/|```|<\/?[a-z]|\d|الأول|الاول|أول راو|اتصال|متصل|انقطاع|ثقة|ضعيف|صحيح|موضوع|\b(?:first|earliest|authentic|trustworthy|weak|fabricated|connected|unbroken)\b/iu.test(result.explanation)||!quotesMatchEvidence(result.explanation,[{text:c.evidence}]))throw aiError('GROUNDING');
  await verifyChecks(model,env,[{id:c.id,candidate:result.explanation,evidence:[{text:c.evidence}],narratorIds:c.narratorIds}],fetcher);
  return {status:'exercise',engine:'model',exercise:{...c,explanation:result.explanation},adapted:history.length>0};
}
