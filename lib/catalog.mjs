import raw from '../data/catalog.json' with { type: 'json' };
export function validateCatalog(data) {
  if (data?.version !== 1 || !['sources','narrators','hadiths'].every(k=>Array.isArray(data[k]))) throw new Error('Invalid catalog');
  const unique = rows => new Set(rows.map(r=>r.id)).size === rows.length && rows.every(r=>typeof r.id === 'string' && /^[a-z0-9-]+$/.test(r.id));
  if (!['sources','narrators','hadiths'].every(k=>unique(data[k]))) throw new Error('Duplicate or invalid ID');
  const sources = new Set(data.sources.map(s=>s.id));
  const narrators = new Set(data.narrators.map(n=>n.id));
  const refs = ids => Array.isArray(ids) && ids.length > 0 && ids.every(id=>sources.has(id));
  if(data.terms !== undefined && (!Array.isArray(data.terms)||!unique(data.terms)))throw new Error('Invalid glossary');
  for(const t of data.terms||[])if(!t.name||!t.definition||!Array.isArray(t.aliases)||!refs(t.sourceIds))throw new Error('Unsourced term');
  for (const s of data.sources) {
    if (!s.title || !s.reference || !s.rights) throw new Error('Source reference and rights required');
    if (s.url && new URL(s.url).protocol !== 'https:') throw new Error('Source URL must use HTTPS');
  }
  for (const n of data.narrators) {
    if (typeof n.name!=='string' || !n.name.trim() || !Array.isArray(n.aliases) || n.aliases.some(a=>typeof a!=='string'||!a.trim()) || !refs(n.sourceIds)) throw new Error('Narrator missing source');
    for (const field of ['bio','period','classification','birth','death','kuniya']) if (n[field]!==undefined && (!n[field] || typeof n[field].text!=='string' || !n[field].text.trim() || n[field].narratorId!==n.id || !refs(n[field].sourceIds))) throw new Error('Unsourced or mismatched narrator field');
    if(n.reliability!==undefined){const r=n.reliability;if(!r || r.narratorId!==n.id || !['trusted','review','untrusted'].includes(r.status) || typeof r.text!=='string' || !r.text.trim() || !refs(r.sourceIds))throw new Error('Invalid or unsourced reliability');}
    if(n.role!==undefined){const r=n.role;if(!r || r.narratorId!==n.id || !['companion','prophet'].includes(r.type) || !refs(r.sourceIds) || n.reliability)throw new Error('Invalid or unsourced narrator role');}
    if(n.knowledge!==undefined && (!Array.isArray(n.knowledge)||!unique(n.knowledge)||n.knowledge.some(f=>f.narratorId!==n.id||!f.label||!f.text||!refs(f.sourceIds))))throw new Error('Invalid or unsourced narrator knowledge');
  }
  for (const h of data.hadiths) {
    if(h.judgement!==undefined && (!h.judgement || h.judgement.hadithId!==h.id || typeof h.judgement.text!=='string' || !h.judgement.text.trim() || !refs(h.judgement.sourceIds) || (h.judgement.grade!==undefined&&!['sahih','weak','fabricated'].includes(h.judgement.grade))))throw new Error('Unsourced or mismatched hadith judgement');
    if(h.compiler!==undefined && (!h.compiler || typeof h.compiler.name!=='string' || !h.compiler.name.trim() || typeof h.compiler.wording!=='string' || !h.compiler.wording.trim() || !refs(h.compiler.sourceIds)))throw new Error('Unsourced compiler');
    if (!h.title || !h.matn || !refs(h.sourceIds) || !Array.isArray(h.chains) || !h.chains.length || !unique(h.chains)) throw new Error('Hadith missing content');
    for (const c of h.chains) {
      if(c.compiler!==undefined && (!c.compiler || typeof c.compiler.name!=='string' || !c.compiler.name.trim() || typeof c.compiler.wording!=='string' || !c.compiler.wording.trim() || !refs(c.compiler.sourceIds) || c.compiler.sourceIds.some(id=>!c.sourceIds.includes(id))))throw new Error('Unsourced path compiler');
      if(c.isnad!==undefined && (typeof c.isnad!=='string'||!c.isnad.trim()))throw new Error('Invalid original isnad');
      if(c.note!==undefined && (!c.note || c.note.chainId!==c.id || typeof c.note.text!=='string' || !c.note.text.trim() || !refs(c.note.sourceIds)))throw new Error('Unsourced or mismatched chain note');
      if (!c.label || !refs(c.sourceIds) || !Array.isArray(c.nodes) || !c.nodes.length || !c.nodes.every(id=>narrators.has(id)) || new Set(c.nodes).size !== c.nodes.length) throw new Error('Invalid chain');
      if (!Array.isArray(c.links) || c.links.length !== c.nodes.length - 1) throw new Error('Invalid edges');
      c.links.forEach((l,i)=>{if(l.from!==c.nodes[i] || l.to!==c.nodes[i+1] || !l.wording || !refs(l.sourceIds)) throw new Error('Unsourced edge');});
    }
  }
  return data;
}
export const catalog = validateCatalog(raw);
export const normalize = text => text.normalize('NFKC').replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase().replace(/[؟?!.،,؛:]/g,' ').replace(/\s+/g,' ').trim();
