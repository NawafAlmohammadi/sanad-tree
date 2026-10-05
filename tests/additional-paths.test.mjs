import {archivedCatalog} from './archived-catalog.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,validateCatalog} from '../lib/catalog.mjs';
import {unifiedGraph,journeySteps,narratorTone} from '../lib/sanad-map.mjs';
import {groundedContext} from '../lib/grounded-assistant.mjs';
import {answerQuestion} from '../lib/assistant.mjs';

test('eleven reviewed additions preserve the existing ten reports and exact route provenance',()=>{
 const expected={'bukhari-1':['bukhari:54','bukhari:2529','bukhari:5070','bukhari:6689','bukhari:6953'],'bukhari-10':['bukhari:6484'],'bukhari-6018':['bukhari:6475','bukhari:6136'],'bukhari-6116':['tirmidhi:2020'],'tirmidhi-2687':['ibnmajah:4169'],'ibnmajah-802':['tirmidhi:2617']};
 assert.equal(catalog.hadiths.length,10);assert.equal(catalog.hadiths.reduce((n,h)=>n+h.chains.length,0),22);
 for(const h of catalog.hadiths){const additions=h.chains.filter(c=>c.compiler);assert.deepEqual(additions.map(c=>catalog.sources.find(s=>s.id===c.sourceIds[0]).url),(expected[h.id]||[]).map(ref=>'https://sunnah.com/'+ref));for(const c of additions){assert.ok(c.isnad);assert.ok(c.note);assert.ok(c.links.every(l=>l.sourceIds.every(id=>c.sourceIds.includes(id))));}}
});
test('each route starts with its own compiler, with no fabricated cross-collection teacher edge',()=>{
 for(const h of catalog.hadiths){const graph=unifiedGraph(h,catalog.narrators);for(const c of h.chains){const steps=journeySteps(h,c,catalog.narrators),root=steps[0];assert.ok(graph.edges.some(e=>e.from===root.key&&e.to===c.nodes[0]&&e.chainIds.includes(c.id)));if(c.compiler)assert.equal(root.name,c.compiler.name);}}
 const h=catalog.hadiths.find(h=>h.id==='tirmidhi-2687'),g=unifiedGraph(h,catalog.narrators);assert.ok(g.nodes.some(n=>n.name==='الإمام ابن ماجه'));assert.ok(!g.edges.some(e=>e.from==='compiler'&&e.to==='abdrahman-abdwahhab-ammi'));
 const invalid=structuredClone(catalog);invalid.hadiths[0].chains[1].compiler.sourceIds=['bukhari-1-source'];assert.throws(()=>validateCatalog(invalid));
});
test('Sufyan identities stay separate and qualifiers are not erased by colours',()=>{
 const h=catalog.hadiths.find(h=>h.id==='bukhari-1'),g=unifiedGraph(h,catalog.narrators);assert.ok(g.nodes.some(n=>n.key==='sufyan'));assert.ok(g.nodes.some(n=>n.key==='sufyan-thawri'));assert.ok(!g.edges.some(e=>e.from==='sufyan'&&e.to==='sufyan-thawri'));
 for(const id of ['sufyan','sufyan-thawri','abd-wahhab-thaqafi','abu-numan-arim','zakariyya-abi-zaida']){const n=catalog.narrators.find(n=>n.id===id);assert.match(n.reliability.text,/دلس|تغير/);assert.ok(n.reliability.sourceIds.every(id=>catalog.sources.find(s=>s.id===id).url.startsWith('https://sunnah.com/')));}
});
test('unverified matching profiles cannot borrow a namesake’s appraisal',()=>{
 for(const id of ['muadh-qurashi-grandfather']){const n=archivedCatalog.narrators.find(n=>n.id===id);assert.equal(n.reliability,undefined);assert.equal(narratorTone(n),'unknown');}
});
test('AI receives route-specific compilers, preserved variant notes and independently attributed grades',()=>{
 const h=catalog.hadiths.find(h=>h.id==='ibnmajah-802'),ctx=groundedContext(catalog,{hadithId:h.id,chainId:h.chains[0].id,question:'قارن طرق هذا الحديث'});assert.ok(ctx.facts.some(f=>f.id==='compiler-ibnmajah-802-via-tirmidhi-2617'&&f.text.includes('الإمام الترمذي')));const note=ctx.facts.find(f=>f.id==='note-ibnmajah-802-via-tirmidhi-2617');assert.match(note.text,/دار السلام: ضعيف/);assert.match(note.text,/غريب حسن/);
});
test('source mode can answer a narrator selected only in an added route',async()=>{
 const h=catalog.hadiths.find(h=>h.id==='bukhari-1');const answer=await answerQuestion(catalog,{hadithId:h.id,chainId:h.chains[0].id,allPaths:true,narratorId:'sufyan-thawri',question:'ما حكم هذا الراوي',locale:'en'});assert.equal(answer.status,'answered');assert.equal(answer.narrator.id,'sufyan-thawri');assert.ok(answer.displayClaims.some(f=>f.text.includes('tadlis')));
});
