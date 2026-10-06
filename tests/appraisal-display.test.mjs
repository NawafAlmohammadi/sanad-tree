import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../lib/catalog.mjs';
import {narratorTone,TRUST_LABELS} from '../lib/sanad-map.mjs';
import profiles from '../data/compiler-profiles.json' with {type:'json'};

test('explicit trust remains green without deleting source qualifications or promoting weak narrators',()=>{
  for(const id of ['sufyan','sufyan-thawri','uthman-asim-hasin','abd-wahhab-thaqafi','abu-numan-arim','zakariyya-abi-zaida']){
    const n=catalog.narrators.find(n=>n.id===id);assert.equal(narratorTone(n),'trusted',id);assert.match(n.reliability.text,/ثقة/);
    const source=catalog.sources.find(s=>s.id===n.reliability.sourceIds[0]);
    const appraisal=n.reliability.text.match(/«([^»]+)»/u)?.[1];assert.ok(source.evidence.includes(appraisal),id+' keeps the complete quotation');
  }
  assert.match(catalog.narrators.find(n=>n.id==='sufyan-thawri').reliability.text,/دلس/);
  assert.match(catalog.narrators.find(n=>n.id==='abu-numan-arim').reliability.text,/تغير/);
  assert.equal(narratorTone(catalog.narrators.find(n=>n.id==='ibn-abi-sabra')),'untrusted');
  assert.equal(narratorTone(catalog.narrators.find(n=>n.id==='darraj-abi-samh')),'review');
  assert.equal(narratorTone(catalog.narrators.find(n=>n.id==='abdullah-lahia')),'review');
  assert.doesNotMatch(TRUST_LABELS.review,/شك/);
});
test('Yahya ibn Qazaa trust cites al-Daraqutni while preserving Ibn Hajar’s different appraisal',()=>{
  const n=catalog.narrators.find(n=>n.id==='yahya-qazaa');assert.equal(narratorTone(n),'trusted');assert.match(n.reliability.text,/مقبول من العاشرة/);
  const source=catalog.sources.find(s=>s.id==='daraqutni-yahya-qazaa');assert.ok(n.reliability.sourceIds.includes(source.id));assert.equal(source.editionId,'12764');assert.match(source.evidence,/يحيى بن قزعة.*قال ثقة/s);assert.match(source.reference,/510/);
});
test('Bukhari’s birth and death are bound to distinct literal source passages',()=>{
  const p=profiles.find(p=>p.name==='الإمام البخاري');assert.match(p.birth,/194/);assert.match(p.death,/256/);
  assert.equal(p.dateEvidence.length,2);for(const e of p.dateEvidence){assert.ok(p.sources.includes(e.url));assert.match(e.url,/^https:\/\/shamela.ws\/book\/10906\//);}
  assert.match(p.dateEvidence.find(e=>e.field==='birth').quote,/وَوُلِدَ/);
  assert.match(p.dateEvidence.find(e=>e.field==='death').quote,/وَمائَتَيْنِ/);
});
