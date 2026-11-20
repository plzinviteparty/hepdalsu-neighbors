'use strict';
// Optional investigation route. Core evidence is earned through deduction, never a loose pickup.
(()=>{
 const seq=(id,title,help,options,answer,extra={})=>({puzzle:true,puzzleId:id,title,help,device:'evidence',mode:'sequence',options,answer,...extra});
 const match=(id,title,help,labels,options,answer,extra={})=>({puzzle:true,puzzleId:id,title,help,device:'evidence',mode:'match',labels,options,answer,...extra});
 const obj=(room,id)=>MAPS[room].objects.find(o=>o.id===id);
 const once=(id,flag,nodes,again)=>{SCRIPTS[id]=[Q(flag,id+'ReadAlready',id+'Deduce')];SCRIPTS[id+'ReadAlready']=[T(again)];SCRIPTS[id+'Deduce']=nodes;};
 // Archive: chronological reconstruction, not an unsupported historical medical finding.
 obj('landing','newspaper').label='신문 스크랩 보관함';
 once('newspaper','dalsuKnown',[
  T('책상 서랍에는 신문 스크랩 세 장과 연혁 보관함이 있었다. 기사에는 날짜 대신 서로를 인용하는 문장이 남아 있다.'),
  seq('evidence-archive','낙원의 샘 · 연혁 복원','보관함: 가장 오래된 기사부터 배열할 것.\n「공동생활관」 기사는 보건소 진료 기사 이후의 일이라고 적혀 있다.\n「공동체 대표 인터뷰」는 공동생활관 개소를 회고한다.',[
   '대표 인터뷰 · 공동생활관 개소를 회고','보건소 진료 · 흰 가운을 입은 의사','공동생활관 개소 · 보건소 기사 인용'
  ],[1,2,0],{hintParty:'nasol',hintText:'오은지: 앞선 기사를 인용할 수는 있어도 아직 나오지 않은 기사를 인용할 수는 없죠.'}),
  T('보관함에서 오래된 원본 기사를 꺼냈다. 대표 허달수는 시골 보건소에서 진료하던 의사였다. 낙원의 샘의 연혁은 1970~80년대까지 거슬러 올라간다.'),
  I('newspaper'),F('dalsuKnown')
 ],'연혁을 복원한 스크랩 보관함이다. 원본 기사는 이미 챙겼다.');
 // Preserve the access badge and original record interaction for companion recruitment.
 obj('ward','record').label='환자 대조 기록철';
 SCRIPTS.record=[
  T('기록철에는 네 명의 환자와 다섯 개의 투약 관리번호가 있다. 이름이 지워진 기록을 분리해 보관한 것 같다.'),
  match('evidence-ward','존재하지 않는 환자','침상 명부: 01, 02, 03, 04.\n투약 장부: 01, 02, 05, 03, 04.\n별도 기록: 05는 침상 명부 삭제, 외부 접촉 금지.\n기록 보관함의 분류표를 맞추자.',
   ['침상 명부와 일치하지 않는 번호','누락 기록의 분류'],[['02','04','05'],['정상 퇴실','외부 접촉 제한','자진 귀가']],[2,1],
   {hintParty:'changwon',hintText:'이철민: 두 장부 중 한쪽에만 있는 번호를 찾으면 됩니다. 삭제된 번호의 별도 기록도 확인해 보세요.'}),
  T('잠긴 칸에서 관찰 기록을 꺼냈다. 환자들의 검사는 별도 관리되었고 외부와의 접촉은 제한되어 있었다. 사망 원인은 적혀 있지 않다.'),
  I('record'),F('readRecord'),T('뒷부분이 두껍다. 기록철을 한 번 더 살펴볼 수 있을 것 같다.')
 ];
 // The recordBack scene in the base game supplies the badge; make its completion explicit.
 if(!SCRIPTS.recordBack.some(n=>n.op==='flag'&&n.key==='badgeTaken'))SCRIPTS.recordBack.push(F('badgeTaken'));
 obj('ward','investorNote').label='잠긴 외부 접촉 기록함';
 once('investorNote','investorClue',[
  match('evidence-investor','자금 회수 기록 대조','접수 목록: A는 연구직 면담, B는 투자금 회수, C는 자원봉사 신청.\n관리 지시: B만 외부 통화와 면회를 전면 금지.\n결재자: 허달수.',
   ['차준영의 접수 분류','그에게 내려진 조치'],[['A','B','C'],['연구직 채용','외부 연락 금지','자원봉사 등록']],[1,1],
   {hintParty:'kim',hintText:'차준영: 저는 우성제약 쪽 자금을 회수하던 중이었어요. 분류표에서 투자금 회수 항목을 찾아보세요.'}),
  T('기록함이 열렸다. 차준영의 투자금 회수를 문제 삼은 허달수의 지시가 적혀 있었다.'),
  ...SCRIPTS.investorNote.slice(1)
 ],'차준영에 관한 외부 접촉 제한 기록을 이미 확보했다.');
 // Reporter treatment is optional corroboration, but still requires a record match.
 once('reporterTreatment','reporterTreatmentRead',[
  match('evidence-reporter','응급 처치 기록 대조','접수표: R-12 두부 외상·의식 소실 / R-18 발열 / R-23 골절.\n반복 투약지: R-12.\n관찰지: R-12 각성 후 시간과 장소 혼동.',
   ['오은지의 입소 기록','투약 이후 관찰 결과'],[['R-18','R-12','R-23'],['정상 퇴실','기억 및 지남력 혼동','골절 회복']],[1,1],
   {hintParty:'nasol',hintText:'오은지: 머리를 맞았던 기억은 있어요. 깨어났을 때 어디인지도 몰랐고요.'}),
  ...SCRIPTS.reporterTreatment
 ],'오은지의 응급 처치 및 투약 기록은 이미 확인했다.');
 // A separate offering device, away from the existing fasting pursuit route.
 MAPS.research.objects=MAPS.research.objects.filter(o=>o.id!=='incidentMemo');
 MAPS.altar.objects.push(O('incidentMemo',5,25,'box','세 개의 봉헌함'));
 once('incidentMemo','incidentMemoRead',[
  T('세 봉헌함 위에는 기도, 배려, 양보라는 글자가 새겨져 있었다. 옆에는 세 가지 봉헌물을 그린 낡은 안내문이 있다.'),
  match('evidence-offering','낙원의 샘 · 봉헌 의식','기도문: 말로 올리는 것은 첫 번째 덕목.\n몸이 아픈 이웃에게는 치료할 물건을.\n내게 허락된 몫을 남에게 내어 주는 것은 마지막 덕목.\n각 봉헌함의 그림을 선택하자.',
   ['기도','배려','양보'],[['약봉지','기도문','내 몫의 샘물'],['약봉지','기도문','내 몫의 샘물'],['약봉지','기도문','내 몫의 샘물']],[1,0,2]),
  T('세 그림을 맞추자 봉헌함 아래의 서랍이 열렸다. 안에는 유가족을 어떻게 대할지 정해 놓은 내부 메모가 있었다.'),
  ...SCRIPTS.incidentMemo.slice(1)
 ],'봉헌함 안쪽에는 더 이상 문건이 없다.');
 // Trace supply rather than confusing the sacred water with medication or inventing chemical results.
 obj('bath','waterDelivery').label='샘물 공급 관리함';
 once('waterDelivery','waterOrigin',[
  T('배관 옆에 빈 생수 상자와 공급 경로 도면이 있었다. 잠긴 관리함의 표시는 물의 이동 순서대로 맞추게 되어 있다.'),
  seq('evidence-water','샘물의 공급 경로','납품표: 일반 생수 상자 → 설비실 입고.\n작업표: 입고된 물은 의식 준비실에서 용기에 옮겨 담는다.\n배급표: 준비실에서 신도용 샘물 용기를 수령한다.',
   ['신도 배급','일반 생수 입고','의식 준비실 용기 충전'],[1,2,0],
   {hintParty:'jubin',hintText:'김주호: 상자랑 의식용 통에 같은 납품 번호가 붙어 있어요.'}),
  ...SCRIPTS.waterDelivery
 ],'일반 생수 납품 명세서를 확인한 관리함이다.');
 // Scientist files: distinguish recruitment from experimentation.
 obj('research','recruitmentNote').label='잠긴 연구 인력 서류함';
 once('recruitmentNote','recruitmentClue',[
  match('evidence-recruitment','연구 인력 선별 기록','면담표: E는 은성제약 백신 연구원, 퇴직 예정.\nP는 공동체 입소 환자, 검사 대상.\nV는 외부 투자 관련 방문자.\n채용부는 연구 인력만 따로 분리하라는 지시를 받았다.',
   ['이철민의 면담 분류','그에게 제안된 역할'],[['P','V','E'],['연구 인력 영입','환자 검사 대상','투자금 상담']],[2,0],
   {hintParty:'changwon',hintText:'이철민: 해외 수출용 백신을 연구하던 건 제 경력입니다. 환자로 들어온 게 아니에요.'}),
  ...SCRIPTS.recruitmentNote
 ],'이철민의 연구 인력 면담 기록을 확보했다.');
 // The research protocol itself must be reconstructed from separate files.
 MAPS.research.objects.push(O('projectRecord',21,8,'book','봉인된 연구 계획철'));
 ITEMS.projectRecord=['신인류 연구 계획서','허달수가 결재한 연구 계획. 감각 반응과 기억을 관찰하며 인간의 상태를 재구성하려는 목적이 적혀 있다. 치료 결과 보고서가 아니다.'];
 once('projectRecord','projectClue',[
  T('잠긴 계획철에는 분류되지 않은 연구 항목 세 개가 표시되어 있었다. 앞서 병동과 배관실에서 확인한 자료가 있어야 대조할 수 있을 것 같다.'),
  match('evidence-project','연구 계획철 · 목적과 대상','서류 A: 일반 생수 입고 및 의식용 용기 충전.\n서류 B: 대상자 감각 반응 및 기억 변화 관찰, 외부 접촉 제한.\n서류 C: 백신 연구원 영입 면담.\n관찰 계획과 물품 공급, 인력 영입을 각각 분리하라.',
   ['물품 공급','대상자 관찰','연구 인력'],[['B','C','A'],['C','B','A'],['A','B','C']],[2,1,2],
   {requiresFlags:['readRecord','waterOrigin','recruitmentClue'],requiresNames:['병동 환자 기록','배관실 샘물 기록','연구 인력 기록'],hintParty:'changwon',hintText:'이철민: 이건 환자를 치료하고 퇴원시키는 연구 계획서가 아닙니다. 사람의 반응과 기억 자체를 관찰하고 있어요.'}),
  T('「신인류 연구 / 책임자: 허달수」'),
  T('「감각 반응의 유지 여부, 자기 인식 및 기억의 일관성을 반복 관찰할 것. 대상자의 외부 복귀는 별도 승인 전까지 보류한다.」'),
  T('치료 경과에 관한 문장은 없었다. 문서의 목적란에는 인간을 더 나은 상태로 만드는 것이라고 적혀 있었다.'),
  I('projectRecord'),F('projectClue')
 ],'봉인된 연구 계획철은 이미 확인했다.');
 // Recover the reporter's evidence through file reconstruction, preserving card and reaction scenes.
 const originalPhotos=SCRIPTS.cameraPhotos;
 SCRIPTS.cameraPhotos=[
  T('메모리 카드에서 손상된 사진 파일의 미리보기를 찾았다. 파일의 일부가 깨졌으나 촬영 순서는 복원할 수 있을 것 같다.'),
  seq('evidence-camera','취재 사진 복구','촬영 로그: 먼저 대문을 통과한다. 다음은 나무에 묶인 사람을 렌즈에 담고, 신도가 카메라 쪽을 돌아본 순간 기록이 끊긴다.',
   ['플래시를 향해 돌아본 얼굴','대문 안쪽 정원','나무에 묶인 사람'],[1,2,0],
   {hintParty:'jubin',hintText:'김주호: 연속 촬영된 파일은 장면이 이어지는 순서로 복구하면 돼요.'}),
  ...originalPhotos
 ];
 // Final reconstruction: entirely optional. Existing physical escape branches remain intact.
 const core=['dalsuKnown','readRecord','investorClue','incidentMemoRead','waterOrigin','recruitmentClue','projectClue'];
 const names=['홀의 연혁 기록','병동 환자 기록','병동 외부 접촉 기록','절식기도실 봉헌함','배관실 샘물 기록','연구실 인력 기록','봉인된 연구 계획서'];
 SCRIPTS.observationBeforeTruth=[
  T('출입문 옆에 잠긴 방이 있었다. 유리 너머로 누군가의 이름이 적힌 장비가 보였다.'),
  C('관찰실 옆에 기록 확인 장치가 있다.',[['수집한 증거를 대조한다','evidenceFinal'],['밖으로 나간다','falseEscape'],['물러난다','doorStay']])
 ];
 SCRIPTS.evidenceFinal=[
  match('evidence-final','관찰실 · 기록 대조','지금까지 확보한 기록으로 다음 다섯 문장의 빈칸을 채운다.\n공동체의 표면과 실제 운영을 구분하고, 사람들을 가둔 목적을 추리하자.',
   ['샘물의 실제 출처','환자 사망에 대한 내부 설명','차준영을 가둔 이유','이철민을 불러들인 이유','연구의 실제 목적'],
   [['일반 납품 생수','신성한 지하수','치료용 약물'],['의학적 원인 확정','기도 부족으로 책임 전가','정상 퇴원'],['연구원 채용','자원봉사 신청','투자금 회수와 외부 발언'],['백신 연구 경력 활용','투자 손실 보복','신도 봉헌 의무'],['통상적인 환자 치료','감각과 기억의 관찰을 통한 신인류 연구','생수 재고 정리']],
   [0,1,2,0,1],{requiresFlags:core,requiresNames:names}),
  T('확보한 기록의 관리 번호를 대조하자 관찰실 문이 열렸다.'),
  J('truthReveal')
 ];
 ENDINGS.truth.hint='허달수와 조우한 뒤 일곱 핵심 기록을 확보하고 관찰실에서 대조하자.';
 // Warn before the player crosses the irreversible final pursuit.
 const barrier=SCRIPTS.rewrite.findIndex(n=>n.puzzle);
 if(barrier>=0)SCRIPTS.rewrite[barrier].investigationWarning=true;
})();
function renderEvidencePuzzle(n,raw){
 const root=$('#choices');
 root.replaceChildren();
 // Field folder and clipped papers: one shared visual grammar for every investigation puzzle.
 const desk=document.createElement('section');desk.className='caseDesk';root.append(desk);
 const header=document.createElement('div');header.className='caseDeskHead';desk.append(header);
 const code=document.createElement('span');code.className='caseFolderCode';
 code.textContent=n.puzzleId?.toUpperCase().replaceAll('-',' / ')||'CASE FILE';header.append(code);
 const status=document.createElement('span');status.className='caseFolderStatus';
 status.textContent='낙원의 샘 · 기록 대조';header.append(status);
 const paper=document.createElement('div');paper.className='casePaper';desk.append(paper);
 const tape=document.createElement('div');tape.className='casePaperTape';paper.append(tape);
 const title=document.createElement('h3');title.className='casePaperTitle';title.textContent=n.title;paper.append(title);
 const help=document.createElement('p');help.className='casePaperInstructions';help.textContent=n.help;paper.append(help);
 if(n.puzzleId==='case-final')addFinalCaseLinks(paper);
 $('#words').textContent='서류의 내용을 확인하고 빈칸을 채우자.';
 const missing=(n.requiresFlags||[]).map((f,i)=>s.flags[f]?null:n.requiresNames[i]).filter(Boolean);
 if(missing.length){
  const warn=document.createElement('div');warn.className='caseWarning';warn.textContent='미확보 기록\n'+missing.join('\n');paper.append(warn);
  const actions=document.createElement('div');actions.className='caseActions';paper.append(actions);
  button(actions,'돌아가기',leavePuzzle);
  updateUI();return;
 }
 if(raw.evidenceId!==n.puzzleId){
  raw.evidenceId=n.puzzleId;
  raw.selected=n.mode==='sequence'?[]:n.labels.map(()=>null);
  raw.tries=0;
 }
 const selected=raw.selected;
 const work=document.createElement('div');work.className='caseWork';paper.append(work);
 const render=()=>{autoSave();renderPuzzle(n)};
 if(n.mode==='sequence'){
  const section=document.createElement('p');section.className='caseSection';section.textContent='01 / 기사·기록 배열';work.append(section);
  const order=document.createElement('div');order.className='caseOrder';work.append(order);
  for(let i=0;i<n.options.length;i++){
   const line=document.createElement('div');line.className='caseOrderSlot'+(i<selected.length?' filled':'');
   const num=document.createElement('small');num.textContent=String(i+1).padStart(2,'0');line.append(num);
   const value=document.createElement('span');value.textContent=i<selected.length?n.options[selected[i]]:'문서 선택 대기';line.append(value);order.append(line);
  }
  const choices=document.createElement('div');choices.className='caseSlipTray';work.append(choices);
  n.options.forEach((label,i)=>{
   const rank=selected.indexOf(i),b=button(choices,(rank>=0?String(rank+1).padStart(2,'0')+' ✓  ':'')+label,()=>{
    if(selected.includes(i))return;selected.push(i);render();
   },'caseSlip'+(rank>=0?' filed':''));
   b.disabled=rank>=0;
  });
 }else{
  const section=document.createElement('p');section.className='caseSection';section.textContent='02 / 기록 분류 · 항목 대조';work.append(section);
  n.labels.forEach((label,i)=>{
   const field=document.createElement('div');field.className='caseField';work.append(field);
   const labelNode=document.createElement('div');labelNode.className='caseFieldLabel';field.append(labelNode);
   const index=document.createElement('span');index.className='caseFieldIndex';index.textContent=String(i+1).padStart(2,'0');labelNode.append(index);
   const name=document.createElement('span');name.textContent=label;labelNode.append(name);
   const options=document.createElement('div');options.className='caseFieldOptions';field.append(options);
   n.options[i].forEach((opt,j)=>{
    const active=selected[i]===j;
    const b=button(options,(active?'■ ':'□ ')+opt,()=>{selected[i]=j;render()},'caseAnswer'+(active?' chosen':''));
    b.setAttribute('aria-pressed',String(active));
   });
  });
 }
 if(n.hintParty&&s.party.includes(n.hintParty)){
  const hint=document.createElement('p');hint.className='caseCompanionNote';hint.textContent=n.hintText;paper.append(hint);
 }
 if(raw.tries){
  const warn=document.createElement('p');warn.className='caseWrong';warn.textContent='문서 내용이 일치하지 않는다. 다시 대조해 보자.';paper.append(warn);
 }
 const actions=document.createElement('div');actions.className='caseActions';paper.append(actions);
 const allSelected=selected.length===n.answer.length&&selected.every(x=>x!==null);
 const submit=button(actions,'대조 완료 / 기록 봉인',()=>{
  if(!allSelected)return;
  if(n.answer.every((v,i)=>selected[i]===v)){completePuzzle()}
  else{raw.tries++;sound(110,.12);render();}
 },'caseConfirm');
 submit.disabled=!allSelected;
 if(n.mode==='sequence')button(actions,'다시 배열',()=>{selected.length=0;render()},'caseReset');
 button(actions,'조사 중단',leavePuzzle,'caseLeave');
 updateUI();
}
