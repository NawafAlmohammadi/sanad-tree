'use client';
import {useEffect,useLayoutEffect,useId,useMemo,useRef,useState,type PointerEvent as ReactPointerEvent} from 'react';
import HadithText from './hadith-text';
import {useLanguage} from './language';
import {BookOpen,ShieldCheck,CircleHelp,ShieldX,Info,RotateCcw,Pause,Plus,Minus,GitBranch,Maximize,Minimize,Move,PenLine,Eraser,Type,Undo2,Trash2,X,Check} from 'lucide-react';
import type {Data,Hadith} from '@/lib/catalog-types';
import {unifiedGraph,linkGeometry,wrapEdgeLabel,placeEdgeLabels,narratorTone,TRUST_LABELS} from '@/lib/sanad-map.mjs';
import {graphPoint,clampNode,hitsStroke,editingWorld,clampTranslation} from '@/lib/map-editor.mjs';

const TRACE_STEP_MS=2600;
export type MapHighlight={id:string;nodeIds:string[];edgeKeys:string[];pathIds:string[]};
type Props={data:Data;hadith:Hadith;selected:string;onSelect:(id:string)=>void;zoom:number;onZoom:(value:number)=>void;highlight?:MapHighlight|null;onClearHighlight?:()=>void;draft?:boolean};
type Point={x:number;y:number};
type Note={id:string;color:string;points?:Point[];text?:string;direction?:'rtl'|'ltr';x?:number;y?:number};
type Tool='move'|'pen'|'eraser'|'text';
export default function SanadMap({data,hadith,selected,onSelect,zoom,onZoom,highlight,onClearHighlight,draft:reviewDraft=false}:Props){
  const {locale,t,name,compiler,trust,wording}=useLanguage();
  const say=(ar:string,en:string)=>locale==='en'?en:ar;
  const [expanded,setExpanded]=useState(false),[tool,setTool]=useState<Tool>('move');
  const [offsets,setOffsets]=useState<Record<string,Point>>({}),[notes,setNotes]=useState<Note[]>([]),[color,setColor]=useState('#e6c76b');
  const [history,setHistory]=useState<Note[][]>([]);
  const [draft,setDraft]=useState<(Point&{text:string})|null>(null);
  const workspaceRef=useRef<HTMLDivElement>(null),stageRef=useRef<HTMLDivElement>(null),expandRef=useRef<HTMLButtonElement>(null);
  const drag=useRef<{key:string;start:Point;origin:Point;moved:boolean;id:number}|null>(null),suppressClick=useRef(false),stroke=useRef<string|null>(null),serial=useRef(0);
  const textDrag=useRef<{id:string;pointerId:number;start:Point;origin:Point;box:DOMRect;moved:boolean;delta:Point}|null>(null);
  const pan=useRef<{id:number;x:number;y:number;left:number;top:number}|null>(null);
  const frame=useRef(0),pending=useRef<(()=>void)|null>(null);
  const nodeElements=useRef(new Map<string,HTMLDivElement>()),edgeElements=useRef(new Map<string,SVGGElement>());
  const noteElements=useRef(new Map<string,SVGGElement>());
  const [viewportWidth,setViewportWidth]=useState(0);
  const graph=useMemo(()=>unifiedGraph(hadith,data.narrators,viewportWidth,{compact:reviewDraft}),[hadith,data.narrators,viewportWidth,reviewDraft]);
  const world=useMemo(()=>editingWorld(graph),[graph]);
  const people=useMemo(()=>new Map(data.narrators.map(n=>[n.id,n])),[data.narrators]);
  const positions=useMemo(()=>new Map(graph.nodes.map(node=>[node.key,{...node,x:world.paddingX+node.x+(offsets[node.key]?.x??0),y:world.paddingY+node.y+(offsets[node.key]?.y??0)}])),[graph,world,offsets]);
  function buildEdgeDisplay(){
    const entries=graph.edges.map(edge=>{const from=positions.get(edge.from)!,to=positions.get(edge.to)!;
      return {...edge,...linkGeometry(from,to,from.diameter/2,edge.route.map((p:Point)=>({x:p.x+world.paddingX,y:p.y+world.paddingY}))),lines:wrapEdgeLabel(edge.wordings.map(wording).join(' / '))};});
    const labels=placeEdgeLabels(entries,[...positions.values()]);
    return new Map(entries.map(edge=>[edge.key,{path:edge.path,lines:edge.lines,...labels.get(edge.key)!}]));
  }
  const edgeDisplay=useMemo(buildEdgeDisplay,[graph,world,positions,wording,locale]);
  const last=graph.nodes.length-1;
  const [cursor,setCursor]=useState(-1),[playing,setPlaying]=useState(false),[finished,setFinished]=useState(false);
  const reduced=useRef(false),manualUntil=useRef(0);
  const canvasRef=useRef<HTMLDivElement>(null),cardsRef=useRef<Array<HTMLElement|null>>([]);
  const marker='sanad-arrow-'+useId().replace(/[^a-zA-Z0-9]/g,'');
  useEffect(()=>{
    if(!highlight)return;
    setPlaying(false);
    const first=graph.nodes.find(n=>highlight.nodeIds.includes(n.key));
    const frame=requestAnimationFrame(()=>{const canvas=canvasRef.current,card=first&&cardsRef.current[first.index];if(!canvas||!card)return;const a=canvas.getBoundingClientRect(),b=card.getBoundingClientRect();canvas.scrollTo({left:canvas.scrollLeft+b.left-a.left-(canvas.clientWidth-b.width)/2,top:canvas.scrollTop+b.top-a.top-40,behavior:reduced.current?'instant':'smooth'});});
    return()=>cancelAnimationFrame(frame);
  },[highlight,graph]);
  // Dragging updates geometry and collision-free captions once per frame.
  // React state is committed at the end, rather than re-rendering the whole map per event.
  function schedule(update:()=>void){pending.current=update;if(!frame.current)frame.current=requestAnimationFrame(()=>{frame.current=0;const run=pending.current;pending.current=null;run?.();});}
  function flush(){if(frame.current)cancelAnimationFrame(frame.current);frame.current=0;const run=pending.current;pending.current=null;run?.();}
  useEffect(()=>()=>{if(frame.current)cancelAnimationFrame(frame.current);},[]);
  function centreMap(){
    const canvas=canvasRef.current,stage=stageRef.current,first=positions.get(graph.nodes[0].key);if(!canvas||!stage||!first)return;
    const viewport=canvas.getBoundingClientRect(),bounds=stage.getBoundingClientRect(),scale=bounds.width/world.width;
    canvas.scrollTo({left:canvas.scrollLeft+bounds.left-viewport.left+(world.paddingX+graph.width/2)*scale-canvas.clientWidth/2,top:Math.max(0,canvas.scrollTop+bounds.top-viewport.top+(first.y-first.diameter/2)*scale-36),behavior:'instant'});
  }
  function changeZoom(value:number){
    onZoom(value);
  }
  useLayoutEffect(()=>{
    centreMap();
  },[zoom,world.width,world.height,graph,expanded]);
  function fitBranches(){
    const canvas=canvasRef.current;if(!canvas)return;
    onZoom(Math.max(.35,Math.min(reviewDraft?1.15:1,(canvas.clientWidth-72)/graph.width)));
    requestAnimationFrame(centreMap);
  }
  useEffect(()=>{const id=requestAnimationFrame(expanded?fitBranches:centreMap);return()=>cancelAnimationFrame(id);},[graph,expanded]);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const observer=new ResizeObserver(([entry])=>{if(!workspaceRef.current?.classList.contains('is-expanded'))setViewportWidth(entry.contentRect.width);else if(!drag.current&&!textDrag.current&&!pan.current)requestAnimationFrame(centreMap);});
    observer.observe(canvas);return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');reduced.current=media.matches;
    const change=()=>{reduced.current=media.matches;if(media.matches){setPlaying(false);setCursor(last);setFinished(true);}};
    media.addEventListener('change',change);return()=>media.removeEventListener('change',change);
  },[last]);
  useEffect(()=>{
    if(!playing)return;
    const timer=window.setTimeout(()=>{if(cursor>=last){setPlaying(false);setFinished(true);}else setCursor(i=>i+1);},TRACE_STEP_MS);
    return()=>window.clearTimeout(timer);
  },[playing,cursor,last]);
  useEffect(()=>{
    if(!playing||reduced.current||Date.now()<manualUntil.current)return;
    const canvas=canvasRef.current,card=cardsRef.current[cursor];if(!canvas||!card)return;
    const viewport=canvas.getBoundingClientRect(),bounds=card.getBoundingClientRect();
    canvas.scrollTo({left:canvas.scrollLeft+bounds.left-viewport.left-(canvas.clientWidth-bounds.width)/2,top:Math.max(0,canvas.scrollTop+bounds.top-viewport.top-(canvas.clientHeight-bounds.height)/2),behavior:'smooth'});
  },[playing,cursor]);
  useEffect(()=>{
    if(!expanded)return;
    const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';expandRef.current?.focus();
    return()=>{document.body.style.overflow=overflow;previous?.focus();};
  },[expanded]);
  function closeExpanded(){
    setExpanded(false);setTool('move');setDraft(null);
  }
  function toggleExpanded(){
    if(expanded){void closeExpanded();return;}
    setExpanded(true);moveViewport();
  }
  function point(e:ReactPointerEvent):Point{
    return graphPoint(e.clientX,e.clientY,stageRef.current!.getBoundingClientRect(),world.width,world.height);
  }
  function startDrag(e:ReactPointerEvent<HTMLDivElement>,key:string){
    if(tool!=='move'||e.button!==0)return;
    const node=positions.get(key)!;
    drag.current={key,start:point(e),origin:{x:node.x,y:node.y},moved:false,id:e.pointerId};
    suppressClick.current=false;moveViewport();
  }
  function moveDrag(e:ReactPointerEvent<HTMLDivElement>){
    const d=drag.current;if(!d||d.id!==e.pointerId)return;
    const x=e.clientX,y=e.clientY;
    schedule(()=>updateDrag(x,y));
  }
  function updateDrag(x:number,y:number){
    const d=drag.current;if(!d||!stageRef.current)return;
    const p=graphPoint(x,y,stageRef.current.getBoundingClientRect(),world.width,world.height),dx=p.x-d.start.x,dy=p.y-d.start.y;
    if(!d.moved&&Math.hypot(dx,dy)<5)return;
    const el=nodeElements.current.get(d.key);if(!el)return;
    if(!d.moved){try{el.setPointerCapture(d.id);}catch{}el.classList.add('is-dragging');}
    d.moved=true;suppressClick.current=true;moveViewport();
    const node=positions.get(d.key)!,next=clampNode({x:d.origin.x+dx,y:d.origin.y+dy},node.diameter,world.width,world.height);
    node.x=next.x;node.y=next.y;el.style.left=next.x+'px';el.style.top=next.y+'px';
    for(const [key,display] of buildEdgeDisplay()){
      const group=edgeElements.current.get(key);edgeDisplay.set(key,display);
      group?.querySelector('path')?.setAttribute('d',display.path);
      group?.querySelector('.edge-caption')?.setAttribute('transform',`translate(${display.x} ${display.y})`);
    }
  }
  function stopDrag(e:ReactPointerEvent<HTMLDivElement>){
    if(drag.current?.id!==e.pointerId)return;
    flush();const d=drag.current!,base=graph.nodes.find(n=>n.key===d.key)!,node=positions.get(d.key)!;
    if(d.moved)setOffsets(old=>({...old,[d.key]:{x:node.x-world.paddingX-base.x,y:node.y-world.paddingY-base.y}}));
    drag.current=null;e.currentTarget.classList.remove('is-dragging');if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function startTextDrag(e:ReactPointerEvent<SVGGElement>,n:Note){
    if(tool!=='move'||e.button!==0)return;
    e.stopPropagation();e.preventDefault();textDrag.current={id:n.id,pointerId:e.pointerId,start:point(e),origin:{x:n.x!,y:n.y!},box:e.currentTarget.getBBox(),moved:false,delta:{x:0,y:0}};e.currentTarget.setPointerCapture(e.pointerId);moveViewport();
  }
  function moveTextDrag(e:ReactPointerEvent<SVGGElement>){
    const d=textDrag.current;if(!d||d.pointerId!==e.pointerId)return;
    const x=e.clientX,y=e.clientY;
    schedule(()=>{const p=graphPoint(x,y,stageRef.current!.getBoundingClientRect(),world.width,world.height),delta=clampTranslation({x:p.x-d.start.x,y:p.y-d.start.y},d.box,world.width,world.height);
      if(!d.moved&&Math.hypot(delta.x,delta.y)<3)return;
      if(!d.moved)checkpoint();d.moved=true;d.delta=delta;noteElements.current.get(d.id)?.setAttribute('transform',`translate(${delta.x} ${delta.y})`);moveViewport();});
  }
  function stopTextDrag(e:ReactPointerEvent<SVGGElement>){
    if(textDrag.current?.pointerId!==e.pointerId)return;flush();const d=textDrag.current!;
    if(d.moved)setNotes(old=>old.map(n=>n.id===d.id?{...n,x:d.origin.x+d.delta.x,y:d.origin.y+d.delta.y}:n));
    noteElements.current.get(d.id)?.removeAttribute('transform');textDrag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function startPan(e:ReactPointerEvent<HTMLDivElement>){
    if(tool!=='move'||e.button!==0||(e.target as Element).closest('.graph-node,.map-annotations,.zoom-controls,.map-matn'))return;
    pan.current={id:e.pointerId,x:e.clientX,y:e.clientY,left:e.currentTarget.scrollLeft,top:e.currentTarget.scrollTop};e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.classList.add('is-panning');moveViewport();
  }
  function movePan(e:ReactPointerEvent<HTMLDivElement>){
    const p=pan.current;if(!p||p.id!==e.pointerId)return;const x=e.clientX,y=e.clientY;
    schedule(()=>{const canvas=canvasRef.current;if(canvas){canvas.scrollLeft=p.left+p.x-x;canvas.scrollTop=p.top+p.y-y;}moveViewport();});
  }
  function stopPan(e:ReactPointerEvent<HTMLDivElement>){if(pan.current?.id!==e.pointerId)return;flush();pan.current=null;e.currentTarget.classList.remove('is-panning');if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}
  function erase(p:Point){
    setNotes(old=>old.filter(n=>{
      if(n.points)return !hitsStroke(p,n.points);
      const box=noteElements.current.get(n.id)?.getBBox();
      return !box||p.x<box.x-12||p.x>box.x+box.width+12||p.y<box.y-12||p.y>box.y+box.height+12;
    }));
  }
  function startNote(e:ReactPointerEvent<SVGSVGElement>){
    if(tool==='move'||e.button!==0)return;
    e.preventDefault();moveViewport();const p=point(e);
    if(tool==='text'){setDraft({...p,text:''});return;}
    if(tool==='pen'||notes.length)checkpoint();
    e.currentTarget.setPointerCapture(e.pointerId);
    if(tool==='eraser'){erase(p);return;}
    const id='note-'+(++serial.current);stroke.current=id;setNotes(old=>[...old,{id,color,points:[p]}]);
  }
  function moveNote(e:ReactPointerEvent<SVGSVGElement>){
    if(!e.currentTarget.hasPointerCapture(e.pointerId))return;
    const x=e.clientX,y=e.clientY,id=stroke.current;
    schedule(()=>{const p=graphPoint(x,y,stageRef.current!.getBoundingClientRect(),world.width,world.height);moveViewport();
      if(tool==='eraser'){erase(p);return;}
      if(id)setNotes(old=>old.map(n=>n.id===id&&(!n.points?.length||Math.hypot(p.x-n.points.at(-1)!.x,p.y-n.points.at(-1)!.y)>2)?{...n,points:[...(n.points??[]),p]}:n));});
  }
  function endNote(e:ReactPointerEvent<SVGSVGElement>){flush();stroke.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}
  function checkpoint(){setHistory(old=>[...old.slice(-49),notes]);}
  function undo(){const previous=history[history.length-1];if(previous){setNotes(previous);setHistory(old=>old.slice(0,-1));}}
  function saveText(){if(draft?.text.trim()){checkpoint();const first=draft.text.match(/[A-Za-z\u0621-\u064a]/u)?.[0],direction=first&&/[\u0621-\u064a]/u.test(first)?'rtl':'ltr';setNotes(old=>[...old,{id:'note-'+(++serial.current),color,x:draft.x,y:draft.y,text:draft.text.trim(),direction}]);}setDraft(null);}
  function replay(){
    if(highlight)onClearHighlight?.();
    if(playing){setPlaying(false);return;}
    if(reduced.current){setCursor(last);setFinished(true);return;}
    manualUntil.current=0;setCursor(0);setFinished(false);setPlaying(true);
  }
  // Scrolling yields camera control; the independent trace timer keeps advancing.
  const moveViewport=()=>{manualUntil.current=Date.now()+5200;};
  const active=graph.nodes[cursor];
  const icons={trusted:ShieldCheck,review:CircleHelp,untrusted:ShieldX,unknown:Info,companion:ShieldCheck,prophet:BookOpen};
  const graphDrawing=useMemo(()=><>
          <svg className="graph-connections" viewBox={'0 0 '+world.width+' '+world.height} aria-hidden="true"><defs><marker id={marker} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 L6 3.5 L0 7" fill="currentColor"/></marker></defs>{graph.edges.map(edge=>{
            const to=positions.get(edge.to)!,display=edgeDisplay.get(edge.key)!;
            const traversed=to.index<=cursor,focused=playing&&to.index===cursor;
            return <g key={edge.key} ref={el=>{if(el)edgeElements.current.set(edge.key,el);else edgeElements.current.delete(edge.key);}} data-edge-from={edge.from} data-edge-to={edge.to} className={'graph-edge '+(traversed?'is-traced ':'')+(focused?'is-current ':'')+(highlight?(highlight.edgeKeys.includes(`${edge.from}|${edge.to}`)?'ai-highlighted':'ai-muted'):'')}><path d={display.path} markerEnd={'url(#'+marker+')'}/><g className="edge-caption" transform={`translate(${display.x} ${display.y})`}><rect x={-display.width/2} y={-display.height/2} width={display.width} height={display.height} rx="6"/><text textAnchor="middle" direction={locale==='ar'?'rtl':'ltr'}>{display.lines.map((line:string,i:number)=><tspan key={i} x="0" y={(i-(display.lines.length-1)/2)*16+4}>{line}</tspan>)}</text></g></g>;
          })}</svg>
          {graph.nodes.map(node=>{
            const person=people.get(node.key),tone=person?narratorTone(person):'compiler',Icon=person?icons[tone as keyof typeof icons]:BookOpen;
            const active=playing&&cursor===node.index,chosen=selected===node.key,position=positions.get(node.key)!;
            const label=person?name(person.id,person.name):compiler(node.name);
            const draftStatus=person?.bio?.sourceIds.includes('identity-review-profile')?say('مطابق للمصدر','Source-matched identity'):say('اسم من النص','Name from the text');
            return <div key={node.key} ref={el=>{if(el)nodeElements.current.set(node.key,el);else nodeElements.current.delete(node.key);}} data-node-id={node.key} className={'graph-node draggable-node '+(active?'trace-active ':'')+(highlight?(highlight.nodeIds.includes(node.key)?'ai-highlighted':'ai-muted'):'')} style={{left:position.x,top:position.y,width:node.diameter,height:node.diameter}} onPointerDown={e=>startDrag(e,node.key)} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onClickCapture={e=>{if(suppressClick.current){e.preventDefault();e.stopPropagation();suppressClick.current=false;}}}>{person?<button ref={el=>{cardsRef.current[node.index]=el;}} type="button" className={'circle-node tone-'+tone+(chosen?' is-selected':'')} onClick={()=>onSelect(person.id)} aria-pressed={chosen} aria-label={label+'، '+(reviewDraft?draftStatus:trust(tone,TRUST_LABELS[tone as keyof typeof TRUST_LABELS]))} title={label} onKeyDown={e=>{if(!e.altKey||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();moveViewport();const next=clampNode({x:position.x+(e.key==='ArrowLeft'?-20:e.key==='ArrowRight'?20:0),y:position.y+(e.key==='ArrowUp'?-20:e.key==='ArrowDown'?20:0)},node.diameter,world.width,world.height);setOffsets(old=>({...old,[node.key]:{x:next.x-world.paddingX-node.x,y:next.y-world.paddingY-node.y}}));}}><span className="node-ornament" aria-hidden="true"/><strong>{label}</strong><span className="circle-status"><Icon size={12}/>{reviewDraft?draftStatus:trust(tone,TRUST_LABELS[tone as keyof typeof TRUST_LABELS])}</span><Info className="circle-info" size={12}/></button>:<div ref={el=>{cardsRef.current[node.index]=el;}} className="circle-node tone-compiler"><span className="node-ornament" aria-hidden="true"/><BookOpen size={20}/><strong>{label}</strong><small>{t('مصنّف الكتاب · بداية المسار')}</small></div>}{node.chainIds.length>1&&graph.pathCount>1&&<span className="shared-node" title={t('راوٍ مشترك بين الطرق')}><GitBranch size={11}/></span>}</div>;
          })}
  </>,[graph,world,positions,edgeDisplay,playing,cursor,selected,tool,locale,name,compiler,trust,wording,t,onSelect,marker,highlight,reviewDraft]);
  return <div ref={workspaceRef} className={'map-workspace'+(expanded?' is-expanded':'')} role={expanded?'dialog':undefined} aria-modal={expanded?true:undefined} aria-label={expanded?say('محرر شجرة الأسانيد','Chain map editor'):undefined} onKeyDown={e=>{
    if(e.key==='Escape'&&expanded){e.preventDefault();e.stopPropagation();if(draft)setDraft(null);else void closeExpanded();}
    if(e.key==='Tab'&&expanded){const items=workspaceRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea,[tabindex="0"]');if(!items?.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  }}>
    {!reviewDraft&&<div className="map-legend" aria-label={t('معاني ألوان الرواة')}>
      <span className="legend-trusted"><ShieldCheck size={14}/> {t('أخضر: موثوق')}</span><span className="legend-review"><CircleHelp size={14}/> {t('أصفر: يحتاج مراجعة')}</span><span className="legend-untrusted"><ShieldX size={14}/> {t('أحمر: ضعيف أو متروك')}</span><span className="legend-unknown">{t('رمادي: لم يسجل حكم')}</span>
    </div>}
    {highlight&&<div className="ai-map-banner" role="status"><GitBranch size={16}/><span>{say("تحديد المساعد من الطرق المسجلة","Assistant selection from recorded paths")}</span><button onClick={onClearHighlight}><X size={14}/>{say("إظهار الخريطة كاملة","Show full map")}</button></div>}
    {reviewDraft&&<div className="ai-map-banner draft-warning" role="note">{say("شجرة من النص · الرمادي: حكم الراوي غير متحقق منه","Tree from your text · grey: narrator appraisal not verified")}</div>}
    <div className="journey-progress" role="progressbar" aria-label={t('تقدم تتبع السند')} aria-valuenow={cursor+1} aria-valuemin={0} aria-valuemax={graph.nodes.length}><span style={{width:((cursor+1)/graph.nodes.length*100)+'%'}}/></div>
    <div className="journey-controls"><span aria-hidden="true">{playing?locale==='en'?'Tracing: '+(active?.kind==='compiler'?compiler(active.name):name(active?.key,active?.name)):'نتتبّع الآن: '+active?.name:finished?t('اكتمل تتبع جميع الطرق'):t('السند كما ورد في المصدر')}</span><div className="map-view-actions"><button onClick={replay}>{playing?<Pause size={15}/>:<RotateCcw size={15}/>} {playing?t('إيقاف الحركة'):t('تتبع المسار')}</button><button ref={expandRef} onClick={toggleExpanded}>{expanded?<Minimize size={16}/>:<Maximize size={16}/>} {expanded?say('إغلاق العرض المكبّر','Exit fullscreen'):say('ملء الشاشة','Fullscreen')}</button></div><span className="sr-only" role="status" aria-live="polite">{playing?t('بدأ تتبع السند'):finished?t('اكتمل تتبع جميع الطرق'):''}</span></div>
    {expanded&&<div className="map-editor-tools" role="toolbar" aria-label={say('أدوات الخريطة','Map tools')}>
      {([{id:'move',icon:Move,ar:'تحريك',en:'Move'},{id:'pen',icon:PenLine,ar:'قلم',en:'Pen'},{id:'eraser',icon:Eraser,ar:'ممحاة',en:'Eraser'},{id:'text',icon:Type,ar:'إضافة نص',en:'Add text'}] as const).map(({id,icon:Icon,ar,en})=><button key={id} aria-pressed={tool===id} onClick={()=>{setTool(id);setDraft(null);stroke.current=null;}}><Icon size={17}/>{say(ar,en)}</button>)}
      <span className="editor-divider"/>{['#e6c76b','#81d5f2','#f7f9fc'].map(c=><button key={c} className="note-color" style={{background:c}} aria-label={say('لون الملاحظات ','Annotation colour ')+({'#e6c76b':say('ذهبي','gold'),'#81d5f2':say('أزرق','blue'),'#f7f9fc':say('أبيض','white')}[c])} aria-pressed={color===c} onClick={()=>setColor(c)}/>)}
      <button disabled={!history.length} onClick={undo}><Undo2 size={17}/>{say('تراجع','Undo')}</button><button disabled={!notes.length} onClick={()=>{checkpoint();setNotes([]);}}><Trash2 size={17}/>{say('مسح الملاحظات','Clear notes')}</button><button disabled={!Object.keys(offsets).length} onClick={()=>{setOffsets({});requestAnimationFrame(centreMap);}}><RotateCcw size={17}/>{say('ترتيب الرواة','Reset layout')}</button>
      <button onClick={fitBranches}><Move size={17}/>{say('عرض الفروع','Fit branches')}</button><small>{tool==='move'?say('اسحب الراوي أو النص. اسحب الخلفية للتنقل في المساحة الواسعة.','Drag a narrator or text. Drag the background to explore the larger workspace.'):tool==='pen'?say('ارسم داخل الخريطة.','Draw on the map.'):tool==='eraser'?say('مرّر على الملاحظات لمسحها.','Drag over annotations to erase them.'):say('اضغط في الخريطة لوضع النص.','Click the map to place text.')}</small>
    </div>}
    <div ref={canvasRef} role="region" aria-label={t('خريطة سلسلة الإسناد')} tabIndex={0} className={'tree-canvas unified-canvas '+(playing?'trace-running':'')} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={stopPan} onPointerCancel={stopPan} onWheel={moveViewport} onTouchStart={moveViewport} onKeyDown={e=>{if(e.key==='Escape')setPlaying(false);else if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))moveViewport();}}>
      <div className="unified-tree" style={{zoom,width:world.width}}>
        <div ref={stageRef} className="graph-stage" style={{width:world.width,height:world.height}}>
          {graphDrawing}
          <svg className={'map-annotations tool-'+tool} viewBox={'0 0 '+world.width+' '+world.height} aria-label={say('ملاحظات الخريطة','Map annotations')} onPointerDown={startNote} onPointerMove={moveNote} onPointerUp={endNote} onPointerCancel={endNote}>
            {notes.map(n=><g key={n.id} data-note-id={n.id} className={n.text?'text-annotation':''} tabIndex={n.text&&tool==='move'?0:undefined} role={n.text?'button':undefined} aria-label={n.text?say('تحريك الملاحظة: ','Move annotation: ')+n.text:undefined} onPointerDown={e=>startTextDrag(e,n)} onPointerMove={moveTextDrag} onPointerUp={stopTextDrag} onPointerCancel={stopTextDrag} onKeyDown={e=>{if(tool!=='move'||!n.text||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();e.stopPropagation();const box=noteElements.current.get(n.id)?.getBBox();if(!box)return;const d=clampTranslation({x:e.key==='ArrowLeft'?-20:e.key==='ArrowRight'?20:0,y:e.key==='ArrowUp'?-20:e.key==='ArrowDown'?20:0},box,world.width,world.height);checkpoint();setNotes(old=>old.map(note=>note.id===n.id?{...note,x:n.x!+d.x,y:n.y!+d.y}:note));}} ref={el=>{if(el)noteElements.current.set(n.id,el);else noteElements.current.delete(n.id);}}>{n.points?<polyline points={n.points.length===1?`${n.points[0].x},${n.points[0].y} ${n.points[0].x+.1},${n.points[0].y}`:n.points.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke={n.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>:<text x={n.x} y={n.y} fill={n.color} textAnchor={n.direction==='rtl'?'end':'start'} direction={n.direction??'ltr'}>{n.text?.split('\n').map((line,i)=><tspan key={i} x={n.x} dy={i?28:0}>{line}</tspan>)}</text>}</g>)}
          </svg>
        <div style={{position:'absolute',left:world.paddingX+graph.width/2,top:world.paddingY+graph.height+32,transform:'translateX(-50%)',width:Math.min(graph.width-20,420)}} className={'map-matn grade-'+(hadith.judgement?.grade||'unknown')} role="note" aria-label={t('متن الرواية')}><small>{reviewDraft?say('متن النص المدخل','Text from your supplied source'):hadith.judgement?.grade==='fabricated'?t('نص الرواية الموضوعة — لا يثبت عن النبي ﷺ'):hadith.judgement?.grade==='weak'?t('نص الرواية الضعيفة — انظر حكم المحدث'):t('متن الحديث')}</small>{reviewDraft?<blockquote className="hadith-text" dir="auto">{hadith.matn||say("لم يُدخل متن للرواية.","No report text was supplied.")}</blockquote>:<HadithText hadith={hadith}/>}<p className="map-source-hint">{reviewDraft?say('لم يُتحقق من مصدر النص أو الحكم عليه.','The source and grading of this text have not been verified.'):t('اقرأ الحكم والمراجع كاملة في تبويب المتن والمصدر.')}</p></div>
        </div>
      </div>
      <div className="zoom-controls"><button aria-label={t('تكبير')} onClick={()=>changeZoom(Math.min(1.5,zoom+.1))}><Plus size={18}/></button><button aria-label={t('تصغير')} onClick={()=>changeZoom(Math.max(.35,zoom-.1))}><Minus size={18}/></button><button aria-label={say('عرض جميع الفروع','Fit all branches')} onClick={fitBranches}><RotateCcw size={16}/></button></div>
    </div>
    {draft&&<form className="map-text-form" onSubmit={e=>{e.preventDefault();saveText();}}><label htmlFor={marker+'-text'}>{say('اكتب ملاحظتك','Write your annotation')}</label><textarea id={marker+'-text'} autoFocus maxLength={500} value={draft.text} onChange={e=>setDraft({...draft,text:e.target.value})} dir="auto"/><div><button type="submit" disabled={!draft.text.trim()}><Check size={16}/>{say('إضافة','Add')}</button><button type="button" onClick={()=>setDraft(null)}><X size={16}/>{say('إلغاء','Cancel')}</button></div></form>}
  </div>;
}


