'use client';
import {BookOpen,ExternalLink} from 'lucide-react';
import profiles from '@/data/compiler-profiles.json';
import type {Data,Hadith} from '@/lib/catalog-types';
import {useLanguage} from './language';
import SourceList from './source-list';

export default function CompilerProfile({data,hadith,compilerName}:{data:Data;hadith:Hadith;compilerName:string}){
  const {locale,compiler,name}=useLanguage(),en=locale==='en';
  const say=(ar:string,english:string)=>en?english:ar;
  const profile=profiles.find(p=>p.name===compilerName);
  const chains=hadith.chains.filter(c=>(c.compiler??hadith.compiler)?.name===compilerName);
  const appearances=data.hadiths.filter(h=>h.chains.some(c=>(c.compiler??h.compiler)?.name===compilerName));
  return <div className="narrator-detail profile-organized compiler-profile">
    <div className="profile-heading"><span className="eyebrow">{say('مصنّف الكتاب','Book compiler')}</span><h3>{compiler(compilerName)}</h3>{profile&&<><p>{en?profile.fullNameEn:profile.fullName}</p><span className="compiler-book"><BookOpen size={15}/>{en?profile.bookEn:profile.book}</span></>}<small>{say(`له ${appearances.length.toLocaleString(locale)} أحاديث في هذه المكتبة`,`${appearances.length} reports in this library`)}</small></div>
    {profile&&<><section className="profile-summary"><p>{en?profile.summaryEn:profile.summary}</p><a className="compiler-reference" href={profile.source} target="_blank" rel="noopener noreferrer">{say('مرجع التعريف بالمصنّف','Biographical reference')}<ExternalLink size={13}/></a></section><section className="profile-section"><h4>{say('حياته ومؤلفاته','Life and works')}</h4><dl className="profile-facts"><div><dt>{say('الولادة','Born')}</dt><dd>{en?profile.birthEn:profile.birth}</dd></div><div><dt>{say('الوفاة','Died')}</dt><dd>{en?profile.deathEn:profile.death}</dd></div><div><dt>{say('من مؤلفاته','Selected works')}</dt><dd>{en?profile.worksEn:profile.works}</dd></div></dl></section></>}
    <section className="profile-section"><h4>{say('روايته في هذا الحديث','Transmission in this report')}</h4>{chains.map(c=>{const entry=c.compiler??hadith.compiler,person=data.narrators.find(n=>n.id===c.nodes[0]);return <div className="compiler-chain" key={c.id}><strong>{say('المسار ','Path ')}{(hadith.chains.indexOf(c)+1).toLocaleString(locale)}</strong><p>{compiler(compilerName)} ← {name(c.nodes[0],person?.name)}</p><blockquote lang="ar" dir="rtl">{entry?.wording}</blockquote><SourceList data={data} ids={entry?.sourceIds||[]}/></div>;})}</section>
  </div>;
}
