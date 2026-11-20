'use strict';
// Pixel-art readability for the passage and the prayer room.
// Do not replace the existing raster doors, furniture or crawler sprites.
(()=>{
 const corridor=MAPS.loop;
 const sign=corridor.props.find(p=>p[0]==='sign'&&p[1]===21&&p[2]===3);
 if(sign)sign[0]='corridorSign';
 const signScenery=(SCENERY.loop||[]).find(o=>o.kind==='sign'&&o.x===21);
 if(signScenery){
  signScenery.kind='corridorSign';
  signScenery.label='중복된 출입구 안내판';
  SCRIPTS[signScenery.id]=[
   T('안내판에는 지하 배관실, 공동생활관, 연구실이 서로 다른 방향으로 적혀 있었다.'),
   T('페인트 밑으로 지워진 화살표가 보였다. 복도 끝의 출입문 번호도 두 번 덧칠돼 있었다.')
  ];
 }
 const ledger=corridor.objects.find(o=>o.id==='maintenanceLog');
 if(ledger)ledger.kind='corridorLedger';
 const passage=corridor.objects.find(o=>o.id==='backroom');
 if(passage)passage.kind='corridorWallpaper';
 // Fasting room: a missing "box" image previously left a bare ground shadow.
 const offerings=MAPS.altar.objects.find(o=>o.id==='incidentMemo');
 if(offerings){
  offerings.kind='ritualOfferings';
  offerings.label='기도 · 배려 · 양보 봉헌함';
 }
 // The altar remains within the existing fixed chase geometry.
 const trial=MAPS.altar.objects.find(o=>o.id==='altarTrial');
 if(trial)trial.label='절식기도 안내대';
})();

function drawRitualReadability(kind,x,y){
 const inCorridor=s.room==='loop';
 const inAltar=s.room==='altar';
 if(!(inCorridor&&['corridorSign','corridorLedger','corridorWallpaper'].includes(kind))&&
    !(inAltar&&['ritualOfferings','altarTable','altarPillar','altarCandle'].includes(kind)))return false;
 const p=(a,b,w,h,color)=>{cx.fillStyle=color;cx.fillRect(Math.round(a),Math.round(b),w,h)};
 const colors={
  ink:'#22202a',dark:'#332d34',metal:'#5b5558',stone:'#716b70',stoneLight:'#9f9091',
  bone:'#c1b5a4',paper:'#cfc0a2',wood:'#554039',woodLight:'#91765b',
  brass:'#ac9062',moss:'#596155',oldBlood:'#694448',pale:'#e1d4b6'
 };
 const c=colors;
 const grains=(bx,by,w,h,seed,count=36,tint='#b2a99f')=>{
  for(let i=0;i<count;i++){
   const px=bx+((i*37+i*i*7+seed*17)%Math.max(2,w-2));
   const py=by+((i*29+i*i*11+seed*13)%Math.max(2,h-2));
   p(px,py,i%5===0?2:1,1,i%4===0?'#28212a55':tint+'5a');
  }
 };
 const stud=(xx,yy)=>{
  p(xx,yy,4,4,c.ink);p(xx+1,yy+1,2,2,c.brass);p(xx+1,yy+1,1,1,c.pale);
 };
 if(!['corridorSign','corridorWallpaper'].includes(kind))shadow(x,y,kind==='altarTable'?69:kind==='ritualOfferings'?62:42);
 cx.save();cx.translate(Math.round(x),Math.round(y));cx.imageSmoothingEnabled=false;
 switch(kind){
  case 'corridorSign':{
   // Three wayfinding strips are separated; dark bevels and painted arrows
   // keep the sign readable even at the game's 640x384 base resolution.
   p(-4,-83,9,83,c.ink);p(-2,-82,5,80,'#6d584c');p(-1,-81,1,78,c.woodLight);
   const tabs=[[-51,-36,42],[-19,-39,45],[-53,-2,44]];
   tabs.forEach(([tx,ty,w],i)=>{
    p(tx-2,ty-3,w+4,19,c.ink);
    p(tx,ty,w,15,i===1?'#6b5e53':'#766b5d');
    p(tx+1,ty+1,w-3,2,'#aca18a');
    p(tx+2,ty+4,w-5,10,'#514741');
    for(let a=0;a<3;a++)p(tx+8+a*7,ty+7,a===1?5:3,2,c.paper);
    if(i===1){p(tx+w-11,ty+6,7,2,c.brass);p(tx+w-7,ty+4,3,6,c.brass)}
    else{p(tx+4,ty+6,7,2,c.brass);p(tx+4,ty+4,3,6,c.brass)}
    grains(tx+4,ty+4,w-8,9,4+i,11,c.bone);
    stud(tx+2,ty+12);
   });
   break;
  }
  case 'corridorLedger':{
   // A physical maintenance ledger in a weathered metal tray.
   p(-21,-15,42,16,c.ink);p(-19,-13,38,11,c.metal);
   p(-18,-19,36,18,c.woodLight);
   p(-16,-22,33,19,c.paper);p(-14,-24,30,20,c.bone);
   p(-13,-22,28,2,c.pale);p(-13,-7,28,2,'#786c61');
   p(-10,-20,2,11,c.oldBlood);
   for(let i=0;i<5;i++){
    p(-6,-19+i*3,16-(i%2)*4,1,'#736c68');
    p(11,-19+i*3,3,1,'#98746a');
   }
   p(16,-8,7,3,c.brass);p(18,-11,2,3,c.ink);
   break;
  }
  case 'corridorWallpaper':{
   // Dark opening framed by visibly curling wallpaper and a wooden stud.
   p(-20,-90,38,89,'#24212c');
   p(-16,-89,29,85,'#0f1119');
   for(let i=0;i<6;i++)p(-16,-82+i*12,3,4,'#40343a');
   p(-23,-87,12,91,'#9a8b60');p(-20,-84,7,78,'#b9aa7c');
   p(-18,-80,2,75,'#766b52');
   p(12,-90,14,93,'#938664');
   p(15,-85,8,85,'#c0b08a');
   for(let i=0;i<6;i++){
    const yy=-87+i*13;p(12,yy,9,2,'#776a51');p(-22,yy+3,7,1,'#dbcc9c');
   }
   p(14,-63,5,13,'#312931');p(-22,-35,6,7,'#5d5144');
   grains(15,-80,6,66,9,17,c.bone);
   // A pale triangle of peeled paper conveys a lifting edge.
   p(-21,-88,14,8,'#c7b68e');p(-17,-80,9,5,'#9f8e6e');
   break;
  }
  case 'ritualOfferings':{
   // Three individually legible offering boxes, not one unmarked block.
   // Symbols refer to prayer, care and surrender without neon highlights.
   const starts=[-52,-17,18];
   for(let i=0;i<3;i++){
    const bx=starts[i],width=33;
    p(bx-1,-36,width+2,35,c.ink);
    p(bx+1,-34,width-2,31,'#584440');
    p(bx+3,-32,width-6,27,'#73564b');
    p(bx+3,-32,3,26,c.woodLight);p(bx+width-7,-32,3,26,'#332729');
    p(bx-3,-39,width+6,9,c.ink);
    p(bx-1,-38,width+2,6,'#97795a');
    p(bx,-38,width-1,2,'#c0a47b');
    p(bx+6,-34,width-12,3,'#30252a');
    p(bx+5,-24,width-10,16,c.paper);
    p(bx+7,-22,width-14,12,i===1?'#b6aa95':'#ccbea2');
    if(i===0){// folded hands / prayer glyph
     p(bx+14,-20,5,10,c.wood);p(bx+13,-18,7,2,c.brass);
     p(bx+16,-22,2,3,c.oldBlood);
    }else if(i===1){// crossed cloth bandage
     p(bx+11,-18,12,4,c.wood);p(bx+15,-22,4,12,c.oldBlood);
     p(bx+13,-17,8,2,c.pale);
    }else{// two opposed arrows for yielding
     p(bx+10,-20,13,2,c.wood);
     p(bx+10,-21,4,4,c.oldBlood);p(bx+19,-21,4,4,c.brass);
    }
    p(bx+4,-7,width-8,3,'#35282b');
    p(bx+3,-3,7,4,c.ink);p(bx+width-10,-3,7,4,c.ink);
    grains(bx+4,-30,width-8,17,6+i,16,c.bone);
    stud(bx+2,-37);stud(bx+width-6,-37);
   }
   break;
  }
  case 'altarTable':{
   // Keep the game's mature original desk PNG, which already has carved wood
   // details, rather than using the dinner-table graphic with food plates.
   if(drawRasterProp('desk',x,y)){
    // drawRasterProp receives world coordinates, so undo local translate.
    // The paper atop the table is then drawn at the same pixel scale.
    p(-31,-59,62,27,'#26222a');
    p(-29,-58,58,24,'#817160');
    p(-26,-57,52,20,c.paper);
    p(-23,-55,46,2,c.pale);
    for(let i=0;i<5;i++){
     p(-20+i*9,-47,6,6,c.wood);
     p(-18+i*9,-45,2,3,c.brass);
    }
    p(-24,-36,48,1,'#786d63');
    grains(-26,-56,51,19,12,22,c.bone);
   }
   break;
  }
  case 'altarPillar':{
   // Carved stone, with alternating planes, mortar wear and sacrificial cuts.
   p(-23,-96,46,92,c.ink);p(-19,-93,38,86,c.stone);
   p(-15,-90,8,80,c.stoneLight);
   p(-1,-90,11,80,'#5d545f');
   p(12,-90,5,80,'#3c3742');
   p(-26,-101,52,15,c.ink);p(-24,-99,48,11,c.stoneLight);
   p(-21,-97,42,2,c.bone);p(-26,-7,52,12,c.ink);
   p(-24,-6,48,7,'#6c626a');p(-22,-4,44,2,c.stoneLight);
   for(let i=0;i<4;i++){
    p(-18+i*11,-87,2,71,'#3a3540');
    p(-16+i*11,-85,1,66,'#a09498');
   }
   for(let i=0;i<5;i++)p(-20+i*9,-98,4,4,'#574e56');
   // Worn carvings, each with light and shadow along one edge.
   for(let i=0;i<6;i++){
    const yy=-78+i*10;
    p(-6,yy,13-(i%3)*3,1,'#36323b');
    p(-6,yy+1,11-(i%3)*3,1,'#b0a09b');
   }
   p(7,-69,2,18,c.oldBlood);
   p(7,-51,6,1,'#c2aaa0');
   grains(-18,-86,35,76,3,70,c.bone);
   break;
  }
  case 'altarCandle':{
   // Triple candle stand: actual candle shafts, wax streaks, iron holders.
   p(-5,-37,10,39,c.ink);p(-3,-35,6,35,'#736357');
   p(-22,0,44,6,c.ink);p(-20,0,40,3,c.metal);
   p(-16,-7,32,8,c.wood);p(-14,-6,28,3,c.brass);
   for(let i=0;i<3;i++){
    const xx=-15+i*15,h=22+(i%2)*6;
    p(xx-4,-h-15,8,h,c.ink);
    p(xx-3,-h-14,6,h-2,c.bone);
    p(xx-2,-h-13,2,h-5,c.pale);
    p(xx+2,-h+1,2,8,'#a79b85');
    p(xx-5,-15,10,4,c.metal);
    p(xx-1,-h-20,2,6,c.brass);
    p(xx-2,-h-23,4,5,'#edb875');
    p(xx-1,-h-22,2,3,'#ffe0a2');
   }
   stud(-17,-1);stud(14,-1);
   break;
  }
 }
 cx.restore();return true;
}
function drawCorridorFloorMarks(){
 if(s.room!=='loop')return;
 const stamp=(xx,yy,w,h,col)=>{cx.fillStyle=col;cx.fillRect(Math.round(xx-camera.x),Math.round(yy-camera.y),w,h)};
 // Very small path clues that read as architecture, not decorative glows.
 for(const [gx,gy,label] of [[4,4,'04'],[27,4,'04'],[5,10,'07']]){
  const x=gx*TS+16,y=gy*TS;
  stamp(x-9,y-21,18,15,'#28242c');
  stamp(x-7,y-20,14,12,'#746950');
  stamp(x-6,y-18,12,9,'#b5aa90');
  for(let i=0;i<2;i++)stamp(x-4+i*6,y-16,3,6,'#4c3e3d');
  stamp(x-5,y-12,11,1,'#655650');
 }
 for(let i=0;i<18;i++){
  const x=(i*73+17)%(MAPS.loop.w*TS-80)+40;
  const y=(i*97+21)%(MAPS.loop.h*TS-150)+110;
  stamp(x,y,3,1,'#25212b45');
  stamp(x+5,y+2,1,2,'#a49a7955');
 }
}
