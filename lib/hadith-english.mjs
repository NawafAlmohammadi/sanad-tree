import records from '../data/hadith-english.json' with {type:'json'};

export const ENGLISH_UNAVAILABLE = 'No reviewed published English translation is recorded for this version. The original Arabic remains available; no AI translation is supplied.';

// A translation belongs to a particular Arabic record and its reviewed paths.
// Editing either invalidates the translation until the source is checked again.
export function hadithEnglish(hadith) {
  const record = records[hadith.id];
  if (!record || record.status !== 'verified' || record.original !== hadith.matn) return null;
  if (JSON.stringify(record.sourceIds) !== JSON.stringify(hadith.sourceIds)) return null;
  if (Object.keys(record.chainNodes).length !== hadith.chains.length) return null;
  if (hadith.chains.some(c => JSON.stringify(record.chainNodes[c.id]) !== JSON.stringify(c.nodes))) return null;
  return record;
}

export function englishMatn(hadith) {
  return hadithEnglish(hadith)?.text || '';
}

export function englishMatnClaim(hadith) {
  const record = hadithEnglish(hadith);
  return record ? [record.introduction, record.versionNote, record.text].filter(Boolean).join('\n\n') : ENGLISH_UNAVAILABLE;
}

export const verifiedTexts = Object.fromEntries(Object.entries(records).filter(([, r]) => r.status === 'verified').map(([id, r]) => [id, r.text]));
export const verifiedTitles = Object.fromEntries(Object.entries(records).filter(([, r]) => r.status === 'verified').map(([id, r]) => [id, r.title]));
