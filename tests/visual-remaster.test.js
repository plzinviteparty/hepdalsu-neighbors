'use strict';
// Run: node tests/visual-remaster.test.js
// These checks are asset wiring/pixel-footprint smoke tests, not a browser
// screenshot comparison or a substitute for visual QA.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const remaster=read('visual-remaster.js'),game=read('game.js'),
  html=read('index.html'),raster=read('raster.js'),pixel=read('pixel-polish.js'),
  pursuit=read('pursuit-polish.js'),prologue=read('prologue.js'),
  photo=read('tactile-puzzles.js'),style=read('style.css');
const arts=['intro-female-road.svg','intro-female-mansion.svg',
 'dalsu-encounter-remaster.svg','reporter-evidence-remaster.svg'];
for(const name of arts){
 const content=read('art/'+name);
 assert.match(content,/^<svg /,'SVG root missing: '+name);
 assert(content.trim().endsWith('</svg>'),'Unclosed SVG '+name);
 assert(content.length>4000,'Art may be a placeholder: '+name);
}
assert(!remaster.includes('drawImage('),'Character sprites must be pixel-grid art, not image cutouts');
assert(pursuit.includes("drawRemasterSprite('guard'"),'Guard chase sprite not connected');
assert(raster.includes("drawRemasterSprite(kind==='nurse'?'guard':kind"),'Guard and Dalsu raster override missing');
assert(pixel.includes("drawRemasterSprite('patient05'"),'Patient 05 sprite not connected');
assert(prologue.includes('intro-female-road.svg')&&prologue.includes('intro-female-mansion.svg'),
 'Female protagonist cutscene paths missing');
assert(raster.includes('dalsu-encounter-remaster.svg'),'Dalsu cutscene is still low-resolution');
assert(photo.includes('reporter-evidence-remaster.svg'),'Reporter evidence is still low-resolution');
assert(style.includes('.cinematicArtwork')&&game.includes('updateCinematicArtwork();'),
 'Cinematic art is still scaled through the pixel canvas');
assert(style.includes('.objectLabel')&&game.includes('drawReadableObjectLabel(e.label,x,labelY)'),
 'Crisp object labels are missing');
assert(html.indexOf('visual-remaster.js')<html.indexOf('game.js'),
 'Sprites are not registered before the game starts');
const painted=[],transform=[];
const cx={
 save(){},restore(){},translate(){},
 scale(x,y){transform.push([x,y])},
 fillRect(x,y,w,h){painted.push([x,y,w,h]);},
 set fillStyle(v){this.current=v}
};
const state={room:'loop',script:null,party:['patient05']};
const draw=new Function('cx','s','frameTime','shadow',remaster+'\nreturn drawRemasterSprite;')(cx,state,0,()=>{});
const profiles={guard:82,patient05:82,dalsu:94};
const output=[];
for(const kind of Object.keys(profiles)){
 for(const face of ['down','up','left','right']){
  painted.length=0;transform.length=0;
  assert.equal(draw(kind,300,250,face),true,'Failed to draw '+kind+' '+face);
  assert(painted.length>=40,'Sprite lacks expected detail: '+kind+' '+face);
  assert(painted.every(r=>r[2]>=1&&r[3]>=1&&r.every(Number.isFinite)),
   'Broken pixel rectangle '+kind+' '+face);
  const tallest=Math.min(...painted.map(r=>r[1]))*2;
  assert(tallest>=-100&&tallest<=-67,'Character scale is inconsistent: '+kind);
  output.push({kind,face,rectangles:painted.length,approxHeight:Math.abs(tallest)});
 }
}
console.log(JSON.stringify({passed:true,artFiles:arts.length,spriteFaces:output.length,
 spriteFootprints:output.filter(v=>v.face==='down')},null,2));
