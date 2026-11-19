'use strict';
// Scripted finale: a pursuer's footsteps, a quiet capture, then staged clinical reveal.
// All additional art is rendered on the existing logical pixel canvas; no imported style assets.
(()=>{
 SCRIPTS.detectiveCaught=[
  T('복도 건너편에서 일정한 간격으로 구두 굽이 울렸다. 세 걸음. 잠깐의 정적. 다시 세 걸음.'),
  T('저택 밖으로 나가시려던 참입니까?','허달수'),
  T('어둠 속에서 허달수가 걸어 나왔다. 정갈하게 여민 옷깃 아래로 흰 장갑이 보였다.'),
  T('그날 도로에서도 참 집요하셨지요. 제가 멈추라고 했을 때 그만두셨더라면 좋았을 텐데.','허달수'),
  T('사고까지 당하셨는데도 남의 기록을 뒤지는 습관은 그대로더군요. 기억을 잃어도 사람은 달라지지 않는 걸까요?','허달수'),
  T('허달수가 손가락을 가볍게 구부렸다. 벽에 붙어 있던 직원 두 명이 동시에 움직였다. 뒷걸음질 칠 틈도 없었다.'),
  R('lab',8,8),
  T('눈을 떴다. 형광등이 깜빡였다. 목소리를 내려고 했지만 아무 소리도 나지 않았다.'),
  T('유리 너머에 무언가 떠 있었다. 주름진 덩어리. 가느다란 선이 여러 가닥 연결되어 있었다. 뇌였다.'),
  T('장비의 명판에 적힌 이름을 읽었다. 내 이름이었다.'),
  T('손을 들어 유리를 만져 보려 했다. 손가락을 움직이는 감각은 또렷했다. 그런데 아무것도 움직이지 않았다.'),
  T('이제 선생이 기억하시는 것과 선생에게 남아 있는 것이 얼마나 같은지, 천천히 확인해 보지요.','허달수'),
  E('truth')
 ];
})();

function drawCaptureCinematic(){
 if(s.script!=='detectiveCaught')return;
 const step=s.step;
 const p=(x,y,w,h,color)=>{cx.fillStyle=color;cx.fillRect(Math.round(x),Math.round(y),w,h)};
 const grid=(x,y,w,h,c)=>{for(let yy=y;yy<y+h;yy+=2)p(x,yy,w,2,c)};
 if(s.room==='bedroom'&&step<=5){
  cx.save();
  // Darken the room first. The doctor remains legible under a narrow source of cold light.
  p(0,0,640,384,step>=5?'#080b13a8':'#0b101ba0');
  const centerX=405,centerY=172;
  const halo=cx.createRadialGradient(centerX,centerY,12,centerX,centerY,196);
  halo.addColorStop(0,'#aab9a025');halo.addColorStop(.6,'#7d929511');halo.addColorStop(1,'#0b101b00');
  cx.fillStyle=halo;cx.fillRect(0,0,640,384);
  // Intermittent fluorescent strip, never a full-screen strobe.
  p(280,43,256,7,'#33434b');p(290,45,230,3,'#b2bab054');
  if(step>=1){
   const x=395+Math.min(step-1,3)*17,y=218;
   p(x-26,y-3,51,7,'#090c1455');
   // Reuse the cult leader's existing in-game pixel sprite where available.
   if(!drawRasterSprite('dalsu',x,y,'down')){
    p(x-13,y-81,26,61,'#202531');
    p(x-11,y-83,22,7,'#55525a');p(x-10,y-84,20,5,'#343640');
    p(x-10,y-70,20,15,'#bcaba4');p(x-9,y-71,18,5,'#35313a');
    p(x-15,y-49,30,36,'#242a36');p(x-13,y-14,10,15,'#1c222e');p(x+4,y-14,10,15,'#1c222e');
    p(x-17,y-34,6,18,'#e2d8c7');p(x+11,y-34,6,18,'#d5cabe');
   }
  }
  if(step>=3){
   // The hand he raises is isolated by a faint surgical-colored glint.
   p(448,141,11,17,'#a49a8b');p(452,135,6,9,'#d2c9b6');
  }
  if(step>=5){
   const staff=(x,y)=>{
    p(x-11,y-51,22,36,'#151a24');p(x-7,y-67,14,15,'#232731');
    p(x-11,y-68,22,4,'#293540');p(x-9,y-15,7,15,'#101520');p(x+2,y-15,7,15,'#101520');
   };
   staff(308,225);staff(548,226);
   p(0,0,640,384,'#0c0f1520');
  }
  // Grain in 2-pixel blocks, deterministic and very restrained.
  for(let i=0;i<44;i++){
   const x=(i*103+17)%640,y=(i*67+43)%384;
   p(x,y,2,2,i%3===0?'#adc0bb0d':'#04091120');
  }
  cx.restore();
 }else if(s.room==='lab'&&step>=7){
  cx.save();
  if(step===7){
   p(0,0,640,384,'#070c16b8');
   p(16,34,608,3,'#788c8b28');
   p(21,42,7,7,'#a5a89a25');
  }else{
   // Transparent scanning line follows the reveal without hiding the evidence.
   const scanY=Math.round((frameTime*22)%388);
   p(0,scanY,640,2,step>=9?'#aa9d9040':'#a0b4ae1f');
   p(0,scanY+2,640,2,'#1826341c');
   if(step>=9){
    p(402,25,213,49,'#1a2c37e5');p(402,25,213,2,'#788984');
    cx.fillStyle='#e0d9c3';cx.font='bold 12px monospace';cx.textAlign='left';
    cx.fillText('OBSERVATION LOG',416,44);
    cx.font='10px monospace';cx.fillStyle='#b6b6aa';
    cx.fillText('SUBJECT: IDENTIFIED',416,62);
   }
   if(step>=10){
    const pulse=Math.sin(frameTime*1.9)>.25;
    p(47,40,8,8,pulse?'#aa7877':'#544950');
    p(60,40,8,8,'#658980');
   }
  }
  cx.restore();
 }
}
