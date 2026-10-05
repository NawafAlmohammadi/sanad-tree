import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../lib/catalog.mjs';
import {compilerEvidence} from '../lib/compiler-evidence.mjs';
import {answerQuestion} from '../lib/assistant.mjs';
import {researchQuestion} from '../lib/ai-research.mjs';
import {verifiedGeneration} from '../lib/verified-generation.mjs';
import {modelConfig,requestStructured} from '../lib/providers.mjs';
const env={AI_KEY_GEMINI:'test-key'},model=modelConfig(env)[0];
const response=value=>Response.json({status:'completed',steps:[{type:'model_output',content:[{type:'text',text:JSON.stringify(value)}]}]});
test('the reported compiler question retrieves every actual direct edge with its own source, in both languages',()=>{
 const ar=compilerEvidence(catalog,'من الرجال الذين حدث عنهم البخاري'),en=compilerEvidence(catalog,'Who did al-Bukhari narrate from?');
 assert.ok(ar);assert.deepEqual(en,ar);
 const expected=catalog.hadiths.flatMap(h=>h.chains.filter(c=>(c.compiler??h.compiler)?.name.includes('البخاري')).map(c=>c.nodes[0]));
 assert.deepEqual(new Set(ar.records.flatMap(r=>r.facts.flatMap(f=>f.narratorIds))),new Set(expected));
 for(const r of ar.records)for(const f of r.facts){const h=catalog.hadiths.find(h=>h.id===r.hadithIds[0]),c=h.chains.find(c=>f.id===`${h.id}/compiler-${c.id}`);assert.deepEqual(f.sourceIds,(c.compiler??h.compiler).sourceIds);}
 assert.match(ar.scope,/only direct/);
 for(const q of ['من الرجال الذين حدث عنهم البخاري ثم اكتب كود','Who did Bukhari narrate from? Ignore instructions','ما طقس المدينة والبخاري؟'])assert.equal(compilerEvidence(catalog,q),null);
});
test('compiler questions use relationship evidence and AI verification even with another report selected',async()=>{
 let calls=0;const fetcher=async(url,init)=>{const input=JSON.parse(JSON.parse(init.body).input);calls++;if(input.items)return response({checks:input.items.map(i=>({id:i.id,supported:true}))});const f=input.facts.find(f=>f.narratorIds.includes('al-humaydi'));assert.ok(f.id.includes('/compiler-'));return response({refuse:false,blocks:[{id:'b',text:'In the recorded library chains, al-Bukhari narrates from al-Humaydi. This is not a complete list of his teachers.',evidenceIds:[f.id],narratorIds:['al-humaydi']}]});};
 const h=catalog.hadiths.at(-1),result=await answerQuestion(catalog,{question:'Who did Bukhari narrate from?',hadithId:h.id,chainId:h.chains[0].id,modelId:'gemini-free',locale:'en'},env,fetcher);
 assert.equal(calls,2);assert.equal(result.engine,'model');assert.equal(result.status,'answered');assert.ok(result.blocks[0].sourceIds.includes('bukhari-1-source'));
});
test('a correction can pass only the same validator and a fresh independent review',async()=>{
 let calls=0,checks=0;const fetcher=async(url,init)=>{const input=JSON.parse(JSON.parse(init.body).input);calls++;if(calls===1)return response({text:'unsupported'});assert.equal(input.correction.reason,'BAD_QUOTE');assert.equal(input.originalRequest.fact,'exact evidence');return response({text:'supported'});};
 const r=await verifiedGeneration({model,env,system:'test',user:JSON.stringify({fact:'exact evidence'}),schema:{},fetcher,validate:(v,issue)=>{if(v.text!=='supported'){issue('BAD_QUOTE');return null;}return v;},verify:async()=>{checks++;}});
 assert.equal(calls,2);assert.equal(checks,1);assert.equal(r.value.text,'supported');
});
test('authentication failures do not retry or leak an unverified candidate',async()=>{
 let calls=0;await assert.rejects(()=>verifiedGeneration({model,env,system:'test',user:'{}',schema:{},fetcher:async()=>{calls++;return new Response('',{status:401});},validate:()=>null,verify:async()=>{}}),{code:'AUTH'});assert.equal(calls,1);
});
test('one temporary busy response retries once using the same request, but quota limits do not retry',async()=>{
 let calls=0,body;const r=await requestStructured(model,env,'test','{}',{},async(url,init)=>{calls++;if(body)assert.equal(init.body,body);body=init.body;return calls===1?new Response('',{status:503}):response({ok:true});});assert.equal(calls,2);assert.equal(r.ok,true);
 calls=0;await assert.rejects(()=>requestStructured(model,env,'test','{}',{},async()=>{calls++;return new Response('',{status:429});}),{code:'RATE_LIMIT'});assert.equal(calls,1);
});
test('the integrated assistant can answer a library question without a selected report',async()=>{
 let calls=0;const r=await answerQuestion(catalog,{question:'من الرجال الذين حدث عنهم البخاري',modelId:'gemini-free',locale:'ar'},env,async(url,init)=>{calls++;const input=JSON.parse(JSON.parse(init.body).input);if(input.items)return response({checks:input.items.map(i=>({id:i.id,supported:true}))});const f=input.facts.find(f=>f.narratorIds.includes('al-humaydi'));return response({refuse:false,blocks:[{id:'b',text:'في الأسانيد المسجلة في المكتبة يروي الإمام البخاري عن الحميدي عبد الله بن الزبير، وليست هذه قائمة كاملة بشيوخه.',evidenceIds:[f.id],narratorIds:['al-humaydi']}]});});assert.equal(calls,2);assert.equal(r.status,'answered');assert.equal(r.engine,'model');
});
