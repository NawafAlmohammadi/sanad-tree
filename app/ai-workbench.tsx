'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Sparkles,ScanText,GraduationCap,Check,Download,ShieldCheck,MessageCircle} from 'lucide-react';
import {useLanguage} from './language';
import SourceList from './source-list';
import SanadMap from './sanad-map';
import type {Data,Hadith} from '@/lib/catalog-types';

type Mode='ask'|'extract'|'learn';
type DraftNode={id:string;nameQuote:string;uncertain:boolean;start:number;end:number};
type DraftLink={from:string;to:string;quote:string;start:number;end:number};
type Extraction={status:string;engine?:string;providerError?:string;sourceText:string;data:Data;sourceUrl?:string;identityReview?:{reportUrl:string;profileUrl:string;mergedMentions:string[]};incompleteBranches?:number;draft?:{nodes:DraftNode[];paths:{nodeIds:string[];links:DraftLink[]}[];matn?:{quote:string}|null}};
type Exercise={id:string;kind:string;question:string;options:{id:string;label:string}[];answerId:string;explanation:string;sourceIds:string[];narratorIds:string[]};
type Attempt={id:string;chosenId:string};
type Model={id:string;label:string;ready:boolean};

export default function AIWorkbench({data,hadith,modelId,models,onModel,assistant,onTabChange}:{assistant:ReactNode;onTabChange:()=>void;data:Data;hadith?:Hadith;modelId:string;models:Model[];onModel:(id:string)=>void}){
  const {locale,t,title}=useLanguage(),say=(ar:string,en:string)=>locale==='en'?en:ar;
  const [mode,setMode]=useState<Mode>('ask'),[text,setText]=useState('');
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const [extraction,setExtraction]=useState<Extraction|null>(null),[draftNarrator,setDraftNarrator]=useState(''),[draftZoom,setDraftZoom]=useState(.8);
  const [exercise,setExercise]=useState<Exercise|null>(null),[attempts,setAttempts]=useState<Attempt[]>([]),[choice,setChoice]=useState('');
  const controller=useRef<AbortController|null>(null),revision=useRef(0);
  const ready=modelId!=='local'&&!!models.find(m=>m.id===modelId&&m.ready);
  useEffect(()=>{controller.current?.abort();revision.current++;setBusy(false);setError('');setExercise(null);setAttempts([]);setChoice('');setExtraction(null);},[locale]);
  useEffect(()=>{setExercise(null);setAttempts([]);setChoice('');if(mode==='learn'){controller.current?.abort();revision.current++;setBusy(false);setError('');}},[hadith?.id]);
  useEffect(()=>()=>{controller.current?.abort();},[]);
  function selectMode(next:Mode){controller.current?.abort();revision.current++;setBusy(false);setError('');onTabChange();setMode(next);}
  function message(code:string){
    if(code==='GROUNDING')return say('لم يجتز الناتج فحص الأدلة؛ لم نعرض نصًا أو خريطة غير موثقة. تعذر توثيق الإجابة بعد محاولة تصحيحها. أعد المحاولة أو راجع الأدلة الأصلية.','The result did not pass the evidence checks, so it was withheld. Verification still failed after a correction attempt. Retry or review the original evidence.');
    if(code==='SOURCE_AUTH')return say('رفضت واجهة Sunnah.com مفتاح المصدر. يحتاج الفريق تحديث مفتاح Sunnah.com؛ مفتاح Gemini لا يحل مكانه.','Sunnah.com rejected its source API key. The team needs to update the Sunnah.com key; a Gemini key cannot replace it.');
    if(code==='SOURCE_UNAVAILABLE')return say('تعذر الوصول إلى Sunnah.com حاليًا. تستطيع رسم الشجرة بلصق النص الكامل مع الإسناد؛ لا يكفي المتن وحده إذا تعذر جلب مصدره.','Sunnah.com could not be reached. Paste the full report with its chain to draw the tree; text alone needs an accessible source.');
    if(['RATE_LIMIT','SERVICE_BUSY','TIMEOUT','SERVICE','NETWORK'].includes(code))return say('خدمة النموذج مشغولة أو تعذر الاتصال بها. أعد المحاولة بعد قليل؛ لم يُستبدل الناتج بإجابة جاهزة.','The model is busy or could not be reached. Try again shortly; no preset answer has been substituted.');
    if(code==='AUTH')return say('رفضت خدمة النموذج بيانات الاتصال؛ يحتاج الفريق مراجعة إعدادات الخدمة.','The model service rejected the connection credentials. The team needs to check its configuration.');
    if(code==='UNAVAILABLE')return say('اختر نموذجًا خارجيًا مفعّلًا لتشغيل هذه المزايا.','Choose an enabled external model to use these features.');
    return say('تعذر معالجة الطلب. تحقق من النص المدخل وأعد المحاولة.','The request could not be processed. Check your input and try again.');
  }
  async function run(payload:Record<string,unknown>){
    if(busy||(!ready&&mode!=='extract'))return;
    controller.current=new AbortController();const turn=++revision.current;setBusy(true);setError('');
    if(mode==='extract'){setExtraction(null);setDraftNarrator('');}
    try {
      const response=await fetch('/api/ai-workbench',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...payload,action:mode,locale,modelId}),signal:controller.current.signal});
      const result=await response.json() as {status:string;error?:string;exercise?:Exercise}&Partial<Extraction>;if(turn!==revision.current)return;
      if(!response.ok)throw new Error(message(result.error||'SERVICE'));
      if(result.status==='refused'){setError(say('لم يجد النموذج أدلة كافية لهذا الطلب. لم نُكمل المعلومات بالتخمين.','The model could not find enough evidence for this request. Missing information has been left unresolved.'));return;}
      if(mode==='extract'&&['draft','recorded'].includes(result.status))setExtraction(result as Extraction);
      else if(result.status==='not_found'){setError(say('لم نعثر على إسناد مطابق في نتائج المصدر. ألصق نص الحديث بإسناده أو رابط صفحته في Sunnah.com.','No matching chain was found in the source results. Paste the full chain text or its Sunnah.com report URL.'));return;}
      else if(mode==='learn'&&result.status==='exercise'){setExercise(result.exercise||null);setChoice('');}
    }catch(e){if(turn===revision.current&&(e as Error).name!=='AbortError')setError((e as Error).message||message('SERVICE'));}
    finally{if(turn===revision.current)setBusy(false);}
  }
  const draftPerson=extraction?.data.narrators.find(n=>n.id===draftNarrator);
  const draftNode=draftPerson&&extraction?.draft?.nodes.find((n,i)=>draftPerson.id==='draft-person-'+(i+1));
  function example(){const h=hadith||data.hadiths[0],c=h.chains[0];setText((c.isnad||'')+'\n'+h.matn);setExtraction(null);}
  function exportDraft(){if(!extraction)return;const blob=new Blob([JSON.stringify({type:'unreviewed-isnad-draft',sourceText:extraction.sourceText,draft:extraction.draft,identityReview:extraction.identityReview,data:extraction.data},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='sanad-review-draft.json';a.click();URL.revokeObjectURL(url);}
  return <section id="ai-workbench" className="ai-workbench panel" aria-labelledby="ai-workbench-title">
    <div className="lab-heading"><div><span className="eyebrow"><Sparkles size={15}/>{say('ذكاء اصطناعي يستند إلى الأدلة','AI grounded in evidence')}</span><h2 id="ai-workbench-title">{say('من النص إلى الفهم','From text to understanding')}</h2><p>{say('مساعد واحد للبحث والشرح والمقارنة، مع أدلة وروابط إلى الشجرة.','One assistant to find evidence, explain and compare, with references and links to the map.')}</p></div><label className="lab-model">{say('النموذج','Model')}<select aria-label={say('نموذج أدوات الذكاء الاصطناعي','AI workbench model')} value={modelId} onChange={e=>{controller.current?.abort();revision.current++;setBusy(false);setError('');onTabChange();onModel(e.target.value);}}>{models.map(m=><option key={m.id} value={m.id} disabled={!m.ready}>{m.id==='local'?t('الإجابة من المصادر · دون نموذج خارجي'):m.label}</option>)}</select></label></div>
    <div className="lab-tabs" role="tablist" aria-label={say('مزايا الذكاء الاصطناعي','AI features')}>{([{id:'ask',icon:MessageCircle,ar:'مساعد سَنَد',en:'Sanad assistant'},{id:'extract',icon:ScanText,ar:'حديث إلى شجرة',en:'Hadith to tree'},{id:'learn',icon:GraduationCap,ar:'تدريب تفاعلي',en:'Adaptive practice'}] as const).map(({id,icon:Icon,ar,en})=><button id={'lab-tab-'+id} key={id} role="tab" aria-selected={mode===id} aria-controls={'lab-panel-'+id} onClick={()=>selectMode(id)}><Icon size={19}/>{say(ar,en)}</button>)}</div>
    <div className="lab-body" role="tabpanel" id={'lab-panel-'+mode} aria-labelledby={'lab-tab-'+mode}>
      {mode==='ask'&&assistant}
      {mode!=='ask'&&mode!=='extract'&&!ready&&<p className="lab-notice" role="note">{say('هذه الأدوات تحتاج نموذجًا خارجيًا مفعّلًا. اختره من القائمة أعلاه.','These tools require an enabled external model. Select one above.')}</p>}
      {mode==='extract'&&<>
        <form onSubmit={e=>{e.preventDefault();void run({text});}}><label htmlFor="isnad-input">{say('ألصق الحديث أو الإسناد أو رابط الحديث في Sunnah.com','Paste a hadith, its chain, or its Sunnah.com report URL')}</label><textarea id="isnad-input" dir="auto" maxLength={12000} value={text} onChange={e=>{setText(e.target.value);setExtraction(null);}} placeholder={say('متن الحديث، أو حدثنا … عن …، أو https://sunnah.com/bukhari:59','Hadith text, a full transmission chain, or https://sunnah.com/bukhari:59')} disabled={busy}/><div className="lab-form-actions"><button className="primary" type="submit" disabled={busy||text.trim().length<4}><ScanText size={17}/>{say('إنشاء الشجرة','Create tree')}</button><button className="lab-secondary" type="button" disabled={busy} onClick={example}>{say('تجربة نص من المكتبة','Try a library example')}</button><small>{ready?say('يحلل النموذج الإسناد من النص. المتن وحده يحتاج إلى جلب إسناده من المصدر. لا تُضاف النتائج إلى المكتبة تلقائيًا.','The model extracts the chain from your text. Text alone requires fetching its chain from the source. Results are not added to the library automatically.'):say('رسم مباشر لصيغ الإسناد الواضحة من النص، دون نموذج خارجي.','Direct extraction of explicit transmission formulas, without an external model.')}</small></div></form>
        {extraction&&<div className="extraction-review"><div className="lab-result-heading"><ShieldCheck size={19}/><h3>{extraction.status==='recorded'?say('شجرة الحديث من المكتبة الموثقة','Tree from the sourced library'):say('شجرة الإسناد المستخرجة','Extracted transmission tree')}</h3></div>
          <p>{extraction.status==='recorded'?say('عرضنا الطرق المسجلة ومراجعها.','Showing the recorded paths and their references.'):say('الأسماء والوصلات من النص نفسه؛ استخراج الإسناد لا يعني تصحيح الحديث أو الحكم على رواته.','Names and links come from the text. Extracting a chain does not authenticate the report or appraise its narrators.')}</p>
          {extraction.engine==='parser'&&<p className="lab-notice" role="note">{say('رسم مباشر من صيغ الرواية في النص، دون توليد بالذكاء الاصطناعي.'+(extraction.providerError==='AUTH'?' تعذر اتصال النموذج؛ يحتاج الفريق تحديث مفتاح Gemini.':''),'Direct extraction from explicit transmission formulas, without AI generation.'+(extraction.providerError==='AUTH'?' The model connection failed; the team needs to update the Gemini key.':''))}</p>}
          {!!extraction.incompleteBranches&&<p className="lab-notice">{say('يوجد فرع لا يصرّح النص باتصاله ببقية السند. أبقيناه منفصلًا حتى لا نخمن هوية ضمير أو وصلة.','A branch has no explicit connection to the rest of the chain. It remains separate rather than guessing an identity or link.')}</p>}
          {extraction.identityReview&&<p className="lab-notice">{say('وُصل الطريقان عند فليح: يربط Sunnah.com «فليح» و«أبي» بالراوي نفسه. الرمادي يعني أن حكم الراوي لم يُراجع، ولا يعني أنه ضعيف.','The paths join at Flayh: Sunnah.com links “Flayh” and “my father” to the same narrator. Grey means the narrator appraisal has not been reviewed; it does not mean weak.')}</p>}
          <SourceList data={extraction.data} ids={extraction.data.hadiths[0].sourceIds}/>
          <div className="draft-map"><SanadMap draft={extraction.status!=='recorded'} data={extraction.data} hadith={extraction.data.hadiths[0]} selected={draftNarrator} onSelect={setDraftNarrator} zoom={draftZoom} onZoom={setDraftZoom}/>{draftPerson&&<div className="draft-identity"><h3 dir="auto">{draftPerson.name}</h3><p>{draftPerson.bio?.sourceIds.includes('identity-review-profile')?draftPerson.bio.text:draftNode?.uncertain?say('هوية غير محسومة؛ تحتاج مراجعة المرجع.','Unresolved identity; check the source.'):draftPerson.bio?.text||say('اسم مستخرج من النص؛ لم تُطابق هويته بمراجع الرجال.','A name extracted from the text; its biographical identity is unverified.')}</p>{draftNode&&<blockquote dir="auto">{extraction.sourceText.slice(Math.max(0,draftNode.start-35),Math.min(extraction.sourceText.length,draftNode.end+50))}</blockquote>}</div>}</div>
          <details className="evidence-disclosure"><summary>{say('قراءة نص المصدر وأدلة الوصلات','Read the source text and link evidence')}</summary><blockquote dir="auto">{extraction.sourceText}</blockquote>{extraction.draft?.paths.map((p,i)=><div key={i}><h4>{say('الطريق '+(i+1),'Path '+(i+1))}</h4>{p.links.map((l,j)=><blockquote key={j} dir="auto">{l.quote}</blockquote>)}</div>)}</details>
          <button className="lab-secondary" type="button" onClick={exportDraft}><Download size={16}/>{say('تنزيل الشجرة وبيانات المصدر','Download tree and source data')}</button>
        </div>}
      </>}
      {mode==='learn'&&<>
        <p className="lab-scope">{hadith?say(`تدرّب على سند «${title(hadith)}». يختار المساعد السؤال التالي من علاقات الخريطة، وفق إجاباتك.`,`Practise the chain of “${title(hadith)}”. The assistant selects the next exercise from recorded relationships, based on your answers.`):say('اختر حديثًا من المكتبة لبدء التدريب.','Select a hadith from the library to start practising.')}</p>
        {!exercise&&<button className="primary" disabled={busy||!ready||!hadith} onClick={()=>void run({hadithId:hadith?.id,history:attempts})}><GraduationCap size={18}/>{say('ابدأ التدريب','Start practice')}</button>}
        {exercise&&<div className="quiz-card"><span className="eyebrow">{say('سؤال في قراءة الإسناد','A question about reading the chain')}</span><h3>{exercise.question}</h3><div className="quiz-options">{exercise.options.map(o=><button key={o.id} disabled={!!choice||busy} className={choice?(o.id===exercise.answerId?'correct':o.id===choice?'incorrect':''):''} onClick={()=>{setChoice(o.id);setAttempts(old=>[...old.slice(-7),{id:exercise.id,chosenId:o.id}]);}}>{o.label}{choice&&o.id===exercise.answerId&&<Check size={17}/>}</button>)}</div>{choice&&<div className="quiz-feedback" role="status"><strong>{choice===exercise.answerId?say('إجابة صحيحة','Correct'):say('راجع اتجاه الوصلة','Check the direction of the link')}</strong><p>{exercise.explanation}</p><SourceList data={data} ids={exercise.sourceIds}/><button className="primary" disabled={busy||!ready} onClick={()=>void run({hadithId:hadith?.id,history:attempts})}>{say('السؤال التالي حسب إجابتي','Next exercise based on my answer')}</button></div>}</div>}
      </>}
      {busy&&<div className="lab-progress" role="status"><span className="lab-spinner" aria-hidden="true"/><div><strong>{mode==='extract'?say('استخراج السند وفحص المقاطع…','Extracting the chain and checking passages…'):say('اختيار التدريب والتحقق من شرحه…','Selecting an exercise and checking its explanation…')}</strong><small>{say('ننتظر ناتج النموذج والتحقق؛ لا نعرض ناتجًا جزئيًا.','Waiting for generation and verification; partial results are withheld.')}</small></div><button onClick={()=>{controller.current?.abort();revision.current++;setBusy(false);}}>{say('إلغاء','Cancel')}</button></div>}
      {error&&<p className="error" role="alert">{error}</p>}
    </div>
  </section>;
}
