'use strict';
// Companion fear/trust: optional characterization only. No flags, reward, puzzle or ending gates.
const COMPANION_TENSION_PROFILES={
 kim:{name:'차준영',fear:19,trust:32,reactivity:0.75,lines:{
  steady:'아직 상황을 판단할 근거가 충분하지 않습니다. 겁이 안 나는 건 아니지만, 우선 기록부터 챙기죠.',
  shaken:'잠깐만요. 이렇게 계속 같은 건물 안을 돌고 있는데, 저 사람들은 우리를 어디까지 지켜보고 있는 겁니까?',
  supported:'이곳을 믿을 수는 없지만, 적어도 함께 확인한 기록은 믿을 수 있겠군요. 서로 놓친 걸 채워 봅시다.',
  mixed:'겁이 나지 않는다고 하면 거짓말입니다. 그래도 이제는 혼자 모든 걸 판단할 필요가 없군요.'}},
 jubin:{name:'김주호',fear:28,trust:27,reactivity:1.15,lines:{
  steady:'손이 좀 떨리네요. 그래서 길은 꼭 표시하려고요. 제가 할 수 있는 일이 그거니까요.',
  shaken:'문이 또 똑같아요. 아까도 이랬죠? 제가 표시를 잘못했나…… 잠깐, 다시 확인할게요.',
  supported:'우리끼리 지나온 길을 기억하니까 덜 무서워요. 제가 먼저 표식을 찾을게요.',
  mixed:'무서워서 계속 뒤를 보게 돼요. 그래도 같이 가면 적어도 어디로 왔는지는 알 수 있겠죠.'}},
 changwon:{name:'이철민',fear:24,trust:25,reactivity:0.9,lines:{
  steady:'지금 불편한 건 사실입니다. 그래도 추정과 기록을 나눠 보면 판단할 수 있는 게 있습니다.',
  shaken:'저 문서가 실제로 실행됐다면…… 아닙니다. 증거도 없이 결과를 앞질러선 안 되겠죠.',
  supported:'서로 다른 관찰을 합쳐야 누락을 줄일 수 있습니다. 이제 당신들이 기록을 확인하는 방식을 믿겠습니다.',
  mixed:'솔직히 두렵습니다. 연구 경력이 있다고 이런 상황을 설명할 수 있는 건 아니니까요. 함께 확인합시다.'}},
 nasol:{name:'오은지',fear:31,trust:30,reactivity:1.0,lines:{
  steady:'나중에 기사를 쓸 수 있을지는 모르겠어요. 그래도 지금 본 건 지워지지 않게 남겨야죠.',
  shaken:'제가 기억하지 못하는 시간에 저 사람들이 뭘 했을까요. …아니, 지금은 아는 것부터 말할게요.',
  supported:'혼자 취재할 때랑은 달라요. 누가 무엇을 봤는지 서로 확인할 수 있어서 다행이에요.',
  mixed:'여전히 겁나요. 그래도 여기서는 제 말을 멋대로 고치지 않는 사람들이 있다는 걸 알아요.'}},
 patient05:{name:'서정윤',fear:50,trust:30,reactivity:1.15,lines:{
  steady:'병실 밖에 나오면 괜찮을 줄 알았어요. 아직은 발소리가 들릴 때마다 놀라지만요.',
  shaken:'저 또 돌아가야 하는 건 아니죠? 제가 뭘 잘못 대답하면 다시 번호로 부를까 봐 무서워요.',
  supported:'같이 걸으니까 조금 나아요. 제 이름으로 불러 주는 사람이 옆에 있다는 게 좋아요.',
  mixed:'무서운 건 여전해요. 그래도 제가 돌아가고 싶다고 말하면 들어줄 거라는 건 알아요.'}}
};
const COMPANION_TENSION_ROOM={
 landing:{fear:3,trust:0},ward:{fear:8,trust:0},loop:{fear:12,trust:0},
 backroom:{fear:10,trust:0},altar:{fear:15,trust:0},research:{fear:7,trust:0},
 annex05:{fear:9,trust:0},bath:{fear:2,trust:0},wreck:{fear:-14,trust:7}
};
const COMPANION_TENSION_FLAGS={
 dalsuEncounter:{fear:18,trust:0},readRecord:{fear:6,trust:0},
 incidentMemoRead:{fear:13,trust:0},reporterTreatmentRead:{fear:8,trust:2},
 projectClue:{fear:9,trust:4},cameraPhotoSeen:{fear:4,trust:8},
 accidentProof:{fear:7,trust:9},identityKnown:{fear:0,trust:9},
 patient05Located:{fear:0,trust:6},patient05Rescued:{fear:-14,trust:14},
 wardQuiet:{fear:-7,trust:5},melted:{fear:-6,trust:4},
 caseSolved:{fear:-15,trust:16},waterOrigin:{fear:0,trust:4}
};
const COMPANION_TENSION_RISKS={
 'ward:lockedWard':{fear:7,trust:-3},
 'ward:nurse':{fear:8,trust:-3},
 'ward:nurse2':{fear:8,trust:-3},
 'loop:loopWrong':{fear:8,trust:-3},
 'altar:altarTrial':{fear:9,trust:-3},
 'altar:altarHead0':{fear:9,trust:-3},
 'altar:altarHead1':{fear:9,trust:-3},
 'altar:altarHead2':{fear:9,trust:-3},
 'altar:altarHead3':{fear:9,trust:-3},
 'altar:altarHead4':{fear:9,trust:-3}
};
const tensionClamp=n=>Math.min(100,Math.max(0,Math.round(n)));
function companionTensionStore(){
 if(!s.companionTension||typeof s.companionTension!=='object')s.companionTension={};
 const t=s.companionTension;
 if(!t.scores||typeof t.scores!=='object')t.scores={};
 if(!t.events||typeof t.events!=='object')t.events={};
 if(!t.talked||typeof t.talked!=='object')t.talked={};
 if(!t.riskCounts||typeof t.riskCounts!=='object')t.riskCounts={};
 return t;
}
function companionTensionScore(id){
 const profile=COMPANION_TENSION_PROFILES[id];
 if(!profile)return null;
 const record=companionTensionStore().scores;
 if(!record[id]||!Number.isFinite(record[id].fear)||!Number.isFinite(record[id].trust)){
  record[id]={fear:profile.fear,trust:profile.trust};
 }
 record[id].fear=tensionClamp(record[id].fear);
 record[id].trust=tensionClamp(record[id].trust);
 return record[id];
}
// Register low-frequency, single-speaker milestone reactions in the existing safe queue.
for(const [id,profile] of Object.entries(COMPANION_TENSION_PROFILES)){
 for(const kind of ['fear','trust']){
  const entry={id:'tension-'+id+'-'+kind,
   lines:[[id,kind==='fear'?
    {kim:'앞으로 간 사람만 돌아오지 않는다면 어떡하죠. …인원부터 다시 세겠습니다.',
     jubin:'잠깐만요. 방금 어디서 소리가 나지 않았어요? 우리 발소리랑은 달랐는데.',
     changwon:'무슨 일이 벌어지고 있는지 제대로 설명할 수 없다는 게 가장 두렵군요.',
     nasol:'제가 놓친 시간이 또 생기는 건 아니겠죠. 이곳에선 잠깐 눈을 감는 것도 무서워요.',
     patient05:'문을 열 때마다 다시 그 병실일까 봐 겁나요. 저 혼자 두지 말아 주세요.'}[id]:
    {kim:'기록은 제가 챙기겠습니다. 다른 분들이 확인한 내용과 맞춰 보죠.',
     jubin:'저쪽 길은 제가 기억해요. 함께 가면 길을 잘못 들어도 바로 알 수 있을 거예요.',
     changwon:'각자 확인한 사실이 다릅니다. 서로의 기록을 신뢰하면서 맞춰 보죠.',
     nasol:'이제는 혼자 본 장면이 아니에요. 서로 증언을 확인할 수 있으니까요.',
     patient05:'제 이름을 기억해 주시는군요. 돌아갈 때도 같이 가 주실 거죠?'}[id]]]};
  const scene='ambientCompanion_'+entry.id;
  if(SCRIPTS[scene])throw Error('Duplicate tension dialogue: '+scene);
  SCRIPTS[scene]=entry.lines.map(([person,say])=>({who:profile.name,say,requiresParty:person}));
  COMPANION_REACTIONS_BY_ID.set(entry.id,entry);
 }
 for(const [kind,text] of Object.entries(profile.lines)){
  SCRIPTS['companionMood_'+id+'_'+kind]=[{who:profile.name,say:text}];
 }
}
function companionTensionChange(key,delta){
 if(!s||!started||ended||!Array.isArray(s.party))return;
 const present=s.party.filter(id=>COMPANION_TENSION_PROFILES[id]);
 if(!present.length)return;
 const t=companionTensionStore();
 if(t.events[key])return;
 t.events[key]=true;
 let milestone=null;
 for(const id of present){
  const score=companionTensionScore(id),profile=COMPANION_TENSION_PROFILES[id];
  const beforeFear=score.fear,beforeTrust=score.trust;
  score.fear=tensionClamp(score.fear+(delta.fear||0)*profile.reactivity);
  score.trust=tensionClamp(score.trust+(delta.trust||0));
  if(!milestone&&beforeFear<65&&score.fear>=65)milestone={id,kind:'fear'};
  if(!milestone&&beforeTrust<62&&score.trust>=62)milestone={id,kind:'trust'};
 }
 if(milestone)companionReactionQueue(COMPANION_REACTIONS_BY_ID.get('tension-'+milestone.id+'-'+milestone.kind));
}
function companionTensionRoom(room){
 const delta=COMPANION_TENSION_ROOM[room];
 if(delta)companionTensionChange('room:'+room,delta);
}
function companionTensionFlag(flag){
 const delta=COMPANION_TENSION_FLAGS[flag];
 if(delta)companionTensionChange('flag:'+flag,delta);
}
function companionTensionParty(id){
 if(COMPANION_TENSION_PROFILES[id])companionTensionScore(id);
}
function companionTensionInteraction(target){
 if(!s||!started||paused||ended||s.script||s.flags.chaseActive||s.room==='chase')return;
 if(s.room==='altar'&&['collapse','shatter','chase'].includes(s.altar?.phase))return;
 const kind=s.room+':'+target,delta=COMPANION_TENSION_RISKS[kind];
 if(!delta)return;
 if((s.room==='ward'&&(s.flags.melted||s.flags.wardQuiet))||
    (s.room==='altar'&&(s.flags.incidentMemoRead||s.flags.altarAwake)))return;
 const t=companionTensionStore();
 // All five heads share one risk counter; avoid exploiting repeated inspections.
 const riskKey=s.room==='altar'?'altar:heads':s.room==='ward'&&target.startsWith('nurse')?'ward:staff':kind;
 t.riskCounts[riskKey]=Math.min(10,(Number(t.riskCounts[riskKey])||0)+1);
 if(t.riskCounts[riskKey]===2)companionTensionChange('risk:'+riskKey,delta);
}
function companionTensionPhase(id){
 const score=companionTensionScore(id);
 if(!score)return 'steady';
 if(score.fear>=60&&score.trust>=58)return 'mixed';
 if(score.fear>=60)return 'shaken';
 if(score.trust>=58)return 'supported';
 return 'steady';
}
function companionTensionScene(id){
 if(!COMPANION_TENSION_PROFILES[id]||!s.party.includes(id))return null;
 const t=companionTensionStore(),score=companionTensionScore(id);
 // Checking in helps once per companion per room, at most twice per game.
 const roomKey=id+':'+s.room;
 const total=Object.keys(t.talked).filter(key=>key.startsWith(id+':')).length;
 if(!t.talked[roomKey]&&total<2){
  t.talked[roomKey]=true;
  score.fear=tensionClamp(score.fear-5);
  score.trust=tensionClamp(score.trust+5);
 }
 autoSave();
 return 'companionMood_'+id+'_'+companionTensionPhase(id);
}
function companionTensionLabel(id){
 const score=companionTensionScore(id);
 if(!score)return '';
 const fear=score.fear>=65?'불안이 크게 쌓인 상태':score.fear>=42?'경계가 높아진 상태':'침착하려 애쓰는 상태';
 const trust=score.trust>=62?'동료들을 믿고 의지함':score.trust>=43?'서서히 협력하는 중':'아직은 조심스러움';
 return fear+' · '+trust;
}
function openCompanionTensionMenu(){
 const panel=modal('동료들의 심리');
 paragraph(panel,'위험한 구역과 사건은 불안을 키우고, 증거 확보와 구출은 서로에 대한 신뢰를 높인다. 동료에게 직접 말을 걸면 잠시 진정할 수 있다.','small');
 for(const id of ['kim','jubin','changwon','nasol','patient05']){
  if(!s.party.includes(id))continue;
  paragraph(panel,COMPANION_TENSION_PROFILES[id].name+' — '+companionTensionLabel(id));
 }
 const nav=row(panel);
 button(nav,'동료들과 대화',openCompanionTalkMenu);
 button(nav,'게임으로',closeModal,'primary');
}
