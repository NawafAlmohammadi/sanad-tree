'use client';
import {useState} from 'react';
import {BookOpen,Search,ChevronDown} from 'lucide-react';
import {normalize} from '@/lib/catalog.mjs';
import type {Data,Hadith} from '@/lib/catalog-types';
import {useLanguage} from './language';

export default function MapLibrary({data,selected,onChoose}:{data:Data;selected:string;onChoose:(h:Hadith)=>void}){
  const {locale,t,title}=useLanguage(),[search,setSearch]=useState('');
  const filtered=data.hadiths.filter(h=>normalize(`${title(h)} ${h.title} ${h.matn} ${h.chains.flatMap(c=>c.nodes).map(id=>data.narrators.find(n=>n.id===id)?.name).join(' ')}`).includes(normalize(search)));
  const labels={sahih:'صحيح',weak:'ضعيف',fabricated:'موضوع'};
  return <details className="map-library" open>
    <summary><BookOpen size={17}/><strong>{t('مكتبة الأحاديث')}</strong><span>{data.hadiths.length.toLocaleString(locale)}</span><ChevronDown className="library-chevron" size={16}/></summary>
    <div className="map-library-content"><label className="search"><Search size={16}/><input aria-label={locale==='en'?'Search the map library':'البحث في مكتبة الشجرة'} placeholder={t('ابحث عن حديث أو راوٍ…')} value={search} onChange={e=>setSearch(e.target.value)}/></label>
    <div className="map-library-list">{filtered.map(h=><button key={h.id} type="button" data-map-hadith-id={h.id} className={'map-library-item hadith-item grade-'+(h.judgement?.grade||'unknown')+(selected===h.id?' selected':'')} aria-pressed={selected===h.id} onClick={()=>onChoose(h)}><span className="item-number">{(data.hadiths.indexOf(h)+1).toLocaleString(locale,{minimumIntegerDigits:2})}</span><span><strong>{title(h)}</strong>{h.judgement?.grade&&<small>{t(labels[h.judgement.grade])}</small>}</span></button>)}{!filtered.length&&<p className="map-library-empty">{t('لا توجد نتائج')}</p>}</div></div>
  </details>;
}
