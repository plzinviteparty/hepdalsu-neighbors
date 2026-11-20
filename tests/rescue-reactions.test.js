'use strict';
// Run from repository root: node tests/rescue-reactions.test.js
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files=['story.js','facility-revision.js','mansion-route.js','paradise-lore.js',
 'fasting-room.js','evidence-puzzles.js','detective-route.js','pixel-polish.js',
 'observation-polish.js','capture-cinematic.js','story-continuity.js',
 'prop-readability.js','facility-tone.js','ritual-readability.js',
 'dormitory-furnishings.js','tactile-puzzles.js','case-board.js',
 'pursuit-polish.js','companion-rescue.js'];
const engine=read('game.js'),from=engine.indexOf('function flush(){'),
 to=engine.indexOf('function renderText(',from);
assert(from>=0&&to>from,'Cannot find story execution function');
const check=new Function('assert',files.map(read).join('\n')+'\n'+engine.slice(from,to)+String.raw`
 let s={},spoken=[],ending=null,trailDraw=[];
 function current(){return s.script?SCRIPTS[s.script]?.[s.step]:null}
 function renderText(who,text){spoken.push([who,text])}
 function renderChoice(n){spoken.push(['choice',n.choice])}
 function renderPuzzle(){}
 function puzzleSolved(){return false}
 function renderDance(){}
 function renderStatueTrial(){}
 function finish(id){ending=id;s.script=null}
 function idle(){}
 function autoSave(){}
 function updateUI(){}
 function notify(){}
 function sound(){}
 function resetJoystick(){}
 function setRoom(room,x,y){s.room=room;s.x=x;s.y=y}
 function addItem(id){if(!s.inventory.includes(id))s.inventory.push(id)}
 const play=(name,party=[],flags={},start=0)=>{
  s={script:name,step:start,party:party.slice(),flags:{...flags},
   inventory:[],dropped:[],solvedPuzzles:{},miniProgress:0};
  spoken=[];ending=null;trailDraw=[];
  for(let i=0;i<100&&s.script;i++){
   flush();
   if(!s.script||current()?.choice)break;
   if(current()?.say){s.step++;continue}
   throw Error('Scene did not advance: '+s.script+' '+s.step);
  }
  return {party:s.party.slice(),flags:{...s.flags},spoken:spoken.slice(),
    ending,room:s.room};
 };
 const solo=play('patient05Join',[],{patient05Located:true,identityKnown:true});
 assert.deepEqual(solo.party,['patient05']);
 assert(solo.flags.patient05Rescued);
 assert(solo.spoken.some(x=>x[1].includes('다른 사람은 없지만')));
 assert(!solo.spoken.some(x=>['차준영','김주호','이철민','오은지'].includes(x[0])));
 const full=play('patient05Join',['kim','jubin','changwon','nasol'],{patient05Located:true});
 assert.deepEqual(full.party,['kim','jubin','changwon','nasol','patient05']);
 for(const name of ['차준영','김주호','이철민','오은지'])
  assert(full.spoken.some(x=>x[0]===name),'Missing rescue reaction: '+name);
 assert(!full.spoken.some(x=>x[1].includes('다른 사람은 없지만')));
 const escort=play('annexReturn',full.party,{patient05Rescued:true});
 assert.equal(escort.room,'wreck');
 assert.equal(escort.spoken.length,5);
 const happy=play('happyReveal',['kim','patient05'],{patient05Rescued:true});
 assert.equal(happy.ending,'happy');
 assert(!happy.spoken.some(x=>['김주호','이철민','오은지'].includes(x[0])));
 const best=play('bestReveal',full.party,{patient05Rescued:true});
 assert.equal(best.ending,'best');
 const missing=play('detectiveIncompleteEscape',['kim'],{caseSolved:true});
 assert.equal(missing.ending,'realSolo');
 const before=play('companionTalk_kim',['kim'],{});
 const after=play('companionTalk_kim',['kim','patient05'],{patient05Rescued:true});
 assert.notEqual(before.spoken[0][1],after.spoken[0][1]);
 const transitions=Object.values(SCRIPTS).flatMap(a=>a.flatMap(n=>
  n.choice?n.options.map(o=>o.to):n.jump?[n.jump]:n.branch?[n.yes,n.no]:
  n.op==='allParty'?[n.yes,n.no]:[]));
 for(const target of transitions)assert(SCRIPTS[target],'Broken scene: '+target);
 for(const id of ['patient05Join','annexReturn','happyReveal','bestReveal'])
  assert(SCRIPTS[id],'Missing rescue/ending scene '+id);
 return {passed:true,rooms:Object.keys(MAPS).length,
  rescueSoloLines:solo.spoken.length,rescueWithFourLines:full.spoken.length,
  escortLines:escort.spoken.length,endings:['happy','best','realSolo']};
`);
console.log(JSON.stringify(check(assert),null,2));
