'use strict';
// Tactile detective puzzles, loaded after evidence and detective route patches.
// Existing puzzle IDs, flags, rewards and downstream ending conditions stay intact.
(()=>{
 const camera=(SCRIPTS.cameraPhotos||[]).find(n=>n.puzzleId==='evidence-camera');
 if(!camera)throw Error('Missing evidence-camera puzzle');
 camera.device='photo-grid';
 camera.mode='mosaic';
 camera.help='기억 카드에 남은 취재 사진 한 장의 조각이 뒤섞였다. 두 조각을 차례로 눌러 자리를 맞춰 보자. 원본은 대문 안쪽, 나무, 결박된 인물의 모습을 담고 있다.';
 camera.answer=[0,1,2,3,4,5,6,7,8];
 const opening=SCRIPTS.cameraPhotos[0];
 if(opening?.say)opening.say='메모리 카드에서 손상된 취재 사진을 찾았다. 아홉 조각으로 흩어진 파일을 복원하면 그날 정원에서 무슨 일이 있었는지 확인할 수 있을 것 같다.';
 const locker=(SCRIPTS.detectiveLockerFirst||[]).find(n=>n.puzzleId==='case-locker');
 if(!locker)throw Error('Missing case-locker puzzle');
 locker.device='combination';
 locker.mode='lock';
 locker.help='압수 물품 목록에는 「사고 현장 수거품 C-05 / 가죽 수첩·카드지갑」이라고 적혔다. 잠금장치 아래 작은 안내표에는 「A=1, B=2, C=3」이 새겨져 있다. 분류 문자와 두 자리 번호를 차례로 입력하자.';
 locker.answer=[3,0,5];
 locker.labels=['분류 코드','보관 번호 십의 자리','보관 번호 일의 자리'];
})();

// Full-resolution scene, not a 144px canvas montage. The three-by-three
// swapping puzzle still uses exactly the same indices, answer and save data.
const detectivePhotoImage='art/reporter-evidence-final.webp';
function makeDetectivePhoto(){return detectivePhotoImage;}

function renderTactilePuzzle(n,raw){
 const root=$('#choices');root.replaceChildren();
 const desk=document.createElement('section');desk.className='caseDesk tactileCase';root.append(desk);
 const header=document.createElement('div');header.className='caseDeskHead';desk.append(header);
 const code=document.createElement('span');code.className='caseFolderCode';
 code.textContent=n.puzzleId.toUpperCase().replaceAll('-',' / ');header.append(code);
 const status=document.createElement('span');status.className='caseFolderStatus';
 status.textContent=n.device==='photo-grid'?'취재 사진 · 손상 파일':'압수 목록 · 잠금장치';header.append(status);
 const paper=document.createElement('div');paper.className='casePaper';desk.append(paper);
 const label=document.createElement('h3');label.className='casePaperTitle';label.textContent=n.title;paper.append(label);
 const info=document.createElement('p');info.className='casePaperInstructions';info.textContent=n.help;paper.append(info);
 $('#words').textContent=n.device==='photo-grid'?'조각의 경계가 이어지도록 원본 사진을 복원하자.':'보관 목록을 보고 자물쇠를 조작하자.';
 if(raw.tactileId!==n.puzzleId){
  raw.tactileId=n.puzzleId;
  raw.tries=0;raw.moves=0;
  if(n.device==='photo-grid'){raw.tiles=[6,0,5,3,8,1,7,2,4];raw.first=null}
  else raw.digits=[0,0,0];
 }
 const refresh=()=>{autoSave();renderPuzzle(n)};
 if(n.device==='photo-grid'){
  if(!Array.isArray(raw.tiles)||raw.tiles.length!==9||new Set(raw.tiles).size!==9||raw.tiles.some(v=>!Number.isInteger(v)||v<0||v>8)){
   raw.tiles=[6,0,5,3,8,1,7,2,4];raw.first=null;
  }
  if(!Number.isInteger(raw.first)||raw.first<0||raw.first>8)raw.first=null;
  const notice=document.createElement('p');notice.className='tactileGuide';
  notice.textContent=raw.first===null?'첫 번째 사진 조각을 선택하세요.':'다음 조각을 선택하면 서로 자리를 바꿉니다.';
  paper.append(notice);
  const board=document.createElement('div');board.className='photoRepair';board.setAttribute('role','group');board.setAttribute('aria-label','손상된 취재 사진 아홉 조각');paper.append(board);
  const photo=makeDetectivePhoto();
  for(let i=0;i<9;i++){
   const piece=raw.tiles[i];
   const b=document.createElement('button');
   b.type='button';b.className='photoFragment'+(raw.first===i?' picked':'');
   b.setAttribute('aria-label',(Math.floor(i/3)+1)+'행 '+(i%3+1)+'열 사진 조각'+(raw.first===i?' 선택됨':''));
   b.setAttribute('aria-pressed',String(raw.first===i));
   b.style.backgroundImage=photo?'url('+photo+')':'none';
   b.style.backgroundPosition=(piece%3)*50+'% '+Math.floor(piece/3)*50+'%';
   b.onclick=()=>{
    if(raw.first===null){raw.first=i}
    else if(raw.first===i){raw.first=null}
    else{[raw.tiles[raw.first],raw.tiles[i]]=[raw.tiles[i],raw.tiles[raw.first]];raw.first=null;raw.moves++;sound(280,.05)}
    refresh();
   };
   board.append(b);
  }
  const count=document.createElement('p');count.className='tactileCounter';
  count.textContent='교환 '+raw.moves+'회 · 왼쪽 대문과 오른쪽 나무, 인물을 이어 보자.';paper.append(count);
 }else{
  if(!Array.isArray(raw.digits)||raw.digits.length!==3||raw.digits.some(v=>!Number.isInteger(v)||v<0||v>9))raw.digits=[0,0,0];
  const housing=document.createElement('div');housing.className='lockFace';paper.append(housing);
  const engraved=document.createElement('div');engraved.className='lockEngraving';
  engraved.textContent='회수품 보관함  /  C-05';housing.append(engraved);
  const rack=document.createElement('div');rack.className='lockDigits';housing.append(rack);
  for(let i=0;i<3;i++){
   const unit=document.createElement('div');unit.className='lockDigit';rack.append(unit);
   const caption=document.createElement('small');caption.textContent=n.labels[i];unit.append(caption);
   const up=button(unit,'▲',()=>{raw.digits[i]=(raw.digits[i]+1)%10;sound(320,.06);refresh()},'lockArrow');
   up.setAttribute('aria-label',n.labels[i]+' 증가');
   const number=document.createElement('strong');number.textContent=String(raw.digits[i]);number.setAttribute('aria-live','polite');unit.append(number);
   const down=button(unit,'▼',()=>{raw.digits[i]=(raw.digits[i]+9)%10;sound(260,.06);refresh()},'lockArrow');
   down.setAttribute('aria-label',n.labels[i]+' 감소');
  }
  const note=document.createElement('p');note.className='tactileCounter';
  note.textContent='왼쪽: 분류 문자 숫자 / 가운데·오른쪽: 보관 번호';paper.append(note);
 }
 renderCompanionInvestigation(n,raw,paper);
 if(raw.tries){const error=document.createElement('p');error.className='caseWrong';error.textContent=n.device==='photo-grid'?'사진의 경계가 일치하지 않는다. 조각을 다시 살펴보자.':'번호가 맞지 않는다. 수거품의 분류와 번호를 대조하자.';paper.append(error)}
 const actions=document.createElement('div');actions.className='caseActions';paper.append(actions);
 button(actions,n.device==='photo-grid'?'사진 복원 완료':'보관함 열기',()=>{
  const okay=n.device==='photo-grid'?n.answer.every((v,i)=>raw.tiles[i]===v):n.answer.every((v,i)=>raw.digits[i]===v);
  if(okay)completePuzzle();
  else{raw.tries++;sound(110,.12);refresh()}
 },'caseConfirm');
 if(n.device==='photo-grid'){
  button(actions,'조각 처음으로',()=>{raw.tiles=[6,0,5,3,8,1,7,2,4];raw.first=null;raw.moves=0;raw.tries=0;refresh()},'caseReset');
 }
 button(actions,'조사 중단',leavePuzzle,'caseLeave');
 updateUI();
}
