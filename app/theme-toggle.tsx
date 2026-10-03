'use client';
import {useEffect,useState} from 'react';
import {useLanguage} from './language';
import {Moon,Sun} from 'lucide-react';
export default function ThemeToggle(){
  const {t}=useLanguage();
  const [dark,setDark]=useState(true);
  useEffect(()=>{
    const initial=window.requestAnimationFrame(()=>setDark(document.documentElement.dataset.theme==='dark'));
    return()=>window.cancelAnimationFrame(initial);
  },[]);
  function toggle(){const next=!dark;document.documentElement.dataset.theme=next?'dark':'light';setDark(next);try{localStorage.setItem('sanad-university-theme',next?'dark':'light');}catch{}}
  return <button className="theme-toggle" onClick={toggle} aria-label={dark?t("تفعيل الوضع الفاتح"):t("تفعيل الوضع الداكن")} aria-pressed={dark} title={dark?t("الوضع الفاتح"):t("الوضع الداكن")}>{dark?<Sun size={19}/>:<Moon size={19}/>}<span>{dark?t("الوضع الفاتح"):t("الوضع الداكن")}</span></button>;
}
