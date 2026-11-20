'use strict';
// Additional companion investigation: optional comments from present people.
// Puzzles, core flags, item rewards and existing save keys are untouched.
const COMPANION_INVESTIGATION={
 'evidence-archive':[
  ['nasol','오은지','이건 기사 원문과 공동체 홍보 자료를 구분해야겠어요. 서로 인용한 날짜를 기준으로 보면 순서가 잡힐 거예요.'],
  ['kim','차준영','기사에서 말하는 개소 시점과 대표가 회고하는 시점이 다르군요. 처음부터 끝까지 읽어 보죠.']],
 'evidence-ward':[
  ['changwon','이철민','침상 목록과 투약 목록이 완전히 일치하지 않아요. 임상 기록으로 보려면 누락된 대상부터 확인해야 합니다.'],
  ['nasol','오은지','번호를 지운 자국이 있어요. 퇴실했다는 기록과 단순히 이름이 빠진 기록은 다르죠.']],
 'evidence-investor':[
  ['kim','차준영','제가 요구한 건 자금 회수였어요. 직원들은 그걸 면담이 아니라 외부 접촉 제한 사유로 적었군요.'],
  ['nasol','오은지','돈 얘기 다음에 방문 제한이 붙었네요. 누가 결재했는지까지 확인해야겠어요.']],
 'evidence-reporter':[
  ['nasol','오은지','그날 머리를 다쳤던 건 기억해요. 그런데 깨어난 뒤부터 기억이 흐릿해진 부분도 있어요. 두 기록을 따로 봐야 해요.'],
  ['changwon','이철민','투약 시점과 관찰 내용만으로 약물의 정확한 작용을 단정할 순 없습니다. 기록에 적힌 것만 확인합시다.']],
 'evidence-offering':[
  ['nasol','오은지','기도와 배려라는 말로 포장했지만, 안쪽 문건에는 누군가 책임을 피하려고 만든 표현이 보여요.'],
  ['kim','차준영','여긴 물품을 놓는 순서에도 규칙이 있군요. 문구가 가리키는 용도부터 따져 보죠.']],
 'evidence-water':[
  ['jubin','김주호','상자에 찍힌 숫자가 저장 탱크 쪽이랑 같아요. 설비실을 거쳐 준비실로 옮겨진 모양이에요.'],
  ['changwon','이철민','납품 생수와 의식용 샘물 표기는 다르지만, 이 도면에서 확인되는 건 공급 경로뿐입니다.']],
 'evidence-recruitment':[
  ['changwon','이철민','저는 연구 경력 때문에 연락을 받았습니다. 환자 검사 대상과 같은 분류에 넣으면 안 됩니다.'],
  ['kim','차준영','외부 투자 방문자와 연구원 채용 면담은 구분돼 있네요. 결재자가 같은지도 살펴봐야겠습니다.']],
 'evidence-project':[
  ['changwon','이철민','검사 항목이 감각과 기억 유지 여부에 집중돼 있어요. 통상적인 치료 결과 보고서와는 목적이 다릅니다.'],
  ['nasol','오은지','밖으로 돌려보내지 않는다는 조항이 있네요. 누가 보고 있는지보다 누가 돌아갈 수 없는지가 중요해요.']],
 'evidence-camera':[
  ['nasol','오은지','제가 찍은 장면이에요. 나무가 화면 오른쪽에 있었고, 대문이 왼쪽에 있었어요.'],
  ['jubin','김주호','사진 조각의 울타리 선과 나무 줄기 무늬가 이어지는 곳부터 맞춰 볼게요.']],
 'case-locker':[
  ['kim','차준영','분류 문자는 표에 적힌 순서대로 숫자를 바꾸는군요. 현장 수거품이라는 항목부터 찾죠.'],
  ['nasol','오은지','카드지갑과 수첩이 같은 보관번호로 묶여 있어요. 단순 환복 물품은 아닐 거예요.']],
 'case-patient05':[
  ['nasol','오은지','의뢰서엔 이름, 병동엔 번호, 별관엔 이관 일자가 있어요. 셋이 같은 사람을 가리키는지 보죠.'],
  ['changwon','이철민','투약 대상의 번호가 삭제됐어도 이관대장은 별도로 남을 수 있습니다. 그 문서를 먼저 확인하세요.']],
 'case-accident':[
  ['kim','차준영','차량 출입대장과 현장 조치서는 다른 문서입니다. 차를 움직인 사람과 이송을 결재한 사람을 혼동하지 맙시다.'],
  ['nasol','오은지','영상에 보이는 차량과 문서의 차량 번호가 맞아요. 다만 영상 하나만으로 사고의 지시자를 단정하지는 말죠.']],
 'case-final':[
  ['kim','차준영','투자금 회수로 제가 갇힌 과정도 사건의 일부입니다. 다른 사람의 방문 목적과 섞이지 않게 정리하죠.'],
  ['jubin','김주호','우리가 걸어온 방들이 연결돼 있었어요. 환자 이관과 차량 출입 기록에도 같은 식의 경로가 남아 있을 거예요.'],
  ['changwon','이철민','연구 계획의 목표와 환자 기록을 구분해 보세요. 둘을 연결해도 실제 결과가 입증되는 건 아니니까요.'],
  ['nasol','오은지','자료마다 다른 말을 하고 있어요. 직접 확인한 기록과 누군가의 주장부터 나눠 보면 진상이 보일 거예요.'],
  ['patient05','서정윤','제 이름이 적힌 이관 기록은 정말 남아 있나요? 제가 여기 있었다는 사실을 꼭 가져가 주세요.']]
};
function investigationRemarks(puzzleId,party){
 const rows=COMPANION_INVESTIGATION[puzzleId]||[];
 return rows.filter(([id])=>Array.isArray(party)&&party.includes(id));
}
function renderCompanionInvestigation(n,raw,paper){
 const rows=investigationRemarks(n.puzzleId,s.party);
 if(!rows.length)return false;
 const box=document.createElement('section');box.className='companionInvestigation';paper.append(box);
 const head=document.createElement('div');head.className='companionInvestigationHead';head.textContent='동행자 의견 · 조사 보조';box.append(head);
 const bar=document.createElement('div');bar.className='companionInvestigationChoices';box.append(bar);
 for(const [id,who]of rows){
  const b=button(bar,who+'에게 묻기',()=>{
   raw.companionView=raw.companionView===id?null:id;
   autoSave();renderPuzzle(n);
  },'companionInvestigationAsk'+(raw.companionView===id?' active':''));
  b.setAttribute('aria-pressed',String(raw.companionView===id));
 }
 const selected=rows.find(([id])=>id===raw.companionView);
 if(selected){
  const quote=document.createElement('p');quote.className='companionInvestigationQuote';
  quote.textContent=selected[1]+' · '+selected[2];box.append(quote);
 }
 return true;
}
(()=>{
 const remarks={
  newspaperDeduce:[
   ['nasol','오은지','신문은 출처마다 말이 달라요. 이 날짜는 따로 적어 둘게요.']],
  record:[
   ['changwon','이철민','05번을 지웠다는 사실과 그 사람이 퇴실했다는 건 다른 얘기입니다.']],
  investorNoteDeduce:[
   ['kim','차준영','제가 돈을 돌려달라고 하자 연락을 막았군요. 이제야 기록으로 확인했습니다.']],
  reporterTreatmentDeduce:[
   ['nasol','오은지','이건 제 기록이네요. 제가 기억하지 못하는 시간도 서류에는 남아 있었어요.']],
  waterDeliveryDeduce:[
   ['jubin','김주호','바닥에 쌓여 있던 빈 상자도 같은 납품처였어요. 설비실부터 이어지는 경로네요.']],
  recruitmentNoteDeduce:[
   ['changwon','이철민','이렇게 채용과 입소를 같은 서류에 적어 놓을 줄은 몰랐습니다.']],
  projectRecordDeduce:[
   ['changwon','이철민','치료 경과를 찾고 있었는데, 이 계획에는 그 항목이 없어요.']],
  incidentMemoDeduce:[
   ['nasol','오은지','누구에게 무슨 말을 할지도 미리 써 놨네요. 피해자 가족은 사실을 듣지 못했을 거예요.']],
  reporterPhotoReaction:[
   ['nasol','오은지','흔들린 마지막 장면을 보니 왜 카메라를 놓쳤는지 조금 알 것 같아요. 그래도 원본은 꼭 남겨 주세요.']],
  detectiveLockerFirst:[
   ['kim','차준영','수첩과 명함을 꼭 챙기세요. 본인이 무슨 일을 하러 왔는지 증명할 자료입니다.']],
  patientIndexFirst:[
   ['nasol','오은지','이름이 나왔어요. 이제 이관된 사람을 직접 만나 확인해야겠네요.']],
  accidentLedgerFirst:[
   ['kim','차준영','차량 영상과 현장 조치서가 함께 있으니 단순한 우연으로만 보긴 어렵겠습니다.']]
 };
 for(const [scene,lines]of Object.entries(remarks)){
  const nodes=SCRIPTS[scene];
  if(!nodes)throw Error('Missing investigation scene '+scene);
  // Append only: existing scene steps (including older saves) are unchanged.
  for(const [id,who,text]of lines)nodes.push({say:text,who,requiresParty:id});
 }
})();
