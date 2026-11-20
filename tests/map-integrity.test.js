'use strict';
// Run from repository root: node tests/map-integrity.test.js
// Static world and geometry checks; no browser, network or saved games needed.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const scripts = [
 'story.js','facility-revision.js','mansion-route.js','paradise-lore.js',
 'fasting-room.js','evidence-puzzles.js','detective-route.js',
 'pixel-polish.js','observation-polish.js','capture-cinematic.js',
 'story-continuity.js','prop-readability.js','facility-tone.js',
 'ritual-readability.js','dormitory-furnishings.js','tactile-puzzles.js','case-board.js','pursuit-polish.js','companion-rescue.js'
];
const read = f => fs.readFileSync(path.join(root,f),'utf8');
const combined = scripts.map(read).join('\n');
const engine = read('game.js');
const {MAPS,SCRIPTS,SCENERY,DOOR_ACTIONS} = new Function(combined + '\nreturn {MAPS,SCRIPTS,SCENERY,DOOR_ACTIONS};')();
const extract = (start,end) => {
 const a=engine.indexOf(start), b=engine.indexOf(end,a+start.length);
 assert(a>=0&&b>a,'Engine geometry function unavailable: '+start);
 return engine.slice(a,b);
};
const collisionCode=extract('function collision(room)','function walkable(');
const arrivalCode=extract('function arrivalCell(','function setRoom(');
const geometry=new Function(combined + '\nconst collisionCache={};let s={flags:{},dropped:[]};\n'+collisionCode+'\n'+arrivalCode+'\nreturn {MAPS,SCRIPTS,SCENERY,collision,arrivalCell};')();
const {collision,arrivalCell} = geometry;
const direction=[[1,0],[-1,0],[0,1],[0,-1]];
let assertions=0;
const check=(condition,message) => {assert(condition,message);assertions++};
const cells=(room,x,y,ignoreObject=null) => {
 const m=MAPS[room];
 if(x<1||y<3||x>=m.w-1||y>=m.h-1||collision(room).has(x+','+y))return false;
 return !m.objects.some(o => o.id!==ignoreObject && !o.hide && !o.need
     && !['bone','pen','mark','ghostcat'].includes(o.kind)
     && o.x===x&&o.y===y);
};
function flood(room,start){
 const queue=[start],seen=new Set([start.join(',')]);
 for(let i=0;i<queue.length;i++){
  const [x,y]=queue[i];
  for(const [dx,dy] of direction){
   const nx=x+dx,ny=y+dy,k=nx+','+ny;
   if(!seen.has(k)&&cells(room,nx,ny)){seen.add(k);queue.push([nx,ny])}
  }
 }
 return {seen,queue};
}
const mapEntries={
 prom:[8,20],landing:[4,6],ward:[4,12],bath:[4,7],
 loop:[3,5],backroom:[3,4],pool:[5,5],chase:[3,8],
 wreck:[5,9],bedroom:[5,8],lab:[8,8],research:[4,10],
 altar:[13,25],annex05:[5,16]
};
const entries=[{scene:'newGame',room:'prom',x:8,y:20}],edges={};
const storyLinks=[];
for(const [scene,nodes] of Object.entries(SCRIPTS)){
 for(const node of nodes){
  if(node.op==='room')entries.push({scene,room:node.room,x:node.x,y:node.y});
  if(node.jump)storyLinks.push([scene,node.jump]);
  if(node.branch)storyLinks.push([scene,node.yes],[scene,node.no]);
  if(node.op==='allParty')storyLinks.push([scene,node.yes],[scene,node.no]);
  if(node.choice)for(const option of node.options)storyLinks.push([scene,option.to]);
 }
}
for(const [src,dst] of storyLinks)check(!!SCRIPTS[dst], 'Broken scene link: '+src+' -> '+dst);
let corrected=0;
for(const {room,scene,x,y} of entries){
 check(!!MAPS[room],'Unknown arrival map from '+scene+': '+room);
 const [nx,ny]=arrivalCell(room,x,y);
 check(cells(room,nx,ny),'Blocked arrival after '+scene+' -> '+room+' '+nx+','+ny);
 if(nx!==x||ny!==y)corrected++;
}
const accessible={};
for(const [room,m] of Object.entries(MAPS)){
 const start=arrivalCell(room,...mapEntries[room]);
 const {queue,seen}=flood(room,start);
 check(queue.length>0,'Map inaccessible: '+room);
 accessible[room]=queue.length;
 const distance=(o,x,y)=>Math.hypot(
  Math.max(0,Math.abs(o.x-x)-(o.rx||0)),
  Math.max(0,Math.abs(o.y-y)-(o.ry||0))
 );
 for(const o of m.objects){
  check(queue.some(([x,y])=>distance(o,x,y)<=1.55),'Unreachable object: '+room+'/'+o.id);
  check(!!SCRIPTS[o.id]||!!DOOR_ACTIONS[o.id]||[
   'nurse','lockedWard','exitProm','bathExit','chair','record',
   'mirror','jubin','changwon','quietConsole','cameraReader'
  ].includes(o.id),'Object without script: '+room+'/'+o.id);
 }
 for(const o of SCENERY[room]||[]){
  check(!!SCRIPTS[o.proxy||o.id],'Unimplemented scenery: '+room+'/'+o.id);
  check(m.props.some(([kind,x,y])=>kind===o.kind&&x===o.x&&y===o.y),
     'Scenery not attached to visual prop: '+room+'/'+o.id);
  check(queue.some(([x,y])=>distance(o,x,y)<=1.55),
     'Scenery cannot be investigated: '+room+'/'+o.id);
  const clickPositions=[];
  for(let x=o.x-(o.rx||0)-1;x<=o.x+(o.rx||0)+1;x++)
   for(let y=o.y-(o.ry||0)-1;y<=o.y+(o.ry||0)+1;y++)
    if(seen.has(x+','+y)&&distance(o,x,y)<=1.05)clickPositions.push([x,y]);
  check(clickPositions.length>0,'No mobile click-to-walk approach: '+room+'/'+o.id);
 }
}
const raster = new Function(read('raster.js')+'\nreturn RASTER_MANIFEST;')();
const assets = new Set([
 ...Object.values(raster.sprites).flatMap(Object.values),
 ...Object.values(raster.props),
 ...Object.values(raster.textures).flatMap(Object.values)
]);
for(const a of assets)check(fs.existsSync(path.join(root,a)),'Missing raster asset: '+a);
const html=read('index.html');
for(const f of scripts)check(html.includes('src="'+f+'?'),'Missing script in HTML: '+f);
check(html.indexOf('dormitory-furnishings.js')<html.indexOf('game.js'),'Graphics load after game');
console.log(JSON.stringify({passed:true,maps:Object.keys(MAPS).length,arrivals:entries.length,
 correctedArrivals:corrected,sceneLinks:storyLinks.length,assets:assets.size,
 assertions,reachableCells:accessible},null,2));
