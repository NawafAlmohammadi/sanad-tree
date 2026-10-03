import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {catalog} from '../lib/catalog.mjs';
import records from '../data/hadith-english.json' with {type:'json'};
import {hadithEnglish,englishMatn,englishMatnClaim,ENGLISH_UNAVAILABLE} from '../lib/hadith-english.mjs';
import {answerQuestion} from '../lib/assistant.mjs';

test('the ten records distinguish ten exact Sunnah matches, including three replacement fabricated reports',()=>{
  assert.deepEqual(Object.keys(records).sort(),catalog.hadiths.map(h=>h.id).sort());
  assert.equal(Object.values(records).filter(r=>r.status==='verified').length,10);
  assert.deepEqual(Object.keys(records).filter(id=>records[id].status==='not-found').sort(),[]);
  for(const h of catalog.hadiths){const r=records[h.id];assert.equal(r.original,h.matn);assert.deepEqual(r.chainNodes,Object.fromEntries(h.chains.map(c=>[c.id,c.nodes])));
    if(r.status==='verified'){
      assert.ok(hadithEnglish(h));assert.ok(r.text.includes(r.title));
      assert.equal(catalog.sources.find(s=>s.id===r.sourceIds[0]).url,r.url);
      assert.match(r.url,/^https:\/\/sunnah\.com\/(bukhari|nasai|tirmidhi|ibnmajah):\d+$/);
      assert.equal(createHash('sha256').update(r.introduction+'\n\n'+r.text).digest('hex'),r.sourceTextSha256);
    }else{assert.equal(hadithEnglish(h),null);assert.equal(englishMatn(h),'');assert.equal(r.text,null);assert.equal(r.url,null);}
  }
});

test('an edited matn, source or path cannot inherit a previously verified translation',()=>{
  const h=catalog.hadiths[0];assert.ok(hadithEnglish(h));
  const changedText=structuredClone(h);changedText.matn+=' changed';assert.equal(hadithEnglish(changedText),null);
  const changedSource=structuredClone(h);changedSource.sourceIds=['different-source'];assert.equal(hadithEnglish(changedSource),null);
  const changedRoute=structuredClone(h);changedRoute.chains[0].nodes[0]='different-narrator';assert.equal(hadithEnglish(changedRoute),null);
  const newRoute=structuredClone(h);newRoute.chains.push({...newRoute.chains[0],id:'unreviewed-route'});assert.equal(hadithEnglish(newRoute),null);
});

test('English matn answers retain the exact sourced quotation and all three weak-route warnings',async()=>{
  for(const h of catalog.hadiths){const c=h.chains[0];const a=await answerQuestion(catalog,{hadithId:h.id,chainId:c.id,question:'show the hadith text',locale:'en'});
    assert.equal(a.status,'answered');const matn=a.displayClaims.find(f=>f.id==='matn');assert.ok(matn);
    assert.equal(matn.text,englishMatnClaim(h));assert.deepEqual(matn.sourceIds,h.sourceIds);
    if(h.judgement.grade==='weak') assert.ok(a.displayClaims.some(f=>f.id==='attribution-warning'));
    if(h.judgement.grade==='fabricated') {assert.ok(a.displayClaims.some(f=>f.id==='attribution-warning'));assert.notEqual(matn.text,ENGLISH_UNAVAILABLE);assert.equal(matn.text,englishMatnClaim(h));assert.ok(!/[\u0621-\u064a]/u.test(matn.text));}
  }
});
