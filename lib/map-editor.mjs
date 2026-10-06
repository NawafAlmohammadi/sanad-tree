// All edits use graph coordinates, independent of CSS zoom and canvas scrolling.
export function graphPoint(clientX,clientY,rect,width,height){
  return {x:(clientX-rect.left)*width/rect.width,y:(clientY-rect.top)*height/rect.height};
}
export function clampNode(point,diameter,width,height){
  const r=diameter/2+10;
  return {x:Math.max(r,Math.min(width-r,point.x)),y:Math.max(r,Math.min(height-r,point.y))};
}
// Source layout is centred in a larger editable world, without changing its edges.
export function editingWorld(graph){
  const paddingX=900,paddingY=300;
  return {paddingX,paddingY,width:graph.width+paddingX*2,height:graph.height+1300};
}
export function clampTranslation(delta,box,width,height){
  return {x:Math.max(12-box.x,Math.min(width-12-box.x-box.width,delta.x)),y:Math.max(12-box.y,Math.min(height-12-box.y-box.height,delta.y))};
}
export function distanceToSegment(point,a,b){
  const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
  const t=den?Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/den)):0;
  return Math.hypot(point.x-a.x-t*dx,point.y-a.y-t*dy);
}
export function hitsStroke(point,points,radius=16){
  return points.some((p,i)=>distanceToSegment(point,points[Math.max(0,i-1)],p)<=radius);
}

/**
 * Move the whole annotation without changing its shape or its source snapshot.
 * @template {{points?:{x:number,y:number}[],x?:number,y?:number}} T
 * @param {T} note
 * @param {{x:number,y:number}} delta
 */
export function translateAnnotation(note,delta){
  return note.points?{...note,points:note.points.map(p=>({x:p.x+delta.x,y:p.y+delta.y}))}
    :{...note,x:(note.x??0)+delta.x,y:(note.y??0)+delta.y};
}
