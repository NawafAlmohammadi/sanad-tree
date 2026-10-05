import defaults from '../config/ai-models.json' with {type:'json'};
// The original ID-only adapter remains supported for custom configurations.
// Tests of that contract select it explicitly; generated answers have their own suite.
export const legacyEnv=extra=>({...extra,AI_MODELS:JSON.stringify(defaults.map(m=>({...m,groundedGeneration:false})))});
