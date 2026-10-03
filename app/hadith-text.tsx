'use client';
import {ExternalLink} from 'lucide-react';
import {useLanguage} from './language';
import {hadithEnglish,ENGLISH_UNAVAILABLE} from '@/lib/hadith-english.mjs';
import type {Hadith} from '@/lib/catalog-types';

export default function HadithText({hadith}:{hadith:Hadith}) {
  const {locale,t}=useLanguage();
  if(locale==='ar') return <blockquote lang="ar" dir="rtl">{hadith.matn}</blockquote>;
  const record=hadithEnglish(hadith);
  if(!record) return <div className="hadith-translation"><p className="translation-unavailable" role="note">{ENGLISH_UNAVAILABLE}</p><blockquote lang="ar" dir="rtl">{hadith.matn}</blockquote></div>;
  return <div className="hadith-translation" lang="en" dir="ltr">
    {record.introduction&&<p className="translation-introduction">{record.introduction}</p>}
    <blockquote>{record.text}</blockquote>
    <a className="translation-source" href={record.url} target="_blank" rel="noopener noreferrer">{t("النص الإنجليزي كما في Sunnah.com")} · {record.reference} <ExternalLink size={14}/></a>
  </div>;
}
