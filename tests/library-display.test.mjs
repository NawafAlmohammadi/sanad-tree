import test from 'node:test';import assert from 'node:assert/strict';
import {catalog} from '../lib/catalog.mjs';
import {filterLibrary} from '../lib/library-filter.mjs';
import {narratorExcerpt,BOOK_SYMBOLS,BOOK_SYMBOL_REFERENCES} from '../lib/narrator-book-symbols.mjs';
import {REFERENCE_SERVICES} from '../lib/reference-policy.mjs';
import translations from '../data/hadith-english.json' with {type:'json'};
import compilers from '../data/compiler-profiles.json' with {type:'json'};

test('grade filters return only matching reports and intersect Arabic search without changing order',()=>{
  for(const [grade,count] of [['sahih',4],['weak',3],['fabricated',3]]){
    const filtered=filterLibrary(catalog.hadiths,{grade});assert.equal(filtered.length,count);
    assert.ok(filtered.every(h=>h.judgement.grade===grade));
    assert.deepEqual(filtered,catalog.hadiths.filter(h=>h.judgement.grade===grade));
  }
  const selected=catalog.hadiths.find(h=>h.judgement.grade==='sahih');
  assert.ok(filterLibrary(catalog.hadiths,{grade:'sahih',query:selected.title}).includes(selected));
  assert.equal(filterLibrary(catalog.hadiths,{grade:'weak',query:selected.title}).length,0);
  assert.equal(filterLibrary(catalog.hadiths,{grade:null,query:''}).length,10);
  assert.equal(filterLibrary(catalog.hadiths,{grade:'sahih',query:'أَعْمَال',searchText:h=>h.title}).length,1);
});
test('Taqrib display separates book codes while keeping qualifications and original evidence intact',()=>{
  const original=JSON.stringify(catalog);
  for(const n of catalog.narrators)for(const field of [n.bio,n.reliability].filter(Boolean)){
    const excerpt=narratorExcerpt(field.text,field.sourceIds);
    for(const symbol of excerpt.symbols)assert.ok(BOOK_SYMBOLS[symbol],symbol);
    if(excerpt.symbols.length){assert.ok(excerpt.text.includes('…'));assert.notEqual(excerpt.text,field.text);}
    for(const qualification of ['دلس','تغير','إلا','مقبول','ضعيف'])if(field.text.includes(qualification))assert.ok(excerpt.text.includes(qualification),n.id);
  }
  const h=catalog.narrators.find(n=>n.id==='al-humaydi');const excerpt=narratorExcerpt(h.bio.text,h.bio.sourceIds);
  assert.deepEqual(excerpt.symbols,['خ','م','د','ت','س','فق']);assert.doesNotMatch(excerpt.text,/خ م د ت س فق/);
  assert.equal(BOOK_SYMBOLS['فق'][0],'تفسير ابن ماجه');assert.equal(BOOK_SYMBOLS['خد'][0],'الناسخ لأبي داود');
  assert.equal(narratorExcerpt('نص ع».',['different-edition']).text,'نص ع».');
  assert.equal(JSON.stringify(catalog),original);
});
test('every active evidence URL and source-service link belongs to the competition guide directory',()=>{
  // Pages 3–4 and 9–15 of the supplied scientific-reference guide.
  const approved=new Set(['shamela.ws','dorar.net','hadeethenc.com','mcp.islamiccontent.org','quranenc.com','dawa.center','islamic-content.com']);
  const urls=[...catalog.sources.map(s=>s.url),...REFERENCE_SERVICES.map(s=>s.url),...BOOK_SYMBOL_REFERENCES,
    ...compilers.flatMap(p=>p.sources),...Object.values(translations).filter(r=>r.status==='verified').map(r=>r.url)];
  for(const url of urls){const parsed=new URL(url);assert.equal(parsed.protocol,'https:');assert.ok(approved.has(parsed.hostname),url);}
  assert.equal(catalog.sources.length,105);assert.ok(catalog.sources.every(s=>['shamela','dorar'].includes(s.provider)));
});
