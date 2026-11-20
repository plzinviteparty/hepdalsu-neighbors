'use strict';
// Run from repo root: node tests/companion-banter.test.js
// This runner exercises the real menu script and the engine dialogue dispatcher.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const engine=read('game.js');
const start=engine.indexOf('function flush(){'),end=engine.indexOf('function renderText(',start);
assert(start!==-1&&end>start,'Cannot extract dialogue execution from game.js');
const run=new Function('assert',
 "const T=(say,who='나')=>({say,who});const Q=(branch,yes,no)=>({branch,yes,no});const SCRIPTS={};"+
 read('companion-banter.js')+"\n"+engine.slice(start,end)+String.raw`
 const EXPECTED=['kim','jubin','changwon','nasol','patient05'];
 let s={flags:{},party:[],script:null,step:0,inventory:[]},spoken=[],renderedButtons=[];
 let trailDraw=[],finished=false,autoSaves=0,pickedScene=null;
 function current(){return s.script?SCRIPTS[s.script]?.[s.step]:null}
 function renderText(who,text){spoken.push([who,text])}
 function renderChoice(n){throw Error('Unexpected choice '+n.choice)}
 function renderPuzzle(){throw Error('Unexpected puzzle')}
 function puzzleSolved(){return false}
 function renderDance(){}
 function renderStatueTrial(){}
 function finish(){finished=true;s.script=null}
 function idle(){}
 function autoSave(){autoSaves++}
 function updateUI(){}
 function notify(){}
 function sound(){}
 function resetJoystick(){}
 function setRoom(){}
 function addItem(){}
 function modal(title){renderedButtons=[];return {title,children:[],append(v){this.children.push(v)}}}
 function paragraph(panel,t){panel.children.push({text:t})}
 function row(panel){const r={children:[]};panel.children.push(r);return r}
 function button(parent,label,click){const btn={label,click};parent.children.push(btn);renderedButtons.push(btn);return btn}
 function closeModal(){}
 function openCompanionTalkMenu(){}
 function runScene(id){pickedScene=id}
 function run(id){runScene(id)}
 const play=(scene,flags={})=>{
  s={flags:{...flags},party:EXPECTED.slice(),script:scene,step:0,inventory:[]};
  spoken=[];autoSaves=0;
  for(let i=0;i<50&&s.script;i++){
   flush();
   if(!s.script)break;
   const n=current();
   assert(n?.say,'Scene stalled '+s.script+'/'+s.step);
   s.step++;
  }
  assert(!s.script,'Scene did not finish '+scene);
  return spoken.slice();
 };
 assert.equal(PARTY_BANTER.length,9,'Expected authored exchanges');
 assert.equal(partyBanterAvailable([]).length,0);
 assert.equal(partyBanterAvailable(['kim']).length,0);
 assert.equal(partyBanterAvailable(['kim','changwon']).length,1);
 assert.equal(partyBanterAvailable(['kim','changwon','nasol']).length,3);
 assert.equal(partyBanterAvailable(EXPECTED).length,9);
 for(const talk of PARTY_BANTER){
  const scene='partyBanter_'+talk.id;
  assert(SCRIPTS[scene]&&SCRIPTS[scene+'Before']&&SCRIPTS[scene+'After'],'Missing branch: '+scene);
  assert.equal(SCRIPTS[scene].branch,talk.flag);
  const early=play(scene),late=play(scene,{[talk.flag]:true});
  assert.equal(early.length,talk.early.length,'Unreachable early dialogue '+talk.id);
  assert.equal(late.length,talk.late.length,'Unreachable later dialogue '+talk.id);
  assert.notDeepEqual(early,late,'Evidence has no impact '+talk.id);
  assert(early.every(([who])=>talk.early.some(x=>x[0]===who)));
  assert(late.every(([who])=>talk.late.some(x=>x[0]===who)));
  s.party=talk.people.slice();openPartyBanterMenu();
  const label=renderedButtons.find(b=>b.label.startsWith(talk.title));
  assert(label,'Missing topic button '+talk.id);
  label.click();
  assert.equal(pickedScene,scene,'Bad menu target '+talk.id);
 }
 s.party=['kim','jubin'];openPartyBanterMenu();
 assert(!renderedButtons.some(b=>b.label.includes('연구')),'Unavailable member conversations leaked');
 s.party=EXPECTED;openPartyBanterMenu();
 assert.equal(renderedButtons.filter(b=>PARTY_BANTER.some(x=>b.label.startsWith(x.title))).length,9);
 assert.equal(finished,false,'Optional dialogue must not trigger ending');
 return {passed:true,pairs:PARTY_BANTER.length,
  evidenceSensitiveBranches:PARTY_BANTER.length*2,
  trioTopics:PARTY_BANTER.filter(x=>x.people.length===3).length,
  partyTypes:EXPECTED.length};
`);
console.log(JSON.stringify(run(assert),null,2));
