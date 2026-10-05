import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../lib/catalog.mjs';
import {answerQuestion} from '../lib/assistant.mjs';
import {narratorTone} from '../lib/sanad-map.mjs';
const id='tirmidhi-3371',chainId=id+'-chain';
test('replacement weak report preserves its original compiler, chain and independent grading',()=>{
  assert.ok(!catalog.hadiths.some(h=>h.id==='nasai-518'));
  const h=catalog.hadiths.find(h=>h.id===id);
  assert.equal(h.compiler.name,'الإمام الترمذي');assert.equal(h.judgement.grade,'weak');assert.match(h.judgement.text,/دار السلام/);
  assert.deepEqual(h.chains[0].nodes,['ali-hujr','walid-muslim','abdullah-lahia','ubaydullah-abi-jafar','aban-salih','anas-malik','messenger']);
  assert.equal(narratorTone(catalog.narrators.find(n=>n.id==='ali-hujr')),'trusted');assert.equal(narratorTone(catalog.narrators.find(n=>n.id==='abdullah-lahia')),'untrusted');
  assert.equal(narratorTone(catalog.narrators.find(n=>n.id==='anas-malik')),'companion');
  for(const nid of h.chains[0].nodes.slice(0,-1)){const n=catalog.narrators.find(n=>n.id===nid),s=catalog.sources.find(s=>s.id===(n.reliability??n.role).sourceIds[0]);assert.match(s.url,/^https:\/\/sunnah.com\/narrator\/\d+$/);}
});
test('new namesakes cannot inherit a different Aban profile or contaminate scoped answers',async()=>{
  const a=await answerQuestion(catalog,{hadithId:id,chainId,narratorId:'ali-hujr',question:'من هو أبان بن صالح'});
  assert.equal(a.narrator.id,'aban-salih');assert.ok(a.claims.every(f=>f.id.startsWith('narrator-aban-salih-')));
  assert.equal((await answerQuestion(catalog,{hadithId:id,chainId,question:'من هو أبان بن عثمان'})).status,'refused');
  const w=await answerQuestion(catalog,{hadithId:id,chainId,narratorId:'walid-muslim',question:'ما حكم هذا الراوي'});assert.match(w.answer,/التدليس/);
  const u=await answerQuestion(catalog,{hadithId:id,chainId,narratorId:'ubaydullah-abi-jafar',question:'ما حكم هذا الراوي'});assert.match(u.answer,/أقوالًا أخرى/);
});
