import { normalize } from './catalog.mjs';
export const REFUSAL = 'نطاقي هو الأحاديث والرواة والمعلومات الموثقة الموجودة في المشروع فقط. لا أملك مرجعًا كافيًا للإجابة عن هذا الطلب.';
function narratorIntent(question,name) {
  const phrases={
    profile:[`من هو ${name}`,`من ${name}`,`ما معلومات ${name}`,`أعطني معلومات عن ${name}`,`حدثني عن ${name}`],
    bio:[`ما نبذة ${name}`,`أعطني نبذة عن ${name}`,`اعرض ترجمة ${name}`,`ما ترجمة ${name}`],
    relation:[`ما علاقة الراوي ${name} بهذا الحديث`,`ما علاقة ${name} بهذا الحديث`],
    incoming:[`من روى عن ${name}`],outgoing:[`عن من روى ${name}`],
    birth:[`متى ولد ${name}`,`ما تاريخ ولادة ${name}`],death:[`متى توفي ${name}`,`ما تاريخ وفاة ${name}`],
    classification:[`ما طبقة ${name}`],period:[`ما فترة ${name}`,`في أي عصر عاش ${name}`],kuniya:[`ما كنية ${name}`],
    reliability:[`ما حكم ${name}`,`هل ${name} ثقة`,`ما توثيق ${name}`]
  };
  return Object.entries(phrases).find(([,rows])=>rows.some(p=>normalize(p)===question))?.[0];
}
export function retrieve(data, input) {
  const h = data.hadiths.find(h=>h.id===input.hadithId);
  const c = h?.chains.find(c=>c.id===input.chainId);
  if (!h || !c) return null;
  const q=normalize(input.question);
  // Closed intents: added phrases must be reviewed and tested.
  if (!q || q.length>500) return null;
  let kind, target, intent;
  const exact = phrases=>phrases.map(normalize).includes(q);
  const term=(data.terms||[]).find(t=>[t.name,...t.aliases].some(name=>exact([`ما معنى ${name}`,`ما المقصود بـ${name}`,`عرف ${name}`,`اشرح مصطلح ${name}`])));
  if(term)return {kind:'term',facts:[{id:'term',text:term.definition,sourceIds:term.sourceIds}]};
  if (exact(['اشرح لي هذا السند','اشرح هذا السند','اشرح السند','من روى عن من','كيف تصل السلسلة إلى النبي','اعرض سلسلة الرواة','كم عدد الرواة في هذا السند'])) kind='chain';
  else if(exact(['اعرض متن الحديث','ما متن هذا الحديث','ما مصدر هذا الحديث','ما مصدر الحديث'])) kind='hadith';
  else if(exact(['ما حكم هذا الحديث','ما حكم هذا الإسناد','ما حكم الألباني على هذا الحديث'])) kind='judgement';
  else if(exact(['ما الاختلاف في هذا السند','ما ملاحظة هذا السند'])) kind='chain-note';
  else if((intent=narratorIntent(q,'هذا الراوي')) || exact(['من روى عنه','من هذا الراوي'])) {kind='narrator';target=input.narratorId;intent=intent||(q===normalize('من روى عنه')?'incoming':'profile');}
  else {
    // Search every stored identity before applying chain scope: an overlapping alias
    // must never silently select the first narrator or the currently selected card.
    const matches=data.narrators.map(n=>({n,intent:[n.name,...n.aliases].map(name=>narratorIntent(q,name)).find(Boolean)})).filter(m=>m.intent);
    if(matches.length>1)return {clarification:true,answer:'الاسم المذكور يطابق أكثر من راوٍ في بيانات المشروع. اذكر الاسم الكامل مع النسبة كما يظهر في بطاقة الراوي لتحديد المقصود.',facts:[]};
    if(matches.length===1){kind='narrator';target=matches[0].n.id;intent=matches[0].intent;}
  }
  if(!kind) return null;
  const facts=[];
  const add=(id,text,sourceIds)=>facts.push({id,text,sourceIds});
  // A model must select the grading notice along with every other fact. This
  // prevents a fabricated report from appearing as an established attribution.
  const result=extra=>{
    const grade=h.judgement?.grade;
    if(h.judgement?.hadithId===h.id && kind!=='judgement' &&
      (grade==='fabricated' || (grade==='weak' && kind==='hadith'))){
      facts.unshift({id:'attribution-warning',text:h.judgement.text,sourceIds:h.judgement.sourceIds});
    }
    return {facts,kind,...extra};
  };
  if(kind==='judgement') {if(!h.judgement || h.judgement.hadithId!==h.id)return null;add('hadith-judgement',h.judgement.text,h.judgement.sourceIds);}
  if(kind==='chain-note') {if(!c.note || c.note.chainId!==c.id)return null;add('chain-note',c.note.text,c.note.sourceIds);}
  if(kind==='hadith') {
    if(q.includes('مصدر')) add('hadith-source',`مصدر «${h.title}»: ${h.sourceIds.map(id=>data.sources.find(s=>s.id===id).reference).join('؛ ')}.`,h.sourceIds);
    else add('matn',h.matn,h.sourceIds);
  }
  if(kind==='chain') {
    if(q.includes('عدد')) add('count',`يضم المسار المعروض ${c.nodes.length} أسماء وفق ترتيب المصدر؛ العد يشمل جميع العقد المعروضة.`,c.sourceIds);
    else c.links.forEach((l,i)=>add(`edge-${i}`,`${data.narrators.find(n=>n.id===l.from).name} يروي عن ${data.narrators.find(n=>n.id===l.to).name}؛ الصيغة في المصدر: «${l.wording}».`,l.sourceIds));
  }
  if(kind==='narrator') {
    const n=data.narrators.find(n=>n.id===target && c.nodes.includes(n.id));
    if(!n) return null;
    const labels={bio:'التعريف',birth:'الولادة',death:'الوفاة',period:'الفترة',classification:'الطبقة',kuniya:'الكنية',reliability:'الحكم المسجل'};
    const profileFact=field=>{const value=n[field];if(!value || value.narratorId!==n.id)return false;add(`narrator-${n.id}-${field}`,`${labels[field]} — ${n.name}: ${value.text}`,value.sourceIds);return true;};
    if(intent==='reliability' && n.role?.narratorId===n.id) {add(`narrator-${n.id}-role`,`${n.name}: ${n.role.type==='prophet'?'النبي ﷺ؛ لا تعرض له أحكام الجرح والتعديل.':'صحابي؛ تعرض هذه الصفة مستقلة عن أحكام الجرح والتعديل.'}`,n.role.sourceIds);}
    else if(Object.hasOwn(labels,intent)) {if(!profileFact(intent))return null;}
    else if(intent==='incoming' || intent==='outgoing') {
      const incoming=intent==='incoming';
      c.links.forEach((l,i)=>{if(incoming?l.to===n.id:l.from===n.id)add(`edge-${i}`,`${data.narrators.find(n=>n.id===l.from).name} يروي عن ${data.narrators.find(n=>n.id===l.to).name}؛ الصيغة: «${l.wording}».`,l.sourceIds);});
    }
    else {
      add(`narrator-${n.id}-identity`,`الاسم كما هو مسجل: ${n.name}. موضعه في المسار المعروض: ${c.nodes.indexOf(n.id)+1} من ${c.nodes.length}.`,[...new Set([...n.sourceIds,...c.sourceIds])]);
      if(intent==='profile')Object.keys(labels).forEach(profileFact);
      if(intent==='relation')c.links.forEach((l,i)=>{if(l.from===n.id||l.to===n.id)add(`edge-${i}`,`${data.narrators.find(n=>n.id===l.from).name} يروي عن ${data.narrators.find(n=>n.id===l.to).name}؛ الصيغة: «${l.wording}».`,l.sourceIds);});
    }
    if(!facts.length)return null;
    return result({narrator:{id:n.id,name:n.name}});
  }
  if(!facts.length) return null;
  return result();
}
export function renderSelection(data, evidence, selection) {
  // The response never uses model prose. Arbitrary fact subsets fail closed.
  if (!selection || selection.refuse!==false || !Array.isArray(selection.factIds) || !selection.factIds.length || selection.factIds.length!==evidence.facts.length || new Set(selection.factIds).size!==selection.factIds.length || selection.factIds.some(id=>!evidence.facts.some(f=>f.id===id))) return null;
  if(evidence.facts.some(f=>!Array.isArray(f.sourceIds)||!f.sourceIds.length))return null;
  const sourceIds=[...new Set(evidence.facts.flatMap(f=>f.sourceIds))];
  if(sourceIds.some(id=>!data.sources.some(s=>s.id===id)))return null;
  return {answer:evidence.facts.map(f=>f.text).join('\n'), claims:evidence.facts, sources:data.sources.filter(s=>sourceIds.includes(s.id)),...(evidence.narrator?{narrator:evidence.narrator}:{})};
}
