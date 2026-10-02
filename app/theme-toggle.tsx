'use client';
import {useEffect,useState} from 'react';
import {Moon,Sun} from 'lucide-react';
export default function ThemeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    setDark(document.documentElement.dataset.theme==='dark');
    const media=window.matchMedia('(prefers-color-scheme: dark)');
    const followSystem=()=>{try{if(localStorage.getItem('sanad-theme'))return;}catch{}document.documentElement.dataset.theme=media.matches?'dark':'light';setDark(media.matches);};
    media.addEventListener('change',followSystem);return()=>media.removeEventListener('change',followSystem);
  },[]);
  function toggle(){const next=!dark;document.documentElement.dataset.theme=next?'dark':'light';setDark(next);try{localStorage.setItem('sanad-theme',next?'dark':'light');}catch{}}
  return <button className="theme-toggle" onClick={toggle} aria-label={dark?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن'} aria-pressed={dark} title={dark?'الوضع الفاتح':'الوضع الداكن'}>{dark?<Sun size={19}/>:<Moon size={19}/>}<span>{dark?'الوضع الفاتح':'الوضع الداكن'}</span></button>;
}
