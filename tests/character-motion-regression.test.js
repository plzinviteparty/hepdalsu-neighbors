'use strict';
// Run: node tests/character-motion-regression.test.js
// Patient 05 must not walk in place just because she joins the party.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','raster.js'),'utf8');
const found=source.match(/function drawAtlasSprite\(kind,x,y,face='down'\)\{[\s\S]*?\n\}\n\nfunction drawRasterSprite/);
assert(found,'Missing atlas renderer');
const body=found[0].replace(/\n\nfunction drawRasterSprite$/,'');
const calls=[];
const cx={save(){},restore(){},set imageSmoothingEnabled(v){},drawImage(...args){calls.push(args)}};
const s={room:'ward',party:['kim','jubin','changwon','nasol','patient05'],script:null};
const atlas={complete:true,naturalWidth:384,naturalHeight:672};
const factory=new Function('cx','s','atlas',
 'const CHARACTER_ATLAS_ROWS={guard:0,patient05:2,dalsu:4};'+
 'const CHARACTER_ATLAS_CELL={width:96,height:112,feetY:105};'+
 'const characterAtlasImage=atlas;let frameTime=0;function shadow(){}'+
 body+';return {draw:drawAtlasSprite,setTime(t){frameTime=t}};');
const renderer=factory(cx,s,atlas);
function draw(kind,time,face='down'){
 renderer.setTime(time);calls.length=0;
 assert(renderer.draw(kind,240,140,face));assert.equal(calls.length,1);return calls[0];
}
for(const t of [0,.24,.48,.72,1.2]){
 const frame=draw('patient05',t);
 assert.equal(frame[2],224,'Patient 05 should remain on idle source row');
 assert.equal(frame[5],192,'Left anchor changed');
 assert.equal(frame[6],35,'Feet anchor changed');
}
assert.equal(draw('patient05',.37,'left')[1],96);
assert.equal(draw('patient05',.37,'up')[1],288);
assert.equal(draw('guard',.21)[2],112,'Guard walk animation broke');
s.room='loop';
assert.equal(draw('dalsu',.21)[2],560,'Dalsu walk animation broke');
console.log('PASS: Patient 05 follower motion, anchors and guard/Dalsu animation');
