'use strict';
// A legibility pass for the main entrance. Favor the game's existing richly shaded
// pixel furniture instead of temporary solid-color geometric placeholders.
(()=>{
 const hall=MAPS.prom;
 const exitDoor=hall.objects.find(o=>o.id==='exitProm');
 if(!exitDoor)throw Error('Missing hall exit');
 // The original door was drawn partly off the top of the 640x384 canvas.
 exitDoor.y=3;
 exitDoor.label='연회장 북쪽 출입문';
 // The source of the shapeless block was a 62x43 code-only fireplace directly
 // beneath the door, plus a large tabletop on the same centerline.
 hall.props=hall.props.filter(([kind,x,y])=>!(kind==='fireplace'&&x===18&&y===4)&&!(kind==='table'&&x===19&&y===8));
 // Move the guest-facing desk away from the door. Leave a clear corridor.
 hall.props.push(['hallReception',24,6],['table',28,9]);
 // The original clue was a floating book in the middle of the room. Place it
 // on the desk instead, preserving its stable scene flag and journal entry.
 hall.objects=hall.objects.filter(o=>o.id!=='entryPlacard');
 SCENERY.prom=[
  {id:'hallCheckinSurface',x:24,y:6,kind:'hallReception',label:'방문객 안내대',scenery:true,rx:1,ry:0,proxy:'entryPlacard'},
  {id:'hallDinnerLeft',x:8,y:13,kind:'table',label:'식탁과 사용한 식기',scenery:true,rx:1,ry:0},
  {id:'hallWaitingTable',x:28,y:9,kind:'table',label:'대기용 탁자',scenery:true,rx:1,ry:0},
  {id:'hallDinnerRight',x:28,y:17,kind:'table',label:'가려진 식탁',scenery:true,rx:1,ry:0},
  {id:'hallPianoSurface',x:5,y:19,kind:'piano',label:'오래된 피아노',scenery:true,rx:1,ry:0}
 ];
 SCRIPTS.hallDinnerLeft=[
  T('식탁에 흰 접시가 놓여 있었다. 칼과 포크는 가지런했지만 식기 안쪽에는 먼지가 내려앉아 있었다.'),
  T('누군가 식사를 마친 자리는 아니었다.')
 ];
 SCRIPTS.hallWaitingTable=[
  T('탁자 위에는 번호가 적힌 종이컵과 안내장이 있었다.'),
  T('자리마다 종이컵은 있었지만 마신 흔적은 거의 보이지 않았다.')
 ];
 SCRIPTS.hallDinnerRight=[
  T('식탁보가 낮게 늘어져 있었다. 아래에는 의자 다리와 바닥의 오래된 흠집이 보였다.'),
  T('더 살펴볼 만한 것은 없다.')
 ];
 SCRIPTS.hallPianoSurface=[J('pianoTune')];
 if(SCRIPTS.entryPlacardNew){
  SCRIPTS.entryPlacardNew.unshift(T('방문객 안내대 위에 두꺼운 접수 명부가 펼쳐져 있었다. 낡은 펜과 날짜 도장이 옆에 놓여 있었다.'));
 }
})();

function drawReadableHallProp(kind,x,y){
 if(kind!=='hallReception')return false;
 const stamp=(xx,yy,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(xx),Math.round(yy),w,h)};
 const good=drawRasterProp('desk',x,y);
 if(!good){
  // Fallback keeps separated legs, drawers and wooden inlays; never a solid box.
  shadow(x,y,48);
  stamp(x-38,y-34,76,9,'#261d22');
  stamp(x-36,y-36,72,5,'#665042');
  stamp(x-32,y-32,64,9,'#745745');
  stamp(x-32,y-24,64,3,'#b28d62');
  for(const dx of [-28,21]){
   stamp(x+dx,y-20,10,26,'#2c2429');
   stamp(x+dx+2,y-19,6,22,'#6e5245');
   stamp(x+dx+2,y+3,6,3,'#231e26');
  }
  stamp(x-20,y-20,40,12,'#3a2929');
  stamp(x-17,y-18,34,8,'#715543');
  stamp(x-3,y-15,6,2,'#b49a6a');
 }
 // A thin open register and a tiny metal service bell help identify the desk.
 // They are built from 1-2px details over the same wood sprite.
 stamp(x-17,y-49,38,3,'#221c25aa');
 stamp(x-17,y-53,18,11,'#d7c7a4');
 stamp(x+1,y-53,17,11,'#bfb190');
 stamp(x-1,y-53,2,10,'#776956');
 for(let i=0;i<4;i++){
  stamp(x-14,y-50+i*2,11-i,1,i%2?'#77746f':'#8a7c67');
  stamp(x+4,y-50+i*2,10-i,1,'#867760');
 }
 stamp(x+23,y-46,13,2,'#1d1a20');
 stamp(x+26,y-53,8,7,'#8c7650');
 stamp(x+27,y-55,6,3,'#c5aa6e');
 stamp(x+29,y-57,2,2,'#e4d09b');
 // A red ink stamp is a small accent, not a glowing interaction marker.
 stamp(x-12,y-42,9,2,'#9f655e');
 return true;
}
function drawHallThreshold(){
 if(s.room!=='prom')return;
 const door=MAPS.prom.objects.find(o=>o.id==='exitProm');
 if(!door)return;
 const x=door.x*TS+16-camera.x,y=door.y*TS+16-camera.y;
 const p=(xx,yy,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(xx),Math.round(yy),w,h)};
 // A narrow raised threshold under the door, with a worn central strip.
 p(x-25,y-4,50,3,'#392d32');
 p(x-23,y-4,46,1,'#988368');
 p(x-18,y-1,36,2,'#3a3437');
 for(let i=0;i<6;i++)p(x-18+i*7,y-3,3,1,'#655445');
}
