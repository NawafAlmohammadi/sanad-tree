import {normalize} from './catalog.mjs';

// Verified printed Bukhari 59 and Taqrib entry 6228 establish this family reference only.
const review={
  report:'https://shamela.ws/book/1681/112',profile:'https://shamela.ws/book/8609/428',
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
  data.sources.push({id:reportId,title:'الشاملة · صحيح البخاري 59',reference:'The printed report contains محمد بن فليح … حدثني أبي',url:review.report,rights:'Source identity attribution retained'},
    {id:profileId,title:'الشاملة · تقريب التهذيب 6228',reference:'Entry 6228: محمد ابن فليح ابن سليمان · identity only; no appraisal imported',url:review.profile,rights:'Source identity attribution retained'});
  const narrator=data.narrators.find(n=>n.id===primary);
  narrator.name=review.name;narrator.aliases=[original[1].nameQuote,original[4].nameQuote];narrator.sourceIds.push(reportId,profileId);
  narrator.bio={narratorId:primary,text:locale==='en'?'Bukhari 59 prints “Muhammad ibn Flayh … my father”; Taqrib entry 6228 gives his father’s name. Both source mentions are retained in the evidence. No narrator appraisal has been imported.':'نص البخاري 59: «محمد بن فليح … حدثني أبي»؛ وتقريب التهذيب 6228 يذكر نسب محمد بن فليح بن سليمان. حُفظ اللفظان في أدلة النص؛ لم يُنقل حكم على الراوي.',sourceIds:[reportId,profileId]};
  data.narrators=data.narrators.filter(n=>n.id!==alias);
  const hadith=data.hadiths[0];hadith.sourceIds.push(reportId,profileId);
  for(const chain of hadith.chains){chain.nodes=chain.nodes.map(id=>id===alias?primary:id);for(const link of chain.links){if(link.from===alias)link.from=primary;if(link.to===alias)link.to=primary;link.sourceIds=[...new Set([...link.sourceIds,reportId])];}chain.sourceIds.push(reportId);}
  const a=data.hadiths[0].chains[draft.paths.indexOf(first)],b=data.hadiths[0].chains[draft.paths.indexOf(second)],join=b.nodes.indexOf(primary);
  // Extend only at the source-confirmed common identity. The common tail's
  // edges retain the exact evidence extracted from the second printed branch.
  a.nodes.push(...b.nodes.slice(join+1));a.links.push(...b.links.slice(join).map(l=>({...l,sourceIds:[...l.sourceIds]})));
  a.note={chainId:a.id,text:locale==='en'?'The shared tail is joined using the printed Bukhari passage and the family identity in Taqrib 6228.':'أُكمل الفرع بالذيل المشترك بعد مراجعة لفظ البخاري ونسب محمد بن فليح في تقريب التهذيب.',sourceIds:[reportId,profileId]};
  return {reportUrl:review.report,profileUrl:review.profile,mergedMentions:[original[1].nameQuote,original[4].nameQuote]};
}
