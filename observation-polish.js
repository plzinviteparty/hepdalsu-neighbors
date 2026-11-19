'use strict';
// Environmental storytelling for patient 05 and the bad-ending observation chamber.
// Every new prop is drawn on the game's existing 2x logical pixel grid.
(()=>{
 const lab=MAPS.lab;
 lab.name='별관 관찰실';
 lab.theme='lab';
 lab.mission='원통형 장비와 연결된 기록을 확인하자';
 lab.props=[
  ['labTankSide',5,7],['labTankCore',10,6],['labTankSide',15,7],
  ['labCeiling',10,3],['labDuct',10,4],['labMonitor',17,5],
  ['labConsole',15,11],['labRack',4,11],['labChair',11,12],
  ['labWarning',3,4]
 ];
 // These are atmospheric observations, not instantly given quest items.
 const notes=[
  ['annexScenery_casePulseChart',21,8,'뒤집힌 관찰표',[
   T('병상 옆의 관찰표에는 일정한 간격으로 눈금이 찍혀 있었다.'),
   T('통증이나 회복 정도를 적는 칸은 없었다. 「반응」「기억」「시선 추적」이라는 항목만 반복되어 있었다.'),
   T('누가 이렇게 오래 관찰했다는 걸까.')
  ]],
  ['annexScenery_caseBedRail',18,10,'긁힌 침대 난간',[
   T('침대 난간의 도장이 손톱만 한 크기로 여러 군데 벗겨져 있었다.'),
   T('금속이 드러난 부분에 작고 불규칙한 긁힌 자국이 남아 있었다.'),
   T('누군가 계속 같은 곳을 붙잡고 있었던 모양이다.')
  ]],
  ['annexScenery_caseDiary',9,13,'접힌 수면 기록지',[
   T('처치대 아래 접힌 종이가 끼어 있었다. 종이 끝이 여러 번 접혔다 펴진 듯 헤져 있었다.'),
   T('「밤에 잠들었다가도 경보음이 울리면 일어나 앉게 됨.」'),
   T('그 아래는 글씨가 흐려 읽을 수 없었다. 날짜만 나흘 연속 적혀 있었다.')
  ]],
  ['annexScenery_caseDoorView',5,12,'문 안쪽 잠금쇠',[
   T('문 안쪽에도 잠금쇠가 있었다. 그러나 손잡이 바로 옆의 나사는 한 번 뜯었다가 다시 조인 흔적이 있었다.'),
   T('환자가 나가는 걸 막기 위한 장치라기보다, 안에서 문을 열었을 때 밖에 알려 주기 위한 장치 같았다.')
  ]]
 ];
 const locations={
  annexScenery_casePulseChart:[21,8,'casePulseChart'],
  annexScenery_caseBedRail:[18,10,'caseBedRail'],
  annexScenery_caseDiary:[9,13,'caseDiary'],
  annexScenery_caseDoorView:[5,12,'caseDoorView']
 };
 for(const [id,_px,_py,label,scenes] of notes){
  const [px,py,kind]=locations[id];
  SCENERY.annex05.push({id,x:px,y:py,kind,label,scenery:true,rx:kind==='caseBedRail'?1:0,ry:0});
  SCRIPTS[id]=scenes;
 }
 MAPS.annex05.props.push(
  ['casePulseChart',21,8],['caseBedRail',18,10],
  ['caseDiary',9,13],['caseDoorView',5,12]
 );
 // The patient is framed as a living person, not an item at the end of a quest.
 SCRIPTS.annexEnter.push(
  T('먼저 소리가 들렸다. 기계가 한 번 울리고, 누군가 숨을 고르는 소리.'),
  T('침대에는 반쯤 접힌 이불과 비어 있는 물컵이 놓여 있었다.')
 );
 const recognize=SCRIPTS.patient05Recognize;
 recognize.splice(0,0,T('여자가 환자복 소매를 잡아당겼다. 드러난 팔목에 05라는 숫자가 적혀 있었다.'));
 SCRIPTS.patient05Unknown.splice(1,0,T('여자는 먼저 복도 쪽을 살폈다. 발소리가 없는 것을 확인하고서야 입을 열었다.'));
 // Keep the original ending branches and plot beats unchanged.
})();

function drawObservationTile(x,y){
 if(s.room!=='lab')return false;
 const px=x*TS-camera.x,py=y*TS-camera.y,m=MAPS.lab;
 const p=(a,b,w,h,color)=>{cx.fillStyle=color;cx.fillRect(Math.round(a),Math.round(b),w,h)};
 const wall=y<3||x===0||x===m.w-1||y===m.h-1;
 if(wall){
  p(px,py,32,32,'#192732');
  p(px+2,py+2,28,28,'#2d3d48');
  p(px+4,py+4,24,24,'#243640');
  p(px+6,py+5,2,22,'#465763');
  p(px+25,py+4,2,23,'#182b37');
  p(px,py+28,32,4,'#111f2b');
  if(y<3){p(px+5,py+14,20,2,'#415865');p(px+8,py+16,15,2,'#1a2934')}
  if((x+y)%3===0)p(px+14,py+8,5,3,'#4d616a');
  return true;
 }
 p(px,py,32,32,(x+y)%2?'#293945':'#30414c');
 p(px,py,32,2,'#60727a');
 p(px,py,2,32,'#52626c');
 p(px+4,py+4,24,24,'#25374448');
 p(px+26,py+4,2,23,'#1b2b3658');
 if((x*7+y*11)%5===0){p(px+6,py+20,6,2,'#a4afa91a');p(px+17,py+11,4,2,'#101f2b45')}
 if(y===3){p(px,py,32,4,'#687f86');p(px+3,py+4,26,2,'#a3a79a')}
 return true;
}
function drawObservationProp(kind,x,y,frame=0){
 if(!kind.startsWith('lab')&&!['casePulseChart','caseBedRail','caseDiary','caseDoorView'].includes(kind))return false;
 const p=(xx,yy,w,h,color)=>{cx.fillStyle=color;cx.fillRect(Math.round(xx),Math.round(yy),w,h)};
 const metal='#617782',shadowMetal='#2c3f4a',pale='#b7c6be',blue='#335565',
       amber='#a99976',paper='#cfc5ae',rust='#765d5d',dark='#171e2c';
 if(!['labCeiling','labDuct','labWarning','caseDoorView'].includes(kind))shadow(x,y,34);
 cx.save();cx.translate(Math.round(x/2)*2,Math.round(y/2)*2);cx.scale(2,2);
 switch(kind){
  case 'casePulseChart':{
   p(-13,-41,27,34,dark);p(-11,-39,23,30,paper);p(-9,-36,19,3,'#746f6b');
   for(let i=0;i<4;i++){p(-9,-30+i*5,17,1,'#8b857d');p(-8+(i%2)*3,-28+i*5,6,2,'#56737b')}
   p(-3,-43,7,4,metal);p(7,-12,4,3,rust);break;
  }
  case 'caseBedRail':{
   p(-27,-27,54,5,shadowMetal);p(-25,-32,50,7,metal);p(-21,-32,44,2,pale);
   for(let i=0;i<4;i++){p(-23+i*13,-25,3,23,shadowMetal);p(-22+i*13,-21,1,17,amber)}
   p(-16,-31,11,2,rust);p(2,-30,9,1,'#d0beb2');break;
  }
  case 'caseDiary':{
   p(-13,-12,28,15,dark);p(-12,-13,25,13,paper);
   p(-10,-11,21,2,'#bcae95');for(let i=0;i<3;i++)p(-9,-7+i*3,17-i*4,1,'#7d8282');
   p(9,0,5,2,'#b1a895');break;
  }
  case 'caseDoorView':{
   p(-8,-46,16,27,shadowMetal);p(-6,-44,12,23,metal);p(-4,-40,8,13,'#222d37');
   p(-4,-23,8,3,pale);p(3,-34,3,3,amber);break;
  }
  case 'labTankCore':
  case 'labTankSide':{
   const core=kind==='labTankCore',h=core?59:50,w=core?37:30;
   p(-w/2-3,-h-15,w+6,h+20,dark);
   p(-w/2,-h-16,w,h+15,shadowMetal);
   p(-w/2+3,-h-11,w-6,h+5,blue);
   p(-w/2+5,-h-8,5,h-4,'#71989b');
   p(w/2-9,-h-7,3,h-8,'#72939a');
   p(-w/2-4,-h-18,w+8,8,metal);p(-w/2-5,0,w+10,8,shadowMetal);
   p(-w/2-3,-h-18,w+6,2,pale);
   if(core){
    // Neural tissue is intentionally withheld until the capture reveal.
    if(s.room==='lab'&&s.script==='detectiveCaught'&&s.step>=6){
     const pulse=Math.sin(frame*1.6)>0?'#ae7480':'#997080';
     p(-9,-h+20,18,17,pulse);p(-11,-h+25,22,7,'#bc8d95');
     p(-5,-h+15,11,9,'#bc8793');p(-8,-h+19,4,12,'#9d6976');
     for(const [xx,yy] of [[-9,-h+28],[-3,-h+21],[4,-h+27],[7,-h+22]]){
      p(xx,yy,6,2,'#d3a7aa');p(xx+2,yy+3,3,3,'#8b5367')
     }
     p(-2,-h+36,4,11,'#ae848b');p(-1,-h+46,3,9,pale);
     p(-14,-h+8,28,1,'#9ab6b4');
    }else{
     p(-11,-h+23,22,18,'#64838c');p(-7,-h+16,14,10,'#8da8a3');
     p(-9,-h+27,18,13,'#4d6976');
    }
   }else{
    // Closed side vessels show incomplete organic silhouettes, not explicit gore.
    p(-8,-h+19,15,20,'#587785');p(-5,-h+15,12,8,'#759394');
    p(-11,-h+36,20,4,'#3e6570');p(-3,-h+39,6,10,'#56767d');
   }
   for(let i=0;i<4;i++)p(-w/2+5+i*7,-h-15,3,3,i===1?'#c6ae7c':pale);
   p(-w/2+2,5,w-4,3,metal);break;
  }
  case 'labConsole':{
   p(-28,-41,56,44,dark);p(-26,-39,52,39,metal);p(-22,-36,45,23,shadowMetal);
   for(let j=0;j<4;j++)p(-18,-32+j*5,28+(j%2)*7,2,j===3?'#b69275':'#7a9f9c');
   for(let i=0;i<5;i++)p(-21+i*10,-8,5,4,i===2?'#a8847d':'#b2b4a6');
   p(-27,1,54,5,shadowMetal);break;
  }
  case 'labMonitor':{
   p(-17,-54,34,37,dark);p(-15,-52,30,33,metal);p(-12,-49,24,23,shadowMetal);
   for(let j=0;j<5;j++)p(-10,-45+j*4,19-(j%3)*4,2,j===4?'#b68b80':'#81a2a0');
   p(-3,-18,6,10,metal);p(-12,-8,24,3,shadowMetal);break;
  }
  case 'labRack':{
   p(-19,-56,38,56,dark);p(-17,-53,34,51,metal);
   for(let j=0;j<3;j++){
    p(-14,-49+j*15,28,11,shadowMetal);
    for(let k=0;k<3;k++)p(-12+k*9,-46+j*15,5,6,j===2&&k===1?'#af8179':'#8ca59e');
   }
   p(-19,-3,38,5,dark);break;
  }
  case 'labChair':{
   p(-13,-29,26,19,shadowMetal);p(-10,-26,20,15,'#5c7074');
   p(-13,-11,26,7,metal);p(-3,-5,6,15,shadowMetal);
   p(-12,7,24,3,metal);p(-16,9,7,3,dark);p(9,9,7,3,dark);break;
  }
  case 'labCeiling':{
   p(-29,-73,58,5,metal);p(-27,-71,54,2,pale);
   p(-21,-65,42,11,shadowMetal);p(-18,-62,36,4,'#a0b4af');
   break;
  }
  case 'labDuct':{
   p(-60,-79,120,6,shadowMetal);p(-53,-76,106,2,metal);
   for(let i=0;i<7;i++)p(-42+i*14,-73,7,19,shadowMetal);
   p(-35,-54,70,4,'#3b5663');break;
  }
  case 'labWarning':{
   p(-22,-63,44,46,dark);p(-20,-61,40,42,amber);p(-18,-59,36,39,'#4c5557');
   p(-13,-52,26,4,'#c4b694');p(-13,-43,20,3,'#a7a7a0');
   p(-13,-34,23,3,'#a7a7a0');p(-13,-25,15,3,'#c29c88');
   break;
  }
  default:cx.restore();return false;
 }
 cx.restore();return true;
}
function drawObservationFloor(){
 if(s.room!=='lab')return;
 const p=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x-camera.x),Math.round(y-camera.y),w,h)};
 // Cable runs connect the three tubes; no free-floating props.
 for(const x of [5,10,15]){
  p(x*TS+14,7*TS+3,4,42,'#304c5a');
  p(x*TS+12,7*TS+16,2,29,'#7790975c');
 }
 p(5*TS+14,8*TS+14,10*TS+7,4,'#334959');
 p(5*TS+14,8*TS+14,10*TS+7,1,'#8091947c');
 for(const [x,y] of [[4,9],[9,11],[17,9],[12,13],[15,12]]){
  p(x*TS+8,y*TS+9,8,2,'#253a4538');p(x*TS+23,y*TS+20,4,2,'#a8b4ae1d');
 }
}
function drawObservationLighting(){
 if(s.room!=='lab')return;
 cx.save();
 cx.fillStyle='#06101e38';cx.fillRect(0,0,640,384);
 const cx0=10*TS+16-camera.x,cy=6*TS-22-camera.y;
 const halo=cx.createRadialGradient(cx0,cy,10,cx0,cy,220);
 halo.addColorStop(0,'#89aeba1d');halo.addColorStop(.55,'#6f92a110');halo.addColorStop(1,'#07101b00');
 cx.fillStyle=halo;cx.fillRect(0,0,640,384);
 if(s.script==='detectiveCaught'&&s.step>=6){
  // Cold warning pulse after the character is captured, not a jump scare.
  cx.fillStyle=Math.sin(frameTime*2.4)>0?'#ac6b6813':'#2539470e';
  cx.fillRect(0,0,640,384);
 }
 cx.restore();
}
function drawCaseInspectionOverlay(){
 const scene=s.script||'';
 if(s.room==='annex05'){
  const types={
   annexScenery_casePulseChart:['관찰표','기억 / 반응 / 시선','05'],
   annexScenery_caseBedRail:['침대 난간','닳은 도장 / 손톱 자국',''],
   annexScenery_caseDiary:['수면 기록','반복 각성 / 경보음',''],
   annexScenery_caseDoorView:['안쪽 잠금쇠','외부 통제 / 경보 연결','']
  };
  const data=types[scene];
  if(!data)return;
  cx.save();
  cx.fillStyle='#060e18a4';cx.fillRect(0,0,640,384);
  // One paper close-up presented at pixel scale, with restrained contrast.
  const x=148,y=63,w=344,h=244;
  rect(x+8,y+10,w,h,'#0e1724');rect(x,y,w,h,'#6b726f');
  rect(x+7,y+7,w-14,h-14,'#c8c5b4');rect(x+13,y+13,w-26,h-26,'#d7d0bc');
  rect(x+136,y-7,78,18,'#b7a47cbb');
  cx.fillStyle='#343b41';cx.font='bold 18px monospace';cx.textAlign='left';
  cx.fillText(data[0],x+35,y+58);
  cx.font='12px monospace';cx.fillText(data[1],x+35,y+89);
  for(let i=0;i<6;i++)rect(x+35,y+108+i*19,200-(i%3)*37,2,'#807f78');
  if(data[2]){
   rect(x+244,y+106,59,56,'#4f6064');
   cx.font='bold 35px monospace';cx.fillStyle='#e8ddd0';cx.fillText(data[2],x+251,y+145);
  }else{
   rect(x+246,y+113,54,40,'#817c75');
   for(let i=0;i<4;i++)rect(x+253,y+120+i*7,34-i*5,2,'#cfc7b5');
  }
  cx.restore();
 }else if(s.room==='lab'&&scene==='detectiveCaught'&&s.step>=6){
  // A tight lens glare on the tube; the restrained reveal is in the room itself.
  cx.save();
  const x=10*TS+16-camera.x,y=6*TS-46-camera.y;
  const glint=cx.createRadialGradient(x,y,5,x,y,78);
  glint.addColorStop(0,'#d2c1b514');glint.addColorStop(.55,'#b5a3a30e');glint.addColorStop(1,'#5e677100');
  cx.fillStyle=glint;cx.fillRect(x-95,y-95,190,190);
  if(s.step>=8){
   rect(415,35,186,38,'#1c2e37ea');
   cx.font='12px monospace';cx.textAlign='left';cx.fillStyle='#c6c7b6';
   cx.fillText('SUBJECT RECORD',427,50);
   cx.font='10px monospace';cx.fillText('STATUS: OBSERVING',427,65);
  }
  cx.restore();
 }
}
