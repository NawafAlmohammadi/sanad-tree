import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../lib/catalog.mjs';
import {unifiedGraph,linkGeometry,placeEdgeLabels,wrapEdgeLabel,narratorTone} from '../lib/sanad-map.mjs';
import {wordings} from '../lib/language.mjs';
import {groundedContext} from '../lib/grounded-assistant.mjs';
import {answerQuestion} from '../lib/assistant.mjs';

test('all ten unified trees keep their branches spaced and route skipped ranks without adding identities',()=>{
 for(const h of catalog.hadiths)for(const viewport of [350,1200]){
  const g=unifiedGraph(h,catalog.narrators,viewport),byId=new Map(g.nodes.map(n=>[n.key,n]));
  assert.equal(g.nodes.filter(n=>n.kind==='narrator').length,new Set(h.chains.flatMap(c=>c.nodes)).size);
  for(const a of g.nodes)for(const b of g.nodes)if(a.key!==b.key)assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=a.diameter+80,`${h.id}: ${a.key} overlaps ${b.key}`);
  for(const e of g.edges){assert.equal(e.route.length,byId.get(e.to).rank-byId.get(e.from).rank-1);
   for(const p of e.route)for(const n of g.nodes)assert.ok(Math.hypot(p.x-n.x,p.y-n.y)>n.diameter/2+70,`${h.id}: routing lane enters ${n.key}`);
  }
 }
});
test('Arabic and English transmission captions avoid narrator circles and other captions in every tree',()=>{
 for(const h of catalog.hadiths)for(const viewport of [350,1200])for(const locale of ['ar','en']){
  const g=unifiedGraph(h,catalog.narrators,viewport),byId=new Map(g.nodes.map(n=>[n.key,n]));
  const edges=g.edges.map(e=>({...e,...linkGeometry(byId.get(e.from),byId.get(e.to),g.nodes[0].diameter/2,e.route),lines:wrapEdgeLabel(e.wordings.map(w=>locale==='en'?wordings[w]:w).join(' / '))}));
  const labels=[...placeEdgeLabels(edges,g.nodes).values()];
  for(const p of labels){const box={x:p.x-p.width/2,y:p.y-p.height/2,width:p.width,height:p.height};
   for(const n of g.nodes){const x=Math.max(box.x,Math.min(box.x+box.width,n.x)),y=Math.max(box.y,Math.min(box.y+box.height,n.y));assert.ok(Math.hypot(x-n.x,y-n.y)>=n.diameter/2+15,`${h.id} ${locale}: caption overlaps ${n.key}`);}
   for(const q of labels)if(p!==q)assert.ok(Math.abs(p.x-q.x)>=(p.width+q.width)/2+8||Math.abs(p.y-q.y)>=(p.height+q.height)/2+6,`${h.id} ${locale}: captions overlap`);
  }
 }
});
test('initial curved connections never pass through an unrelated narrator card',()=>{
 for(const h of catalog.hadiths){const g=unifiedGraph(h,catalog.narrators),byId=new Map(g.nodes.map(n=>[n.key,n]));
  for(const e of g.edges){const path=linkGeometry(byId.get(e.from),byId.get(e.to),72,e.route).path,numbers=path.match(/-?\d+(?:\.\d+)?/g).map(Number);let a={x:numbers[0],y:numbers[1]};
   for(let i=2;i<numbers.length;i+=6){const c1={x:numbers[i],y:numbers[i+1]},c2={x:numbers[i+2],y:numbers[i+3]},b={x:numbers[i+4],y:numbers[i+5]};
    for(let step=0;step<=40;step++){const t=step/40,u=1-t,x=u*u*u*a.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*b.x,y=u*u*u*a.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*b.y;
     for(const n of g.nodes)if(![e.from,e.to].includes(n.key))assert.ok(Math.hypot(n.x-x,n.y-y)>=n.diameter/2+6,`${h.id}: ${e.key} crosses ${n.key}`);
    }a=b;
   }
  }
 }
});
test('routed curves stay finite and connected after moving either endpoint, even across or onto the other endpoint',()=>{
 const h=catalog.hadiths.find(h=>h.id==='bukhari-10'),g=unifiedGraph(h,catalog.narrators),edge=g.edges.find(e=>e.route.length),from=g.nodes.find(n=>n.key===edge.from),to=g.nodes.find(n=>n.key===edge.to);
 for(const moved of [{x:to.x+800,y:to.y+500},{x:to.x,y:to.y},{x:from.x-900,y:from.y-100}]){
  const shape=linkGeometry(moved,to,72,edge.route);assert.match(shape.path,/^M /);assert.equal((shape.path.match(/ C /g)||[]).length,edge.route.length+1);assert.ok(!/NaN|Infinity/.test(shape.path));
  assert.ok(Number.isFinite(shape.label.x)&&Number.isFinite(shape.label.y));
 }
});
test('Abu al-Haytham appraisal is attached to his matching Sunnah identity and reaches both language modes and AI context',async()=>{
 const n=catalog.narrators.find(n=>n.id==='sulayman-amr-haytham'),h=catalog.hadiths.find(h=>h.id==='ibnmajah-802');
 assert.equal(narratorTone(n),'trusted');assert.equal(n.reliability.narratorId,n.id);
 assert.deepEqual(n.reliability.sourceIds.map(id=>catalog.sources.find(s=>s.id===id).url),['https://sunnah.com/narrator/3617']);
 const ctx=groundedContext(catalog,{hadithId:h.id,chainId:h.chains[0].id,narratorId:n.id,question:'ما حكم هذا الراوي'});
 assert.ok(ctx.facts.some(f=>f.text.includes('ثقة')&&f.sourceIds.includes('sunnah-rijal-3617')));
 for(const locale of ['ar','en']){const answer=await answerQuestion(catalog,{hadithId:h.id,chainId:h.chains[0].id,narratorId:n.id,question:'ما حكم هذا الراوي',locale,modelId:'local'});assert.equal(answer.status,'answered');assert.ok((locale==='en'?answer.displayClaims:answer.claims).some(f=>f.text.includes(locale==='ar'?'ثقة':'trustworthy')));}
 assert.equal(h.judgement.grade,'weak');
});
