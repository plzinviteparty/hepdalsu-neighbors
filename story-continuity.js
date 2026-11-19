'use strict';
// The cult investigation, from the amnesiac roadside prologue to the detective's
// recovered case, is one coherent physical journey. Keep scene IDs/flags stable
// for pre-existing local saves; only the public-facing narration is refreshed.
(()=>{
 const hall=MAPS.prom,landing=MAPS.landing,ward=MAPS.ward,
       plant=MAPS.bath,loop=MAPS.loop,back=MAPS.backroom,
       pool=MAPS.pool,chase=MAPS.chase,refuge=MAPS.wreck,exit=MAPS.bedroom;

 // The protagonist knows how to compare evidence, but not why they know.
 // Keep the 12 original prologue beats so the two illustrated plates still align.
 const oldIntro=SCRIPTS.intro;
 const steps=[
  '급커브에 들어서기 전, 사이드미러에 불빛이 비쳤다. 뒤따라오던 차였는지, 언제부터 있었는지는 떠오르지 않았다.',
  '도로 옆에서 커다란 그림자가 시야를 가로질렀다. 반사적으로 핸들을 꺾었다. 타이어가 헛돌고, 가드레일이 코앞으로 다가왔다.',
  '정신을 차렸을 때는 차 밖이었다. 도로 아래쪽에 처박힌 차에서 하얀 김이 올라오고 있었다.',
  '손바닥에 피가 묻어 있었다. 운전석 문은 반쯤 열려 있었다. 어떻게 빠져나왔는지는 기억나지 않았다.',
  '휴대전화의 화면이 깨져 있었다. 전원도 들어오지 않았다. 그러고 보니…… 나는 어디로 가던 중이었지?',
  '비탈을 한참 걸어 올라갔다. 나무들 너머로 불이 켜진 창문 하나가 보였다. 사람을 만날 수 있을지도 몰랐다.',
  '가까이 가 보니 집이라고 하기에는 규모가 컸다. 낡은 철문, 정원, 흰 벽. 처음 보는 장소였다. 그런데 어쩐지 낯설지만은 않았다.',
  '“계세요?” 대답이 없었다. 철문 안쪽을 살피려는데 등 뒤에서 발소리가 났다. 돌아보기도 전에 머리에 무언가 부딪혔다.',
  '……',
  '눈을 뜨자 낯선 연회장이 보였다. 머리 뒤쪽이 욱신거렸다. 내가 누구인지, 왜 이곳에 왔는지 떠올리려 했지만 아무것도 잡히지 않았다.'
 ];
 for(let i=0;i<steps.length;i++)oldIntro[i]=T(steps[i]);
 // Flag + control instructions remain at their original positions.
 const hintIndex=oldIntro.findIndex(n=>n.who==='조작 안내');
 if(hintIndex>=0)oldIntro[hintIndex]=T('조작 안내: 방향키/WASD 또는 아래 조이스틱으로 이동하고, E/조사로 가까운 물건을 확인하세요. 메뉴에서 저장할 수 있습니다.','조작 안내');

 hall.mission='낙원의 샘 연회장을 조사하고 밖으로 나갈 방법을 찾자';
 landing.mission='저택의 홀에서 신문과 진료·관리 구역 출입문을 확인하자';
 ward.mission='시설 직원의 감시를 피하며 병동 기록과 출입문을 조사하자';
 plant.mission='배관 장치를 고치고 설비 구역의 기록을 살펴보자';
 loop.name='지하 순환 복도';
 loop.mission='반복되는 복도의 안내판과 문을 대조하자';
 back.name='폐쇄된 공동생활관';
 back.mission='비슷한 구조의 방들을 지나, 금속 덮개와 이동 통로를 찾아보자';
 pool.name='저수조 정비실';
 chase.name='지하 연결 통로';
 refuge.name='지하 비상 대피실';
 refuge.mission='압수 물품, 차량 기록, 별관 출입문을 조사하자';
 exit.name='저택 외부 출입구';
 exit.mission='확보한 증거를 정리하고 철문을 통해 탈출하자';

 // Old UFO/cat/alien remnants cannot appear in a grounded human horror escape.
 refuge.props=[
  ['desk',7,6],['table',14,7],['monitor',23,5],['chair',13,13],
  ['pipe',4,10],['caseCabinet',29,10],['caseCart',22,18],
  ['plant',5,4],['caseCeilingLight',17,3],['chair',15,17]
 ];
 const fileTable=refuge.objects.find(o=>o.id==='family');
 if(fileTable){fileTable.kind='book';fileTable.label='폐쇄 구역 출입 기록';}
 const exitHall=refuge.objects.find(o=>o.id==='wake');
 if(exitHall)exitHall.label='외부 출입구로 이어지는 문';

 // The looping wing is architecture and disorientation, not a supernatural realm.
 SCRIPTS.backroom=[
  T('벽지가 들뜬 자리를 살펴봤다. 그 뒤로 문의 모서리와 낡은 손잡이가 보였다.'),
  R('backroom',3,4),
  T('길게 이어진 생활관이었다. 같은 무늬의 벽지가 반복되고, 낮은 칸막이가 방들을 똑같이 나누고 있었다.'),
  T('어느 문으로 들어왔는지 헷갈렸다.'),
  T('방의 배치부터 기억해 두자. 같은 자리를 다시 지나면 표식을 남겨야겠다.')
 ];
 SCRIPTS.loopWrong=[
  F('wrongTurn'),
  T('복도를 돌아 나왔는데 조금 전의 흠집이 다시 보였다.'),
  T('이곳에서 걸어온 방향과 출입문 번호를 비교해야겠다.'),
  R('loop',3,5)
 ];
 SCRIPTS.dalsuSound=[
  T('갈림길 너머에서 구두 굽이 일정하게 바닥을 두드렸다.'),
  T('걸음을 멈췄더니 그쪽에서도 발소리가 멎었다.'),
  C('어떻게 할까?', [['안쪽을 살펴본다','dalsuEncounter'],['지나간다','doorStay']])
 ];
 // Preserve 14 frames, including step 8's preexisting black-screen animation.
 const meet=SCRIPTS.dalsuEncounter;
 const meetLines={
  0:T('갈림길을 돌자 흰 셔츠 차림의 남자가 서 있었다. 언제부터 있었는지 알 수 없었다.'),
  1:T('남자는 내 얼굴을 차근차근 살폈다. 그 시선이 지나치게 익숙했다.'),
  2:T('혹시 이 저택의 관계자예요?'),
  3:T('아직도 여기 계셨군요.','남자'),
  4:T('저를 아세요?'),
  5:T('허달수라고 합니다. 여기서 지내는 분들은 모두 제 이웃이지요.','허달수'),
  6:T('그는 질문에 대답하지 않았다. 내가 뒤로 물러나자 한 발 가까이 왔다.'),
  7:T('찾으러 오실 분은 없습니까? 기다리는 가족이라든가.','허달수'),
  8:T('……'),
  11:T('복도 벽에 손을 짚고 있었다. 몇 초나 그렇게 서 있었는지 알 수 없었다.'),
  12:T('허달수가 있던 자리에는 아무도 없었다.'),
  13:T('방금 그 사람은 나를 알고 있는 것 같았다. 왜 그 말을 듣고도 아무것도 떠오르지 않을까.')
 };
 for(const [key,node] of Object.entries(meetLines))meet[Number(key)]=node;

 // A few physical deductions, never an outright reveal of the detective's job.
 SCRIPTS.bone.splice(SCRIPTS.bone.findIndex(n=>n.op==='flag'),0,
  T('맨 아래에는 인쇄 날짜와 배포 담당자의 서명이 있었다. 먼저 그걸 확인한 자신이 이상했다.'),
  T('이런 종이를 받으면 항상 날짜부터 확인했었나?')
 );
 const newspaper=SCRIPTS.newspaperDeduce;
 if(newspaper){
  newspaper.splice(1,0,T('신문의 발행일은 흐려졌지만 사건 순서를 알 수 있는 문장들이 남아 있었다. 본능적으로 세 기사를 날짜순으로 펼쳤다.'));
  const award=newspaper.findIndex(n=>n.op==='give');
  if(award>=0)newspaper.splice(award,0,T('서명을 보니 연혁표와 기사 작성자는 서로 달랐다. 어느 쪽이 맞는지까지 확인하는 습관이 몸에 배어 있는 것 같았다.'));
 }
 const wardRecord=SCRIPTS.record;
 if(wardRecord){
  const puzzlePos=wardRecord.findIndex(n=>n.puzzle);
  if(puzzlePos>=0)wardRecord.splice(puzzlePos,0,T('침상 명부, 투약 장부, 퇴실 기록. 세 문서의 번호부터 나란히 적었다. 이런 작업이 이상할 만큼 손에 익었다.'));
 }
 // A small temporal inconsistency on a staff log: independent, optional foreshadowing.
 const newClue=(room,id,x,y,kind,label,nodes,flag)=>{
  MAPS[room].objects.push(O(id,x,y,kind,label));
  SCRIPTS[id]=[Q(flag,id+'Known',id+'New')];
  SCRIPTS[id+'New']=[...nodes,F(flag)];
  SCRIPTS[id+'Known']=[T('이미 확인한 기록이다. 다른 새로운 단서는 없다.')];
 };
 newClue('prom','entryPlacard',15,12,'book','연회장 출입표',[
  T('연회장 출입표에는 이름 대신 번호가 적혀 있었다. 입장 시각과 퇴장 시각이 나란히 붙어 있었다.'),
  T('어떤 번호는 입장 시각만 있었다. 나는 무심코 퇴장 기록이 비어 있는 번호부터 세고 있었다.'),
  T('그걸 센다고 무슨 소용이 있지?')
 ],'foreshadowEntry');
 newClue('landing','guestLedger',17,13,'book','방문객 서명부',[
  T('방문객 서명부를 펼쳤다. 외부 방문자는 대부분 출입 시간 두 개를 적었다.'),
  T('몇 줄은 나간 기록이 비어 있었다. 같은 날짜에 들어온 사람들의 필체는 제각각이었다.'),
  T('입소했다는 사실과 돌아갔다는 사실은 별개였다. 당연한 걸 이제야 떠올린 기분이었다.')
 ],'foreshadowLedger');
 newClue('ward','filingMarks',25,18,'book','분리된 기록 목록',[
  T('자료 목록의 정리 순서가 이상했다. 이름순도, 입소일순도 아니었다.'),
  T('서류 왼쪽 모서리에 같은 도장 자국이 있는 것끼리 모아 놓았다. 어떤 사람은 이 기록을 반복해서 옮겨 본 모양이다.'),
  T('검사 결과가 아니라 누가 어디로 옮겨졌는지를 먼저 살펴봐야겠다.')
 ],'foreshadowWard');
 newClue('loop','maintenanceLog',13,8,'book','출입문 보수 일지',[
  T('보수 일지에는 비슷한 구조의 생활관 문들이 몇 차례 수리됐다고 적혀 있었다.'),
  T('동일한 문 번호가 서로 다른 구역에 반복되어 있었다. 방향을 착각하기 쉬운 구조다.'),
  T('지도를 그리더라도 번호만 믿어서는 안 되겠다.')
 ],'foreshadowMaze');

 // The forced escape is still a staffed pursuit, never a body transformation.
 const chaseIntro=SCRIPTS.chaseIntro;
 const oldTransform=chaseIntro.findIndex(n=>n.op==='flag'&&n.key==='tofu');
 if(oldTransform>=0)chaseIntro[oldTransform]=F('tofu',false);
 SCRIPTS.rescued=[
  F('chaseActive',false),
  R('wreck',5,9),
  T('비상문을 닫고 빗장을 걸었다. 뒤에서 손잡이를 비트는 소리가 몇 번 들렸다.'),
  T('복도 반대편에서 경비 직원들의 호출음이 울렸다. 곧 발소리가 멀어졌다.'),
  T('벽에는 출입 경로 안내도가 붙어 있었다. 여기서 별관과 외부 출입구가 갈라진다.'),
  F('ufoDone')
 ];
 SCRIPTS.family=[
  T('책상에는 구역 출입 내역이 묶여 있었다. 「별관 관찰병실 / 담당자 승인 필요」.'),
  T('연구동으로 반입된 물품의 담당자 결재란에는 우성제약의 이름이 남아 있었다.'),
  T('같은 날짜에 반복해서 기록된 차량 번호도 보였다. 별도의 차량 출입대장이 있을 것 같다.'),
  F('observationClue')
 ];
 SCRIPTS.wake=[
  R('bedroom',5,8),F('tofu',false),
  T('출입 통로 끝에서 차가운 외기가 느껴졌다. 철문까지 이어진 길이 보였다.'),
  T('밖으로 나갈 수 있을 것 같다. 하지만 확인하지 않은 기록들이 아직 남아 있다.')
 ];
 SCRIPTS.clock=[T('벽시계의 바늘이 멈춰 있었다. 초침의 위치와 먼지 자국이 맞지 않았다.'),T('누군가 시간을 다시 맞추려 한 것처럼 보였다.')];

 // A patrol guard catching the player is a failed escape, not a fantastical
 // transformation carried over from the retired mini-game.
 ENDINGS.tofu={
  type:'BAD END 03',title:'비상문 앞에서',
  text:'비상문에 손이 닿기 직전, 뒤에서 누군가 내 팔을 붙잡았다.\\n\\n직원들이 무전기로 누군가에게 보고했다. 잠시 뒤 병동으로 통하는 문이 다시 열렸다.\\n\\n이번에는 돌아갈 길이 없었다.',
  hint:'지하 연결 통로에서는 시설 직원보다 먼저 비상문에 도착해야 한다.'
 };
 // The final case board should feel earned, even without optional discoveries.
 const finale=SCRIPTS.evidenceFinal;
 if(finale){
  const before=finale.findIndex(n=>n.puzzle);
  if(before>=0)finale.splice(before,0,T('문서마다 이름을 적은 방식은 달랐지만, 날짜와 관리번호는 서로 맞물렸다. 그 관계를 먼저 기록해 두었다.'));
 }
})();
