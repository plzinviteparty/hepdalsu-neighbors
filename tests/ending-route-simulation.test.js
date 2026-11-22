'use strict';
// Run from repository root: node tests/ending-route-simulation.test.js
// Runs a deterministic story-node interpreter; no browser, audio or canvas required.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const modules=[
 'story.js','facility-revision.js','mansion-route.js','paradise-lore.js',
 'fasting-room.js','evidence-puzzles.js','detective-route.js',
 'story-continuity.js','route-backtrack.js'
];
const world=new Function(modules.map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n')+
 '\nreturn {MAPS,SCRIPTS,ENDINGS,REQUIRED_PARTY,DOOR_ACTIONS};')();
const {SCRIPTS,MAPS,REQUIRED_PARTY,DOOR_ACTIONS}=world;
const fresh=()=>({room:'prom',flags:{},inventory:[],party:[],solvedPuzzles:{}});
let checks=0;
function check(value,message){assert(value,message);checks++}
function play(scene,state,{choices={},allowBlocked=false}={}){
 let id=scene,step=0,cycles=0,ending=null;
 while(id&&cycles++<1000){
  const nodes=SCRIPTS[id];
  check(!!nodes,'Missing story scene '+id);
  const n=nodes[step++];
  if(!n)break;
  if(n.op==='enterDoor'){id=n.id;step=0;continue}
  if(n.op==='room'){check(!!MAPS[n.room],'Missing destination room');state.room=n.room;continue}
  if(n.op==='flag'){state.flags[n.key]=n.value;continue}
  if(n.op==='give'){if(!state.inventory.includes(n.id))state.inventory.push(n.id);continue}
  if(n.op==='remove'){state.inventory=state.inventory.filter(x=>x!==n.id);continue}
  if(n.op==='party'){if(n.join&&!state.party.includes(n.id))state.party.push(n.id);if(!n.join)state.party=state.party.filter(x=>x!==n.id);continue}
  if(n.statueTrial)continue; // Movement/crawler physics covered by their dedicated tests.
  if(n.puzzle){
   const missing=(n.requiresFlags||[]).filter(flag=>!state.flags[flag]);
   if(missing.length){if(allowBlocked)return {blocked:true,missing};throw Error('Blocked '+n.puzzleId+': '+missing.join(','))}
   state.solvedPuzzles[n.puzzleId||n.title]=true;
   continue;
  }
  if(n.choice){const selected=choices[id]??0;check(!!n.options[selected],'Missing choice '+id);id=n.options[selected].to;step=0;continue}
  if(n.jump){id=n.jump;step=0;continue}
  if(n.branch){id=state.flags[n.branch]?n.yes:n.no;step=0;continue}
  if(n.op==='allParty'){id=REQUIRED_PARTY.every(x=>state.party.includes(x))?n.yes:n.no;step=0;continue}
  if(n.ending){ending=n.ending;break}
 }
 check(cycles<1000,'Story scene loop');
 return {ending,room:state.room};
}
const early=s=>{for(const scene of ['newspaper','record','investorNote','incidentMemo','waterDelivery','recruitmentNote','projectRecord'])play(scene,s);return s};
const late=s=>{for(const scene of ['detectiveLocker','accidentLedger','patientIndex','patient05Join'])play(scene,s);return s};
const scenarios={};
{
 const s=late(early(fresh()));s.party=['kim','jubin','changwon','nasol','patient05'];
 scenarios.best=play('evidenceFinal',s).ending;
 check(scenarios.best==='best'&&s.flags.caseSolved,'Full party completion inaccessible');
}
{
 const s=late(early(fresh()));s.party=['patient05'];
 scenarios.happy=play('evidenceFinal',s).ending;
 check(scenarios.happy==='happy','Rescue happy ending inaccessible');
}
{
 const s=early(fresh());play('detectiveLocker',s);play('accidentLedger',s);
 const result=play('evidenceFinal',s,{allowBlocked:true});
 scenarios.gated=result.missing;
 check(result.blocked&&result.missing.includes('patient05Located'),'Final reconstruction accepts missing patient record');
}
{
 scenarios.normal=play('detectiveEscapeGate',fresh()).ending;
 check(scenarios.normal==='normal','Incomplete investigation should allow normal escape');
}
{
 const s=fresh();s.flags.caseSolved=true;
 scenarios.incomplete=play('detectiveSafeExit',s).ending;
 check(scenarios.incomplete==='realSolo','Solved case without rescued patient must remain incomplete');
}
{
 scenarios.truth=play('detectiveCaught',fresh()).ending;
 check(scenarios.truth==='truth','Heo Dalsu confrontation must reach the capture ending');
}
{
 const s=fresh();
 for(const id of ['newspaper','investorNote','incidentMemo','waterDelivery','recruitmentNote'])play(id,s);
 play('detectiveLocker',s);
 const first=play('patientIndex',s,{allowBlocked:true});
 check(first.blocked&&first.missing.includes('readRecord'),'Missing ward records should block 05 index');
 s.flags.refugeReached=true;
 check(MAPS.loop.objects.find(o=>o.id==='loopServiceDoor')?.need==='refugeReached','Service shortcut is open too soon');
 play('refugeServiceDoor',s);check(s.room==='loop','Cannot return to the loop');
 play('record',s);play('projectRecord',s);
 play('loopServiceDoor',s);check(s.room==='wreck','Cannot return to refuge');
 play('patientIndex',s);play('patient05Join',s);play('accidentLedger',s);
 s.party=['kim','jubin','changwon','nasol','patient05'];
 scenarios.recovered=play('evidenceFinal',s).ending;
 check(scenarios.recovered==='best','Missed ward evidence cannot be recovered');
}
{
 const s=fresh();s.room='bedroom';play('returnToRefuge',s);
 scenarios.returnToRefuge=s.room;
 check(s.room==='wreck','Final exit prevents returning for evidence');
}
for(const id of ['refugeServiceDoor','loopServiceDoor']){
 check(!!SCRIPTS['doorGo_'+id]&&!!SCRIPTS['doorAsk_'+id]&&!!DOOR_ACTIONS[id],
  'Door confirmation broken: '+id);
}
console.log(JSON.stringify({passed:true,scenarios,checks},null,2));
