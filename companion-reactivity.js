'use strict';
// One-time, optional companion reactions to discoveries and location changes.
// These never set story flags, change puzzles, or alter ending conditions.
const COMPANION_REACTION_NAMES={
 kim:'차준영',jubin:'김주호',changwon:'이철민',nasol:'오은지',patient05:'서정윤'
};
const COMPANION_REACTIONS=[
 {id:'arrival-landing',room:'landing',lines:[
  ['kim','아까와 같은 홀인데, 문 위치를 다시 확인해야겠습니다. 익숙하다고 바로 믿진 말죠.'],
  ['jubin','벽에 흠집이 있어요. 지나온 곳인지 알아보게 제가 표시해 둘게요.']]},
 {id:'arrival-ward',room:'ward',lines:[
  ['nasol','침대는 많은데 누가 여기 머물렀는지 제대로 적혀 있지 않네요. 번호보다 이름부터 찾아야겠어요.'],
  ['changwon','의료 시설처럼 보여도 기록과 출입 절차를 확인하기 전에는 진료 공간이라고 단정할 수 없습니다.']]},
 {id:'arrival-loop',room:'loop',lines:[
  ['jubin','문을 잘 보세요. 아까 본 번호랑 똑같아요. 문짝의 긁힌 자국까지 같진 않은지 확인할게요.'],
  ['kim','헷갈리게 만드는 구조군요. 돌아온 지점과 들어간 시각을 따로 기록하겠습니다.']]},
 {id:'arrival-backroom',room:'backroom',lines:[
  ['jubin','의자 쌓인 방향이 조금씩 달라요. 출구를 찾더라도 돌아갈 길은 남겨 두죠.'],
  ['nasol','여기까지 사람을 들여보냈다면 이동 기록이 어딘가 남았을 거예요. 그냥 길을 잃은 게 아닐 수도 있어요.']]},
 {id:'arrival-research',room:'research',lines:[
  ['changwon','자료를 볼 땐 연구 목적과 실제로 실행된 일을 구분해야 합니다. 이름만 보고 판단하지 맙시다.'],
  ['nasol','연구실에서 사람들을 어떻게 불렀는지부터 보고 싶어요. 기록 속 번호가 실제 누구인지 알아야 하니까요.']]},
 {id:'arrival-altar',room:'altar',lines:[
  ['nasol','기도문보다 바닥에 남은 흔적이 신경 쓰여요. 여기서 누가 무슨 일을 겪었는지 살펴봅시다.'],
  ['kim','어떤 규칙을 어겼다는 이유로 사람을 가뒀는지, 그 규칙을 누가 정했는지 확인해야겠군요.']]},
 {id:'arrival-annex',room:'annex05',lines:[
  ['nasol','일반 병실과 따로 떨어져 있어요. 이관 날짜와 환자 번호가 이어지는지 먼저 봐요.'],
  ['changwon','별도 관찰실이라면 이전 병동에서 어떤 기록을 넘겼는지 확인해야 합니다.']]},
 {id:'arrival-wreck',room:'wreck',lines:[
  ['patient05','병실 밖인데도 자꾸 뒤를 돌아보게 돼요. 문이 다시 잠길까 봐요.'],
  ['kim','지나온 출입구와 남은 자료를 확인하겠습니다. 이제 필요한 건 밖으로 나갈 길입니다.']]},
 {id:'proof-ward',flag:'readRecord',lines:[
  ['changwon','명부에 없는 번호가 투약 장부에는 남아 있군요. 삭제된 기록이라고 해서 없던 사람은 아닙니다.'],
  ['nasol','여기 누군가 빠져 있어요. 나간 건지 옮겨진 건지는 아직 모르는 거고요.']]},
 {id:'proof-investor',flag:'investorClue',lines:[
  ['kim','제가 나가겠다고 한 뒤부터 외부 연락이 막혔군요. 방문 목적이 어떻게 감금 이유가 됐는지 이제 보입니다.'],
  ['nasol','돈을 돌려받겠다는 요구와 사람을 가두라는 지시는 전혀 다른 일이죠. 결재자를 확인해 둬요.']]},
 {id:'proof-offering',flag:'incidentMemoRead',lines:[
  ['nasol','사람이 죽은 일을 기도가 부족했다고 적었네요. 누가 그 말을 하게 만들었는지도 알아야겠어요.'],
  ['kim','책임을 지는 사람의 이름이 빠져 있습니다. 이 문건을 남겨 둡시다.']]},
 {id:'proof-water',flag:'waterOrigin',lines:[
  ['changwon','납품 기록과 준비실 이동 내역이 이어집니다. 다만 물의 성분까지 이 서류가 증명하진 않아요.'],
  ['nasol','특별한 샘물이라고 홍보했는데 실제로는 납품 상자를 옮겼군요. 그 차이를 기록해 둬요.']]},
 {id:'proof-project',flag:'projectClue',lines:[
  ['changwon','치료 경과가 아니라 감각과 기억의 변화를 관찰한다는 계획입니다. 동의 여부는 어디에도 보이지 않는군요.'],
  ['kim','사람을 돌본다는 말 뒤에 이런 계획이 있었군요. 지시한 사람과 실제로 시행한 사람을 따로 확인하죠.']]},
 {id:'proof-reporter',flag:'reporterTreatmentRead',lines:[
  ['nasol','제 이름이 있어요. 기억나지 않는 시간에도 누군가는 제 상태를 적었군요. 이건 꼭 챙길래요.'],
  ['changwon','기록된 투약 시점은 확인할 수 있습니다. 그날의 기억까지 대신 설명할 수는 없지만요.']]},
 {id:'proof-camera',flag:'cameraPhotoSeen',lines:[
  ['nasol','끊긴 기억 대신 사진이 남았어요. 이 장면에 누가 있었는지 확인할 수 있겠네요.'],
  ['jubin','사진은 원본 그대로 보관해요. 사람 얼굴이 찍혔다고 모두에게 보여 줄 필요는 없으니까요.']]},
 {id:'proof-identity',flag:'identityKnown',lines:[
  ['nasol','실종자 가족의 의뢰로 오신 거였군요. 이제 왜 이 기록들을 모으는지 알겠어요.'],
  ['kim','당신이 처음부터 이곳을 찾으러 온 사람이었다니. 의뢰서에 적힌 이름부터 놓치지 맙시다.']]},
 {id:'proof-patient',flag:'patient05Located',lines:[
  ['nasol','05번 환자, 서정윤. 이제 번호와 이름이 연결됐어요. 이관된 곳으로 가 봐야겠어요.'],
  ['changwon','명부에서 지웠어도 이관대장엔 남아 있었군요. 이 사람의 동선을 따라가죠.']]},
 {id:'proof-accident',flag:'accidentProof',lines:[
  ['kim','사고 현장에 있던 차량 번호가 서류와 맞습니다. 이송 결재가 누구 이름으로 났는지도 남아 있군요.'],
  ['nasol','영상과 문서가 같은 차량을 가리켜요. 이제 추측이 아닌 확인된 부분부터 정리해요.']]},
 {id:'proof-case',flag:'caseSolved',lines:[
  ['patient05','제가 어디에 있었는지 이제 다른 사람한테도 설명할 수 있겠죠? 제 이름도 적혀 있고요.'],
  ['nasol','기록은 연결됐어요. 밖에 나가서는 사람들의 말을 서류 옆에 그대로 남겨야 해요.']]}
];
// Optional responses to repetitive investigation and unsafe choices; these do not modify game progress.
const COMPANION_ACTION_REACTIONS=[{"id":"repeat-archive","room":"landing","targets":["newspaper"],"requiresFlag":"dalsuKnown","attempts":2,"lines":[["nasol","연혁을 다시 읽어도 기사 내용이 저절로 사실이 되진 않아요. 누가 쓴 글인지도 남겨 둡시다."],["kim","날짜와 발언을 다시 대조하죠. 확인된 사실과 추측은 구별해야 합니다."]]},{"id":"repeat-investor","room":"ward","targets":["investorNote"],"requiresFlag":"investorClue","attempts":2,"lines":[["kim","제 이름이 적힌 문서라 자꾸 눈이 가는군요. 그래도 다른 사람들의 기록까지 확인해야 합니다."],["nasol","이 결재란은 이미 확인했어요. 다음 기록과 대조해 보는 게 좋겠어요."]]},{"id":"repeat-reporter","room":"ward","targets":["reporterTreatment"],"requiresFlag":"reporterTreatmentRead","attempts":2,"lines":[["nasol","다시 읽어도 기억나지 않는 시간은 그대로예요. 그래도 날짜와 투약 기록은 챙길래요."],["changwon","기억을 억지로 끼워 맞추실 필요는 없습니다. 기록을 확보했으니 다른 자료와 대조하죠."]]},{"id":"repeat-water","room":"bath","targets":["waterDelivery"],"requiresFlag":"waterOrigin","attempts":2,"lines":[["changwon","납품표는 공급 경로를 보여 줄 뿐입니다. 물의 성분까지 증명한 건 아니죠."],["jubin","상자 번호가 또 보이네요. 우리가 읽은 기록과 같다는 것만 적어 둘게요."]]},{"id":"repeat-recruitment","room":"research","targets":["recruitmentNote"],"requiresFlag":"recruitmentClue","attempts":2,"lines":[["changwon","몇 번을 확인해도 제가 동의했다는 기록은 없군요. 이 서류는 연구원 영입에 관한 것입니다."],["kim","다시 확인하셔도 좋습니다. 다만 피실험자 기록과 이 문서를 섞지는 맙시다."]]},{"id":"repeat-project","room":"research","targets":["projectRecord"],"requiresFlag":"projectClue","attempts":2,"lines":[["changwon","계획서에 적힌 목표와 실제로 얻었다는 결과는 다릅니다. 없는 내용을 추정하면 안 됩니다."],["nasol","서류를 계속 보는 이유는 알겠어요. 이제 여기에 적히지 않은 사람들의 말도 들어야죠."]]},{"id":"repeat-camera","room":"research","targets":["cameraReader"],"requiresFlag":"cameraPhotoSeen","attempts":2,"lines":[["nasol","사진은 복구됐어요. 더 열어 보기보다 원본을 안전하게 보관하는 일이 중요하겠네요."],["jubin","찍힌 사람의 동의 없이 공개하면 안 되겠죠. 일단 증거로만 남겨 둡시다."]]},{"id":"repeat-identity","room":"wreck","targets":["detectiveLocker"],"requiresFlag":"identityKnown","attempts":2,"lines":[["kim","의뢰서의 이름은 확인했습니다. 이제 서정윤 씨가 어디로 옮겨졌는지 찾아보죠."],["nasol","수첩에 적힌 의뢰 내용은 확보했어요. 다음 단서와 연결해 보죠."]]},{"id":"repeat-accident","room":"wreck","targets":["accidentLedger"],"requiresFlag":"accidentProof","attempts":2,"lines":[["kim","차량 번호는 맞군요. 운전한 사람과 이송을 결재한 사람은 구분해 둬야겠습니다."],["nasol","영상과 서류가 가리키는 건 같은 차량이에요. 그 이상의 지시는 추측하지 말아요."]]},{"id":"repeat-transfer","room":"annex05","targets":["patientIndex"],"requiresFlag":"patient05Located","attempts":2,"lines":[["patient05","제 이름이 적혀 있죠? 번호만 남은 건 아니죠?"],["nasol","이관 기록은 확보했어요. 정윤 씨에게 어떤 일이 있었는지는 본인이 말할 준비가 됐을 때 듣죠."]]},{"id":"repeat-scenery","scenery":true,"attempts":3,"lines":[["jubin","그 물건은 아까도 확인했어요. 다른 쪽도 살펴보면 어떨까요?"],["nasol","다시 살펴보는 건 좋지만, 새 흔적이 없다면 다음 장소로 가는 게 나을 것 같아요."]]},{"id":"risk-locked-ward","room":"ward","targets":["lockedWard"],"blockedBy":["wardQuiet","melted"],"attempts":2,"lines":[["nasol","잠긴 문을 계속 당기면 직원들이 소리를 들을 거예요. 제어함부터 봐요."],["kim","문이 그대로군요. 요란하게 건드리기보다 잠금장치를 살펴봅시다."]]},{"id":"risk-staff","room":"ward","targets":["nurse","nurse2"],"blockedBy":["melted"],"attempts":2,"lines":[["changwon","직원에게 같은 질문을 반복해 봐야 경계만 심해질 겁니다. 다른 길을 찾죠."],["nasol","저 직원은 밖에 내보내 줄 생각이 없어 보여요. 오래 이야기하지 말아요."]]},{"id":"risk-loop","room":"loop","targets":["loopWrong"],"attempts":2,"lines":[["jubin","그 문은 아까도 봤어요. 계속 열어 보기보다 벽의 흔적을 확인해요."],["kim","같은 출구를 반복해서 확인하고 있군요. 길을 표시하는 편이 낫겠습니다."]]},{"id":"risk-altar","room":"altar","targets":["altarTrial","altarHead0","altarHead1","altarHead2","altarHead3","altarHead4"],"blockedBy":["incidentMemoRead","altarAwake"],"attempts":2,"lines":[["nasol","저 사람들 말에 휘둘리지 말아요. 봉헌함과 문건부터 확인해야겠어요."],["kim","어떤 규칙인지 알기도 전에 시험에 응하지 맙시다. 이곳의 기록부터 살펴보죠."]]},{"id":"risk-patient","room":"annex05","targets":["patient05"],"blockedBy":["patient05Located","patient05Rescued"],"attempts":2,"lines":[["nasol","정윤 씨에게 같은 질문을 반복하지 말아요. 우선 이관 기록부터 확인하죠."],["changwon","당사자의 대답을 재촉해서는 안 됩니다. 문서를 먼저 확인해야 합니다."]]}];
COMPANION_REACTIONS.push(...COMPANION_ACTION_REACTIONS);
const COMPANION_REACTIONS_BY_ID=new Map();
for(const entry of COMPANION_REACTIONS){
 const scene='ambientCompanion_'+entry.id;
 if(SCRIPTS[scene])throw Error('Duplicate companion reaction '+scene);
 if(entry.room&&!MAPS[entry.room])throw Error('Unknown companion reaction room '+entry.room);
 SCRIPTS[scene]=entry.lines.map(([person,say])=>({say,who:COMPANION_REACTION_NAMES[person],requiresParty:person}));
 COMPANION_REACTIONS_BY_ID.set(entry.id,entry);
}
function companionReactionQueue(entry){
 if(!entry||!s||!started||ended||!Array.isArray(s.party))return;
 if(!entry.lines.some(([person])=>s.party.includes(person)))return;
 const record=s.companionReactions||(s.companionReactions={seen:[],pending:null});
 if(!Array.isArray(record.seen))record.seen=[];
 if(!Array.isArray(record.pendingQueue))record.pendingQueue=[];
 if(record.seen.includes(entry.id)||record.pending===entry.id||record.pendingQueue.includes(entry.id))return;
 if(record.pending&&record.pendingQueue.length>=5)return;
 record.seen.push(entry.id);
 if(record.pending)record.pendingQueue.push(entry.id);
 else record.pending=entry.id;
}
function companionReactionRoom(room){
 companionReactionQueue(COMPANION_REACTIONS.find(entry=>entry.room===room));
}
function companionReactionFlag(flag){
 companionReactionQueue(COMPANION_REACTIONS.find(entry=>entry.flag===flag));
}
function companionReactionInteraction(target){
 if(!s||!started||paused||ended||s.script||s.flags.chaseActive||s.room==='chase')return;
 if(s.room==='altar'&&['collapse','shatter','chase'].includes(s.altar?.phase))return;
 const entry=COMPANION_ACTION_REACTIONS.find(e=>(!e.room||e.room===s.room)&&(e.scenery?target.startsWith('scenery_'):e.targets?.includes(target)));
 if(!entry)return;
 const record=s.companionReactions||(s.companionReactions={seen:[],pending:null});
 const counts=record.actionCounts||(record.actionCounts={});
 const key=entry.scenery?'prop:'+target:entry.id;
 counts[key]=Math.min(99,(Number(counts[key])||0)+1);
 if(counts[key]<(entry.attempts||2))return;
 if(entry.requiresFlag&&!s.flags[entry.requiresFlag])return;
 if(entry.blockedBy?.some(flag=>s.flags[flag]))return;
 companionReactionQueue(entry);
}
function maybeCompanionReaction(){
 if(!s||!started||paused||ended||s.script||s.flags.chaseActive||s.room==='chase')return false;
 if(s.room==='altar'&&['collapse','shatter','chase'].includes(s.altar?.phase))return false;
 const record=s.companionReactions;
 if(!record)return false;
 if(!Array.isArray(record.pendingQueue))record.pendingQueue=[];
 if(!record.pending)record.pending=record.pendingQueue.shift()||null;
 if(!record.pending)return false;
 const entry=COMPANION_REACTIONS_BY_ID.get(record.pending);
 record.pending=record.pendingQueue.shift()||null;
 if(!entry||!entry.lines.some(([person])=>s.party.includes(person))){autoSave();return false}
 autoSave();
 run('ambientCompanion_'+entry.id);
 return true;
}
