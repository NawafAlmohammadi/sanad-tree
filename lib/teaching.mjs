import {normalize} from './catalog.mjs';
import {names,compilers} from './language.mjs';
import {reviewedText} from './reviewed-language.mjs';

const aliases={
 simple:['اشرح لي السند ببساطة','اشرح السند للمبتدئ','كيف أقرأ هذا السند','وضح لي هذا السند خطوة بخطوة','اشرح لي هذا السند بشكل مبسط','explain this chain simply','help me understand this chain','walk me through this chain'],
 concerns:['لماذا هذا الحديث ضعيف','لماذا هذا السند ضعيف','لماذا هذا الحديث موضوع','ما مواضع المراجعة في هذا السند','لماذا بعض الرواة باللون الأحمر','why is this report weak','why is this hadith weak','why is this report fabricated','which narrators need review'],
 paths:['قارن طرق هذا الحديث','ما الفرق بين طرق هذا الحديث','قارن أسانيد هذا الحديث','compare the paths of this hadith','compare these chains','how do the paths differ'],
 relate:['اشرح علاقة هذا الراوي بالسند','اشرح مكان هذا الراوي في السند','how does this narrator fit into the chain','explain this narrator’s role in the chain'],
 prophet:['ما أسماء النبي','ما أسماء النبي صلى الله عليه وسلم','متى ولد النبي','متى توفي النبي','كم كان عمر النبي عند وفاته','متى بعث النبي','حدثني عن النبي','أعطني معلومات موثقة عن النبي','what names of the prophet are recorded','when was the prophet born','how old was the prophet when he died','tell me about the prophet','when did the prophet receive his mission']
};
export function teachingKind(question){const q=normalize(question);return Object.entries(aliases).find(([,rows])=>rows.some(row=>normalize(row)===q))?.[0];}
export function teachingCards(data,input){
 const h=data.hadiths.find(h=>h.id===input.hadithId),c=h?.chains.find(c=>c.id===input.chainId);if(!h||!c)return [];
 const cards=[],add=(id,text,displayEn,sourceIds)=>cards.push({id,text,displayEn,sourceIds:[...new Set(sourceIds)]});
 const person=id=>data.narrators.find(n=>n.id===id),ar=id=>person(id).name,en=id=>names[id]||ar(id);
 if(c.nodes.length>1){
  const companion=c.nodes.find(id=>person(id).role?.type==='companion'),last=c.nodes.at(-1);
  add('lesson-overview',`تبدأ قراءة هذا الطريق من ${h.compiler?.name||ar(c.nodes[0])}، ثم ${ar(c.nodes[0])}، ويتتابع النقل حتى ${ar(last)}${companion?` عبر الصحابي ${ar(companion)}`:''}. الخريطة تتبع ترتيب الإسناد في الكتاب، وليست ترتيبًا زمنيًا لولادة الرواة.`, `Read this path from ${compilers[h.compiler?.name]||en(c.nodes[0])}, through ${en(c.nodes[0])}, to ${en(last)}${companion?` through the Companion ${en(companion)}`:''}. The map follows the source's chain order, not the narrators' birth dates.`,c.sourceIds);
  const first=c.links[0];
  add('lesson-direction',`لفهم اتجاه الخط: ${ar(first.from)} يروي عن ${ar(first.to)}. الاسم التالي هو من نُقل عنه، لا من أخذ عن الاسم السابق. طُبّق الاتجاه نفسه على بقية الروابط.`, `To read a link: ${en(first.from)} narrated from ${en(first.to)}. The next name is the person from whom the report was received. The same direction applies to the other links.`,first.sourceIds);
 }
 if(c.note?.chainId===c.id)add('lesson-path-note',`انتبه لهذا الطريق تحديدًا: ${c.note.text}`,`A detail specific to this path: ${reviewedText('notes',c.id,c.note.text)}`,c.note.sourceIds);
 const selected=person(input.narratorId);
 if(selected&&c.nodes.includes(selected.id)){
  const incoming=c.links.find(l=>l.to===selected.id),outgoing=c.links.find(l=>l.from===selected.id);
  if(incoming||outgoing)add('lesson-selected-relation',`${selected.name} يقع في الموضع ${c.nodes.indexOf(selected.id)+1}. ${outgoing?`ينقل في هذا الطريق عن ${ar(outgoing.to)}. `:''}${incoming?`والذي ينقل عنه هنا هو ${ar(incoming.from)}. `:''}هذه علاقات الطريق المعروض فقط؛ لا تحصر جميع شيوخه أو تلاميذه.`,`${en(selected.id)} is at position ${c.nodes.indexOf(selected.id)+1}. ${outgoing?`In this path, this narrator received the report from ${en(outgoing.to)}. `:''}${incoming?`The narrator who received it from them here is ${en(incoming.from)}. `:''}These are relationships in the displayed path, not a complete list of teachers or students.`,[...(incoming?.sourceIds||[]),...(outgoing?.sourceIds||[])]);
  for(const field of ['bio','reliability','birth','death'])if(selected[field]?.narratorId===selected.id)add(`lesson-selected-${field}`,`${selected.name}: ${selected[field].text}`,`${en(selected.id)}: ${reviewedText('profiles',selected.id,selected[field].text,field)}`,selected[field].sourceIds);
  for(const f of selected.knowledge||[])if(f.narratorId===selected.id)add(`lesson-selected-${f.id}`,`${selected.name}: ${f.text}`,`${en(selected.id)}: ${reviewedText('knowledge',f.id,f.text)}`,f.sourceIds);
 }
 if(h.judgement?.hadithId===h.id)add('lesson-grade',`الحكم الذي نرجع إليه هنا هو حكم المرجع على الرواية: ${h.judgement.text}`,`The recorded judgement on this report is: ${reviewedText('judgements',h.id,h.judgement.text)}`,h.judgement.sourceIds);
 for(const id of c.nodes){const n=person(id),r=n.reliability;if(r?.narratorId===id&&['review','untrusted'].includes(r.status))add(`lesson-concern-${id}`,`${n.name}: ${r.text} هذا قول مسجل في هذا الراوي؛ لا ينقل إلى الراوي الذي قبله أو بعده.`,`${en(id)}: ${reviewedText('profiles',id,r.text,'reliability')} This assessment belongs to this narrator, not to the preceding or following narrator.`,r.sourceIds);}
 if(h.chains.length>1){const all=h.chains,common=all[0].nodes.filter(id=>all.every(path=>path.nodes.includes(id))),different=all.map(path=>path.nodes.filter(id=>!common.includes(id)));
  add('lesson-compare-paths',`المسارات المسجلة لهذا الحديث: ${all.length}. الأسماء المشتركة: ${common.map(ar).join('، ')}. يختلف كل مسار في: ${different.map((ids,i)=>`المسار ${i+1}: ${ids.map(ar).join('، ')||'لا توجد أسماء مختلفة'}`).join('؛ ')}. لا تعني المقارنة أن راوياً في فرع يروي عن الراوي في الفرع الآخر.`, `This hadith has ${all.length} recorded paths. Shared names: ${common.map(en).join(', ')}. Differences: ${different.map((ids,i)=>`Path ${i+1}: ${ids.map(en).join(', ')||'no distinct names'}`).join('; ')}. Narrators in parallel branches are not placed after one another.`,all.flatMap(path=>path.sourceIds));
 }
 return cards.filter(f=>f.sourceIds.length&&f.sourceIds.every(id=>data.sources.some(s=>s.id===id))&&!f.displayEn?.includes('null'));
}
export function teachingEvidence(data,input){
 const kind=teachingKind(input.question);if(!kind)return null;
 const h=data.hadiths.find(h=>h.id===input.hadithId),c=h?.chains.find(c=>c.id===input.chainId);if(!h||!c)return null;
 if(kind==='prophet'){
  const n=data.narrators.find(n=>n.id==='messenger'&&c.nodes.includes(n.id));if(!n)return null;
  const q=normalize(input.question),field=/ولد|born/.test(q)?'birth':/توفي|وفاته|died/.test(q)?'death':null;
  let fields=field?[{id:field,...n[field]}]:/اسماء|names/.test(q)?n.knowledge?.filter(k=>k.id==='prophet-names'):/بعث|mission/.test(q)?n.knowledge?.filter(k=>k.id==='prophet-mission'):[{id:'bio',...n.bio},{id:'birth',...n.birth},{id:'death',...n.death},...(n.knowledge||[])];
  fields=fields?.filter(f=>f.narratorId===n.id&&f.text&&f.sourceIds?.length);if(!fields?.length)return null;
  const facts=fields.map(f=>({id:`narrator-${n.id}-${f.id}`,text:f.text,sourceIds:f.sourceIds}));
  if(h.judgement?.grade==='fabricated')facts.unshift({id:'attribution-warning',text:h.judgement.text,sourceIds:h.judgement.sourceIds});
  return {kind:'narrator',facts,narrator:{id:n.id,name:n.name}};
 }
 const cards=teachingCards(data,input),ids={simple:['lesson-overview','lesson-direction','lesson-path-note'],concerns:['lesson-grade',...cards.filter(f=>f.id.startsWith('lesson-concern-')).map(f=>f.id),'lesson-path-note'],paths:['lesson-compare-paths','lesson-path-note'],relate:['lesson-selected-relation','lesson-selected-bio']}[kind];
 const facts=ids.map(id=>cards.find(f=>f.id===id)).filter(Boolean);if(!facts.length)return null;
 if(h.judgement?.grade==='fabricated')facts.unshift({id:'attribution-warning',text:h.judgement.text,sourceIds:h.judgement.sourceIds});
 return {kind:'learning',facts};
}
export function renderTeaching(cards,selection){
 if(selection.lessonIds===undefined)return [];
 if(!Array.isArray(selection.lessonIds)||selection.lessonIds.length>6||new Set(selection.lessonIds).size!==selection.lessonIds.length||selection.lessonIds.some(id=>!cards.some(c=>c.id===id)))return null;
 // Keep original evidence in the response even when the model chooses a shorter teaching plan.
 return selection.lessonIds.map(id=>cards.find(c=>c.id===id));
}
