'use strict';
// Human-staff stealth for the loop corridor and grounded pursuit visuals.
// Runs before game.js; no new map destinations or saved-game schema changes.
const LOOP_WATCH_ROUTE=[[27,12],[27,8],[20,8],[21,12]];
function validLoopWatchStep(x,y){
 const m=MAPS.loop;
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<1||y<3||x>=m.w-1||y>=m.h-1)return false;
 if(collision('loop').has(x+','+y))return false;
 return !m.objects.some(o=>o.x===x&&o.y===y&&!o.hide&&!['mark','book','pen','ghostcat'].includes(o.kind));
}
function loopWatchPath(ax,ay,bx,by){
 const start=[Math.round(ax),Math.round(ay)],goal=[Math.round(bx),Math.round(by)];
 if(!validLoopWatchStep(...goal))return [];
 const q=[start],parent=new Map([[start.join(','),null]]);
 for(let i=0;i<q.length;i++){
  const [x,y]=q[i],k=x+','+y;
  if(x===goal[0]&&y===goal[1]){
   const route=[];let current=k;
   while(parent.get(current)){
    route.push(current.split(',').map(Number));current=parent.get(current);
   }
   return route.reverse();
  }
  for(const [dx,dy] of Object.values(DIRS)){
   const nx=x+dx,ny=y+dy,key=nx+','+ny;
   if(parent.has(key)||!validLoopWatchStep(nx,ny))continue;
   parent.set(key,k);q.push([nx,ny]);
  }
 }
 return [];
}
function ensureLoopWatch(){
 if(s.room!=='loop'||!s.flags.dalsuEncounter)return null;
 let w=s.loopWatcher;
 if(!w||!Number.isFinite(w.x)||!Number.isFinite(w.y)||!Array.isArray(w.path)||!Number.isFinite(w.grace)){
  w=s.loopWatcher={x:27,y:12,face:'left',mode:'patrol',grace:4.5,
   alert:0,lost:0,route:1,replan:0,path:[],stepSound:0,seenNotice:false};
 }
 return w;
}
function loopWatchLineClear(ax,ay,bx,by){
 const distance=Math.hypot(bx-ax,by-ay);
 const steps=Math.max(1,Math.ceil(distance*5));
 for(let i=1;i<steps;i++){
  const x=Math.round(ax+(bx-ax)*i/steps),y=Math.round(ay+(by-ay)*i/steps);
  if(!validLoopWatchStep(x,y))return false;
 }
 return true;
}
function loopWatchCanSee(w,x=s.x,y=s.y){
 const dx=x-w.x,dy=y-w.y,d=Math.hypot(dx,dy);
 if(d>6.3)return false;
 if(d>1.1){
  const dir=DIRS[w.face]||DIRS.left;
  if((dx*dir[0]+dy*dir[1])/d<.35)return false;
 }
 return loopWatchLineClear(w.x,w.y,x,y);
}
function tickLoopWatch(dt){
 if(!started||ended||paused||s.room!=='loop'||s.script||!s.flags.dalsuEncounter)return;
 const w=ensureLoopWatch();
 w.grace=Math.max(0,w.grace-dt);
 const seen=w.grace===0&&loopWatchCanSee(w);
 if(seen){
  if(w.mode==='patrol'){w.mode='alert';w.path=[];w.replan=0}
  w.lastX=s.x;w.lastY=s.y;w.lost=0;w.alert=Math.min(1,w.alert+dt*1.25);
  if(w.alert>=1&&w.mode!=='chase'){
   w.mode='chase';w.path=[];w.replan=0;
   notify('허달수가 이쪽을 봤다! 모퉁이를 돌아 시야를 끊자.',2.8);
   sound(158,.12,'square',.032);
  }else if(w.mode==='alert'&&!w.seenNotice&&w.alert>.25){
   w.seenNotice=true;notify('구두 굽 소리가 멎었다. 누군가 지켜보고 있다.',2.2);
  }
 }else{
  w.alert=Math.max(0,w.alert-dt*.95);
  if(w.alert===0){w.seenNotice=false;if(w.mode==='alert'){w.mode='patrol';w.path=[];w.replan=0}}
  if(w.mode==='chase'){
   w.lost+=dt;
   if(w.lost>3.5){
    w.mode='patrol';w.path=[];w.replan=0;w.alert=0;
    notify('발소리가 멀어진다. 잠시 시야에서 벗어났다.',2.6);
   }
  }
 }
 // Capture is non-terminal: no records, companions or solved puzzles are lost.
 if(w.mode==='chase'&&w.grace===0&&Math.hypot(s.x-w.x,s.y-w.y)<.85){
  const caught=(w.caught||0)+1;
  setRoom('loop',3,6);
  s.loopWatcher={x:27,y:12,face:'left',mode:'patrol',grace:8,alert:0,lost:0,
   route:1,replan:0,path:[],stepSound:0,caught,seenNotice:false};
  keys={};path=[];pathTarget=null;moveDelay=0;
  idle();autoSave();
  notify('허달수가 출입구 쪽으로 돌려보냈다. 조사 기록은 그대로다.',4.5);
  sound(130,.22,'square',.035);
  return;
 }
 if(w.mode==='alert')return;
 w.replan-=dt;
 if(w.replan<=0&&Math.abs(w.x-Math.round(w.x))<.09&&Math.abs(w.y-Math.round(w.y))<.09){
  let target;
  if(w.mode==='chase'&&Number.isFinite(w.lastX))target=[w.lastX,w.lastY];
  else{
   target=LOOP_WATCH_ROUTE[w.route%LOOP_WATCH_ROUTE.length];
   if(Math.hypot(w.x-target[0],w.y-target[1])<.2){
    w.route=(w.route+1)%LOOP_WATCH_ROUTE.length;
    target=LOOP_WATCH_ROUTE[w.route];
   }
  }
  const route=loopWatchPath(w.x,w.y,...target);
  w.path=route;w.replan=w.mode==='chase'?.18:.4;
 }
 if(w.path.length){
  const [tx,ty]=w.path[0],dx=tx-w.x,dy=ty-w.y,d=Math.hypot(dx,dy);
  const speed=w.mode==='chase'?2.85:1.35;
  w.face=Math.abs(dx)>=Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  if(d<=speed*dt){w.x=tx;w.y=ty;w.path.shift()}
  else{w.x+=dx/d*speed*dt;w.y+=dy/d*speed*dt}
 }
 w.stepSound=(w.stepSound||0)+dt;
 if(w.stepSound>(w.mode==='chase'?.56:1.05)&&Math.hypot(w.x-s.x,w.y-s.y)<9){
  w.stepSound=0;
  sound(w.mode==='chase'?82:72,.09,'triangle',w.mode==='chase'?.028:.013);
 }
}
function drawFacilityGuard(x,y,face='right'){
 if(typeof drawAtlasSprite==='function'&&drawAtlasSprite('guard',x,y,face))return;
 if(typeof drawRemasterSprite==='function'&&drawRemasterSprite('guard',x,y,face))return;
 // A recognizably human worker, not the old supernatural robe sprite.
 const r=(a,b,w,h,color)=>rect(a,b,w,h,color);
 shadow(x,y,34);
 cx.save();cx.translate(Math.round(x),Math.round(y));cx.scale(2,2);
 r(-7,-4,5,4,'#151922');r(3,-4,5,4,'#151922');
 r(-6,-12,5,9,'#353d45');r(2,-12,5,9,'#353d45');
 r(-8,-25,17,14,'#525d60');r(-6,-22,12,9,'#404d53');
 r(-9,-23,4,11,'#303d44');r(7,-23,4,11,'#303d44');
 r(-9,-12,4,3,'#b89d88');r(8,-12,3,3,'#b89d88');
 r(-4,-25,2,11,'#a9aa99');r(2,-25,2,11,'#727c72');
 r(-6,-35,13,11,'#ae947e');r(-7,-37,15,5,'#252b2e');
 r(-9,-34,4,6,'#2c3336');r(7,-34,3,6,'#2c3336');
 r(-9,-40,19,5,'#323a3e');r(-6,-43,13,5,'#4e5556');
 r(1,-42,3,2,'#9c9f95');
 if(face==='left')r(-7,-31,4,2,'#171d22');
 else if(face==='right')r(4,-31,3,2,'#171d22');
 else if(face==='down'){r(-4,-31,2,2,'#1d2123');r(3,-31,2,2,'#1d2123')}
 else r(-6,-34,13,6,'#2d3539');
 // Flashlight: small metal head and short cone of stepped pixel highlights.
 r(7,-19,6,4,'#2b3031');r(11,-19,3,3,'#c6b59a');
 cx.restore();
}
// A restrained pixel dither shows the patrol's line of sight, not a glowing cone.
function drawLoopWatchVision(){
 if(s.room!=='loop'||!s.flags.dalsuEncounter||s.script)return;
 const w=ensureLoopWatch(),dir=DIRS[w.face]||DIRS.left;
 for(let y=Math.max(3,Math.floor(w.y-6));y<=Math.min(14,Math.ceil(w.y+6));y++){
  for(let x=Math.max(1,Math.floor(w.x-6));x<=Math.min(30,Math.ceil(w.x+6));x++){
   const dx=x-w.x,dy=y-w.y,d=Math.hypot(dx,dy);
   if(d<1||d>5.8||(dx*dir[0]+dy*dir[1])/d<.49)continue;
   if(!validLoopWatchStep(x,y)||!loopWatchLineClear(w.x,w.y,x,y))continue;
   const px=x*TS-camera.x,py=y*TS-camera.y;
   const tone=w.mode==='chase'?'#bd655144':w.mode==='alert'?'#c6a37636':'#c7ba8d22';
   for(let i=0;i<3;i++){
    const ax=4+((x*5+y*3+i*7)%23),ay=4+((x*7+y*11+i*13)%22);
    rect(px+ax,py+ay,3,2,tone);
   }
  }
 }
}
function drawLoopWatchEntity(){
 const w=s.room==='loop'&&!s.script&&s.flags.dalsuEncounter?ensureLoopWatch():null;
 if(!w)return null;
 return {kind:'loopWatcher',x:w.x*TS+16,y:w.y*TS+16,face:w.face};
}
function drawInvestigationPursuitHUD(){
 if(paused||ended||!started||s.script)return;
 let title='',detail='',level=0;
 if(s.room==='loop'&&s.flags.dalsuEncounter){
  const w=ensureLoopWatch();
  if(!w)return;
  level=w.mode==='chase'?3:w.alert>.45?2:w.alert>.05?1:0;
  title=w.grace>0?'복도 · 발소리':level===3?'허달수 · 추적 중':level===2?'허달수 · 시선 감지':level===1?'누군가 지켜본다':'복도 · 순찰 중';
  detail=level===3?'모퉁이를 돌아 시야를 끊자':w.grace>0?'잠시 이동할 수 있다':'구두 소리와 시선을 살피자';
 }else if(s.room==='ward'&&!s.flags.melted&&s.wardPatrol){
  level=s.wardPatrol.guards.some(g=>g.mode==='chase')?3:
    s.wardPatrol.guards.some(g=>g.mode==='alert')?2:0;
  title=level===3?'시설 직원 · 추격 중':level===2?'시설 직원 · 의심 중':'병동 · 순찰 중';
  detail=wardHidden()?'커튼 뒤 · 숨은 상태':level>0?'시야를 벗어나자':'직원의 시선과 이동 경로를 살피자';
 }else if(s.room==='chase'&&s.flags.chaseActive&&s.chase){
  const distance=s.x-s.chase.x;
  level=distance<6?3:distance<11?2:1;
  title=level===3?'직원 바로 뒤에 있다!':'연결 통로 · 추격 중';
  detail='오른쪽 비상문까지 · 가구를 피해 달리자';
 }else return;
 // Rectangular 2px-edged interface to match the authored pixel assets.
 const x=327,y=11,w=299,h=39;
 rect(x,y,w,h,'#12141ae8');rect(x+2,y+2,w-4,h-4,'#272933e8');
 rect(x+5,y+5,3,29,level===3?'#b86854':level===2?'#be9b63':'#7d877c');
 txt(title,x+150,y+17,'#e2d5bd',12);
 txt(detail,x+150,y+31,'#b3b4ad',9);
 for(let i=0;i<3;i++)rect(x+11+i*12,y+7,8,4,i<level?'#cf9674':'#54595c');
}
function drawChaseFootfallDetails(){
 if(s.room!=='chase'||!s.flags.chaseActive)return;
 const chase=s.chase;if(!chase)return;
 const cx0=chase.x*TS+16-camera.x,cy0=chase.y*TS+16-camera.y;
 for(let i=0;i<3;i++){
  const xx=cx0-15-i*18,yy=cy0+3+(i%2)*5;
  if(xx<-30||xx>670)continue;
  rect(xx,yy,7,2,'#a79c875a');rect(xx+2,yy+2,4,1,'#453c3a80');
 }
 const distance=s.x-chase.x;
 if(distance<6){rect(0,0,7,384,'#873e3e99');rect(633,0,7,384,'#873e3e99')}
 else if(distance<11){rect(0,0,3,384,'#78464255');rect(637,0,3,384,'#78464255')}
}
