'use strict';
// Run from repository root: node tests/companion-investigation.test.js
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=filename=>fs.readFileSync(path.join(root,filename),'utf8');
const scripts=['story.js','facility-revision.js','mansion-route.js','paradise-lore.js',
 'fasting-room.js','evidence-puzzles.js','detective-route.js','pixel-polish.js',
 'observation-polish.js','capture-cinematic.js','story-continuity.js',
 'prop-readability.js','tactile-puzzles.js','case-board.js',
 'companion-rescue.js','companion-investigation.js'];
const test=new Function('assert',scripts.map(read).join('\n')+String.raw`
 const TEST_DOM={};
 function TEST_element(tag){return {tag,children:[],className:'',textContent:'',style:{},attributes:{},disabled:false,
  append(c){this.children.push(c);return c},replaceChildren(){this.children=[]},
  setAttribute(k,v){this.attributes[k]=v},
  getContext(){return {fillStyle:'',imageSmoothingEnabled:false,fillRect(){}}},
  toDataURL(){return 'data:image/png;base64,MOCK'}}}
 const document={createElement:TEST_element},$=key=>TEST_DOM[key]||(TEST_DOM[key]=TEST_element(key));
 let s={party:[],flags:{},puzzleState:{}},TEST_saves=0,TEST_rewards=0;
 function button(root,text,fn,cls=''){const b=TEST_element('button');b.textContent=text;b.onclick=fn;b.className=cls;root.append(b);return b}
 function sound(){}
 function autoSave(){TEST_saves++}
 function updateUI(){}
 function completePuzzle(){TEST_rewards++}
 function leavePuzzle(){}
 function renderPuzzle(n){if(n.device==='evidence')renderEvidencePuzzle(n,s.puzzleState);
  else renderTactilePuzzle(n,s.puzzleState)}
 function TEST_crawl(node,cls){return (node.className.split(' ').includes(cls)?[node]:[])
  .concat(node.children.flatMap(child=>TEST_crawl(child,cls)))}
 const TEST_cases=Object.entries(COMPANION_INVESTIGATION);
 for(const [id,lines] of TEST_cases){
  assert(Object.values(SCRIPTS).some(nodes=>nodes.some(n=>n.puzzleId===id)),'Unknown puzzle '+id);
  for(const [person]of lines){
   assert.equal(investigationRemarks(id,[person]).length,1,'Missing member-specific hint '+id);
   assert.equal(investigationRemarks(id,[]).length,0,'Solo clue leaked '+id);
  }
 }
 const TEST_puzzle=SCRIPTS.investorNoteDeduce.find(n=>n.puzzleId==='evidence-investor');
 s.party=['kim'];renderPuzzle(TEST_puzzle);
 assert.equal(TEST_crawl($('#choices'),'companionInvestigationAsk').length,1);
 TEST_crawl(TEST_crawl($('#choices'),'caseField')[0],'caseAnswer')[1].onclick();
 const TEST_snapshot=s.puzzleState.selected.slice();
 TEST_crawl($('#choices'),'companionInvestigationAsk')[0].onclick();
 assert.deepEqual(s.puzzleState.selected,TEST_snapshot,'Opinions must preserve selected answers');
 assert(TEST_crawl($('#choices'),'companionInvestigationQuote')[0].textContent.includes('차준영'));
 s.puzzleState=JSON.parse(JSON.stringify(s.puzzleState));
 renderPuzzle(TEST_puzzle);
 assert.equal(TEST_crawl($('#choices'),'companionInvestigationQuote').length,1,'Advice should restore');
 s.party=[];s.puzzleState={};renderPuzzle(TEST_puzzle);
 assert.equal(TEST_crawl($('#choices'),'companionInvestigationAsk').length,0,'Solo puzzle must remain solvable');
 s.party=['kim'];s.puzzleState={};
 const TEST_lock=SCRIPTS.detectiveLockerFirst.find(n=>n.puzzleId==='case-locker');
 renderPuzzle(TEST_lock);
 assert.equal(TEST_crawl($('#choices'),'companionInvestigationAsk').length,1,'Tactile hints missing');
 const TEST_photo=SCRIPTS.cameraPhotos.find(n=>n.puzzleId==='evidence-camera');
 s.party=['nasol'];s.puzzleState={};renderPuzzle(TEST_photo);
 assert.equal(TEST_crawl($('#choices'),'companionInvestigationAsk').length,1,'Photo hints missing');
 const TEST_photoScenes=SCRIPTS.cameraPhotos;
 assert(TEST_photoScenes.some(n=>n.branch==='nasolJoined'),'Photo branching lost');
 assert(SCRIPTS.reporterPhotoReaction.some(n=>n.requiresParty==='nasol'),
  'Photo reaction must follow original branch');
 assert(!TEST_photoScenes.some(n=>n.requiresParty),'Unreachable post-branch photo line');
 assert(SCRIPTS.investorNoteDeduce.some(n=>n.op==='flag'&&n.key==='investorClue'));
 const TEST_targets=[...new Set(Object.values(SCRIPTS).flatMap(nodes=>nodes.flatMap(n=>n.choice?n.options.map(o=>o.to):n.jump?[n.jump]:n.branch?[n.yes,n.no]:n.op==='allParty'?[n.yes,n.no]:[])))];
 for(const id of TEST_targets)assert(SCRIPTS[id],'Broken dialogue route: '+id);
 return {passed:true,maps:Object.keys(MAPS).length,puzzleTypes:TEST_cases.length,
  adviceAutoSaved:TEST_saves>0,missingScenes:0};
`);
console.log(JSON.stringify(test(assert),null,2));
