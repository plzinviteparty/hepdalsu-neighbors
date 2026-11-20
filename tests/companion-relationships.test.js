'use strict';
// Run from repository root: node tests/companion-relationships.test.js
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const scripts=[
 'story.js','facility-revision.js','mansion-route.js','paradise-lore.js',
 'fasting-room.js','evidence-puzzles.js','detective-route.js',
 'pixel-polish.js','observation-polish.js','capture-cinematic.js',
 'story-continuity.js','prop-readability.js','facility-tone.js',
 'ritual-readability.js','dormitory-furnishings.js','tactile-puzzles.js',
 'case-board.js','pursuit-polish.js','companion-rescue.js',
 'companion-investigation.js','companion-relationships.js'
];
const engine=read('game.js'),start=engine.indexOf('function flush(){'),
 end=engine.indexOf('function renderText(',start);
assert(start>=0&&end>start,'Story engine missing');
const check=new Function('assert',scripts.map(read).join('\n')+'\n'+engine.slice(start,end)+String.raw`
 let s={},dialogue=[],ended=null,trailDraw=[],menuButtons=[],requestedScene=null;
 function current(){return s.script?SCRIPTS[s.script]?.[s.step]:null}
 function renderText(who,text){dialogue.push([who,text])}
 function renderChoice(n){throw Error('Unexpected choice '+n.choice)}
 function renderPuzzle(){throw Error('Unexpected puzzle')}
 function puzzleSolved(){return false}
 function renderDance(){}
 function renderStatueTrial(){}
 function finish(id){ended=id;s.script=null}
 function idle(){}
 function autoSave(){}
 function updateUI(){}
 function notify(){}
 function sound(){}
 function resetJoystick(){}
 function setRoom(room,x,y){s.room=room;s.x=x;s.y=y}
 function addItem(id){if(!s.inventory.includes(id))s.inventory.push(id)}
 function modal(title){const panel={title,children:[],append(n){this.children.push(n)}};menuButtons=[];return panel}
 function paragraph(panel,text){panel.children.push({text})}
 function row(panel){const el={children:[]};panel.children.push(el);return el}
 function button(parent,label,click){const b={label,click};parent.children.push(b);menuButtons.push(b);return b}
 function closeModal(){}
 function run(scene){requestedScene=scene}
 function openMenu(){}
 const play=(scene,party,flags={},step=0)=>{
  s={script:scene,step,party:party.slice(),flags:{...flags},
    inventory:[],solvedPuzzles:{},dropped:[],miniProgress:0};
  dialogue=[];ended=null;trailDraw=[];
  for(let i=0;i<100&&s.script;i++){
   flush();
   if(!s.script)break;
   if(current()?.say){s.step++;continue}
   throw Error('Scene stalled: '+s.script+'/'+s.step);
  }
  return {dialogue:dialogue.slice(),ending:ended,party:s.party.slice()};
 };
 const ids=['kim','jubin','changwon','nasol','patient05'];
 const names=['차준영','김주호','이철민','오은지','서정윤'];
 const proofFlags=['investorClue','foreshadowMaze','projectClue','cameraPhotoSeen','projectClue'];
 for(let i=0;i<ids.length;i++){
  const id=ids[i],prefix='companionRelation_'+id,who=names[i];
  const history=play(prefix+'Origin',[id]);
  assert(history.dialogue.length>=2,'No history for '+id);
  assert(history.dialogue.every(([name])=>name===who),'Wrong speaker in '+id+' history');
  const early=play(prefix+'Dalsu',[id]);
  const met=play(prefix+'Dalsu',[id],{dalsuEncounter:true});
  const documented=play(prefix+'Dalsu',[id],{[proofFlags[i]]:true});
  assert.equal(early.dialogue.length,2);
  assert.equal(met.dialogue.length,2);
  assert.equal(documented.dialogue.length,2);
  assert.notDeepEqual(early.dialogue,met.dialogue,'Encounter did not change conversation: '+id);
  assert.notDeepEqual(early.dialogue,documented.dialogue,'Evidence did not change conversation: '+id);
  // A return to the same party member offers three story topics.
  s.party=[id];requestedScene=null;openCompanionTopicMenu(id);
  assert(menuButtons.some(x=>x.label==='왜 이곳에 왔는지'));
  assert(menuButtons.some(x=>x.label==='허달수에 대해'));
  assert(menuButtons.some(x=>x.label==='지금 할 일'));
  menuButtons.find(x=>x.label==='허달수에 대해').click();
  assert.equal(requestedScene,prefix+'Dalsu');
 }
 // Optional encounter keeps original cinematic indices and only comments from present allies.
 assert.equal(SCRIPTS.dalsuEncounter[8].say,'……');
 assert.equal(SCRIPTS.dalsuEncounter.length,19);
 const solo=play('dalsuEncounter',[],{},14);
 assert.equal(solo.dialogue.length,0,'Absent allies spoke during encounter');
 const partial=play('dalsuEncounter',['kim','nasol'],{},14);
 assert.deepEqual(partial.dialogue.map(x=>x[0]),['차준영','오은지']);
 const all=play('dalsuEncounter',ids,{},14);
 assert.equal(all.dialogue.length,5);
 // Established endings and evidence-driven puzzle gates remain unchanged.
 const expected={best:'best',happy:'happy',realSolo:'detectiveIncompleteEscape'};
 for(const key of ['bestReveal','happyReveal'])
  assert(SCRIPTS[key].some(x=>x.ending),'Existing ending missing '+key);
 assert.equal(MAPS.annex05.name,'별관 05번 관찰병실');
 const links=[...new Set(Object.values(SCRIPTS).flatMap(nodes=>nodes.flatMap(n=>
  n.choice?n.options.map(o=>o.to):n.jump?[n.jump]:
  n.branch?[n.yes,n.no]:n.op==='allParty'?[n.yes,n.no]:[])))];
 for(const id of links)assert(SCRIPTS[id],'Broken scene '+id);
 return {passed:true,rooms:Object.keys(MAPS).length,
  testedCompanions:ids.length,newConversationTopics:ids.length*3,
  scenes:Object.keys(SCRIPTS).length,originalEncounterSteps:14,
  conditionalEncounterReactions:all.dialogue.length};
`);
console.log(JSON.stringify(check(assert),null,2));
