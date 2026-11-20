'use strict';
// Run from repo root: node tests/pursuit-integrity.test.js
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const modules=['story.js','facility-revision.js','mansion-route.js','paradise-lore.js',
 'fasting-room.js','evidence-puzzles.js','detective-route.js','pixel-polish.js',
 'observation-polish.js','capture-cinematic.js','story-continuity.js',
 'prop-readability.js','facility-tone.js','ritual-readability.js',
 'dormitory-furnishings.js','tactile-puzzles.js','case-board.js','pursuit-polish.js'];
const engine=read('game.js'),collStart=engine.indexOf('function collision(room)'),
 collEnd=engine.indexOf('function walkable(',collStart);
assert(collStart>=0&&collEnd>collStart,'Could not locate engine collision grid');
const code=modules.map(read).join('\n')+'\n'+engine.slice(collStart,collEnd);
const run=new Function('assert',code+String.raw`
 const TS=32,DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},
 collisionCache={};let camera={x:0,y:0};
 const rects=[];
 let s={room:'loop',x:5,y:6,flags:{},inventory:['record'],party:['kim'],
  dropped:[],solvedPuzzles:{'case-locker':true}},started=true,paused=false,
  ended=false,frameTime=0,keys={},path=[],pathTarget=null,moveDelay=0,autosa=0;
 const messages=[];let lastSave=null;
 function sound(){}
 function notify(v){messages.push(v)}
 function resetJoystick(){}
 function idle(){}
 function autoSave(){lastSave=JSON.parse(JSON.stringify(s))}
 function setRoom(room,x,y){s.room=room;s.x=x;s.y=y}
 function shadow(){}
 const cx={save(){},restore(){},translate(){},scale(){},
  fillRect(x,y,w,h){assert([x,y,w,h].every(Number.isFinite),'Invalid drawing coords');
  assert(w>=0&&h>=0,'Negative drawing size');rects.push([x,y,w,h])}};
 function rect(x,y,w,h){cx.fillRect(x,y,w,h)}
 function txt(){}
 function wardHidden(){return false}
 assert.equal(ensureLoopWatch(),null,'Do not patrol before first encounter');
 s.flags.dalsuEncounter=true;
 for(const point of LOOP_WATCH_ROUTE)assert(validLoopWatchStep(...point),'Patrol stop blocked');
 for(const point of LOOP_WATCH_ROUTE.slice(1))
  assert(loopWatchPath(27,12,...point).length>0,'No path to patrol stop');
 let w=ensureLoopWatch();assert.equal(w.grace,4.5);
 // Sightline alert starts with a readable warning and escalates when not evaded.
 s.x=23;s.y=8;w.x=26;w.y=8;w.face='left';w.grace=0;
 assert(loopWatchCanSee(w),'Clear facing sightline missing');
 for(let i=0;i<30&&w.mode!=='chase';i++)tickLoopWatch(.05);
 assert.equal(w.mode,'chase','Detection never started a chase');
 assert(messages.some(x=>x.includes('허달수')),'No detection warning');
 // Out of sight for 3.5 seconds returns to ordinary route.
 s.x=5;s.y=6;
 for(let i=0;i<95;i++)tickLoopWatch(.05);
 assert.equal(w.mode,'patrol','Failed to lose the stalker');
 // Suspicion dies off when the player turns a corner early.
 w.x=26;w.y=8;w.face='left';w.mode='patrol';w.alert=0;w.grace=0;
 s.x=23;s.y=8;tickLoopWatch(.1);
 assert.equal(w.mode,'alert');s.x=5;s.y=6;
 for(let i=0;i<40;i++)tickLoopWatch(.05);
 assert.equal(w.mode,'patrol','Alert did not decay');
 // Existing saved evidence and companions survive a non-terminal capture.
 w.x=21;w.y=8;w.mode='chase';w.grace=0;s.x=21;s.y=8;
 tickLoopWatch(.05);
 assert.deepEqual([s.x,s.y],[3,6]);
 assert(s.loopWatcher.grace>=7,'Capture retry grace missing');
 assert(s.inventory.includes('record')&&s.party.includes('kim'));
 assert(s.solvedPuzzles['case-locker']&&s.flags.dalsuEncounter);
 assert.equal(lastSave.room,'loop','Capture was not saved');
 // Dialogue and pause freeze enemy state, with no accidental movement.
 const before=[s.loopWatcher.x,s.loopWatcher.y,s.loopWatcher.grace];
 s.script='doorStay';tickLoopWatch(.5);
 assert.deepEqual([s.loopWatcher.x,s.loopWatcher.y,s.loopWatcher.grace],before);
 s.script=null;paused=true;tickLoopWatch(.5);
 assert.deepEqual([s.loopWatcher.x,s.loopWatcher.y,s.loopWatcher.grace],before);
 paused=false;
 // Drawbacks stay pure: scene drawing must not modify evidence or scenes.
 drawFacilityGuard(120,180,'right');
 drawLoopWatchVision();drawInvestigationPursuitHUD();
 s.room='chase';s.x=26;s.y=8;s.chase={x:23,y:8,grace:0};
 s.flags.chaseActive=true;drawChaseFootfallDetails();drawInvestigationPursuitHUD();
 assert(rects.length>15,'Pixel UI/sprite was not rendered');
 return {passed:true,patrolStops:LOOP_WATCH_ROUTE.length,
  pixels:rects.length,captureRetrySeconds:8,notes:messages.length};
`);
const result=run(assert);console.log(JSON.stringify(result,null,2));
