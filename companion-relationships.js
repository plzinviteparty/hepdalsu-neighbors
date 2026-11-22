'use strict';
// Companion histories and their changing views of Heo Dalsu.
// Uses existing evidence flags, not new save fields or mandatory dialogue gates.
(()=>{
 const say=(who,text)=>T(text,who);
 const character={
  kim:{name:'차준영',origin:[
   say('차준영','우성제약 쪽에 들어간 투자금을 회수하러 왔습니다. 여기 사람들을 만나러 온 건 아니었어요.'),
   say('차준영','돌아가겠다고 하니 연락도, 면회도 안 된다고 하더군요. 돈을 받는 일보다 밖으로 나가는 일이 어려워졌죠.')],
   early:[
    say('차준영','대표가 허달수라는 이름이라고 들었습니다. 하지만 누가 제 외부 연락을 막았는지까지는 아직 증거가 없죠.'),
    say('차준영','화가 나지 않는다면 거짓말입니다. 그래도 나중에 부인하지 못하도록 기록부터 확인해야 합니다.')],
   afterMeet:[
    say('차준영','복도에서 만난 사람이 허달수였습니까? 웃으며 이야기해도 출입문이 잠겨 있는 건 달라지지 않더군요.'),
    say('차준영','제가 직접 겪은 건 감금과 연락 차단입니다. 그 사람의 지시는 서류를 찾기 전까지 단정하지 않겠습니다.')],
   proven:[
    say('차준영','제 투자금 회수 방문을 문제 삼고 외부 통화를 막으라는 지시에 허달수의 결재가 있었습니다. 이제는 분명하군요.'),
    say('차준영','돈 때문이라고만 생각했는데, 누군가의 입을 막는 방식으로 처리한 게 더 끔찍합니다. 기록을 잃어버리지 마세요.')],
   proof:'investorClue'},
  jubin:{name:'김주호',origin:[
    say('김주호','흉가 촬영하는 일을 해요. 여기가 빈집인 줄 알았죠. 인기척이 나길래 돌아가려고 했는데, 눈떠 보니 안에 있었어요.'),
    say('김주호','그 뒤로는 비슷한 복도를 몇 번이고 지나왔어요. 길을 기억하는 게 그나마 제가 할 수 있는 일이더라고요.')],
   early:[
    say('김주호','허달수요? 저는 그 사람이 저한테 직접 뭘 했는지 기억나는 게 없어요. 누가 이곳을 관리하는지도 몰랐고요.'),
    say('김주호','사람이 산다는 걸 알았으면 카메라부터 내렸을 겁니다. 그렇다고 이렇게 가둬도 된다는 건 아니잖아요.')],
   afterMeet:[
    say('김주호','복도에서 봤다는 남자가 허달수군요. 그런 사람이 저택을 지킨다고 생각하니 괜히 뒤를 돌아보게 됩니다.'),
    say('김주호','제 기억만으로 범인을 정할 수는 없어요. 그렇지만 문이 계속 같은 곳으로 이어지는 건 확인했어요.')],
   proven:[
    say('김주호','출입문 보수 일지에도 번호가 반복돼요. 처음 온 사람이 방향을 잃기 쉬운 구조입니다.'),
    say('김주호','일부러 헷갈리게 만든 건지는 모르겠어요. 확실한 건 표시를 따라가면 같은 길을 다시 구분할 수 있다는 거죠.')],
   proof:'foreshadowMaze'},
  changwon:{name:'이철민',origin:[
   say('이철민','은성제약에서 백신을 연구했습니다. 퇴직을 준비하던 중 여기서 연구원으로 일하라는 제안을 받았죠.'),
   say('이철민','제안을 거절하고 나가겠다고 하니 출입증을 가져갔습니다. 자발적으로 남기로 한 적은 없어요.')],
   early:[
    say('이철민','허달수는 이곳 대표라고 들었습니다. 처음에는 연구를 맡길 사람을 찾는 줄 알았어요.'),
    say('이철민','무슨 연구인지 정확한 설명도 없으면서 사람을 내보내지 않는 건 정상적인 채용 절차가 아닙니다.')],
   afterMeet:[
    say('이철민','허달수를 직접 만났다고요? 그 사람이 환자들을 어떤 기준으로 구분하는지 알고 싶군요.'),
    say('이철민','과학적인 단어를 쓴다고 모든 연구가 정당해지는 건 아닙니다. 계획서와 실제 기록을 맞춰 봐야 해요.')],
   proven:[
    say('이철민','연구 계획서의 책임자가 허달수입니다. 목표는 치료 후 퇴원이 아니라 감각과 기억의 변화를 관찰하는 것이었어요.'),
    say('이철민','기록이 그렇게 말한다는 것과 실험 결과가 입증됐다는 건 다릅니다. 하지만 사람의 귀가를 막을 근거는 어느 쪽에도 없죠.')],
   proof:'projectClue'},
  nasol:{name:'오은지',origin:[
   say('오은지','낙원의 샘에 관한 제보를 받고 취재하러 왔어요. 대문 안으로 몰래 들어온 것까지는 기억합니다.'),
   say('오은지','그다음이 끊겨요. 머리를 다친 것과 팔에 주사 자국이 남았다는 건 확인했지만, 누가 뭘 했는지 기억으로 꾸며 낼 순 없죠.')],
   early:[
    say('오은지','허달수 이름은 취재 자료에서 봤어요. 지역에선 이웃을 돌보는 사람이라고 소개되더군요.'),
    say('오은지','그 사람이 누구인지보다 이곳 사람들이 실제로 어떤 대우를 받았는지 확인하고 싶습니다.')],
   afterMeet:[
    say('오은지','허달수와 마주쳤다고요? 취재하던 이름이 이렇게 가까이 있을 줄은 몰랐네요.'),
    say('오은지','제가 기억하는 것과 사진이 남긴 장면은 구분해서 말할게요. 중요한 건 어느 쪽이든 지우지 않는 겁니다.')],
   proven:[
    say('오은지','복원한 사진 속에 묶여 있던 사람이 찍혀 있었어요. 그 장면은 제가 남긴 기록이 맞습니다.'),
    say('오은지','다만 사진 한 장으로 누가 전부 지시했는지까지 알 수는 없죠. 허달수의 지시와 연결되는 문서를 더 찾아야 해요.')],
   proof:'cameraPhotoSeen'},
  patient05:{name:'서정윤',origin:[
    say('서정윤','처음에는 얼마 동안만 지내면 된다고 들었어요. 어느 순간부터는 이름보다 05번이 먼저 불렸습니다.'),
    say('서정윤','다른 곳으로 옮겨졌다는 건 알았지만, 언니가 저를 찾고 있는지는 몰랐어요. 그래서 더 무서웠어요.')],
   early:[
    say('서정윤','허달수 씨는 여기 사람들을 이웃이라고 불렀어요. 저한테는 집에 돌아가도 되는 날이 더 중요했는데.'),
    say('서정윤','언니가 저를 포기한 줄 알았어요. 지금은 그렇게 믿고 싶지 않아요.')],
   afterMeet:[
    say('서정윤','그 사람을 복도에서 만났어요? 저는 이름 대신 번호가 적힌 서류가 제일 싫었어요.'),
    say('서정윤','그 사람이 무슨 생각을 했는지는 모르겠어요. 저는 그냥 밖으로 나가서 제 이름을 듣고 싶어요.')],
   proven:[
    say('서정윤','연구 기록에 제 번호도 있었나요? 제가 왜 그렇게 오래 있어야 했는지 설명해 주는 사람은 없었어요.'),
    say('서정윤','서류도 가지고 나가 주세요. 누가 제 말을 믿지 않더라도 제가 여기 있었다는 흔적은 남아 있어야 해요.')],
   proof:'projectClue'}
 };
 for(const [id,data] of Object.entries(character)){
  const prefix='companionRelation_'+id;
  SCRIPTS[prefix+'Origin']=data.origin;
  SCRIPTS[prefix+'Early']=data.early;
  SCRIPTS[prefix+'Encounter']=data.afterMeet;
  SCRIPTS[prefix+'Evidence']=data.proven;
  SCRIPTS[prefix+'BeforeProof']=[Q('dalsuEncounter',prefix+'Encounter',prefix+'Early')];
  SCRIPTS[prefix+'Dalsu']=[Q(data.proof,prefix+'Evidence',prefix+'BeforeProof')];
 }
 // A few words after the original 14-frame optional encounter.
 // Append rather than inserting into that cinematic's save-sensitive steps.
 const encounter=SCRIPTS.dalsuEncounter;
 if(!encounter||encounter.length!==14)throw Error('Unexpected optional encounter framing');
 encounter.push(
  {say:'저 사람은 본인이 우리를 이웃이라고 불렀습니다. 문을 잠가 둔 사람이요.',who:'차준영',requiresParty:'kim'},
  {say:'그 사람을 찍는 게 일이었다면 이렇게 무섭진 않았을 텐데. 지금은 발소리부터 듣게 되네요.',who:'김주호',requiresParty:'jubin'},
  {say:'의사였다는 기사만으로 여기서 벌어진 일을 설명할 수는 없습니다. 병동 기록을 더 확인해야 합니다.',who:'이철민',requiresParty:'changwon'},
  {say:'취재 자료에서 보던 이름이었습니다. 그런데 지금은 질문보다 도망갈 길이 먼저네요.',who:'오은지',requiresParty:'nasol'},
  {say:'저 사람 목소리…… 아직도 듣고 싶지 않아요. 여기서 나가고 싶어요.',who:'서정윤',requiresParty:'patient05'}
 );
})();
function openCompanionTopicMenu(id){
 const names={kim:'차준영',jubin:'김주호',changwon:'이철민',nasol:'오은지',patient05:'서정윤'};
 if(!names[id]||!s.party.includes(id)){openCompanionTalkMenu();return}
 const panel=modal(names[id]+'와 대화');
 paragraph(panel,'어떤 이야기를 나눌까? 단서를 찾으면 허달수에 관한 생각이 달라질 수 있다.','small');
 const choices=row(panel);
 const ask=scene=>{closeModal();run(scene)};
 button(choices,'왜 이곳에 왔는지',()=>ask('companionRelation_'+id+'Origin'));
 button(choices,'허달수에 대해',()=>ask('companionRelation_'+id+'Dalsu'));
 button(choices,'지금 할 일',()=>ask('companionTalk_'+id));
 button(choices,'지금 기분은 어때?',()=>{const scene=companionTensionScene(id);if(scene)ask(scene)});
 const nav=row(panel);
 button(nav,'다른 동료',openCompanionTalkMenu);
 button(nav,'게임으로',closeModal,'primary');
}
