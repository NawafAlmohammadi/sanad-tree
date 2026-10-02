export const TRUST_LABELS={trusted:'موثوق',review:'فيه شك',untrusted:'غير ثقة',unknown:'لم يسجل حكم',companion:'صحابي',prophet:'النبي ﷺ'};
export function narratorTone(n) {
  if(n.role?.narratorId===n.id && n.role.sourceIds?.length && ['companion','prophet'].includes(n.role.type))return n.role.type;
  const r=n.reliability;
  return r?.narratorId===n.id && r.text && r.sourceIds?.length && ['trusted','review','untrusted'].includes(r.status)?r.status:'unknown';
}
export function journeySteps(hadith,chain,narrators) {
  const people=new Map(narrators.map(n=>[n.id,n]));
  const steps=chain.nodes.map(id=>({key:id,name:people.get(id)?.name||id,kind:'narrator'}));
  if(hadith.compiler)steps.unshift({key:'compiler',name:hadith.compiler.name,kind:'compiler'});
  return steps;
}
