import {normalize} from './catalog.mjs';

// Reviewed on 2026-10-05: Bukhari 59 links BOTH فليح and أبي to
// https://sunnah.com/narrator/6437. This is source identity evidence, not
// a general rule that equal short names identify the same person.
const review={
  report:'https://sunnah.com/bukhari:59',profile:'https://sunnah.com/narrator/6437',
  isnad:'حدثنا محمد بن سنان قال حدثنا فليح ح وحدثني إبراهيم بن المنذر قال حدثنا محمد بن فليح قال حدثني أبي قال حدثني هلال بن علي عن عطاء بن يسار عن أبي هريرة',
  names:['محمد بن سنان','فليح','إبراهيم بن المنذر','محمد بن فليح','أبي','هلال بن علي','عطاء بن يسار','أبي هريرة'],
  name:'فليح بن سليمان الأسلمي',
};

export function applyReviewedIdentities(text,draft,data,locale='ar'){
  const normalized=normalize(text),prefix=normalize(review.isnad);
  if(!normalized.startsWith(prefix+' ')||!normalized.slice(prefix.length).match(/^ قال بينما النبي(?: صلي الله عليه وسلم)? في مجلس يحدث القوم(?: |$)/u))return null;
  const original=draft.nodes.filter(n=>n.start<draft.nodes.find(n=>normalize(n.nameQuote)==='ابي هريره')?.end).sort((a,b)=>a.start-b.start);
  if(original.length!==review.names.length||original.some((n,i)=>normalize(n.nameQuote)!==normalize(review.names[i])))return null;
  const first=draft.paths.find(p=>p.nodeIds.join('|')===original.slice(0,2).map(n=>n.id).join('|'));
  const second=draft.paths.find(p=>original.slice(2).every((n,i)=>p.nodeIds[i]===n.id));
  if(!first||!second||draft.paths.length!==2)return null;
  const primary='draft-person-'+(draft.nodes.indexOf(original[1])+1),alias='draft-person-'+(draft.nodes.indexOf(original[4])+1);
  const reportId='identity-review-report',profileId='identity-review-profile';
  data.sources.push({id:reportId,title:'Sunnah.com · Sahih al-Bukhari 59',reference:'Both فليح and أبي link to narrator/6437 in this report',url:review.report,rights:'Source identity attribution retained'},
    {id:profileId,title:'Sunnah.com · فليح بن سليمان الأسلمي',reference:'Narrator 6437 · identity only; no appraisal imported',url:review.profile,rights:'Source identity attribution retained'});
  const narrator=data.narrators.find(n=>n.id===primary);
  narrator.name=review.name;narrator.aliases=[original[1].nameQuote,original[4].nameQuote];narrator.sourceIds.push(reportId,profileId);
  narrator.bio={narratorId:primary,text:locale==='en'?'The source links “Flayh” and “my father” to the same narrator profile in Bukhari 59. Both source mentions are retained in the evidence. No narrator appraisal has been imported.':'يربط المصدر «فليح» و«أبي» بصفحة فليح بن سليمان الأسلمي نفسها في البخاري 59. حُفظ اللفظان في أدلة النص؛ لم يُنقل حكم على الراوي.',sourceIds:[reportId,profileId]};
  data.narrators=data.narrators.filter(n=>n.id!==alias);
  const hadith=data.hadiths[0];hadith.sourceIds.push(reportId,profileId);
  for(const chain of hadith.chains){chain.nodes=chain.nodes.map(id=>id===alias?primary:id);for(const link of chain.links){if(link.from===alias)link.from=primary;if(link.to===alias)link.to=primary;link.sourceIds=[...new Set([...link.sourceIds,reportId])];}chain.sourceIds.push(reportId);}
  const a=data.hadiths[0].chains[draft.paths.indexOf(first)],b=data.hadiths[0].chains[draft.paths.indexOf(second)],join=b.nodes.indexOf(primary);
  // Extend only at the source-confirmed common identity. The common tail's
  // edges retain the exact evidence extracted from the second printed branch.
  a.nodes.push(...b.nodes.slice(join+1));a.links.push(...b.links.slice(join).map(l=>({...l,sourceIds:[...l.sourceIds]})));
  a.note={chainId:a.id,text:locale==='en'?'The shared tail is joined using the source’s matching narrator links for Flayh and “my father”.':'أُكمل الفرع بالذيل المشترك بعد مطابقة رابطَي «فليح» و«أبي» في المصدر.',sourceIds:[reportId,profileId]};
  return {reportUrl:review.report,profileUrl:review.profile,mergedMentions:[original[1].nameQuote,original[4].nameQuote]};
}
