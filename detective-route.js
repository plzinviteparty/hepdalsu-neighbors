'use strict';
// Detective case route. Runs after evidence-puzzles.js and before game.js.
// Draft names: Seo Mi-yeon (client), Seo Jeong-yun (missing patient 05).
(()=>{
 const match=(id,title,help,labels,options,answer,extra={})=>({puzzle:true,puzzleId:id,title,help,device:'evidence',mode:'match',labels,options,answer,...extra});
 const mark=(id,flag,nodes,repeat)=>{SCRIPTS[id]=[Q(flag,id+'Repeat',id+'First')];SCRIPTS[id+'First']=nodes;SCRIPTS[id+'Repeat']=[T(repeat)];};
 const allParty=()=>[...REQUIRED_PARTY];
 // Evidence is carried forward from the existing rooms. No old evidence is awarded automatically.
 ITEMS.detectiveCaseFile=['탐정 수첩과 명함','사설 탐정 명함과 의뢰인 서미연의 서명이 있는 실종 조사 의뢰서. 실종자는 동생 서정윤.'];
 ITEMS.transfer05=['05번 환자 이관 기록','일반 병동에서 삭제된 05번 대상자는 서정윤. 별관 관찰 병실로 이관되었다.'];
 ITEMS.roadEvidence=['사고 관련 기록 묶음','사고 당시 차량 B-17의 출입 시각, 현장 사진, 허달수가 결재한 확보·이송 지시가 연결된다.'];
 // Escape objectives can now include all four existing companions and the rescued missing woman.
 if(!REQUIRED_PARTY.includes('patient05'))REQUIRED_PARTY.push('patient05');
 // The existing emergency room is reached immediately after the staffed pursuit.
 const wreck=MAPS.wreck;
 wreck.mission='압수 물품과 별관 출입 기록을 확인하자';
 wreck.objects.push(
  O('detectiveLocker',8,12,'book','압수 물품 보관함'),
  O('accidentLedger',25,13,'book','차량·이송 기록함'),
  O('annexDoor',28,17,'door','별관 05번 관찰병실')
 );
 // The offering record must be obtained before the irreversible fasting-room trial.
 // This also prevents players from losing a mandatory case clue during the pursuit.
 const originalAltarTrial=SCRIPTS.altarTrial;
 SCRIPTS.altarTrialProceed=originalAltarTrial;
 SCRIPTS.altarNeedOffering=[
  T('신도들의 말소리가 뒤엉켰다. 옆의 봉헌함을 가리키는 손가락이 보였다.'),
  T('기도, 배려, 양보. 먼저 봉헌 의식을 마쳐야 대답을 들을 수 있을 것 같다.')
 ];
 SCRIPTS.altarTrial=[Q('incidentMemoRead','altarTrialProceed','altarNeedOffering')];
 for(let i=0;i<5;i++){
  const id='altarHead'+i,proceed=id+'Proceed';
  SCRIPTS[proceed]=SCRIPTS[id];
  SCRIPTS[id]=[Q('incidentMemoRead',proceed,'altarNeedOffering')];
 }
 MAPS.altar.mission='봉헌함을 살펴보고, 신도들의 참말과 거짓말을 비교하자';
 // The patient lives in a visitable ward, rather than being an ending-only caption.
 MAPS.annex05={
  name:'별관 05번 관찰병실',theme:'ward',w:28,h:20,
  mission:'병상에 있는 사람과 이관 기록을 확인하자',
  objects:[
   O('annexReturn',4,16,'door','비상 대피실로 돌아가는 문'),
   O('patient05',17,12,'patient05','병상 옆에 앉은 여자',{hide:'patient05Rescued'}),
   O('patientIndex',7,11,'book','잠긴 환자 이관 기록함')
  ],
  props:[['bed',17,9],['desk',7,7],['monitor',23,6],['chair',10,14],['plant',24,15]]
 };
 SCENERY.annex05=[];
 MAPS.wreck.objects.find(o=>o.id==='family').label='폐쇄 구역 출입 기록';
 SCRIPTS.annexDoor=[
  T('문에는 「별관 05번 관찰병실」이라는 명패가 붙어 있었다. 안에서 희미한 기침 소리가 들렸다.'),
  C('병실 안으로 들어갈까?', [['들어간다','annexEnter'],['대피실에 남는다','doorStay']])
 ];
 SCRIPTS.annexEnter=[R('annex05',5,16),T('가느다란 형광등이 병상 위에서 깜빡이고 있었다.'),T('침대 옆에 누군가 앉아 있었다.')];
 SCRIPTS.annexReturn=[R('wreck',26,17)];
 // Locker: an observed wristband and transport log supply the combination.
 mark('detectiveLocker','identityKnown',[
  T('벽에 걸린 압수 물품 목록을 펼쳤다. 「사고 현장 수거품」과 「일반 입소자 보관품」이 분리되어 있었다.'),
  T('사고 당시 입고된 물건들 가운데 가죽 수첩과 카드지갑의 보관표가 남아 있었다.'),
  match('case-locker','압수 물품 보관함','사고 현장 수거품은 C-05. A-12는 입소자 환복, E-03은 의료 물품이다.\nC-05의 물품명에는 가죽 수첩과 카드지갑이 적혀 있다.',
   ['사고 현장 수거 분류','회수할 소지품'],[['A-12','C-05','E-03'],['의료 물품','가죽 수첩과 카드지갑','환자복']],[1,1]),
  T('보관함 안에는 찌그러진 카드지갑과 비에 젖은 수첩이 있었다. 첫 장에 적힌 서명과 명함의 이름이 같았다.'),
  T('명함에는 내 사진과 이름이 있었다. 그 아래 적힌 직업을 읽었다.'),
  T('사설 탐정.'),
  T('……맞아. 누군가를 찾고 있었어.'),
  T('수첩 안에는 서미연의 서명이 있는 의뢰서가 끼워져 있었다. 실종된 동생 서정윤. 마지막 확인 장소는 낙원의 샘.'),
  T('나는 도망치려고 여기에 온 사람이 아니었다. 이곳을 조사하고 있었다.'),
  I('detectiveCaseFile'),F('identityKnown')
 ],'압수 물품 보관함은 열려 있다. 내 명함과 의뢰서도 이미 챙겼다.');
 // The register itself is not an item on the floor: it needs both the ward data and the detective's client file.
 mark('patientIndex','patient05Located',[
  T('환자 이관 기록함에는 병동 명부에서 누락된 사람들의 이름이 가려져 있었다.'),
  T('실종 의뢰서와 병동 기록을 나란히 펼쳤다. 기억하던 번호가 있었다. 05.'),
  match('case-patient05','05번 이관 기록 대조','병동: 침상 01~04, 투약대장에만 05가 있음.\n의뢰서: 실종된 서정윤, 가족 서미연.\n별관 이관대장: 05번은 서정윤이라는 이름으로 재분류.',
   ['누락된 관리번호','05번 대상자의 성명'],[['04','05','06'],['서미연','오은지','서정윤']],[1,2],
   {requiresFlags:['identityKnown','readRecord'],requiresNames:['탐정의 의뢰서','병동의 누락 환자 기록']}),
  T('이관대장을 펼쳤다. 「05 — 서정윤. 일반 병동 관리 종료. 별관 관찰 지속.」'),
  T('내가 찾으러 온 사람은 이 저택 안에 있었다.'),
  I('transfer05'),F('patient05Located')
 ],'05번 서정윤의 이관 기록은 확보했다. 병상에 있는 사람과 이야기할 수 있다.');
 SCRIPTS.patient05=[Q('patient05Rescued','patient05After','patient05Contact')];
 SCRIPTS.patient05Contact=[Q('patient05Located','patient05Recognize','patient05Unknown')];
 SCRIPTS.patient05Unknown=[
  T('침대에 앉은 여자가 나를 바라봤다. 팔목에는 05라는 숫자가 적힌 표가 붙어 있었다.'),
  T('누구세요?','여자'),
  T('저도 여기에 갇혔어요. 나가는 길을 찾고 있습니다.'),
  T('그녀는 한참 동안 나를 바라보다 눈을 내리깔았다.'),
  T('……저도 나가고 싶어요.','여자')
 ];
 SCRIPTS.patient05Recognize=[
  T('서정윤 씨?'),
  T('여자가 천천히 고개를 들었다.'),
  T('서미연 씨가 저를 보냈습니다. 언니가 찾고 있어요.'),
  T('……언니가요?','서정윤'),
  T('네. 살아 있는지라도 확인해 달라고 했어요.'),
  T('나는 언니가 날 포기한 줄 알았는데.','서정윤'),
  C('서정윤을 어떻게 할까?', [['같이 나가자고 한다','patient05Join'],['잠시 더 살펴본다','patient05Wait']])
 ];
 SCRIPTS.patient05Wait=[T('서정윤은 문 쪽을 보았다.'),T('돌아오실 거죠?','서정윤')];
 SCRIPTS.patient05Join=[
  T('제가 앞장설게요. 문 밖에 사람이 있는지 먼저 살펴보겠습니다.'),
  T('정윤은 잠시 난간을 붙잡고 일어섰다.'),
  T('……언니한테 연락할 수 있겠죠?','서정윤'),
  T('나가면 제일 먼저요.'),
  P('patient05'),F('patient05Rescued')
 ];
 SCRIPTS.patient05After=[T('서정윤은 내 뒤에서 조용히 숨을 골랐다.'),T('언니한테 돌아갈 수 있으면 좋겠어요.','서정윤')];
 SCRIPTS.spent_patient05=[T('서정윤이 앉아 있던 침대 옆에는 아무도 없다.')];
 SPENT_TEXT.patient05=['빈 병상','서정윤이 일어나 함께 이동한 자리다.'];
 // Vehicle log: coincidence alone is not treated as proof of ordering the crash.
 mark('accidentLedger','accidentProof',[
  T('경비 담당자의 차량 출입대장과 외부 도로 CCTV 캡처가 봉투에 함께 들어 있었다.'),
  T('보관함의 덮개에는 사고 현장 기록을 결재 내역과 대조하라는 내부 메모가 붙어 있었다.'),
  match('case-accident','사고 관련 기록 대조','도로 영상: 사고 직전 B-17이 탐정 차량 앞을 가로막음.\n차량 대장: B-17은 낙원의 샘 소속. 사고 당일 야간 출고 후 귀환.\n현장 조치서: 「대상자 확보·이송」 허달수 결재.',
   ['도로 영상에 찍힌 차량','현장 조치 결재자','조치 내용'],[['B-12','B-17','B-71'],['경비 책임자','허달수','차준영'],['일반 환자 수송','물품 배송','대상자 확보 및 이송']],[1,1,2],
   {requiresFlags:['identityKnown'],requiresNames:['탐정 수첩과 신원 확인']}),
  T('영상 속 차량의 번호가 출입대장과 일치했다. 사고 직전 내 차를 가로막은 차량이었다.'),
  T('그 차량은 낙원의 샘에서 출고되었고, 사고 후에는 내 신병을 확보해 이곳으로 이송했다.'),
  T('조치서 아래에 허달수의 결재가 찍혀 있었다. 우연한 사고라고 보기는 어려웠다.'),
  I('roadEvidence'),F('accidentProof')
 ],'사고 당시의 차량 영상과 출입·이송 지시 기록을 확보했다.');
 // A final case-board puzzle replaces the former instant brain-ending unlock.
 const core=['dalsuKnown','readRecord','investorClue','incidentMemoRead','waterOrigin','recruitmentClue','projectClue'];
 const all=[...core,'identityKnown','patient05Located','accidentProof'];
 const names=['홀의 연혁 기록','병동 환자 기록','병동 외부 접촉 기록','절식기도실 봉헌함','배관실 샘물 기록','연구실 인력 기록','신인류 연구 계획서','탐정의 소지품','05번 환자 이관 기록','사고 및 이송 기록'];
 SCRIPTS.evidenceFinal=[
  T('수첩과 사건 기록을 대조 장치에 올려놓았다. 흩어져 있던 자료들이 같은 사건을 가리키고 있었다.'),
  match('case-final','낙원의 샘 · 최종 사건 재구성','의뢰인의 동생을 찾고, 사고의 배후를 확인했다. 이제 모든 기록을 시간과 목적에 맞춰 대조하자.',
   ['의뢰인','실종된 사람','05번 관찰 대상','탐정의 사고에 관여한 인물','신인류 연구 책임자'],
   [['서미연','서정윤','오은지'],['서미연','서정윤','차준영'],['오은지','서미연','서정윤'],['이철민','허달수','차준영'],['차준영','서미연','허달수']],
   [0,1,2,1,2],{requiresFlags:all,requiresNames:names}),
  T('마지막 문서를 배열하자 장치가 완료음을 냈다. 더는 의심할 여지가 없었다.'),
  T('실종된 서정윤, 교단의 관찰실, 나를 노린 차량, 허달수의 지시. 사건의 윤곽이 하나로 이어졌다.'),
  F('caseSolved'),J('detectiveSecurityChoice')
 ];
 SCRIPTS.observationBeforeTruth=[
  T('문 옆에 연구 기록 대조 장치가 있었다. 확보한 서류들을 연결하면 진상을 정리할 수 있을 것 같다.'),
  C('어떻게 할까?', [['기록을 대조한다','evidenceFinal'],['먼저 밖으로 나간다','detectiveEscapeGate'],['돌아선다','doorStay']])
 ];
 SCRIPTS.observationCheck=[J('observationBeforeTruth')];
 SCRIPTS.realObservation=[J('observationBeforeTruth')];
 SCRIPTS.finalChoice=[
  T('문 너머로 저택 앞 철문이 보였다. 바깥은 조용했다. 저택 안쪽에서 구두 소리가 가까워졌다.'),
  C('어떻게 할까?', [['철문을 통해 밖으로 나간다','detectiveEscapeGate'],['별관 기록 대조 장치를 살펴본다','observationBeforeTruth'],['구두 소리가 나는 곳으로 다가간다','detectiveCaught']])
 ];
 SCRIPTS.exitRealityCheck=[J('detectiveEscapeGate')];
 SCRIPTS.normalEnd=[J('detectiveEscapeGate')];
 SCRIPTS.detectiveSecurityChoice=[
  T('복도 끝에서 문이 열리는 소리가 들렸다. 허달수의 구두 소리였다.'),
  T('출입대장 옆의 도면에는 경비실을 거치지 않는 비상 점검 통로가 표시되어 있었다.'),
  C('어느 길로 나갈까?', [['점검 통로로 빠져나간다','detectiveSafeExit'],['허달수와 직접 대면한다','detectiveCaught'],['잠시 멈춰 선다','doorStay']])
 ];
 SCRIPTS.detectiveEscapeGate=[Q('caseSolved','detectiveSafeExit','detectiveNormalEscape')];
 SCRIPTS.detectiveSafeExit=[Q('patient05Rescued','detectiveCompleteEscape','detectiveIncompleteEscape')];
 SCRIPTS.detectiveCompleteEscape=[{op:'allParty',yes:'bestReveal',no:'happyReveal'}];
 SCRIPTS.detectiveNormalEscape=[
  T('철문을 지나 도로까지 나왔다. 뒤를 돌아봤지만 아무도 따라오지 않았다.'),
  T('살아남았다. 그러나 허달수가 무슨 일을 벌였는지 알릴 증거는 아직 충분하지 않았다.'),
  E('normal')
 ];
 SCRIPTS.detectiveIncompleteEscape=[
  T('서류와 영상은 가지고 나왔다. 그러나 서정윤은 아직 저택 안에 있었다.'),
  T('무사히 빠져나왔는데도 의뢰를 마쳤다는 생각은 들지 않았다.'),
  E('realSolo')
 ];
 SCRIPTS.happyReveal=[
  T('점검 통로의 끝에서 철문을 밀었다. 밖의 찬 공기가 얼굴을 스쳤다.'),
  T('서정윤은 잠시 걸음을 멈췄다.'),
  T('서미연 씨께 전화합시다. 기다리고 계실 거예요.'),
  T('정윤이 눈을 감았다가 천천히 고개를 끄덕였다.'),
  T('나는 증거가 든 가방을 고쳐 멨다. 이번에는 의뢰를 끝낼 수 있을 것 같았다.'),
  E('happy')
 ];
 SCRIPTS.bestReveal=[
  T('나는 문을 붙잡고 한 사람씩 밖으로 나가는 것을 확인했다.'),
  T('차준영, 김주호, 이철민, 오은지. 그리고 서정윤.'),
  T('마지막으로 저택을 돌아봤다. 이곳에서 해야 할 일은 끝났다.'),
  T('서정윤이 내 쪽으로 돌아섰다.'),
  T('언니에게 연락해도 될까요?','서정윤'),
  T('물론이죠. 이제 집으로 갑시다.'),
  E('best')
 ];
 SCRIPTS.falseEscape=[J('detectiveNormalEscape')];
 // The old TRUE ending is repurposed as a consequence of being found by the perpetrator.
 SCRIPTS.detectiveCaught=[
  T('구두 소리가 바로 앞에서 멈췄다. 허달수가 서 있었다.'),
  T('아직도 모르시겠습니까? 선생이 왜 여기까지 오게 되었는지요.','허달수'),
  T('그 상태로도 기록을 찾아내다니. 참 집요하시군요.','허달수'),
  T('선생에게 꼭 확인하고 싶은 게 있었습니다. 기억이 사라져도 사람은 같은 사람일까요?','허달수'),
  T('허달수가 손짓하자 시설 직원들이 양쪽에서 다가왔다.'),
  R('lab',8,8),T('눈을 떴다. 유리 너머로 보이는 것은 몸이 아니었다. 여러 가닥의 선이 연결된 뇌였다.'),
  T('손을 움직이려 했다. 어째서인지 손가락이 움직이는 느낌만 남아 있었다.'),
  T('장비의 명판에는 내 이름이 붙어 있었다.'),
  E('truth')
 ];
 SCRIPTS.truthReveal=[J('detectiveCaught')];
 ENDINGS.truth={
  type:'BAD END 05',title:'통속의 뇌',
  text:'허달수는 끝내 나를 놓아주지 않았다.\n\n유리 너머에서는 내가 움직인다고 믿는 손이 움직였다.\n감각은 남았지만 돌아갈 몸이 없었다.',
  hint:'허달수에게 발견되면 관찰실로 끌려간다.'
 };
 ENDINGS.normal={
  type:'NORMAL END',title:'미해결 사건',
  text:'나는 저택에서 살아 나왔다. 그러나 서미연에게 해 줄 말은 아직 없었다.\n\n허달수가 남긴 기록과 실종자의 행방을 다시 찾아야 한다.',
  hint:'충분한 기록 없이도 살아서 나올 수는 있다.'
 };
 ENDINGS.realSolo={
  type:'ESCAPE END',title:'남겨진 05번',
  text:'사고의 배후와 연구 계획은 밝혀냈다. 하지만 서정윤은 여전히 저택에 갇혀 있다.\n\n의뢰인의 번호 앞에서 한참이나 전화를 걸지 못했다.',
  hint:'진상을 밝혀도 실종자를 데리고 나오지 못하면 의뢰는 끝나지 않는다.'
 };
 ENDINGS.happy={
  type:'HAPPY END',title:'의뢰 완료',
  text:'서미연은 전화기 너머에서 몇 번이나 동생의 이름을 불렀다.\n\n정윤이 울음을 삼키며 대답했다. 나는 확보한 증거를 관계 기관에 제출했다. 허달수에 대한 조사가 시작되었다.',
  hint:'자신의 정체와 사건의 진상을 알아내고, 서정윤과 함께 탈출하자.'
 };
 ENDINGS.best={
  type:'BEST END',title:'아무도 두고 오지 않았다',
  text:'서정윤이 언니와 통화하는 동안 나머지 사람들도 차례로 안전한 곳에 도착했다.\n\n의뢰를 완수했고, 저택에 갇혀 있던 동료들도 모두 돌아왔다.',
  hint:'실종자와 네 동료 모두를 데리고 사건의 진상을 밝혀라.'
 };
 // Show an investigation-centered goal before escape.
 MAPS.bedroom.mission='모아 온 기록을 대조하거나 무사히 밖으로 나가자';
 // Existing saves in the ending area will keep valid map IDs and scene IDs.
})();
