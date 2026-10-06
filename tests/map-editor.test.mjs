import test from 'node:test';
import assert from 'node:assert/strict';
import {graphPoint,clampNode,hitsStroke,editingWorld,clampTranslation,translateAnnotation} from '../lib/map-editor.mjs';
import {curvedLink} from '../lib/sanad-map.mjs';

test('pointer coordinates follow zoom and viewport offsets without shifting the graph',()=>{
  assert.deepEqual(graphPoint(300,500,{left:100,top:100,width:600,height:1200},300,600),{x:100,y:200});
  assert.deepEqual(graphPoint(250,400,{left:100,top:100,width:450,height:900},300,600),{x:100,y:200});
  assert.deepEqual(clampNode({x:-200,y:900},144,460,800),{x:82,y:718});
});
test('dragged connections remain finite for horizontal, reverse and overlapping positions',()=>{
  for(const to of [{x:100,y:100},{x:101,y:100},{x:300,y:100},{x:50,y:0}]){
    const path=curvedLink({x:100,y:100},to);
    assert.match(path,/^M .* C /);assert.doesNotMatch(path,/NaN|Infinity/);
  }
  assert.notEqual(curvedLink({x:100,y:100},{x:200,y:400}),curvedLink({x:150,y:130},{x:200,y:400}));
});
test('eraser detects the middle of sparse strokes and leaves distant notes alone',()=>{
  const points=[{x:10,y:20},{x:300,y:20}];
  assert.equal(hitsStroke({x:150,y:25},points),true);
  assert.equal(hitsStroke({x:150,y:80},points),false);
  assert.equal(hitsStroke({x:10,y:20},[{x:10,y:20}]),true);
});
test('editing world permits dragging far beyond the original layout without clipping connections',()=>{
  const original={width:460,height:1500},world=editingWorld(original);
  assert.ok(world.width>2000);assert.ok(world.height>2500);
  const start={x:world.paddingX+230,y:world.paddingY+104};
  const moved=clampNode({x:start.x+650,y:start.y+700},144,world.width,world.height);
  assert.equal(moved.x,start.x+650);assert.equal(moved.y,start.y+700);
  assert.doesNotMatch(curvedLink(moved,{x:start.x,y:start.y+218}),/NaN|Infinity/);
});
test('text movement clamps its full measured bounds, including RTL and multiline text',()=>{
  const box={x:850,y:200,width:180,height:65};
  assert.deepEqual(clampTranslation({x:500,y:300},box,2260,2800),{x:500,y:300});
  const delta=clampTranslation({x:-900,y:-900},box,2260,2800);
  assert.equal(box.x+delta.x,12);assert.equal(box.y+delta.y,12);
  const far=clampTranslation({x:9000,y:9000},box,2260,2800);
  assert.equal(box.x+box.width+far.x,2248);assert.equal(box.y+box.height+far.y,2788);
});
test('whole-stroke movement preserves shape and undo snapshots, and erasing follows the new position',()=>{
  const note={id:'drawing',color:'#f87171',points:[{x:100,y:100},{x:130,y:150},{x:170,y:180}]};
  const snapshot=JSON.stringify(note),delta={x:250,y:-50},moved=translateAnnotation(note,delta);
  assert.deepEqual(moved.points,[{x:350,y:50},{x:380,y:100},{x:420,y:130}]);
  assert.equal(moved.id,note.id);assert.equal(moved.color,note.color);assert.equal(JSON.stringify(note),snapshot);
  assert.equal(hitsStroke({x:380,y:100},moved.points),true);assert.equal(hitsStroke({x:130,y:150},moved.points),false);
  assert.deepEqual(translateAnnotation(moved,{x:-250,y:50}),note);
  assert.deepEqual(translateAnnotation({id:'dot',points:[{x:10,y:20}]},{x:3,y:4}).points,[{x:13,y:24}]);
  assert.deepEqual(translateAnnotation({id:'text',x:40,y:60,text:'ملاحظة'},{x:10,y:-20}),{id:'text',x:50,y:40,text:'ملاحظة'});
});
