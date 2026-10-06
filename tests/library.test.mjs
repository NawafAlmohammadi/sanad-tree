import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,validateCatalog} from '../lib/catalog.mjs';
import {answerQuestion} from '../lib/assistant.mjs';
import {retrieve,renderSelection} from '../lib/grounding.mjs';
import {journeySteps,narratorTone} from '../lib/sanad-map.mjs';

const input=(id,question,extra={})=>{const h=catalog.hadiths.find(h=>h.id===id);return {hadithId:id,chainId:h.chains[0].id,modelId:'local',question,...extra};};
test('reviewed library has four sound, three weak and three fabricated reports',()=>{
  validateCatalog(catalog);
  assert.equal(catalog.hadiths.length,10);
  assert.deepEqual(catalog.hadiths.reduce((totals,h)=>{totals[h.judgement.grade]++;return totals;},{sahih:0,weak:0,fabricated:0}),{sahih:4,weak:3,fabricated:3});
  for(const h of catalog.hadiths)for(const c of h.chains){
    assert.ok(c.isnad.length>50);
    assert.equal(journeySteps(h,c,catalog.narrators)[0].name,(c.compiler??h.compiler).name);
    assert.equal(narratorTone(catalog.narrators.find(n=>n.id===c.nodes.at(-2))),'companion');
    assert.equal(narratorTone(catalog.narrators.find(n=>n.id===c.nodes.at(-1))),'prophet');
    assert.equal(c.nodes.at(-1),'messenger');
    assert.ok(h.sourceIds.every(id=>catalog.sources.find(s=>s.id===id)?.url?.startsWith('https://')));
  }
});
test('Bukhari 10 represents the two parallel teachers as separate paths',async()=>{
  const h=catalog.hadiths.find(h=>h.id==='bukhari-10');assert.equal(h.chains.length,3);
  for(const [index,teacher] of ['abdullah-abi-safar','ismail-abi-khalid'].entries()){
    const c=h.chains[index];
    assert.deepEqual(c.nodes,['adam-abi-iyas','shuba-hajjaj',teacher,'amir-shabi','abdullah-amr-as','messenger']);
    const answer=await answerQuestion(catalog,input(h.id,'اشرح السند',{chainId:c.id}));
    const other=teacher==='abdullah-abi-safar'?'ismail-abi-khalid':'abdullah-abi-safar';
    assert.ok(!answer.answer.includes(catalog.narrators.find(n=>n.id===other).name));
  }
});
test('Abd Allah ibn Amr and ibn Umar cannot resolve to each other or a selected card',async()=>{
  const amr=await answerQuestion(catalog,input('bukhari-10','من هو عبد الله بن عمرو',{narratorId:'amir-shabi'}));
  assert.equal(amr.narrator.id,'abdullah-amr-as');assert.ok(!amr.answer.includes('الخطاب'));
  const umar=await answerQuestion(catalog,input('ibnmajah-4054','من هو عبد الله بن عمر',{narratorId:'said-sinan-himsi'}));
  assert.equal(umar.narrator.id,'abdullah-umar');
  // His sourced biography explicitly distinguishes him from ibn Amr. Mentioning
  // the other name in that distinction must not be mistaken for identity mixing.
  assert.ok(umar.claims.slice(1).every(f=>f.id.startsWith('narrator-abdullah-umar-')));
  assert.equal(umar.claims.find(f=>f.id.endsWith('-bio')).text,`التعريف — عبد الله بن عمر بن الخطاب: ${catalog.narrators.find(n=>n.id==='abdullah-umar').bio.text}`);
  assert.equal((await answerQuestion(catalog,input('bukhari-10','من هو عبد الله بن عمر'))).status,'refused');
  assert.equal((await answerQuestion(catalog,input('ibnmajah-4054','من هو عبد الله بن عمرو'))).status,'refused');
});
test('fabricated texts and chains always include cited non-attribution notices',async()=>{
  for(const h of catalog.hadiths.filter(h=>h.judgement.grade==='fabricated')){
    for(const question of ['اعرض متن الحديث','اشرح السند','ما مصدر الحديث','من هذا الراوي']){
      const answer=await answerQuestion(catalog,input(h.id,question,{narratorId:h.chains[0].nodes[0]}));
      assert.equal(answer.status,'answered');assert.equal(answer.claims[0].id,'attribution-warning');
      assert.equal(answer.claims[0].text,h.judgement.text);
      assert.deepEqual(answer.claims[0].sourceIds,h.judgement.sourceIds);
      if(question==='اعرض متن الحديث')assert.equal(answer.claims[1].text,h.matn);
    }
    const evidence=retrieve(catalog,input(h.id,'اعرض متن الحديث'));
    assert.equal(renderSelection(catalog,evidence,{refuse:false,factIds:['matn']}),null);
    const valid=renderSelection(catalog,evidence,{refuse:false,factIds:['matn','attribution-warning'],text:'fabricated model prose'});
    assert.equal(valid.claims[0].id,'attribution-warning');assert.ok(!valid.answer.includes('model prose'));
  }
});
test('fabricated reports cannot lose the notice on a disclosed busy-service fallback',async()=>{
  const h=catalog.hadiths.find(h=>h.id==='ibnmajah-4313');
  const answer=await answerQuestion(catalog,input(h.id,'اعرض متن الحديث',{modelId:'gemini-free'}),{AI_KEY_GEMINI:'test-key'},async()=>new Response('',{status:503}));
  assert.equal(answer.status,'answered');assert.equal(answer.engine,'local');assert.equal(answer.claims[0].id,'attribution-warning');
});
test('weak matn answers retain the grading and its actual named critic',async()=>{
  for(const id of ['tirmidhi-3371','tirmidhi-2687','ibnmajah-802']){
    const h=catalog.hadiths.find(h=>h.id===id),answer=await answerQuestion(catalog,input(id,'اعرض متن الحديث'));
    assert.equal(answer.claims[0].text,h.judgement.text);assert.equal(answer.claims[1].text,h.matn);
  }
  assert.match(catalog.hadiths.find(h=>h.id==='tirmidhi-2687').judgement.text,/الألباني/);
});
test('a weak chain does not transfer its defect to trusted narrators',async()=>{
  for(const [id,nid,tone] of [['tirmidhi-2687','ibrahim-fadl','untrusted'],['tirmidhi-2687','abdullah-numayr','trusted'],['ibnmajah-802','rushdin-saad','untrusted'],['ibnmajah-802','darraj-abi-samh','review'],['ibnmajah-802','sulayman-amr-haytham','trusted']]){
    const n=catalog.narrators.find(n=>n.id===nid);assert.equal(narratorTone(n),tone);
    const answer=await answerQuestion(catalog,input(id,'ما حكم هذا الراوي',{narratorId:nid}));
    if(n.reliability)assert.equal(answer.narrator.id,nid);if(n.reliability)assert.ok(answer.answer.includes(n.reliability.text));else assert.equal(answer.status,'refused');
  }
});
test('father and son retain separate identities; the father is a Companion',async()=>{
  const h=catalog.hadiths.find(h=>h.id==='ibnmajah-1388'),c=h.chains[0];
  assert.deepEqual(c.nodes.slice(4,7),['muawiya-abdullah-jafar','abdullah-jafar','ali-abi-talib']);
  for(const [name,nid,tone] of [['معاوية بن عبد الله بن جعفر','muawiya-abdullah-jafar','review'],['عبد الله بن جعفر','abdullah-jafar','companion']]){
    const n=catalog.narrators.find(n=>n.id===nid),answer=await answerQuestion(catalog,input(h.id,`من هو ${name}`));
    assert.equal(answer.narrator.id,nid);assert.equal(narratorTone(n),tone);
  }
  assert.equal(c.links[4].wording,'عن أبيه');
});
test('the reviewed Ibrahim lineage has its exact sourced assessment, without borrowing a namesake’s grade',async()=>{
  const nid='ibrahim-muhammad-sabra',n=catalog.narrators.find(n=>n.id===nid);
  assert.equal(narratorTone(n),'trusted');assert.equal(n.reliability.narratorId,nid);
  assert.match(n.reliability.text,/صدوق/);assert.ok(!n.reliability.text.includes('«ثقة»'));
  const source=catalog.sources.find(s=>s.id===n.reliability.sourceIds[0]);assert.equal(source.url,'https://shamela.ws/book/8609/19');
  const assessment=await answerQuestion(catalog,input('ibnmajah-1388','ما حكم هذا الراوي',{narratorId:nid}));
  assert.equal(assessment.status,'answered');assert.ok(assessment.claims.some(f=>f.id===`narrator-${nid}-reliability`&&f.text.endsWith(n.reliability.text)&&f.sourceIds.includes(source.id)));
  assert.equal((await answerQuestion(catalog,input('ibnmajah-1388','من هذا الراوي',{narratorId:nid}))).narrator.id,nid);
  const imported=structuredClone(n);imported.reliability.narratorId='ibrahim-fadl';assert.equal(narratorTone(imported),'unknown');
  const alaq=catalog.narrators.find(n=>n.id==='alaq-abi-muslim');assert.equal(narratorTone(alaq),'review');assert.match(alaq.reliability.text,/مجهول/);assert.ok(!alaq.reliability.text.includes('يضع الحديث'));
});
test('a kunyah and name in one chain remain one person, with distinct Muhammad identities',async()=>{
  const h=catalog.hadiths.find(h=>h.id==='ibnmajah-4054'),c=h.chains[0];
  assert.deepEqual(c.nodes,['muhammad-musaffa','muhammad-harb','said-sinan-himsi','hudayr-kurayb','kathir-murra','abdullah-umar','messenger']);
  for(const q of ['من هو أبو شجرة','من هو كثير بن مرة'])assert.equal((await answerQuestion(catalog,input(h.id,q))).narrator.id,'kathir-murra');
  const musaffa=await answerQuestion(catalog,input(h.id,'من هو محمد بن المصفى',{narratorId:'muhammad-harb'}));assert.equal(musaffa.narrator.id,'muhammad-musaffa');
  assert.equal(narratorTone(catalog.narrators.find(n=>n.id==='kathir-murra')),'trusted');
});
test('new literal isnad and grade fields reject invalid input instead of silently defaulting',()=>{
  for(const field of ['isnad','grade']){
    const d=structuredClone(catalog);
    if(field==='isnad')d.hadiths[0].chains[0].isnad='';else d.hadiths[0].judgement.grade='invented';
    assert.throws(()=>validateCatalog(d));
  }
});
