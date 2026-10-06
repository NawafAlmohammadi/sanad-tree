'use client';
import type {Hadith} from '@/lib/catalog-types';
import {useLanguage} from './language';

export type GradeFilter='sahih'|'weak'|'fabricated'|null;
const grades=[['sahih','صحيح'],['weak','ضعيف'],['fabricated','موضوع']] as const;
export default function GradeFilters({hadiths,value,onChange}:{hadiths:Hadith[];value:GradeFilter;onChange:(grade:GradeFilter)=>void}){
  const {locale,t}=useLanguage();
  return <div className="grade-summary grade-filters" role="group" aria-label={locale==='ar'?'تصفية الأحاديث حسب الحكم':'Filter hadiths by grade'}>
    <button type="button" className="hadith-grade grade-all" aria-pressed={value===null} onClick={()=>onChange(null)}>{t('الكل')} <span>{hadiths.length.toLocaleString(locale)}</span></button>
    {grades.map(([grade,label])=><button type="button" className={`hadith-grade grade-${grade}`} key={grade} aria-pressed={value===grade} onClick={()=>onChange(value===grade?null:grade)}>{t(label)} <span>{hadiths.filter(h=>h.judgement?.grade===grade).length.toLocaleString(locale)}</span></button>)}
  </div>;
}
