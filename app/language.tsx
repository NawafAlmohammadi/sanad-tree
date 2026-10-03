'use client';
import {createContext,useContext,useEffect,useSyncExternalStore} from 'react';
import {names,titles,compilers,trust,wordings} from '@/lib/language.mjs';
import {englishMatn} from '@/lib/hadith-english.mjs';
import {translations} from '@/lib/ui-translations.mjs';
type Locale='ar'|'en';
type Language={locale:Locale;toggle:()=>void;t:(ar:string)=>string;name:(id:string,fallback?:string)=>string;title:(h:{id:string;title:string})=>string;matn:(h:import('@/lib/catalog-types').Hadith)=>string;compiler:(name:string)=>string;trust:(tone:string,ar:string)=>string;wording:(ar:string)=>string};
const Context=createContext<Language|null>(null);
const lookup=(values:Record<string,string>,key:string,fallback:string)=>values[key]||fallback;
let memoryLocale:Locale='ar';
const subscribe=(listener:()=>void)=>{window.addEventListener('sanad-language',listener);window.addEventListener('storage',listener);return()=>{window.removeEventListener('sanad-language',listener);window.removeEventListener('storage',listener);};};
const readLocale=():Locale=>{try{const stored=localStorage.getItem('sanad-language');return stored==='en'?'en':stored==='ar'?'ar':memoryLocale;}catch{return memoryLocale;}};
export function LanguageProvider({children}:{children:React.ReactNode}){
 const locale=useSyncExternalStore<Locale>(subscribe,readLocale,()=>'ar');
 useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.title=locale==='ar'?'شجرة الأسانيد | استكشف رحلة الحديث':'Sanad Tree | Explore the chain of narration';},[locale]);
 function toggle(){const next=locale==='ar'?'en':'ar';memoryLocale=next;try{localStorage.setItem('sanad-language',next);}catch{}window.dispatchEvent(new Event('sanad-language'));}
 const value:Language={locale,t:ar=>locale==='ar'?ar:lookup(translations,ar,ar),toggle,name:(id,fallback='')=>locale==='en'?lookup(names,id,fallback):fallback,title:h=>locale==='en'?lookup(titles,h.id,h.title):h.title,matn:h=>locale==='en'?englishMatn(h):h.matn,compiler:ar=>locale==='en'?lookup(compilers,ar,ar):ar,trust:(tone,ar)=>locale==='en'?lookup(trust,tone,ar):ar,wording:ar=>locale==='en'?lookup(wordings,ar,ar):ar};
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLanguage(){const value=useContext(Context);if(!value)throw new Error('LanguageProvider is required');return value;}
