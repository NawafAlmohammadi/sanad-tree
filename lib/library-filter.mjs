import {normalize} from './catalog.mjs';

/**
 * @template {import('./catalog-types').Hadith} T
 * @param {T[]} hadiths
 * @param {{grade?: string|null, query?: string, searchText?: (h:T)=>string}} options
 * @returns {T[]}
 */
export function filterLibrary(hadiths,{grade=null,query='',searchText=h=>`${h.title} ${h.matn}`}={}){
  const needle=normalize(query);
  return hadiths.filter(h=>(!grade||h.judgement?.grade===grade)&&(!needle||normalize(searchText(h)).includes(needle)));
}
