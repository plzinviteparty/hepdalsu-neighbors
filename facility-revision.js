'use strict';
// Independent adaptation of the original game: the existing scene IDs and flags
// are intentionally retained for compatibility with saved games.
(() => {
  const ward=MAPS.ward;
  ward.name='저택 지하 병동';
  ward.mission='감시를 피해서 기록과 설비 제어함을 조사하자';
  ward.objects.find(o=>o.id==='nurse').label='순찰 중인 시설 직원';
  ward.objects.find(o=>o.id==='nurse').hide='melted';
  ward.objects.find(o=>o.id==='lockedWard').label='설비 구역 출입문';
  ward.objects.find(o=>o.id==='record').label='검사 기록철';
  ward.props.push(['monitor',25,6],['pipe',29,14]);

  // The original "bath" room is now the adjoining physical maintenance wing.
  const plant=MAPS.bath;
  plant.name='지하 배관실';
  plant.theme='ward';
  plant.mission='배수 조절반을 복구해 복도 쪽 출입문을 열자';
  plant.objects.find(o=>o.id==='ode').kind='monitor';
  plant.objects.find(o=>o.id==='ode').label='배수 조절반';
  plant.objects.find(o=>o.id==='bathExit').label='서비스 복도 출입문';
  plant.props=[
    ['pipe',6,7],['pipe',10,7],['pipe',16,6],['pipe',26,6],
    ['pipe',27,16],['pipe',9,18],['monitor',17,8],
    ['desk',6,16],['desk',29,17],['chair',29,18],
    ['bed',21,18]
  ];

  ITEMS.record=[
    '대상자 관찰 기록',
    '이름과 날짜가 지워진 검사 기록. 외부 출입 제한과 투약 시간을 확인할 수 있다.'
  ];
  ENDINGS.bed={
    type:'BAD END 02',
    title:'퇴실 기록 없음',
    text:'직원이 건넨 약을 받아 먹었다.\n\n깨고 나면 이야기를 다시 해 보자고 했다. 나는 침대에 누워 눈을 감았다.\n\n그날 이후 이름이 적힌 침대는 비워지지 않았다.',
    hint:'병동에서 직원의 안내대로 침대에 누워 버리면…….'
  };

  SCRIPTS.landingDoor=[
    T('복도 끝 출입문에 「진료·관리 구역」이라는 표지가 붙어 있었다.'),
    T('문이 안쪽에서 열렸다. 흰 가운을 입은 사람이 서 있었다.'),
    T('여긴 외부인 출입이 안 됩니다.','시설 직원'),
    T('저 납치당했어요. 경찰에 연락 좀 하게 해 주세요.'),
    T('직원은 내 말을 못 들은 것처럼 기록판을 살폈다.'),
    T('성함 확인하고 안내하겠습니다.','시설 직원'),
    T('그가 뒤로 물러서며 들어오라는 손짓을 했다. 나는 그 틈에 안쪽을 살펴봤다.'),
    R('ward',4,12),
    T('침대와 낡은 모니터가 보였다. 복도에는 소독약 냄새가 났다.'),
    T('여기가 무슨 병원이에요?'),
    T('직원은 대답하지 않았다. 복도 끝에서 구두 소리가 들렸다.')
  ];
  SCRIPTS.record=[
    T('침대 발치에 꽂힌 기록철을 빼냈다. 이름과 생년월일 부분은 검은색으로 지워져 있었다.'),
    T('「외부 접촉 제한 / 2차 면담 보류 / 투약 내역 별도 관리」'),
    T('날짜는 최근이었다. 실수로 놓인 기록은 아닌 것 같았다.'),
    I('record'),
    F('readRecord'),
    T('파일 뒷부분이 두껍다. 나중에 더 살펴보자.')
  ];
  SCRIPTS.recordBack=[
    T('기록철 맨 뒤에는 다른 사람의 출입증이 끼어 있었다.'),
    T('사진 속 남자는 안경을 썼다. 이름은 이철민이었다.'),
    I('badge')
  ];
  SCRIPTS.recordChecked=[T('이미 챙긴 기록철이다. 남아 있는 서류에는 같은 관리 번호가 반복돼 있다.')];

  SCRIPTS.nurse=[
    T('흰 가운을 입은 직원이 내 앞을 막았다. 가슴에는 이름표 대신 번호가 적혀 있었다.'),
    T('어디로 가시려고요?','시설 직원'),
    C('어떻게 대답할까?',[
      ['전화가 필요하다고 말한다','nurseRequest'],
      ['일단 물러난다','stayWard']
    ])
  ];
  SCRIPTS.nurseRequest=[
    T('휴대전화가 고장 났어요. 밖에 연락 좀 하게 해 주세요.'),
    T('직원은 표정 하나 바꾸지 않았다.'),
    T('담당자 확인 없이 외부 통화는 어렵습니다. 침대로 돌아가세요.','시설 직원')
  ];
  SCRIPTS.bedWarning=[
    T('빈 침대 옆 탁자에는 종이컵과 약봉지가 놓여 있었다.'),
    T('직원이 약봉지를 내밀었다. 먹고 쉬면 담당자가 온다고 했다.'),
    C('어떻게 할까?',[
      ['약을 받지 않고 물러난다','stayWard'],
      ['약을 먹고 침대에 눕는다','bedEnd']
    ])
  ];
  SCRIPTS.stayWard=[T('나는 고개를 저었다. 직원이 한동안 나를 쳐다봤다.')];

  SCRIPTS.needWardPower=[
    T('출입문에는 카드 인식기와 전자 잠금장치가 달려 있었다.'),
    T('잠금 표시가 켜져 있다. 복도 제어함을 먼저 살펴봐야겠다.')
  ];
  SCRIPTS.lockedWard=[J('needWardPower')];
  SCRIPTS.lever=[
    T('제어함을 조정하고 돌아오니 출입문 옆 표시등이 바뀌어 있었다.'),
    T('손잡이 아래 비상 해제 장치를 돌렸다. 문이 열리면서 복도 쪽에서 경보음이 울렸다.'),
    F('melted'),
    T('순찰하던 직원들이 경보가 울리는 쪽으로 뛰어갔다. 지금이면 지나갈 수 있다.'),
    R('bath',4,7),
    T('문 너머는 지하 설비실이었다. 배관을 타고 물 흐르는 소리가 났다.')
  ];
  SCRIPTS.wardLeverOpen=[T('비상 해제 장치는 이미 작동했다. 열린 문을 통해 설비실로 들어갔다.'),R('bath',4,7)];
  SCRIPTS.quietConsole=[
    T('복도 제어함 덮개가 나사로 고정돼 있었다. 옆면에는 조명과 경보, 환기 회로도가 붙어 있었다.'),
    {
      puzzle:true,puzzleId:'ward-console',
      title:'병동 제어함',device:'dial',requires:'wrench',
      labels:['조명','경보음','환기'],
      positions:['꺼짐','낮음','정상'],
      answer:[1,0,2],
      help:'작업 메모: 야간에는 조명 낮음, 경보음 꺼짐, 환기 정상. 제어 눈금은 0 꺼짐 / 1 낮음 / 2 정상.'
    },
    F('wardQuiet'),
    T('복도 불빛이 낮아지고 경보음이 멎었다. 출입문 쪽 전자 잠금장치도 다시 확인해 볼 수 있겠다.')
  ];
  SCRIPTS.quietConsoleDone=[T('제어함의 설정은 그대로다. 출입문 쪽을 확인하자.')];
  SCRIPTS.nasolWait=[
    T('벽에 기대 있던 여자가 관자놀이를 눌렀다.'),
    T('여기도 갇힌 거예요?'),
    T('일단 목소리 좀 낮춰요. 저 기계 소리 때문에 머리가 깨질 것 같거든요.','오은지'),
    T('그녀는 복도 제어함을 가리켰다.'),
    T('경보음만 끄면 좀 나을 텐데. 환기는 건드리지 마세요.','오은지')
  ];
  SCRIPTS.nasolOffer=[
    T('오은지가 제어함 쪽을 살펴봤다.'),
    T('환기까지 끄진 않았네요.','오은지'),
    T('그냥 두라고 했으면 그냥 뒀을 텐데요.'),
    T('그 말 믿었다가 여러 번 당했어요.','오은지'),
    C('오은지와 함께 이동할까?',[
      ['같이 나가자고 한다','nasolJoin'],
      ['나중에 이야기한다','leaveOptional']
    ])
  ];
  SCRIPTS.nasolJoin=[
    P('nasol'),F('nasolJoined'),
    T('오은지가 벽에서 몸을 떼고 내 뒤로 왔다.'),
    T('길 막히면 말해요. 뒤는 제가 볼게요.','오은지')
  ];

  SCRIPTS.ode=[
    T('배수 조절반에는 세 개의 밸브가 연결돼 있었다.'),
    T('배관 안내판에 수리 절차가 적혀 있다. 렌치가 있어야 밸브를 조정할 수 있다.'),
    {
      puzzle:true,puzzleId:'bath-drain',
      title:'배관실 배수 조절',device:'valve',requires:'wrench',
      labels:['입수','배수','보조관'],
      positions:['닫힘','절반','열림'],
      answer:[0,2,1],
      help:'작업 지시서: 입수는 닫고, 배수는 끝까지 연다. 보조관은 중간 위치를 유지할 것.'
    },
    F('odeJoined'),
    T('배관을 두드리던 소리가 잦아들었다. 출입문 쪽에서 잠금장치가 풀리는 소리가 났다.')
  ];
  SCRIPTS.needOde=[T('문이 잠겨 있다. 벽의 배수 조절반을 먼저 확인하자.')];
  SCRIPTS.bathExit=[
    T('문을 열자 오래된 복도가 이어졌다.'),
    R('loop',3,5),
    T('몇 걸음 걷지 않았는데 같은 표지판이 다시 나타났다.'),
    T('잘못 돌아왔나? 이번에는 벽의 흠집부터 확인해 봐야겠다.')
  ];
})();
