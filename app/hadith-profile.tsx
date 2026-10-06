'use client';
import {BookOpen} from 'lucide-react';
import type {Data,Hadith} from '@/lib/catalog-types';
import {useLanguage} from './language';
import HadithText from './hadith-text';
import SourceList from './source-list';

export default function HadithProfile({data,hadith}:{data:Data;hadith:Hadith}){
  const {locale,title}=useLanguage();
  const say=(ar:string,en:string)=>locale==='en'?en:ar;
  return <div className="narrator-detail profile-organized hadith-profile">
    <div className="profile-heading"><span className="eyebrow"><BookOpen size={16}/> {say('المتن والمصدر','Text and source')}</span><h3>{title(hadith)}</h3></div>
    {hadith.judgement&&<section className={'profile-section judgement-block grade-'+hadith.judgement.grade}><h4>{say('حكم الحديث المنقول','Recorded hadith grade')}</h4><p lang="ar" dir="rtl">{hadith.judgement.text}</p><SourceList data={data} ids={hadith.judgement.sourceIds}/></section>}
    <section className="profile-section"><h4>{say('متن الحديث','Hadith text')}</h4><HadithText hadith={hadith}/><SourceList data={data} ids={hadith.sourceIds}/></section>
    <section className="profile-section"><h4>{say('الطرق ومراجعها','Paths and their references')}</h4>{hadith.chains.map((chain,index)=><details className="hadith-path-source" key={chain.id}><summary>{say('المسار ','Path ')}{(index+1).toLocaleString(locale)}{locale==='ar'?' · '+chain.label:''}</summary><SourceList data={data} ids={chain.sourceIds}/>{chain.sourcePassage&&<blockquote lang="ar" dir="rtl">{chain.sourcePassage}</blockquote>}</details>)}</section>
  </div>;
}
