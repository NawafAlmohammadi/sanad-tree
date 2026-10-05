'use client';
import {useEffect,useId,useRef,type ReactNode} from 'react';
import {X} from 'lucide-react';

// Native modal dialogs remain above the expanded map and manage focus/inertness.
export default function OverlayPanel({open,onClose,title,closeLabel,kind,children}:{open:boolean;onClose:()=>void;title:string;closeLabel:string;kind:'library'|'narrator'|'connection';children:ReactNode}){
  const ref=useRef<HTMLDialogElement>(null),heading=useId();
  useEffect(()=>{
    const dialog=ref.current;if(!dialog)return;
    if(open&&!dialog.open)dialog.showModal();
    else if(!open&&dialog.open)dialog.close();
    return()=>{if(dialog.open)dialog.close();};
  },[open]);
  return <dialog ref={ref} className={'overlay-panel overlay-'+kind} aria-labelledby={heading} onKeyDown={e=>e.stopPropagation()} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}>
    <div className="overlay-heading"><h2 id={heading}>{title}</h2><button type="button" onClick={onClose} aria-label={closeLabel} autoFocus><X size={23}/></button></div>
    <div className="overlay-content">{open&&children}</div>
  </dialog>;
}
