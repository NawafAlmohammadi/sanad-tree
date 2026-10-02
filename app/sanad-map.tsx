'use client';
import {useEffect,useRef,useState} from 'react';
import {useLanguage} from './language';
import {sourceLabel} from '@/lib/reviewed-language.mjs';
import {BookOpen,ShieldCheck,CircleHelp,ShieldX,Info,RotateCcw,Pause,Plus,Minus} from 'lucide-react';
import type {Chain,Data,Hadith} from '@/lib/catalog-types';
import {journeySteps,narratorTone,TRUST_LABELS} from '@/lib/sanad-map.mjs';

type Props={data:Data;hadith:Hadith;chain:Chain;selected:string;onSelect:(id:string)=>void;zoom:number;onZoom:(value:number)=>void};
export default function SanadMap({data,hadith,chain,selected,onSelect,zoom,onZoom}:Props){
  const {locale,t,name,matn,compiler,trust,wording:displayWording}=useLanguage();
  const steps=journeySteps(hadith,chain,data.narrators);
  const last=steps.length-1;
  const [cursor,setCursor]=useState(0),[playing,setPlaying]=useState(false),[finished,setFinished]=useState(false);
  const canvas=useRef<HTMLDivElement>(null);
  const nodes=useRef(new Map<number,HTMLDivElement>());
  const reduced=useRef(false);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced.current=media.matches;
    const start=window.requestAnimationFrame(()=>{if(media.matches){setCursor(last);setFinished(true);}else setPlaying(true);});
    const change=()=>{reduced.current=media.matches;if(media.matches){setPlaying(false);setCursor(last);setFinished(true);}};
    media.addEventListener('change',change);return()=>{window.cancelAnimationFrame(start);media.removeEventListener('change',change);};
  },[last]);
  useEffect(()=>{
    if(!playing)return;
    const timer=window.setTimeout(()=>{if(cursor>=last){setPlaying(false);setFinished(true);}else setCursor(i=>i+1);},1700);
    return()=>window.clearTimeout(timer);
  },[playing,cursor,last]);
  useEffect(()=>{
    if(!playing||reduced.current)return;
    const box=canvas.current,item=nodes.current.get(cursor);if(!box||!item)return;
    const itemRect=item.getBoundingClientRect(),boxRect=box.getBoundingClientRect();
    const top=box.scrollTop+itemRect.top-boxRect.top-(box.clientHeight-itemRect.height)/2;
    box.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  },[cursor,playing]);
  function replay(){
    if(playing){setPlaying(false);return;}
    if(reduced.current){setCursor(last);setFinished(true);return;}
    setCursor(0);setFinished(false);setPlaying(true);canvas.current?.scrollTo({top:0,behavior:'instant'});
  }
  function select(id:string){setPlaying(false);onSelect(id);}
  const icons={trusted:ShieldCheck,review:CircleHelp,untrusted:ShieldX,unknown:Info,companion:ShieldCheck,prophet:BookOpen};
  return <>
    <div className="map-legend" aria-label={t("معاني ألوان الرواة")}>
      <span className="legend-trusted"><ShieldCheck size={14}/> {t("أخضر: موثوق")}</span><span className="legend-review"><CircleHelp size={14}/> {t("أصفر: يحتاج مراجعة")}</span><span className="legend-untrusted"><ShieldX size={14}/> {t("أحمر: ضعيف أو متروك")}</span><span className="legend-unknown">{t("رمادي: لم يسجل حكم")}</span>
    </div>
    <div className="journey-progress" role="progressbar" aria-label={t("تقدم تتبع السند")} aria-valuenow={cursor+1} aria-valuemin={0} aria-valuemax={steps.length}><span style={{width:`${(cursor+1)/steps.length*100}%`}}/></div><div className="journey-controls"><span aria-hidden="true">{playing?locale==='en'?`Now tracing: ${name(steps[cursor]?.key,compiler(steps[cursor]?.name))}`:`نتتبّع الآن: ${steps[cursor]?.name}`:finished?locale==='en'?`Path complete: ${name(steps[last]?.key,steps[last]?.name)}`:`اكتمل المسار إلى ${steps[last]?.name}`:t("تتبّع السند خطوة بخطوة")}</span><button onClick={replay} aria-label={playing?t("إيقاف حركة السند"):t("إعادة تتبع السند")}>{playing?<Pause size={15}/>:<RotateCcw size={15}/>} {playing?t("إيقاف الحركة"):t("إعادة التتبع")}</button><span className="sr-only" role="status" aria-live="polite">{playing?t("بدأ تتبع السند"):finished?t("اكتمل تتبع السند"):''}</span></div>
    <div ref={canvas} role="region" aria-label={t("خريطة سلسلة الإسناد")} tabIndex={0} className={`tree-canvas sanad-canvas ${playing?'journey-playing':''}`} onWheel={()=>setPlaying(false)} onTouchStart={()=>setPlaying(false)} onKeyDown={e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))setPlaying(false);}}>
      <div className="tree sanad-tree" style={{zoom}}>
        {steps.map((step:{key:string;name:string;kind:string},index:number)=>{
          const person=data.narrators.find(n=>n.id===step.key);
          const tone=person?narratorTone(person):'unknown';const Icon=icons[tone as keyof typeof icons];
          const nodeIndex=index-(hadith.compiler?1:0);
          const wording=index===1&&hadith.compiler?hadith.compiler.wording:chain.links[nodeIndex-1]?.wording;
          return <div className={`node-wrap journey-step ${playing&&index>cursor?'awaiting':''} ${playing&&index===cursor?'journey-active':''}`} key={step.key} ref={node=>{if(node)nodes.current.set(index,node);else nodes.current.delete(index);}}>
            {index>0?<div className={`edge journey-edge ${index<=cursor?'traversed':''} ${playing&&index===cursor?'edge-active':''}`}><span>{displayWording(wording||'')}</span><i/></div>:null}
            {person?<button type="button" className={`narrator-node tone-${tone} ${selected===person.id?'picked':''}`} onClick={()=>select(person.id)} aria-pressed={selected===person.id} aria-label={`${name(person.id,person.name)}، ${trust(tone,TRUST_LABELS[tone as keyof typeof TRUST_LABELS])}`}><span className="node-index">{(nodeIndex+1).toLocaleString(locale)}</span><span className="node-content"><strong>{name(person.id,person.name)}</strong><span className={`trust-badge tone-${tone}`}><Icon size={13}/>{trust(tone,TRUST_LABELS[tone as keyof typeof TRUST_LABELS])}</span></span><Info size={16}/></button>:<div className="compiler-node"><span className="compiler-icon"><BookOpen size={21}/></span><span><small>{t("مصنّف الكتاب · بداية المسار")}</small><strong>{compiler(step.name)}</strong><span className="compiler-reference">{hadith.compiler&&sourceLabel(data.sources.find(s=>s.id===hadith.compiler?.sourceIds[0])!,locale).title}</span></span></div>}
            {person?.role?.type==='prophet'&&<div className={`map-matn grade-${hadith.judgement?.grade||'unknown'}`} role="note" aria-label={t("متن الرواية")}><small>{hadith.judgement?.grade==='fabricated'?t("نص الرواية الموضوعة — لا يثبت عن النبي ﷺ"):hadith.judgement?.grade==='weak'?t("نص الرواية الضعيفة — انظر حكم المحدث"):t("متن الحديث")}</small><blockquote>{matn(hadith)}</blockquote>{locale==='en'&&<small className="translation-note">{t("ترجمة للعرض؛ النص العربي في المصادر")}</small>}<p className="map-source-hint">{t("اقرأ الحكم والمراجع كاملة في تبويب المتن والمصدر.")}</p></div>}
          </div>;
        })}
      </div>
      <div className="zoom-controls"><button aria-label={t("تكبير")} onClick={()=>onZoom(Math.min(1.5,zoom+.1))}><Plus size={18}/></button><button aria-label={t("تصغير")} onClick={()=>onZoom(Math.max(.7,zoom-.1))}><Minus size={18}/></button><button aria-label={t("إعادة ضبط التكبير")} onClick={()=>onZoom(1)}><RotateCcw size={16}/></button></div>
    </div>
  </>;
}
