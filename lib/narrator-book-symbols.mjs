// Ibn Hajar's own key in Taqrib al-Tahdhib, Shamela edition 8609, pp.75–76.
export const BOOK_SYMBOL_REFERENCES=['https://shamela.ws/book/8609/1','https://shamela.ws/book/8609/2'];
/** @type {Record<string,[string,string]>} */
export const BOOK_SYMBOLS={
  'خ':['صحيح البخاري','Sahih al-Bukhari'], 'خت':['تعاليق صحيح البخاري','Suspended reports in Sahih al-Bukhari'],
  'بخ':['الأدب المفرد للبخاري','Al-Bukhari’s al-Adab al-Mufrad'],
  'م':['صحيح مسلم','Sahih Muslim'], 'د':['سنن أبي داود','Sunan Abi Dawud'],
  'خد':['الناسخ لأبي داود','Abu Dawud’s al-Nasikh'], 'ت':['جامع الترمذي','Jamiʿ al-Tirmidhi'],
  'س':['سنن النسائي','Sunan al-Nasa’i'], 'كن':['مسند مالك للنسائي','Al-Nasa’i’s Musnad Malik'],
  'ق':['سنن ابن ماجه','Sunan Ibn Majah'], 'فق':['تفسير ابن ماجه','Ibn Majah’s Tafsir'],
  'ع':['الكتب الستة','The six hadith collections'], '٤':['السنن الأربعة','The four Sunan collections']
};
const token=Object.keys(BOOK_SYMBOLS).sort((a,b)=>b.length-a.length).join('|');
const suffix=new RegExp(`\\s+((?:${token})(?:\\s+(?:${token}))*)(?=\\s*»)`, 'gu');
/**
 * Return a clearly shortened display excerpt; never mutate stored quotations.
 * @param {string} text
 * @param {string[]} sourceIds
 * @returns {{text:string,symbols:string[]}}
 */
export function narratorExcerpt(text,sourceIds=[]){
  if(!sourceIds.some(id=>id.startsWith('taqrib-')))return {text,symbols:[]};
  const symbols=[];
  const display=text.replace(suffix,(_match,codes)=>{symbols.push(...codes.trim().split(/\s+/u));return ' …';});
  return {text:display,symbols:[...new Set(symbols)]};
}
