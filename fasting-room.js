'use strict';
// The old statue trial is now a human ritual. Legacy IDs preserve save compatibility.
(()=>{
 const room=MAPS.altar;
 room.name='절식기도실';room.mission='신도들의 발언을 듣고 참말을 하는 사람을 찾아보자';
 room.props=room.props.filter(([k])=>k!=='altarPlinth');
 // The central aisle remains open; prayer cushions replace the five pedestals.
 const names=['중얼거리는 신도','바닥을 긁는 신도','고개를 숙인 신도','웃고 있는 신도','이를 악문 신도'];
 const claims=[
  '진실을 말하는 건 1번 아니면 2번이야. 내가 들었어. 샘에서 들었어.',
  '진실을 말하는 건 4번 아니면 5번입니다. 메시아께서 말씀하셨어.',
  '2번은 거짓말을 하고 있어요. 저 사람 말 믿지 마세요.',
  '참말을 하는 사람의 번호는 짝수야. 짝수만, 짝수만.',
  '나요. 나만 참말을 해. 다른 사람들은 다 사탄이야.'
 ];
 STATUE_CLAIMS.forEach((c,i)=>{c.name=names[i];c.text=claims[i]});
 for(const o of room.objects){
  if(o.id==='altarTrial'){o.kind='altarTable';o.label='절식기도 안내문'}
  else if(o.id.startsWith('altarHead')){const i=Number(o.id.slice(9));o.kind='crawler'+i;o.label=(i+1)+'번 · '+names[i]}
 }
 SCENERY.altar=SCENERY.altar.filter(o=>o.kind!=='altarPlinth');
 const door=MAPS.loop.objects.find(o=>o.id==='altarDoor');door.label='절식기도실로 내려가는 문';SCRIPTS.doorAsk_altarDoor[0].choice=door.label;
 SCRIPTS.altarDoor=[R('altar',13,25),Q('altarVisited','altarVisitAgain','altarVisit')];
 SCRIPTS.altarVisit=[
  T('방 안에서 몇 사람이 엎드려 있었다. 흰옷은 때에 절어 있었고, 제대로 일어나 앉지도 못했다.'),
  T('바닥에 빈 물그릇이 늘어져 있었다. 누구도 물을 마시지 않았다.'),
  T('사탄아…… 물러가라. 사탄은 물러가라……','신도'),
  T('교주님은 우리를 버리지 않으셨어. 조금만 더 기도하면 돼.','신도'),
  F('altarVisited')
 ];
 SCRIPTS.altarVisitAgain=[];
 SCRIPTS.altarTrial=[
  T('「절식기도 · 불신을 씻기 위한 기도 기간 중 음식물 섭취를 금함. 허락되기 전까지 외부 출입 금지.」'),
  T('아래에는 다섯 사람의 발언 중 오직 하나만 참이라는 문장이 적혀 있었다.'),
  {statueTrial:true}
 ];
 for(let i=0;i<5;i++)SCRIPTS['altarHead'+i]=[{statueTrial:true,preselect:i}];
 SCRIPTS.altarEmpty=[T('기도실에는 더 이상 대답하는 사람이 없었다.')];
 SCRIPTS.altarViolence=[
  T('고개를 숙이고 있던 신도가 쉰 목소리로 말했다.'),
  T('그만해요. 샘물도 그냥 물이잖아요. 우리 며칠째 여기 있는 거예요?','3번 신도'),
  T('나머지 신도들이 일제히 그쪽을 돌아봤다.'),
  T('사탄아, 물러가라.','신도'),
  T('유리 깨지는 소리가 났다. 신도들이 깨진 유리 조각을 쥔 채 그에게 달려들었다.'),
  T('신도가 쓰러졌다. 그가 움직임을 멈춘 뒤에도 다른 사람들은 기도를 계속했다.'),
  T('……'),
  T('네 사람이 천천히 나를 돌아봤다.'),
  T('너도…… 나가려고?','신도')
 ];
 ENDINGS.altar={type:'BAD END 04',title:'기도가 부족합니다',text:'뒤에서 손이 발목을 붙들었다.\n바닥에 쓰러진 내 귀에 기도 소리가 들렸다.\n\n“아직 기도가 부족하시군요.”\n\n문이 닫혔다.',hint:'절식기도실에서 발언의 모순을 비교하고, 신도들이 접근하기 전에 아래쪽 출입문으로 피하자.'};
 // Existing saves can revisit the room, without resurrecting the old statue event.
})();
