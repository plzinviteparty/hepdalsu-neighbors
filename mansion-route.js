'use strict';
// Main-route adaptation. Keep legacy keys for old save compatibility only.
(()=>{
 const retired=new Set(['cat','ode','hachi']);
 REQUIRED_PARTY.splice(0,REQUIRED_PARTY.length,'kim','jubin','changwon','nasol');
 const map=MAPS;
 const rebuildScenery=(room)=>{
   SCENERY[room]=map[room].props.filter(([kind])=>SCENERY_TEXT[kind]).map(([kind,x,y],i)=>({id:'newscenery_'+room+'_'+i,x,y,kind,label:SCENERY_TEXT[kind][0],scenery:true,rx:['desk','bed','table'].includes(kind)?1:0,ry:0,proxy:null}));
   for(const o of SCENERY[room]) SCRIPTS[o.id]=[T(SCENERY_TEXT[o.kind][1][0])];
 };
 const spent=(id,label,desc)=>{SPENT_TEXT[id]=[label,desc];SCRIPTS['spent_'+id]=[T(desc)];};
 spent('ode','배수 조절반','밸브는 맞춰 둔 위치에 있다. 더 조작할 필요는 없다.');
 spent('bone','안내문이 있던 자리','탁자 아래에 다른 종이는 없다.');
 spent('jubin','벽 옆 빈자리','김주호가 서 있던 곳이다.');
 spent('nasol','벽 옆 빈자리','오은지가 기대 있던 곳이다.');
 delete SPENT_TEXT.hachiRescue;
 SCRIPTS.spent_hachiRescue=[T('의자 뒤에는 아무것도 없다.')];
 map.backroom.objects=map.backroom.objects.filter(o=>o.id!=='hachiRescue');
 for(const id of ['hachiWait','hachiOffer','hachiJoin']) SCRIPTS[id]=[T('의자 뒤에는 아무것도 없다.')];
 rebuildScenery('bath');
 map.loop.objects.find(o=>o.id==='bathReturn').label='배관실로 돌아가는 문';
 SCRIPTS.doorAsk_bathReturn[0].choice='배관실로 돌아가는 문';
 map.landing.name='저택의 홀';
 map.landing.mission='복도의 문과 남겨진 기록을 살펴보자';
 map.landing.objects.find(o=>o.id==='landingDoor').label='진료·관리 구역';
 SCRIPTS.doorAsk_landingDoor[0].choice='진료·관리 구역';
 map.landing.objects.push(O('newspaper',12,8,'book','오래된 신문'));
 ITEMS.newspaper=['오래된 신문','지역 봉사단체 대표 허달수의 인터뷰 기사. 저택 사진과 함께 실려 있다.'];
 SCRIPTS.newspaper=[
  T('책상에 접힌 신문이 있었다. 날짜는 몇 년 전이었다.'),
  T('「지역 공동체에 문을 여는 사람들」\n사진 아래에 ‘대표 허달수’라고 적혀 있었다.'),
  T('사진 속 남자는 저택 앞에 서 있었다. 양옆에는 흰 옷을 입은 사람들이 줄지어 있었다.'),
  I('newspaper'),F('dalsuKnown')
 ];
 // Optional encounter: the main way into the backrooms stays open.
 map.loop.objects.push(O('dalsuSound',27,12,'mark','복도 안쪽의 인기척',{hide:'dalsuEncounter'}));
 SCRIPTS.dalsuSound=[
  T('복도 오른쪽으로 난 좁은 통로에서 발소리가 들렸다.'),
  T('누군가 벽에 가려진 채 한동안 서 있는 것 같았다.'),
  C('안쪽을 살펴볼까?',[['다가가 본다','dalsuEncounter'],['그냥 지나간다','doorStay']])
 ];
 SCRIPTS.dalsuEncounter=[
  T('모퉁이를 돌자 남자가 서 있었다. 쉰 살은 넘어 보였다.'),
  T('남자는 고개를 조금 기울였다. 내가 옆으로 비켜도 그의 시선은 따라왔다.'),
  T('여기서 뭘 하고 계세요?'),
  T('아직 계셨네요.','남자'),
  T('혹시 여기가 댁이에요?'),
  T('제 이름은 허달수입니다.','남자'),
  T('남자는 여전히 고개를 기울인 채 나를 봤다.'),
  T('그러고 보니 댁에서는 연락이 안 오던가요?','허달수'),
  T('……',''),
  F('dalsuEncounter'),
  R('loop',25,12),
  T('벽에 손을 짚고 서 있었다. 방금까지 앞에 있던 남자는 보이지 않았다.'),
  T('언제부터 이러고 있었지?'),
  T('아무래도 제대로 먹은 게 없어서 그런가 보다. 일단 나갈 길부터 찾자.')
 ];
 SCRIPTS.backroom=[
  T('벽지가 들뜬 부분을 잡아당겼다. 벽처럼 보였던 판이 안쪽으로 밀렸다.'),
  R('backroom',3,4),
  T('노란 벽지와 카펫이 끝도 없이 이어졌다. 형광등 소리가 유난히 컸다.'),
  T('이런 방이 몇 개나 있는 거야?'),
  T('왔던 길을 잊어버리지 않게 표시를 해 둬야겠다.')
 ];
 // The old pool and transformation route is now a maintenance sump.
 map.pool.name='저수조 정비실';map.pool.mission='정비 장치와 배수구를 살펴보자';
 map.pool.objects.find(o=>o.id==='button').label='배수구 잠금장치';
 map.pool.objects.find(o=>o.id==='pen').label='난간 아래 떨어진 펜';
 ITEMS.pen=['검은 볼펜','저수조 난간 아래에서 주웠다.'];
 ITEMS.paper=['정비 점검표','설비실의 배수구를 점검한 기록. 출입 통제와 별도 관찰실에 대한 메모가 있다.'];
 spent('pen','펜을 주웠던 자리','난간 아래에는 다른 물건이 없다.');
 const chairPuzzle=SCRIPTS.chair.find(n=>n.puzzle);
 const hosePuzzle=SCRIPTS.fall.find(n=>n.puzzle);
 const drainPuzzle=SCRIPTS.rewrite.find(n=>n.puzzle);
 SCRIPTS.chair=[
  T('의자들이 통로를 막고 있었다. 그 사이로 바람이 들어왔다.'),
  chairPuzzle,
  T('의자 더미를 밀자 바닥에 금속 덮개가 보였다. 손잡이 옆에는 개방 버튼이 있었다.'),
  C('덮개를 열고 내려갈까?',[['덮개를 연다','fall'],['조금 더 조사한다','chairWait']])
 ];
 SCRIPTS.chairCleared=SCRIPTS.chair.filter(n=>n.choice);
 SCRIPTS.chairWait=[T('덮개 아래에서 물 흐르는 소리가 들린다. 돌아갈 길은 아직 열려 있다.')];
 SCRIPTS.fall=[
  T('덮개 아래에 사다리가 있었다. 몇 칸 내려가니 발목 근처까지 물이 차올랐다.'),
  R('pool',5,5),
  T('배수관 옆에 놓인 호스가 발에 걸렸다. 호스를 치워야 통과할 수 있을 것 같다.'),
  {...hosePuzzle,title:'배수 호스 정리',help:'관 조각을 돌려 입구에서 배출구까지 연결한다. 연결이 끝나면 밸브의 압력이 빠진다.'}
 ];
 SCRIPTS.button=[
  T('배수구 옆 전자 잠금장치의 덮개가 열려 있었다. 안에 접힌 점검표가 보였다.'),
  T('「배수구 개방 전 확인: 아래 고정쇠 해제 / 중앙 지지 / 상부 개방」'),
  I('paper'),F('buttonTried'),
  T('점검표를 챙겼다. 난간 아래에 펜도 떨어져 있었다.'),
  C('잠금장치를 조작할까?',[['개방 절차를 따른다','rewrite'],['나중에 한다','doorStay']])
 ];
 SCRIPTS.pen=[I('pen'),F('penFound'),T('난간 아래에서 볼펜을 주웠다.')];
 SCRIPTS.needButton=[T('배수구 옆에 점검표가 보인다. 먼저 살펴보자.')];
 SCRIPTS.sign=[C('배수구 잠금장치를 조작할까?',[['개방 절차를 따른다','rewrite'],['물러난다','doorStay']])];
 SCRIPTS.penLook=[T('평범한 볼펜이다. 특별한 점은 없다.')];
 SCRIPTS.deity=[T('점검표에 적힌 순서대로 조작해야 한다.')];
 SCRIPTS.rewrite=[
  {...drainPuzzle,title:'배수구 개방 장치',labels:['아래 고정쇠','중앙 지지','상부 개방'],positions:['해제','지지','개방'],help:'첫 번째 장치는 해제, 두 번째는 지지, 세 번째는 개방 위치에 맞춘다.'},
  T('금속 문이 움직였다. 안쪽에서 누군가 손전등을 켜는 소리가 났다.'),
  J('chaseIntro')
 ];
 for(const id of ['keepPen','dropPen','penLeft'])SCRIPTS[id]=[J('chaseIntro')];
 map.chase.name='지하 연결 통로';map.chase.mission='통로 끝의 비상문까지 달려가자';
 SCRIPTS.chaseIntro=[
  T('뒤쪽에서 빠른 발소리가 들렸다.'),
  T('거기 멈추세요!','시설 직원'),
  T('나는 문이 열려 있는 쪽으로 뛰었다.'),
  F('tofu',false),R('chase',3,8),
  T('오른쪽 비상문까지 달리세요. 가구를 피해 이동하세요.','추격전'),
  F('chaseActive')
 ];
 ENDINGS.tofu={type:'BAD END 03',title:'다시 입실',text:'문까지 몇 걸음 남지 않았다.\n\n등 뒤에서 팔을 잡는 손이 느껴졌다. 발이 바닥에서 떨어졌다.\n\n눈을 떴을 때, 나는 병동의 침대에 누워 있었다.',hint:'연결 통로에서 뒤따라오는 사람을 따돌리자.'};
 map.wreck.name='지하 비상 대피실';map.wreck.theme='ward';map.wreck.mission='출입 기록과 출구를 확인하자';
 const rec=map.wreck.objects.find(o=>o.id==='family');rec.kind='book';rec.label='폐쇄 구역 출입 기록';
 map.wreck.objects.find(o=>o.id==='wake').label='외부 통로';
 SCRIPTS.doorAsk_wake[0].choice='외부 통로';
 map.wreck.props=[['desk',18,8],['monitor',21,5],['chair',18,10],['plant',5,4],['plant',7,17],['plant',26,17]];
 rebuildScenery('wreck');
 SCRIPTS.rescued=[
  F('chaseActive',false),
  R('wreck',5,9),
  T('비상문을 닫고 빗장을 걸었다. 뒤에서 손잡이를 돌리는 소리가 몇 번 났다.'),
  T('더는 발소리가 들리지 않았다. 벽에 출구 안내도가 붙어 있었다.'),
  F('refugeReached')
 ];
 SCRIPTS.family=[
  T('책상 위 기록에는 출입 금지 구역의 번호가 적혀 있었다.'),
  T('「별관 관찰실 / 담당자 승인 없이 출입 금지」'),
  F('observationClue')
 ];
 map.bedroom.name='저택 외부 출입구';map.bedroom.mission='마지막 출입문을 확인하자';
 map.bedroom.objects.find(o=>o.id==='clock').label='멈춘 벽시계';
 map.bedroom.objects.find(o=>o.id==='finalDoor').label='저택 밖으로 나가는 문';
 map.bedroom.props=map.bedroom.props.filter(([k])=>k!=='bed');
 rebuildScenery('bedroom');
 SCRIPTS.wake=[
  R('bedroom',5,8),F('tofu',false),
  T('문을 열자 바깥 공기가 들어왔다.'),
  T('밖에 나갈 수 있을 것 같다. 그래도 주위를 한 번 더 살펴봤다.')
 ];
 SCRIPTS.clock=[T('벽시계가 멈춰 있다. 초침은 움직이지 않는다.')];
 SCRIPTS.finalChoice=[
  T('문 너머로 저택 앞의 철문이 보였다.'),
  C('어떻게 할까?',[['문을 열고 나간다','exitRealityCheck'],['옆의 관찰실을 확인한다','observationCheck']])
 ];
 SCRIPTS.exitRealityCheck=[Q('dalsuEncounter','falseEscape','escapeCheck')];
 SCRIPTS.observationCheck=[Q('dalsuEncounter','observationBeforeTruth','realObservation')];
 SCRIPTS.realObservation=[
  T('옆방에는 관리 기록과 빈 장비가 놓여 있었다. 사진을 찍어 두고 다시 출구로 돌아왔다.'),
  F('observationClue'),J('finalChoice')
 ];
 SCRIPTS.observationBeforeTruth=[
  T('출입문 옆에 잠긴 방이 있었다. 유리 너머로 누군가의 이름이 적힌 장비가 보였다.'),
  C('방을 더 살펴볼까?',[['안으로 들어간다','truthReveal'],['밖으로 나간다','falseEscape']])
 ];
 SCRIPTS.falseEscape=[
  T('철문을 나섰다. 안개가 옅어지고 있었다.'),
  T('도로 쪽으로 걸었다.'),
  T('가드레일 옆을 지나는 순간 뒤에서 익숙한 목소리가 들렸다.'),
  T('아직 계셨네요.','허달수'),
  E('normal')
 ];
 SCRIPTS.truthReveal=[
  R('lab',8,8),
  T('원통형 장비가 여러 대 있었다. 그중 하나에 내 이름이 적혀 있었다.'),
  T('유리 너머로 보이는 것은 몸이 아니었다. 선이 연결된 뇌였다.'),
  T('내 손을 내려다봤다. 손가락이 움직였다.'),
  T('그런데 그 장비에는 내 이름이 적혀 있었다.'),
  T('언제부터였지?'),
  E('truth')
 ];
 SCRIPTS.escapeCheck=[{op:'allParty',yes:'happyReveal',no:'incompleteEscape'}];
 SCRIPTS.happyReveal=[
  T('철문을 열어 두었다. 한 사람씩 나오는 것을 확인했다.'),
  T('김주호, 이철민, 오은지, 차준영.'),
  T('전부 밖으로 나왔다.'),
  T('이제 경찰에 연락할 곳을 찾자.'),
  E('happy')
 ];
 SCRIPTS.incompleteEscape=[
  T('문을 열고 밖으로 나왔다. 뒤에서 문이 닫혔다.'),
  T('저택을 다시 봤다. 아직 확인하지 못한 방에 불이 켜져 있었다.'),
  E('realSolo')
 ];
 SCRIPTS.normalEnd=[J('exitRealityCheck')];
 map.lab.name='별관 관찰실';
 ENDINGS.normal={type:'NORMAL END',title:'아직 계셨네요',text:'도로 위를 몇 번이나 걸었다.\n\n저택은 어느 방향으로 돌아서도 같은 곳에 있었다.\n\n창문 하나에 불이 켜져 있었다.',hint:'밖으로 나가는 길이 정말 하나뿐이었을까?'};
 ENDINGS.happy={type:'HAPPY END',title:'모두 밖으로',text:'날이 밝았다. 지나가는 차를 세울 수 있었다.\n\n돌아보니 네 사람이 아직 그 자리에 있었다. 철문 너머의 저택은 멀어졌다.',hint:'모든 동료와 함께 출구에 도착하자.'};
 ENDINGS.realSolo={type:'ESCAPE END',title:'남겨 둔 불빛',text:'도로 위에 사람이 있었다. 구조를 요청했다.\n\n나는 밖으로 나왔다. 그렇지만 저택 안에 남은 사람들의 이름이 머릿속에서 떠나지 않았다.',hint:'출구까지 도달하는 것만으로 충분할까?'};
 ENDINGS.truth={type:'TRUE END',title:'남은 것',text:'장비의 표시등이 깜빡였다.\n\n내가 느끼는 손의 감각과 발소리, 창문 밖의 바람. 그 모든 것이 여기서 시작됐다는 것을 알았다.\n\n허달수는 그날 나를 보내 주지 않았다.',hint:'도중에 마주친 일과 마지막 관찰실을 확인하자.'};
 ENDINGS.bones={type:'BAD END 01',title:'공동생활관',text:'모두가 웃고 있었다.\n\n나는 같은 자리에 서서 문이 열리기를 기다렸다.',hint:'연회장에서 나갈 방법을 찾아야 한다.'};
 // Update old object scripts still reachable from carried saves.
 for(const [id,nodes] of Object.entries(SCRIPTS)){
   for(const n of nodes){
    if(n.op==='party'&&retired.has(n.id))n.join=false;
    if(typeof n.say==='string')n.say=n.say.replaceAll('김주호이','김주호가').replaceAll('김주호이라고','김주호라고').replaceAll('오은지이','오은지가');
   }
 }
})();