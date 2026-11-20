'use strict';
// Case notes are derived from existing evidence flags; no new save schema.
// This file runs after the last story patch and before game.js.
const CASE_LEADS=[
 {flag:'dalsuKnown',title:'교단의 연혁',where:'저택 홀',note:'허달수는 지역 보건소 진료 경력이 있는 인물이다. 교단의 연혁은 오래된 기사로 확인된다.'},
 {flag:'readRecord',title:'병동의 누락 번호',where:'지하 병동',note:'침상 명부에는 01~04만 남았지만 투약 장부에는 05가 있었다. 별도 관찰·외부 접촉 제한.'},
 {flag:'investorClue',title:'차준영의 격리',where:'지하 병동',note:'투자금 회수 건으로 방문한 차준영에게 외부 통화 및 면회 제한이 내려졌다.'},
 {flag:'incidentMemoRead',title:'봉헌함 내부 메모',where:'절식기도실',note:'교단 내부 문건은 죽음에 대한 책임을 기도가 부족하다는 말로 돌렸다.'},
 {flag:'waterOrigin',title:'샘물 납품 경로',where:'지하 배관실',note:'의식에 쓰인 물은 일반 생수 납품품을 다른 용기에 옮겨 담은 것으로 기록돼 있다.'},
 {flag:'recruitmentClue',title:'연구 인력 면담',where:'불 꺼진 연구실',note:'이철민은 환자가 아니라 백신 연구 경력을 이유로 연구 인력으로 영입하려던 대상이다.'},
 {flag:'projectClue',title:'신인류 연구 계획',where:'불 꺼진 연구실',note:'기록에는 치료 성과 대신 감각 반응·기억 변화와 외부 복귀 제한이 적혀 있다.'},
 {flag:'identityKnown',title:'탐정의 의뢰서',where:'지하 비상 대피실',note:'서미연에게 의뢰받아 동생 서정윤을 찾으러 왔다. 내 명함과 수첩에서 신원을 확인했다.'},
 {flag:'patient05Located',title:'05번 이관 대장',where:'별관 관찰병실',note:'누락된 05번 대상자의 이름은 서정윤. 일반 병동에서 별관으로 이관돼 관찰이 지속됐다.'},
 {flag:'accidentProof',title:'B-17 차량·결재 기록',where:'지하 비상 대피실',note:'사고 직전 내 차를 막은 B-17은 교단 차량이었다. 사고 후 확보·이송 지시에 허달수 결재가 남아 있다.'},
 {flag:'reporterTreatmentRead',title:'오은지 처치 기록',where:'지하 병동',note:'두부 외상과 반복 투약 이후, 각성 뒤 시간·장소 혼동이 기록됐다.',optional:true},
 {flag:'cameraPhotoSeen',title:'취재 사진 복원',where:'불 꺼진 연구실',note:'정원의 나무에 결박된 사람과 주변 신도들의 모습이 담긴 취재 사진을 복원했다.',optional:true}
];
const CASE_CONNECTIONS=[
 {id:'ritual',title:'봉헌 의식과 물의 출처',requires:['incidentMemoRead','waterOrigin'],
  note:'교단의 봉헌 문건과 납품 내역이 가리키는 내용이 다르다. 신앙의 언어와 실제 운영을 구분할 단서다.'},
 {id:'patient',title:'사라진 명부와 실종 의뢰',requires:['readRecord','identityKnown','patient05Located'],
  note:'병동에서 삭제된 05번, 서미연의 실종 의뢰서, 별관 이관 대장이 같은 사람을 가리킨다.'},
 {id:'research',title:'방문자 분류와 관찰 목적',requires:['investorClue','recruitmentClue','projectClue'],
  note:'차준영의 외부 연락 제한, 이철민의 연구 인력 영입, 감각·기억 관찰 계획을 구분해야 한다.'},
 {id:'accident',title:'실종 조사와 사고의 연결',requires:['identityKnown','accidentProof'],
  note:'사설 탐정의 조사 기록과 사고 현장 영상, 교단 차량 출입 및 이송 결재 내역을 연결할 수 있다.'},
 {id:'origin',title:'교단의 겉모습과 내부 계획',requires:['dalsuKnown','readRecord','projectClue'],
  note:'의료인 출신 대표의 연혁과 병동 운영, 신인류 연구 계획은 서로 다른 종류의 기록이다. 날짜와 목적을 대조하자.'},
 {id:'reporter',title:'취재와 처치 기록의 교차 확인',requires:['reporterTreatmentRead','cameraPhotoSeen'],
  note:'오은지의 취재 사진과 입소 이후 처치 기록을 함께 검토할 수 있다.',optional:true}
];
function caseBoardState(flags){
 const required=CASE_LEADS.filter(x=>!x.optional),obtained=required.filter(x=>flags[x.flag]);
 return {total:required.length,collected:obtained.length,
  evidence:CASE_LEADS.map(x=>({...x,obtained:!!flags[x.flag]})),
  connections:CASE_CONNECTIONS.map(x=>({...x,ready:x.requires.every(k=>!!flags[k])}))};
}
function caseBoardElement(tag,cls,content){
 const el=document.createElement(tag);if(cls)el.className=cls;if(content!==undefined)el.textContent=content;return el;
}
function addCaseBoardUI(root,{compact=false}={}){
 const state=caseBoardState(s.flags);
 const board=caseBoardElement('section','detectiveBoard'+(compact?' compact':''));root.append(board);
 const head=caseBoardElement('div','detectiveBoardHead');board.append(head);
 head.append(caseBoardElement('strong','',compact?'증거 간의 연결':'사건 관계도 · 탐정 수첩'));
 head.append(caseBoardElement('span','',state.collected+' / '+state.total+' 핵심 기록'));
 const meter=caseBoardElement('div','detectiveBoardTrack');meter.setAttribute('role','progressbar');
 meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax',String(state.total));
 meter.setAttribute('aria-valuenow',String(state.collected));
 meter.setAttribute('aria-label','확보한 핵심 증거');
 const progress=caseBoardElement('div','detectiveBoardProgress');progress.style.width=String(state.collected/state.total*100)+'%';
 meter.append(progress);board.append(meter);
 if(!compact){
  board.append(caseBoardElement('p','detectiveBoardNote','수집한 기록은 자동으로 정리된다. 문서만으로 확인되지 않은 추측은 결론으로 적지 않는다.'));
  const evidence=caseBoardElement('div','detectiveEvidenceList');board.append(evidence);
  for(const item of state.evidence){
   const card=caseBoardElement('article','detectiveEvidence'+(item.obtained?' found':' missing'));evidence.append(card);
   card.append(caseBoardElement('div','detectiveEvidenceLabel',(item.obtained?'● 확보':'○ 미확보')+(item.optional?' · 보조':'')+'  '+item.where));
   card.append(caseBoardElement('strong','',item.title));
   card.append(caseBoardElement('p','',item.obtained?item.note:'자료를 확보하면 이곳에 기록된다.'));
  }
 }
 board.append(caseBoardElement('h3','detectiveBoardSubheading',compact?'대조할 기록':'연결된 단서'));
 const links=caseBoardElement('div','detectiveLinks');board.append(links);
 for(const item of state.connections){
  const row=caseBoardElement('article','detectiveLink'+(item.ready?' ready':' locked'));links.append(row);
  const found=item.requires.map(f=>CASE_LEADS.find(x=>x.flag===f)).filter(x=>x&&s.flags[x.flag]);
  row.append(caseBoardElement('strong','',item.ready?'● '+item.title:'○ 미완성 연결 · '+found.length+' / '+item.requires.length));
  row.append(caseBoardElement('p','',item.ready?item.note:found.length?'현재 확보된 기록: '+found.map(x=>x.title).join(' · '):'관련 증거를 수집해야 관계를 확인할 수 있다.'));
 }
 if(s.flags.caseSolved)board.append(caseBoardElement('p','detectiveCaseSolved','사건 재구성 완료 · 최종 조사 기록을 확보했다.'));
 return board;
}
function showCaseBoard(fromJournal=false){
 const p=modal('탐정의 사건 수첩');addCaseBoardUI(p);
 const actions=row(p);
 if(fromJournal)button(actions,'탐험 기록으로',journal);
 button(actions,'게임으로',closeModal,'primary');
}
// Final case board is not a new gating mechanic: it gives context to the
// existing five-answer deduction, after the records are earned.
function addFinalCaseLinks(paper){addCaseBoardUI(paper,{compact:true})}
(()=>{
 const nodes=SCRIPTS.evidenceFinal||[];
 const i=nodes.findIndex(n=>n.puzzleId==='case-final');
 if(i>=0){
  nodes[i].help='의뢰서와 이관대장, 사고 기록, 병동과 연구실 문건을 한 장의 사건 관계도로 대조한다. 왼쪽의 수첩에서 확인한 사실을 바탕으로 다섯 항목의 주인을 특정하자.';
  const after=nodes[i+1];
  if(after?.say)after.say='관리번호와 날짜, 결재 기록을 연결하자 서미연의 의뢰에서 시작된 사건이 한 장의 관계도로 정리됐다.';
 }
})();
