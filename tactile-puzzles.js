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
 const locker=(SCRIPTS.detectiveLockerFirst||[]).find(n=>n.puzzleId==='case-locker');
 if(!locker)throw Error('Missing case-locker puzzle');
 locker.device='combination';
 locker.mode='lock';
 locker.help='압수 물품 목록에는 「사고 현장 수거품 C-05 / 가죽 수첩·카드지갑」이라고 적혔다. 잠금장치 아래 작은 안내표에는 「A=1, B=2, C=3」이 새겨져 있다. 분류 문자와 두 자리 번호를 차례로 입력하자.';
 locker.answer=[3,0,5];
 locker.labels=['분류 코드','보관 번호 십의 자리','보관 번호 일의 자리'];
})();

let detectivePhotoImage=null;
function makeDetectivePhoto(){
 if(detectivePhotoImage)return detectivePhotoImage;
 const canvas=document.createElement('canvas');canvas.width=144;canvas.height=144;
 const g=canvas.getContext('2d');if(!g)return null;
 g.imageSmoothingEnabled=false;
 const p=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
 const dark='#181e22',mid='#303a3c',fog='#485459',edge='#7a8981',
  moss='#53615a',fence='#252e31',blue='#85908c',skin='#ada292';
 p(0,0,144,144,'#333f44');
 for(let y=0;y<144;y+=2)for(let x=0;x<144;x+=2){
  const k=(x*17+y*23+x*y*3)%17;
  if(k<3)p(x,y,2,2,y<55?'#414e52':y<95?'#333f3f':'#41443c');
 }
 // Night sky, long courtyard wall and the gate seen behind the subject.
 p(0,0,144,20,dark);p(0,17,144,4,'#66746f');
 p(0,31,144,24,mid);p(0,32,144,3,'#77847f');
 for(let i=0;i<11;i++){let x=i*14+2;p(x,33,3,35,fence);p(x+1,33,1,34,'#6d7b76')}
 p(0,53,144,7,dark);p(0,57,144,3,'#69726a');
 p(0,64,144,80,'#3c4944');
 for(let i=0;i<46;i++){
  let x=(i*29+17)%144,y=60+(i*13)%80;
  p(x,y,3+(i%3),1,i%4===0?'#697064':'#293632');
 }
 // Crooked wooden yard gate / entrance frame.
 p(7,11,12,88,'#26282c');p(11,13,4,80,'#62615c');
 p(8,11,57,10,'#232b2c');p(11,13,50,3,'#8d9185');
 p(58,11,11,90,'#242c2d');p(60,16,3,82,'#6c7771');
 p(14,30,48,4,'#59645f');p(19,31,3,50,'#242e30');
 for(let i=0;i<4;i++){let x=27+i*8;p(x,29,2,45,'#263134')}
 // Thick tree trunk on the right; individual uneven bark and branches.
 p(106,7,22,127,'#262d2c');p(111,4,7,126,'#495047');
 p(120,9,4,115,'#626156');p(106,24,4,93,'#232a27');
 p(93,15,28,9,'#26332e');p(89,11,22,7,'#48524a');
 p(105,17,8,21,'#2a3530');p(100,6,7,11,'#2b3831');
 p(118,28,19,7,'#273530');p(132,24,12,6,'#46594a');
 for(let i=0;i<22;i++){
  let x=106+(i*7)%21,y=12+(i*23)%112;
  p(x,y,1+(i%3),6+(i%5),i%2?'#171f20':'#777368');
 }
 // Restrained adult: coat silhouette, hands against trunk, rope and head.
 p(75,65,17,39,dark);p(77,69,14,8,'#4a5553');
 p(70,77,26,43,'#424a48');p(74,80,18,42,'#647069');
 p(73,71,18,8,'#7d7770');p(77,68,12,14,skin);
 p(75,64,15,5,'#292b2b');p(73,66,5,12,'#2f3331');
 p(77,84,5,13,'#aeb2a3');p(84,86,8,3,'#75817b');
 p(73,114,7,21,dark);p(86,114,7,23,dark);
 p(74,128,6,4,'#70716a');p(85,130,8,3,'#77786e');
 p(68,83,8,26,'#343c39');p(93,84,6,24,'#313937');
 p(92,91,17,4,'#c2b5a0');p(94,94,16,3,'#827460');
 // Rope wraps around the wrists and tree, visible in more than one tile.
 for(let i=0;i<3;i++){p(92,91+i*4,35,2,'#b4a384');p(93,93+i*4,32,1,'#695a4d')}
 // The witness is partly visible at the left of the tree.
 p(25,80,7,11,skin);p(23,76,11,6,dark);
 p(20,91,18,32,'#333e3f');p(23,92,12,29,'#6c7670');
 p(20,119,7,16,dark);p(33,121,7,14,dark);
 p(30,83,3,2,'#23252c');
 // Distinct tree leaf silhouettes and overhanging ivy.
 for(let i=0;i<27;i++){
  const x=(i*19+70)%144,y=(i*7+3)%38;
  p(x,y,5+(i%4),3+(i%2),i%3?'#313f37':'#556456');
 }
 // Tape damage and neutral film grain; thin marks not text labels.
 p(0,0,144,2,'#9caaa0');p(0,142,144,2,'#20282a');
 for(let i=0;i<100;i++){
  const x=(i*41+i*i*3)%144,y=(i*29+i*i*7)%144;
  p(x,y,1,1,i%3===0?'#c0c6b04b':'#151d202f');
 }
 detectivePhotoImage=canvas.toDataURL('image/png');
 return detectivePhotoImage;
}

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
