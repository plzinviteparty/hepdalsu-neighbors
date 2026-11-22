'use strict';
// Party-specific rescue dialogue, portable across old v1 save games.
// This patch adds to the ends of existing scenes: saved dialogue indexes stay valid.
(()=>{
 const line=(id,who,text)=>({say:text,who,requiresParty:id});
 const solo=text=>({say:text,who:'나',requiresNoCompanions:true});
 const push=(name,nodes)=>{
  if(!SCRIPTS[name])throw Error('Missing scene '+name);
  SCRIPTS[name].push(...nodes);
 };
 const beforeEnding=(name,nodes)=>{
  const a=SCRIPTS[name];
  if(!a||!a.length||!a[a.length-1].ending)throw Error('Missing final ending '+name);
  a.splice(a.length-1,0,...nodes);
 };
 const partyDialogue={
  kim:{
   before:'서류가 없어지는 속도가 빠릅니다. 저희가 가진 기록부터 챙기죠.',
   after:'앞쪽은 제가 확인하겠습니다. 정윤 씨는 급하게 움직이지 마세요.'
  },
  jubin:{
   before:'복도 갈림길을 표시해 뒀어요. 같은 문으로 돌아갈 일은 없을 거예요.',
   after:'돌아가는 방향은 제가 기억하고 있어요. 복도에 남긴 표시를 따라가면 됩니다.'
  },
  changwon:{
   before:'여기 기록은 치료 일지가 아닙니다. 어떤 항목을 관찰하려 했는지가 중요해요.',
   after:'지금 몸 상태를 단정해서는 안 됩니다. 힘들면 말해주세요. 서두르지 않아도 됩니다.'
  },
  nasol:{
   before:'이곳의 말과 기록이 자꾸 다릅니다. 누구 말을 들었는지 잘 기억해 둬야겠어요.',
   after:'나가면 기록을 다시 정리할 거예요. 우선 정윤 씨가 안전하게 돌아가는 게 먼저죠.'
  },
  patient05:{
   before:'언니가 저를 찾고 있다는 말, 아직도 실감이 안 나요.',
   after:'언니한테 전화를 걸면… 제가 먼저 말을 해도 될까요?'
  }
 };
 const partyNames={kim:'차준영',jubin:'김주호',changwon:'이철민',nasol:'오은지',patient05:'서정윤'};
 // The rescue choice, inventory and escort flag have already been executed.
 push('patient05Join',[
  T('정윤은 팔목의 번호표를 천천히 풀었다. 글자가 남은 종이를 쥐고 잠시 망설였다.'),
  T('여기서는 제 이름보다 번호가 먼저 불렸어요.','서정윤'),
  T('이제부터는 서정윤 씨라고 부르겠습니다.'),
  line('kim','차준영','출입구 쪽은 제가 살필게요. 누가 다가오면 바로 알려 드리겠습니다.'),
  line('jubin','김주호','복도에 제가 표시를 남겨 놨어요. 문 번호가 같아도 길은 찾을 수 있어요.'),
  line('changwon','이철민','무리해서 걷지 마세요. 여기서 바로 나가야 하는 건 맞지만, 넘어지면 더 위험합니다.'),
  line('nasol','오은지','말하기 힘든 건 지금 얘기하지 않아도 돼요. 우선 같이 나가요.'),
  solo('다른 사람은 없지만 문과 복도 구조는 확인해 뒀다. 정윤이 걸음을 맞출 수 있도록 속도를 늦췄다.'),
  T('정윤은 종이 번호표를 접어 주머니에 넣었다.'),
  T('이름이 적힌 기록도 가지고 나가요. 나중에 제가 겪은 일을 설명할 수 있도록요.','서정윤')
 ]);
 // A return visit without documents must not silently trigger the rescue.
 push('patient05Unknown',[
  T('손목의 숫자는 확인했다. 하지만 실종 의뢰서와 병동 기록을 먼저 맞춰 봐야 이 사람의 신원을 확정할 수 있다.')
 ]);
 push('patient05Wait',[
  T('나 혼자 모든 걸 결정할 수는 없다. 이관 기록과 출구를 조금 더 확인하고 돌아오자.')
 ]);
 // Companion remarks occur once on the annex-to-refuge transition; existing room transfer stays at index 0.
 push('annexReturn',[
  line('patient05','서정윤','복도로 나오니까 병실에 있을 때보다 숨쉬기가 조금 편해요.'),
  line('kim','차준영','이제부터는 직원들 이동 경로를 봐야겠습니다. 출구까지 멈추지 말죠.'),
  line('jubin','김주호','제가 앞서 지나간 문은 기억해 뒀어요. 같은 쪽으로 돌아가지 않게요.'),
  line('changwon','이철민','서류함에 있던 이관 시간도 챙겼죠? 이름과 날짜가 있어야 설명할 수 있습니다.'),
  line('nasol','오은지','저한테 기록용 카메라가 있어도 지금은 들이대지 않을 거예요. 괜찮으세요?')
 ]);
 // Existing escaping scene outcomes and ending IDs do not change.
 beforeEnding('happyReveal',[
  line('kim','차준영','이제는 저 사람들에게 누가 돈을 댔는지도 확인해야겠군요. 우선 집부터 갑시다.'),
  line('jubin','김주호','밖으로 나오니까 방향을 다시 그릴 필요가 없네요. 이런 게 당연한 건데.'),
  line('changwon','이철민','연구 결과가 아니라 사람들의 행방을 확인해야 합니다. 자료는 제가 정리해 둘게요.'),
  line('nasol','오은지','무슨 일이 있었는지 세상에 알려야겠죠. 그래도 오늘은 먼저 쉬어요.'),
  T('정윤은 휴대전화를 건네받고, 저장된 번호를 한 글자씩 확인했다.','나'),
  T('통화 연결음이 울렸다. 정윤은 첫마디를 쉽게 꺼내지 못했다.','나'),
  T('……언니. 나야.','서정윤')
 ]);
 beforeEnding('bestReveal',[
  line('kim','차준영','다섯 명이 전부 나오셨군요. 출입 기록에도 이 사실을 남겨야겠습니다.'),
  line('jubin','김주호','마지막 출입문 표시까지 확인했어요. 이제 더는 돌아가지 않아도 돼요.'),
  line('changwon','이철민','앞으로 설명할 자료가 많겠습니다. 그래도 지금은 모두 무사하네요.'),
  line('nasol','오은지','찍지 못한 장면은 많아요. 하지만 다 같이 나왔다는 것만은 분명해요.'),
  line('patient05','서정윤','제 이름을 기억해 주셔서 고마워요. 이제 언니한테 갈 수 있어요.'),
  T('전화기 너머에서 누군가 숨을 들이마시는 소리가 났다.'),
  T('……정윤아?','서미연'),
  T('응. 나야. 나 이제 밖이야.','서정윤')
 ]);
 beforeEnding('detectiveIncompleteEscape',[
  line('kim','차준영','이대로 나가야 했던 이유는 압니다. 하지만 아직 안에 사람이 남았다는 건 잊지 맙시다.'),
  line('jubin','김주호','제가 그 병실로 가는 길은 기억하고 있어요. 나중에라도 알려 드릴게요.'),
  line('changwon','이철민','이관 기록을 바탕으로 서정윤 씨의 행방을 계속 확인해야 합니다.'),
  line('nasol','오은지','내가 보고 들은 걸 남기겠습니다. 아직 끝난 일이 아니니까요.')
 ]);
 // Direct conversation with companions from the pause menu.
 for(const [id,lines]of Object.entries(partyDialogue)){
  const who=partyNames[id],base='companionTalk_'+id;
  SCRIPTS[base]=[Q('patient05Rescued',base+'After',base+'Before')];
  SCRIPTS[base+'Before']=[T(lines.before,who)];
  SCRIPTS[base+'After']=[T(lines.after,who)];
 }
})();
function openCompanionTalkMenu(){
 const panel=modal('동행자와 대화');
 paragraph(panel,'함께 움직이는 사람에게 현재 상황에 관해 물어볼 수 있다. 대화 중에는 이동과 순찰이 멈춘다.','small');
 const names={kim:'차준영',jubin:'김주호',changwon:'이철민',nasol:'오은지',patient05:'서정윤'};
 const choices=row(panel);
 for(const id of ['kim','jubin','changwon','nasol','patient05']){
  if(!s.party.includes(id))continue;
  button(choices,names[id]+'와 이야기',()=>openCompanionTopicMenu(id));
 }
 if(partyBanterAvailable(s.party).length)button(row(panel),'동료들끼리 대화',openPartyBanterMenu);
 button(row(panel),'동료들 상태 확인',openCompanionTensionMenu);
 const back=row(panel);
 button(back,'메뉴로',openMenu);
 button(back,'게임으로',closeModal,'primary');
}
