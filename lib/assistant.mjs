import {compilerEvidence} from './compiler-evidence.mjs';
import {researchQuestion} from './ai-research.mjs';
import { retrieve, renderSelection, REFUSAL,scopeToGraph } from './grounding.mjs';
import { modelConfig, selectFacts } from './providers.mjs';
import { canonicalQuestion } from './language.mjs';
import {teachingEvidence,teachingCards,renderTeaching} from './teaching.mjs';
import {claimText} from './reviewed-language.mjs';
import {generateGrounded,groundedContext} from './grounded-assistant.mjs';
import {answerUnified} from './unified-assistant.mjs';
export async function answerQuestion(data,input,env={},fetcher=fetch) {
  if(input.unified===true)return answerUnified(data,input,env,fetcher,answerScoped);
  return answerScoped(data,input,env,fetcher);
}
async function answerScoped(data,input,env={},fetcher=fetch) {
  const refused=()=>({status:'refused',answer:REFUSAL,sources:[],claims:[],engine:'none'});
  const modelId=input.modelId||'local';
  const compiler=compilerEvidence(data,input.question);
  if(compiler||(input.hadithId===undefined&&input.chainId===undefined&&modelId!=='local')){
    if(modelId==='local'){const claims=compiler.records.flatMap(r=>r.facts),ids=new Set(claims.flatMap(f=>f.sourceIds));return {status:'answered',engine:'local',answer:claims.map(f=>f.text).join('\n'),claims,sources:data.sources.filter(s=>ids.has(s.id))};}
    try{const result=await researchQuestion(data,input,env,fetcher);return {...result,claims:[...(result.warnings||[]).map(f=>({...f,id:'attribution-warning-'+f.id})),...result.claims],answer:result.blocks.map(b=>b.text).join('\n\n')};}
    catch(error){console.warn('Library research unavailable',{modelId,code:error.code||'SERVICE',stage:error.stage||null});return {status:'unavailable',engine:'none',answer:'تعذر إكمال طلب المساعد. أعد المحاولة أو اختر الإجابة من المصادر.',sources:[],claims:[]};}
  }
  if(modelId!=='local'){
    let model;try{model=modelConfig(env).find(m=>m.id===modelId);}catch{return {status:'unavailable',answer:'إعدادات المساعد غير متاحة. اختر الإجابة من المصادر.',sources:[],claims:[],engine:'none'};}
    if(model?.groundedGeneration){
      const context=groundedContext(data,input);if(!context)return refused();
      if(context.clarification)return {status:'clarification',answer:context.answer,sources:[],claims:[],engine:'none'};
      if(!env[model.keyEnv])return {status:'unavailable',answer:'هذا النموذج غير مفعّل. اختر الإجابة من المصادر.',sources:[],claims:[],engine:'none'};
      try{return await generateGrounded(data,input,model,env,fetcher);}catch(error){
        console.warn('Grounded assistant unavailable',{modelId:model.id,code:error.code||'INVALID_OUTPUT',httpStatus:error.providerStatus||null});
        if(['GROUNDING','SERVICE_BUSY'].includes(error.code)){
          if(context.legacy){
            const scoped=scopeToGraph(data,{...input,question:canonicalQuestion(data,input.question)},context.legacy);
            const direct=renderSelection(data,scoped,{refuse:false,factIds:scoped.facts.map(f=>f.id)});
            if(!direct)return refused();
            return {...direct,status:'answered',engine:'local',fallbackReason:error.code==='SERVICE_BUSY'?'service_busy':'verification',notice:error.code==='SERVICE_BUSY'?'خدمة الذكاء الاصطناعي مشغولة حاليًا؛ هذه إجابة مباشرة من بيانات المشروع ومصادره، دون استخدام النموذج.':'تعذر التحقق من شرح النموذج؛ المعروض أدلة المشروع الأصلية، دون صياغة مولّدة.'};
          }
          const target=context.narrator?.id;
          const facts=context.facts.filter(f=>f.id==='hadith-judgement'||(target?f.narratorIds.includes(target)&&!f.id.startsWith('path-'):f.id.startsWith('path-')||f.id.startsWith('note-'))).slice(0,12);
          const sourceIds=new Set(facts.flatMap(f=>f.sourceIds));
          return {status:'answered',engine:'local',answer:facts.map(f=>f.text).join('\n'),claims:facts,sources:data.sources.filter(s=>sourceIds.has(s.id)),fallbackReason:error.code==='SERVICE_BUSY'?'service_busy':'verification',notice:error.code==='SERVICE_BUSY'?'خدمة الذكاء الاصطناعي مشغولة حاليًا؛ هذه إجابة مباشرة من بيانات المشروع ومصادره، دون استخدام النموذج.':'تعذر التحقق من شرح النموذج؛ المعروض أدلة المشروع الأصلية، دون صياغة مولّدة.'};
        }
        return {status:'unavailable',answer:error.code==='RATE_LIMIT'?'بلغت الخدمة حد الاستخدام الحالي. انتظر قليلًا أو اختر الإجابة من المصادر.':error.code==='AUTH'?'تعذر توثيق الاتصال بالخدمة. يحتاج الفريق مراجعة مفتاح المساعد.':'تعذر التحقق من إجابة النموذج. يمكنك اختيار الإجابة من المصادر وإعادة المحاولة.',sources:[],claims:[],engine:'none'};
      }
    }
  }
  // A unified map can select a narrator belonging only to an additional path.
  if(input.allPaths&&input.narratorId){const h=data.hadiths.find(h=>h.id===input.hadithId),c=h?.chains.find(c=>c.nodes.includes(input.narratorId));if(c)input={...input,chainId:c.id};}
  const request={...input,question:canonicalQuestion(data,input.question)};
  const evidence=scopeToGraph(data,request,retrieve(data,request)||teachingEvidence(data,input));if(!evidence)return refused();
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
