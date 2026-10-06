'use client';
import {useMemo} from 'react';
import {ArrowDownLeft,ArrowUpRight,BookOpen,ShieldCheck} from 'lucide-react';
import {useLanguage} from './language';
import SourceList from './source-list';
import {narratorExcerpt,BOOK_SYMBOLS,BOOK_SYMBOL_REFERENCES} from '@/lib/narrator-book-symbols.mjs';
import {reviewedText} from '@/lib/reviewed-language.mjs';
import {narratorTone,TRUST_LABELS} from '@/lib/sanad-map.mjs';
import type {Data,Hadith,Narrator,Sourced} from '@/lib/catalog-types';

export default function NarratorProfile({data,hadith,narrator:n}:{data:Data;hadith:Hadith;narrator:Narrator}){
  const {locale,t,name,trust,title}=useLanguage(),tone=narratorTone(n);
  const relations=useMemo(()=>{
    const links=new Map<string,{from:string;to:string;sourceIds:string[]}>();
    for(const chain of hadith.chains)for(const l of chain.links)if(l.from===n.id||l.to===n.id){const key=l.from+'→'+l.to,old=links.get(key);links.set(key,{...l,sourceIds:[...new Set([...(old?.sourceIds||[]),...l.sourceIds])]});}
    return [...links.values()];
  },[hadith,n.id]);
  const appearances=data.hadiths.filter(h=>h.chains.some(c=>c.nodes.includes(n.id)));
  const fields=[['kuniya','الكنية'],['classification','الطبقة'],['birth','الولادة'],['death','الوفاة'],['period','الفترة']] as const;
  const bookSymbols=[...new Set([n.bio,n.reliability].filter(Boolean).flatMap(field=>narratorExcerpt(field!.text,field!.sourceIds).symbols))];
  function text(field:Sourced,id:string){const excerpt=narratorExcerpt(field.text,field.sourceIds);const en=reviewedText('profiles',n.id,field.text,id);return locale==='en'?<>{en&&<p>{en}</p>}<details className="original-disclosure"><summary>{t('قراءة النص العربي الأصلي')}</summary><p lang="ar" dir="rtl">{field.text}</p></details></> :excerpt.symbols.length?<><small className="profile-caption">{t('مقتطف الترجمة؛ أسماء الكتب موضحة أدناه')}</small><p lang="ar" dir="rtl">{excerpt.text}</p><details className="original-disclosure"><summary>{t('النص الأصلي كاملًا')}</summary><p lang="ar" dir="rtl">{field.text}</p></details></>:<p lang="ar" dir="rtl">{field.text}</p>;}
  return <div className="narrator-detail profile-organized">
    <div className="profile-heading"><span className="eyebrow">{t('الاسم في المصدر')}</span><h3>{name(n.id,n.name)}</h3><span className={`trust-badge tone-${tone}`}><ShieldCheck size={13}/>{trust(tone,TRUST_LABELS[tone as keyof typeof TRUST_LABELS])}</span><small>{locale==='en'?`${appearances.length} report${appearances.length===1?'':'s'} in this library`:`ورد في ${appearances.length.toLocaleString(locale)} من أحاديث المكتبة`}</small></div>
    {n.bio&&<section className="profile-summary">{text(n.bio,'bio')}<SourceList ids={n.bio.sourceIds} data={data}/></section>}
    <section className="profile-section"><h4>{t('التوثيق في المصادر')}</h4>{n.reliability?<>{text(n.reliability,'reliability')}<SourceList ids={n.reliability.sourceIds} data={data}/></>:n.role?<><p>{n.role.type==='prophet'?t('النبي ﷺ؛ تعرض هويته مستقلة عن تصنيفات الرواة.'):t('صحابي؛ يعرض بهذه الصفة مستقلة عن أقوال الجرح والتعديل.')}</p><SourceList ids={n.role.sourceIds} data={data}/></>:<p className="unavailable">{t('لم يُدخل حكم موثق لهذا الراوي.')}</p>}</section>
    {bookSymbols.length>0&&<details className="profile-section narrator-books"><summary>{t('كتب الرواية المذكورة في المصدر')}</summary><ul>{bookSymbols.map(code=><li key={code}>{BOOK_SYMBOLS[code][locale==='en'?1:0]}</li>)}</ul><small>{t('تفسير رموز الكتب من مقدمة تقريب التهذيب')}</small><div className="book-symbol-references">{BOOK_SYMBOL_REFERENCES.map((url,i)=><a href={url} key={url} target="_blank" rel="noopener noreferrer">{t('مقدمة الكتاب')} · {(75+i).toLocaleString(locale)}</a>)}</div></details>}
    {fields.some(([key])=>n[key])&&<details className="profile-section" open><summary>{t('الهوية والفترة')}</summary><dl className="profile-facts">{fields.map(([key,label])=>{const field=n[key];return field?<div key={key}><dt>{t(label)}</dt><dd>{text(field,key)}<SourceList ids={field.sourceIds} data={data}/></dd></div>:null;})}</dl></details>}
    {n.knowledge?.length? <details className="profile-section"><summary>{t('معلومات إضافية موثقة')}</summary>{n.knowledge.map(f=><div key={f.id} className="profile-knowledge"><h5>{t(f.label)}</h5>{locale==='en'?<><p>{reviewedText('knowledge',f.id,f.text)}</p><details className="original-disclosure"><summary>{t('قراءة النص العربي الأصلي')}</summary><p lang="ar" dir="rtl">{f.text}</p></details></>:<p>{f.text}</p>}<SourceList ids={f.sourceIds} data={data}/></div>)}</details>:null}
    <section className="profile-section"><h4>{t('علاقاته في هذا الحديث')}</h4><p className="profile-caption">{t('العلاقات المسجلة في طرق الحديث فقط')}</p>{relations.map(l=><div className="profile-relation" key={l.from+l.to}>{l.from===n.id?<ArrowUpRight size={15}/>:<ArrowDownLeft size={15}/>}<div><p>{name(l.from,data.narrators.find(n=>n.id===l.from)?.name)} <span>{t('يروي عن')}</span> {name(l.to,data.narrators.find(n=>n.id===l.to)?.name)}</p><SourceList ids={l.sourceIds} data={data}/></div></div>)}</section>
    <details className="profile-section"><summary><BookOpen size={14}/> {t('مواضعه في المكتبة')}</summary>{appearances.map(h=><div className="profile-appearance" key={h.id}><p>{title(h)}</p><SourceList ids={h.chains.filter(c=>c.nodes.includes(n.id)).flatMap(c=>c.sourceIds)} data={data}/></div>)}</details>
    <section className="profile-section"><h4>{t('مرجع الاسم')}</h4><SourceList ids={n.sourceIds} data={data}/></section>
  </div>;
}
