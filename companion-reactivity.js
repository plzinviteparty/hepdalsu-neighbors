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
 if(record.seen.includes(entry.id)||record.pending)return;
 record.seen.push(entry.id);
 record.pending=entry.id;
}
function companionReactionRoom(room){
 companionReactionQueue(COMPANION_REACTIONS.find(entry=>entry.room===room));
}
function companionReactionFlag(flag){
 companionReactionQueue(COMPANION_REACTIONS.find(entry=>entry.flag===flag));
}
function maybeCompanionReaction(){
 if(!s||!started||paused||ended||s.script||s.flags.chaseActive||s.room==='chase')return false;
 if(s.room==='altar'&&['collapse','shatter','chase'].includes(s.altar?.phase))return false;
 const record=s.companionReactions;
 if(!record?.pending)return false;
 const entry=COMPANION_REACTIONS_BY_ID.get(record.pending);
 record.pending=null;
 if(!entry||!entry.lines.some(([person])=>s.party.includes(person))){autoSave();return false}
 autoSave();
 run('ambientCompanion_'+entry.id);
 return true;
}
