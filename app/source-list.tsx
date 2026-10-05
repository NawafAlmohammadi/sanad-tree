'use client';
import {ExternalLink} from 'lucide-react';
import {useLanguage} from './language';
import {sourceLabel} from '@/lib/reviewed-language.mjs';
import type {Data} from '@/lib/catalog-types';
export default function SourceList({ids,data,expanded=false}:{ids:string[];data:Data;expanded?:boolean}){
  const {t,locale}=useLanguage();const sources=data.sources.filter(s=>ids.includes(s.id));if(!sources.length)return null;
  return <details className="source-disclosure" open={expanded||undefined}><summary>{locale==='en'?`${sources.length} source${sources.length===1?'':'s'}`:`المراجع (${sources.length.toLocaleString(locale)})`}</summary><div className="sources">{sources.map(s=>{const label=sourceLabel(s,locale);return <div key={s.id}><strong>{label.title}</strong><span>{label.reference}</span>{s.url&&<a href={s.url} target="_blank" rel="noopener noreferrer">{t('افتح المصدر')} <ExternalLink size={14}/></a>}</div>;})}</div></details>;
}
