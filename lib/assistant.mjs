import { retrieve, renderSelection, REFUSAL } from './grounding.mjs';
import { modelConfig, selectFacts } from './providers.mjs';
export async function answerQuestion(data,input,env={},fetcher=fetch) {
  const refused=()=>({status:'refused',answer:REFUSAL,sources:[],claims:[],engine:'none'});
  const evidence=retrieve(data,input);if(!evidence)return refused();
  if(evidence.clarification)return {status:'clarification',answer:evidence.answer,sources:[],claims:[],engine:'none'};
  const id=input.modelId || 'local';let selection={refuse:false,factIds:evidence.facts.map(f=>f.id)};
  if(id!=='local') {
    let model;try {model=modelConfig(env).find(m=>m.id===id);}catch{return {status:'unavailable',answer:'إعدادات المساعد غير متاحة. اختر الإجابة من المصادر.',sources:[],claims:[],engine:'none'};}
    if(!model || !env[model.keyEnv])return {status:'unavailable',answer:'هذا النموذج غير مفعّل. اختر الإجابة من المصادر.',sources:[],claims:[],engine:'none'};
    try {selection=await selectFacts(model,env,input.question,evidence.facts,fetcher);}catch(error){
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
  const rendered=renderSelection(data,evidence,selection);return rendered?{...rendered,status:'answered',engine:id==='local'?'local':'model'}:refused();
}
