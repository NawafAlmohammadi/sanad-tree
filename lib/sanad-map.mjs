export const TRUST_LABELS={trusted:'موثوق',review:'فيه شك',untrusted:'غير ثقة',unknown:'لم يسجل حكم',companion:'صحابي',prophet:'النبي ﷺ'};
export function narratorTone(n) {
  if(n.role?.narratorId===n.id && n.role.sourceIds?.length && ['companion','prophet'].includes(n.role.type))return n.role.type;
  const r=n.reliability;
  return r?.narratorId===n.id && r.text && r.sourceIds?.length && ['trusted','review','untrusted'].includes(r.status)?r.status:'unknown';
}
export function journeySteps(hadith,chain,narrators) {
  const people=new Map(narrators.map(n=>[n.id,n]));
  const steps=chain.nodes.map(id=>({key:id,name:people.get(id)?.name||id,kind:'narrator'}));
  const compiler=chain.compiler??hadith.compiler;
  if(compiler)steps.unshift({key:compiler.name===hadith.compiler?.name?'compiler':`compiler:${compiler.name}`,name:compiler.name,kind:'compiler'});
  return steps;
}

// Follow one recorded chain at a time; merged nodes keep their identity.
export function traceSteps(hadith,narrators) {
  return hadith.chains.flatMap((chain,pathIndex)=>{
    const path=journeySteps(hadith,chain,narrators);
    return path.map((node,index)=>({...node,chainId:chain.id,pathIndex,
      preceding:path.slice(0,index).map(n=>n.key),
      edgeKeys:path.slice(1,index+1).map((n,i)=>`${path[i].key}→${n.key}`),
      incoming:index?`${path[index-1].key}→${node.key}`:null
    }));
  });
}

// Identity IDs, never display names, determine which narrators can be merged.
export function unifiedGraph(hadith,narrators,viewportWidth=0,{compact=false}={}) {
  const people=new Map(narrators.map(n=>[n.id,n])), nodes=new Map(), edges=new Map();
  const addNode=(id,chainId,compiler)=>{
    if(!nodes.has(id))nodes.set(id,{key:id,name:compiler?compiler.name:people.get(id)?.name||id,kind:compiler?'compiler':'narrator',chainIds:[]});
    const node=nodes.get(id);if(!node.chainIds.includes(chainId))node.chainIds.push(chainId);
  };
  const addEdge=(from,to,wording,sourceIds,chainId)=>{
    const key=`${from}→${to}`;
    if(!edges.has(key))edges.set(key,{key,from,to,wordings:[],transmissions:[],sourceIds:[],chainIds:[]});
    const edge=edges.get(key);if(wording&&!edge.wordings.includes(wording))edge.wordings.push(wording);
    if(wording){
      let transmission=edge.transmissions.find(t=>t.wording===wording);
      if(!transmission){transmission={wording,paths:[]};edge.transmissions.push(transmission);}
      let path=transmission.paths.find(p=>p.chainId===chainId);
      if(!path){path={chainId,sourceIds:[]};transmission.paths.push(path);}
      path.sourceIds=[...new Set([...path.sourceIds,...sourceIds])];
    }
    edge.sourceIds=[...new Set([...edge.sourceIds,...sourceIds])];if(!edge.chainIds.includes(chainId))edge.chainIds.push(chainId);
  };
  for(const chain of hadith.chains){
    chain.nodes.forEach(id=>addNode(id,chain.id));
    const compiler=chain.compiler??hadith.compiler;
    if(compiler){const key=compiler.name===hadith.compiler?.name?'compiler':`compiler:${compiler.name}`;addNode(key,chain.id,compiler);addEdge(key,chain.nodes[0],compiler.wording,compiler.sourceIds,chain.id);}
    for(const link of chain.links)addEdge(link.from,link.to,link.wording,link.sourceIds,chain.id);
  }
  const incoming=new Map([...nodes.keys()].map(id=>[id,0])), ranks=new Map([...nodes.keys()].map(id=>[id,0]));
  for(const edge of edges.values())incoming.set(edge.to,incoming.get(edge.to)+1);
  const queue=[...nodes.keys()].filter(id=>incoming.get(id)===0),order=[];
  for(let i=0;i<queue.length;i++){
    const id=queue[i];order.push(id);
    for(const edge of edges.values())if(edge.from===id){ranks.set(edge.to,Math.max(ranks.get(edge.to),ranks.get(id)+1));incoming.set(edge.to,incoming.get(edge.to)-1);if(incoming.get(edge.to)===0)queue.push(edge.to);}
  }
  if(order.length!==nodes.size)throw new Error('A sanad graph must be acyclic');
  const layers=[];for(const id of order){const rank=ranks.get(id);(layers[rank]||= []).push(id);}
  // Reserve a lane at every skipped rank. These are routing points, never new narrators.
  const segments=[],routes=new Map();
  for(const edge of edges.values()){
    let previous=edge.from;const route=[];
    for(let rank=ranks.get(edge.from)+1;rank<ranks.get(edge.to);rank++){
      const id=`route:${edge.key}:${rank}`;layers[rank].push(id);ranks.set(id,rank);route.push(id);segments.push({from:previous,to:id});previous=id;
    }
    segments.push({from:previous,to:edge.to});routes.set(edge.key,route);
  }
  const neighbours=new Map(layers.flat().map(id=>[id,{up:[],down:[]}]));
  for(const e of segments){neighbours.get(e.to).up.push(e.from);neighbours.get(e.from).down.push(e.to);}
  const crossings=()=>{
    const index=new Map(layers.flatMap(layer=>layer.map((id,i)=>[id,i])));let count=0;
    for(let rank=0;rank<layers.length-1;rank++){
      const list=segments.filter(e=>ranks.get(e.from)===rank);
      for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++)if((index.get(list[i].from)-index.get(list[j].from))*(index.get(list[i].to)-index.get(list[j].to))<0)count++;
    }
    return count;
  };
  let best=layers.map(l=>[...l]),score=crossings();
  for(let pass=0;pass<8;pass++){
    const down=pass%2===0,start=down?1:layers.length-2,end=down?layers.length:-1;
    for(let rank=start;rank!==end;rank+=down?1:-1){
      const adjacent=layers[rank+(down?-1:1)],index=new Map(adjacent.map((id,i)=>[id,i])),old=new Map(layers[rank].map((id,i)=>[id,i]));
      const centre=id=>{const ns=neighbours.get(id)[down?'up':'down'];return ns.length?ns.reduce((n,k)=>n+index.get(k),0)/ns.length:old.get(id);};
      layers[rank].sort((a,b)=>centre(a)-centre(b)||old.get(a)-old.get(b));
    }
    const next=crossings();if(next<score){score=next;best=layers.map(l=>[...l]);}
  }
  layers.splice(0,layers.length,...best);
  const widest=Math.max(...layers.map(l=>l.length)),diameter=viewportWidth&&viewportWidth<400?128:144,spacing=diameter+104,rowHeight=compact?230:280;
  // A narrow viewport pans over this layout; it never squeezes its branches together.
  const width=Math.max(380,(widest-1)*spacing+diameter+120),points=new Map();
  for(let rank=0;rank<layers.length;rank++)layers[rank].forEach((id,column)=>points.set(id,{x:width/2+(column-(layers[rank].length-1)/2)*spacing,y:104+rank*rowHeight}));
  const positioned=order.map((id,index)=>({...nodes.get(id),index,rank:ranks.get(id),...points.get(id),diameter}));
  return {nodes:positioned,edges:[...edges.values()].map(e=>({...e,route:routes.get(e.key).map(id=>points.get(id))})),width,height:208+(layers.length-1)*rowHeight,pathCount:hadith.chains.length};
}

// Curves pass through reserved empty lanes when a source edge skips a rank.
export function linkGeometry(from,to,radius=72,route=[]){
  if(Math.hypot(to.x-from.x,to.y-from.y)<1&&!route.length)return {path:curvedLink(from,to,radius),label:{x:from.x+radius*1.7,y:from.y},normal:{x:1,y:0}};
  const points=[from,...route,to],first=points[1],penultimate=points.at(-2);
  const anchor=(centre,toward,r)=>{const dx=toward.x-centre.x,dy=toward.y-centre.y,len=Math.hypot(dx,dy)||1;return {x:centre.x+dx/len*r,y:centre.y+dy/len*r};};
  points[0]=anchor(from,first,radius+5);points[points.length-1]=anchor(to,penultimate,radius+8);
  const curves=points.slice(0,-1).map((a,i)=>{const b=points[i+1],dx=b.x-a.x,dy=b.y-a.y;
    const c1=Math.abs(dy)<1?{x:a.x+dx*.4,y:a.y-36}:{x:a.x+(Math.abs(dx)<1?34:0),y:a.y+dy*.48};
    const c2=Math.abs(dy)<1?{x:a.x+dx*.6,y:b.y+36}:{x:b.x-(Math.abs(dx)<1?34:0),y:b.y-dy*.48};
    return {a,b,c1,c2};});
  const path=`M ${points[0].x} ${points[0].y}`+curves.map(c=>` C ${c.c1.x} ${c.c1.y}, ${c.c2.x} ${c.c2.y}, ${c.b.x} ${c.b.y}`).join('');
  const c=curves[Math.floor((curves.length-1)/2)],t=.53,u=1-t;
  const label={x:u*u*u*c.a.x+3*u*u*t*c.c1.x+3*u*t*t*c.c2.x+t*t*t*c.b.x,y:u*u*u*c.a.y+3*u*u*t*c.c1.y+3*u*t*t*c.c2.y+t*t*t*c.b.y};
  const dx=3*u*u*(c.c1.x-c.a.x)+6*u*t*(c.c2.x-c.c1.x)+3*t*t*(c.b.x-c.c2.x),dy=3*u*u*(c.c1.y-c.a.y)+6*u*t*(c.c2.y-c.c1.y)+3*t*t*(c.b.y-c.c2.y),len=Math.hypot(dx,dy)||1;
  return {path,label,normal:{x:-dy/len,y:dx/len}};
}
export function wrapEdgeLabel(text){
  const lines=[];let line='';for(const word of text.split(/\s+/)){if(line&&line.length+word.length+1>30){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);return lines;
}
export function placeEdgeLabels(edges,nodes){
  const placed=[],result=new Map();
  for(const edge of edges){
    const width=Math.max(38,...edge.lines.map(line=>line.length*7+18)),height=edge.lines.length*16+10;
    const candidates=[0,22,-22,44,-44,70,-70,100,-100].flatMap(distance=>[0,26,-26,52,-52].map(y=>({x:edge.label.x+edge.normal.x*distance,y:edge.label.y+edge.normal.y*distance+y})));
    const collision=p=>{
      const box={x:p.x-width/2,y:p.y-height/2,width,height};
      let score=placed.filter(b=>box.x<b.x+b.width+10&&box.x+width>b.x-10&&box.y<b.y+b.height+8&&box.y+height>b.y-8).length;
      for(const n of nodes){const x=Math.max(box.x,Math.min(box.x+width,n.x)),y=Math.max(box.y,Math.min(box.y+height,n.y));if(Math.hypot(x-n.x,y-n.y)<n.diameter/2+16)score+=10;}
      return score;
    };
    let position=candidates[0],score=Infinity;for(const p of candidates){const next=collision(p);if(next<score){position=p;score=next;}if(!next)break;}
    placed.push({x:position.x-width/2,y:position.y-height/2,width,height});result.set(edge.key,{...position,width,height});
  }
  return result;
}

export function curvedLink(from,to,radius=72) {
  const dx=to.x-from.x,dy=to.y-from.y,length=Math.hypot(dx,dy);
  // Overlapping dragged cards still have a finite, visible connection.
  if(length<1)return `M ${from.x} ${from.y-radius} C ${from.x+radius*2} ${from.y-radius*2}, ${to.x+radius*2} ${to.y+radius*2}, ${to.x} ${to.y+radius}`;
  const ux=dx/length,uy=dy/length;
  const sx=from.x+ux*(radius+5),sy=from.y+uy*(radius+5),tx=to.x-ux*(radius+8),ty=to.y-uy*(radius+8);
  const bend=dx===0?42:dx*.35;
  return `M ${sx} ${sy} C ${sx+bend} ${sy+(ty-sy)*.38}, ${tx-bend} ${ty-(ty-sy)*.38}, ${tx} ${ty}`;
}
