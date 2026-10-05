import english from '../data/english.json' with {type:'json'};
import {names,titles,wordings} from './language.mjs';
import {englishMatnClaim} from './hadith-english.mjs';
export function reviewedText(section,id,original,field){
  const entry=field?english[section]?.[id]?.[field]:english[section]?.[id];
  return entry?.original===original?entry.text:null;
}
export function sourceLabel(source,locale='ar'){
  return locale==='en'?(english.sources[source.id]||{title:source.title,reference:source.reference}):source;
}
export function claimText(f,h,c,data,locale='ar'){
  if(locale!=='en')return f.text;
  if(f.displayEn)return f.displayEn;
  if(f.id==='matn')return englishMatnClaim(h);
  if(['hadith-judgement','attribution-warning'].includes(f.id))return reviewedText('judgements',h.id,h.judgement.text);
  if(f.id==='chain-note')return reviewedText('notes',c.id,c.note?.text);
  if(f.id==='hadith-source')return `Source of “${titles[h.id]}”: ${h.sourceIds.map(id=>sourceLabel(data.sources.find(s=>s.id===id),'en').reference).join('; ')}.`;
  if(f.id==='count')return `This path contains ${c.nodes.length} names, in the order recorded in the source.`;
  if(f.id==='term'){const term=data.terms?.find(t=>t.definition===f.text);return term&&reviewedText('terms',term.id,term.definition);}
  if(f.id.startsWith('edge-')){const l=c.links[Number(f.id.slice(5))];return l?`${names[l.from]} narrated from ${names[l.to]}. Recorded wording: “${wordings[l.wording]}”.`:null;}
  const n=data.narrators.filter(n=>f.id.startsWith(`narrator-${n.id}-`)).sort((a,b)=>b.id.length-a.id.length)[0];
  if(!n)return null;
  const field=f.id.slice(`narrator-${n.id}-`.length);
  if(field==='identity')return `${names[n.id]} — position ${c.nodes.indexOf(n.id)+1} of ${c.nodes.length} in this path.`;
  if(field==='role')return n.role?.type==='prophet'?`${names[n.id]}: the Prophet ﷺ. Narrator criticism does not apply.`:`${names[n.id]}: a Companion. This role is separate from individual narrator ratings.`;
  if(n[field])return reviewedText('profiles',n.id,n[field].text,field);
  const knowledge=n.knowledge?.find(k=>k.id===field);return knowledge?reviewedText('knowledge',knowledge.id,knowledge.text):null;
}
