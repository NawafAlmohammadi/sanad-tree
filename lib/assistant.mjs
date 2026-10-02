import { retrieve, renderSelection, REFUSAL } from './grounding.mjs';
import { modelConfig, selectFacts } from './providers.mjs';
import { canonicalQuestion } from './language.mjs';
import {teachingEvidence,teachingCards,renderTeaching} from './teaching.mjs';
import {claimText} from './reviewed-language.mjs';
export async function answerQuestion(data,input,env={},fetcher=fetch) {
  const refused=()=>({status:'refused',answer:REFUSAL,sources:[],claims:[],engine:'none'});
  const request={...input,question:canonicalQuestion(data,input.question)};
  const evidence=retrieve(data,request)||teachingEvidence(data,input);if(!evidence)return refused();
  if(evidence.clarification)return {status:'clarification',answer:evidence.answer,sources:[],claims:[],engine:'none'};
  const id=input.modelId || 'local';let selection={refuse:false,factIds:evidence.facts.map(f=>f.id)};
  const cards=teachingCards(data,{...input,narratorId:evidence.narrator?.id||input.narratorId}).filter(f=>evidence.kind==='narrator'?f.id==='lesson-selected-relation'?evidence.facts.some(e=>e.id.startsWith('edge-')):evidence.facts.some(e=>e.id===`narrator-${evidence.narrator?.id}-${f.id.slice('lesson-selected-'.length)}`):evidence.kind==='chain'?['lesson-overview','lesson-direction','lesson-path-note','lesson-grade'].includes(f.id):evidence.kind==='learning'?evidence.facts.some(e=>e.id===f.id):false);
  if(id!=='local') {
    let model;try {model=modelConfig(env).find(m=>m.id===id);}catch{return {status:'unavailable',answer:'إعدادات المساعد غير متاحة. اختر الإجابة من المصادر.',sources:[],claims:[],engine:'none'};}
    if(!model || !env[model.keyEnv])return {status:'unavailable',answer:'هذا النموذج غير مفعّل. اختر الإجابة من المصادر.',sources:[],claims:[],engine:'none'};
    try {selection=await selectFacts(model,env,input.question,evidence.facts,fetcher,cards);}catch(error){
      console.warn('Assistant provider unavailable',{modelId:model.id,code:error.code||'INVALID_OUTPUT',httpStatus:error.providerStatus||null,connectionReason:error.connectionReason||null});
      if(error.code==='SERVICE_BUSY') {
        // Render only retrieved catalog facts; never use an incomplete provider response.
        const rendered=renderSelection(data,evidence,{refuse:false,factIds:evidence.facts.map(f=>f.id)});
        return rendered?{...rendered,status:'answered',engine:'local',fallbackReason:'service_busy',notice:'خدمة الذكاء الاصطناعي مشغولة حاليًا؛ هذه إجابة مباشرة من بيانات المشروع ومصادره، دون استخدام النموذج.'}:refused();
      }
      const message=error.code==='RATE_LIMIT'?'بلغت الخدمة حد الاستخدام الحالي. انتظر قليلًا أو اختر الإجابة من المصادر.':error.code==='AUTH'?'تعذر توثيق الاتصال بالخدمة. يحتاج الفريق مراجعة مفتاح المساعد.':'تعذر التحقق من إجابة النموذج. يمكنك اختيار الإجابة من المصادر وإعادة المحاولة.';
      return {status:'unavailable',answer:message,sources:[],claims:[],engine:'none'};
    }
  }
  const rendered=renderSelection(data,evidence,selection);if(!rendered)return refused();
  const lessons=id==='local'?[]:renderTeaching(cards,selection,evidence);if(!lessons)return refused();
  const h=data.hadiths.find(h=>h.id===input.hadithId),c=h.chains.find(c=>c.id===input.chainId);
  return {...rendered,status:'answered',engine:id==='local'?'local':'model',...(lessons.length?{lessons}:{}),locale:input.locale==='en'?'en':'ar',...(input.locale==='en'?{displayClaims:rendered.claims.map(f=>({...f,text:claimText(f,h,c,data,'en')||f.text}))}:{})};
}
