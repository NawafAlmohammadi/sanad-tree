import {requestStructured} from './providers.mjs';
import {aiError} from './ai-safety.mjs';

// One bounded correction, using the same evidence and unchanged acceptance rules.
export async function verifiedGeneration({model,env,system,user,schema,validate,verify,fetcher=fetch}){
  let rejected,reason;
  for(let attempt=0;attempt<2;attempt++){
    const input=attempt?JSON.stringify({originalRequest:JSON.parse(user),correction:{reason,rejectedCandidate:rejected,instruction:'Correct the candidate using ONLY the original evidence. Cite the precise relationship facts for every relationship. Keep literal quotations and all appraisal qualifications. Remove unsupported details; refuse if evidence is insufficient. Complete every sentence. Do not lower the verification rules.'}}):user;
    const result=await requestStructured(model,env,system,input,schema,fetcher);
    if(result?.refuse===true)return {refused:true};
    let issue='STRUCTURE_OR_EVIDENCE';
    const value=validate(result,code=>{issue=code;});
    try{
      if(!value)throw aiError('GROUNDING');
      await verify(value,result);
      return {value,result};
    }catch(error){
      if(error.code!=='GROUNDING')throw error;
      reason=value?'ENTAILMENT':issue;rejected=result;
      console.warn('AI evidence check',{modelId:model.id,attempt:attempt+1,reason});
      if(attempt===1){error.stage=reason;throw error;}
    }
  }
}
