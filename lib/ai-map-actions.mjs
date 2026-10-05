export function mapViews(h,data){
  const people=new Map(data.narrators.map(n=>[n.id,n])),views=[];
  function add(id,label,paths,nodeIds,required){
    const pathIds=paths.map(c=>c.id),nodes=[...new Set(nodeIds)],edges=[...new Set(paths.flatMap(c=>c.links.filter(l=>nodes.includes(l.from)&&nodes.includes(l.to)).map(l=>`${l.from}|${l.to}`)))];
    views.push({id,label,pathIds,nodeIds:nodes,edgeKeys:edges,required});
  }
  for(const [i,c] of h.chains.entries())add(`path-${c.id}`,`Path ${i+1}`, [c],c.nodes,[`path-${c.id}`]);
  const ids=[...new Set(h.chains.flatMap(c=>c.nodes))];
  for(const id of ids){
    const paths=h.chains.filter(c=>c.nodes.includes(id));
    add(`through-${id}`,`All recorded paths through ${people.get(id)?.name}`,paths,paths.flatMap(c=>c.nodes),paths.map(c=>`path-${c.id}`));
    const incoming=new Set(paths.flatMap(c=>c.links.filter(l=>l.to===id).map(l=>l.from)));
    if(incoming.size>1)add(`join-${id}`,`Recorded branches joining at ${people.get(id)?.name}`,paths,[id,...incoming],paths.map(c=>`path-${c.id}`));
  }
  if(h.chains.length>1)add('compare-paths','Compare all recorded paths',h.chains,ids,h.chains.map(c=>`path-${c.id}`));
  const review=ids.filter(id=>['review','untrusted'].includes(people.get(id)?.reliability?.status));
  if(review.length)add('review-narrators','Narrators with recorded qualifications or criticism',h.chains,review,review.map(id=>`profile-${id}-reliability`));
  return views;
}
export function validateMapAction(action,views,facts){
  if(action===undefined||action===null)return null;
  const view=views.find(v=>v.id===action.viewId),evidenceIds=action.evidenceIds;
  if(!view||!Array.isArray(evidenceIds)||!evidenceIds.length||evidenceIds.some(id=>!facts.some(f=>f.id===id))||view.required.some(id=>!evidenceIds.includes(id)))return false;
  return {...view,sourceIds:[...new Set(facts.filter(f=>evidenceIds.includes(f.id)).flatMap(f=>f.sourceIds))]};
}
