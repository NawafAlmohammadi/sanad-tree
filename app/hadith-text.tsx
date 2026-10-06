'use client';
import {ExternalLink} from 'lucide-react';
import {useLanguage} from './language';
import {hadithEnglish,ENGLISH_UNAVAILABLE} from '@/lib/hadith-english.mjs';
import type {Hadith} from '@/lib/catalog-types';

export default function HadithText({hadith}:{hadith:Hadith}) {
  const {locale,t}=useLanguage();
  const original=<details><summary>{locale==='ar'?'لفظ الرواية في الطبعة المعتمدة':'Original report in the approved edition'}</summary><p className="translation-unavailable">{locale==='ar'?'قد يختلف لفظ النسخة المحفوظة عن الطبعة؛ النص الآتي من المرجع مباشرة.':'The preserved wording may differ from this edition; the following passage is from the source.'}</p><blockquote lang="ar" dir="rtl">{hadith.chains[0]?.sourcePassage}</blockquote></details>;
  if(locale==='ar') return <div><blockquote lang="ar" dir="rtl">{hadith.matn}</blockquote>{original}</div>;
  const record=hadithEnglish(hadith);
  if(!record) return <div className="hadith-translation"><p className="translation-unavailable" role="note">{ENGLISH_UNAVAILABLE}</p><blockquote lang="ar" dir="rtl">{hadith.matn}</blockquote>{original}</div>;
  return <div className="hadith-translation" lang="en" dir="ltr">
    {record.introduction&&<p className="translation-introduction">{record.introduction}</p>}
    <blockquote>{record.text}</blockquote>
    <p className="translation-unavailable" role="note">{record.versionNote}</p>
    <a className="translation-source" href={record.url} target="_blank" rel="noopener noreferrer">Published translation · {record.reference} <ExternalLink size={14}/></a>
    <details><summary>Arabic wording of this published translation</summary><blockquote lang="ar" dir="rtl">{record.versionArabic}</blockquote></details>
  </div>;
}
