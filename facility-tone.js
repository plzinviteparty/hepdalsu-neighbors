'use strict';
// Readability and pixel-density pass for the medical, maintenance, refuge and
// laboratory rooms. Existing rich PNG beds/desks/chairs/doors are deliberately
// left alone; these drawings replace ONLY the formerly flat placeholder props.
// Source-scale 1px hatching, bevels, rusty screws, etched labels and shadow
// planes avoid the oversized single-color rectangles that broke the art style.
(()=>{
 const ward=MAPS.ward,bath=MAPS.bath,wreck=MAPS.wreck,lab=MAPS.research;
 // Reuse the detailed original PNG furniture in rooms where it makes sense.
 const change=(m,match,kind)=>{
  const p=m.props.find(x=>x[0]===match[0]&&x[1]===match[1]&&x[2]===match[2]);
  if(p)p[0]=kind;
 };
 // A clinical pump belongs in a maintenance room, not an unmade hospital bed.
 change(bath,['bed',21,18],'facilityPump');
 const bedDescription=(SCENERY.bath||[]).find(o=>o.x===21&&o.y===18);
 if(bedDescription){
  bedDescription.kind='facilityPump';bedDescription.label='배수 펌프 장치';
  SCRIPTS[bedDescription.id]=[
   T('배관 옆 펌프가 낮은 소리를 내며 진동했다. 하부 배수관에 이물질이 낀 듯했다.'),
   T('가동 표시등은 켜져 있지만 배수량은 일정하지 않았다. 밸브를 조절해야 할 것 같다.')
  ];
 }
 // The old ornate dining table looked like a foreign object inside the refuge.
 change(wreck,['table',14,7],'desk');
 const refugeSurface=(SCENERY.wreck||[]).find(o=>o.x===14&&o.y===7);
 if(refugeSurface){
  refugeSurface.kind='desk';refugeSurface.label='작업 서류 책상';
  SCRIPTS[refugeSurface.id]=[T('작업대에 출입 내역을 펼쳐 놓았던 자국이 남아 있다. 서류마다 담당자 도장이 찍혀 있었다.')];
 }
 // File archives are much more readable than a bed beside the research terminal.
 change(lab,['bed',7,5],'facilityArchive');
 const archiveDetail=(SCENERY.research||[]).find(o=>o.x===7&&o.y===5);
 if(archiveDetail){
  archiveDetail.kind='facilityArchive';archiveDetail.label='연구 기록 보관 캐비닛';
  SCRIPTS[archiveDetail.id]=[T('번호별로 정리된 캐비닛이다. 서랍 대부분은 잠겨 있다. 이곳은 환자를 치료하는 방보다 자료를 보관하는 방에 가깝다.')];
 }
 // Previously this was an unsupported "box" kind; it showed a shadow only.
 const supplies=bath.objects.find(o=>o.id==='waterDelivery');
 if(supplies)supplies.kind='facilitySupplies';
 // Standalone investigation records now have distinct paper silhouettes.
 for(const id of ['record','investorNote','reporterTreatment','filingMarks']){
  const o=ward.objects.find(o=>o.id===id);if(o)o.kind='facilityFolder';
 }
 for(const id of ['recruitmentNote','projectRecord']){
  const o=lab.objects.find(o=>o.id===id);if(o)o.kind='facilityFolder';
 }
 const file=wreck.objects.find(o=>o.id==='family');
 if(file)file.kind='facilityFolder';
 const record=wreck.objects.find(o=>o.id==='accidentLedger');
 if(record)record.kind='facilityLedger';
 const locker=wreck.objects.find(o=>o.id==='detectiveLocker');
 if(locker)locker.kind='facilityLocker';
})();

function drawFacilityArt(kind,x,y,time=0){
 const room=s.room;
 const active=['ward','bath','wreck','research'].includes(room);
 const specialized=['facilityPump','facilityArchive','facilitySupplies','facilityFolder','facilityLedger','facilityLocker','caseCabinet','caseCart','caseWaste','caseIndex','caseLedger','caseLocker'];
 if(!active||(!['monitor','pipe','box'].includes(kind)&&!specialized.includes(kind)))return false;
 const border='#242831',outer='#3c4145',iron='#56616a',steel='#738189',
  lit='#a4aea6',ivory='#cbc3ac',bronze='#a58c67',rust='#835e55',
  panel='#4d5558',shade='#30383c',ink='#33393b';
 const p=(xx,yy,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(xx),Math.round(yy),Math.round(w),Math.round(h))};
 // Repeatable 1px texture: visible scratches, chipped paint and edge grit.
 const grain=(xx,yy,w,h,seed,tint=lit,count=34)=>{
  for(let i=0;i<count;i++){
   let px=((i*37+seed*11+i*i*7)%(Math.max(1,w-3)))+xx;
   let py=((i*19+seed*23+i*i*3)%(Math.max(1,h-2)))+yy;
   p(px,py,i%7===0?3:i%4===0?2:1,1,i%5===0?rust+'77':tint+'42');
  }
 };
 const rivet=(xx,yy)=>{p(xx,yy,3,3,border);p(xx+1,yy,1,1,ivory);p(xx+2,yy+2,1,1,shade)};
 const metal=(xx,yy,w,h,seed=1)=>{
  p(xx,yy,w,h,border);p(xx+2,yy+2,w-4,h-4,steel);p(xx+3,yy+3,w-6,2,lit);
  p(xx+w-5,yy+3,2,h-7,shade);p(xx+3,yy+h-5,w-6,2,shade);
  grain(xx+5,yy+5,w-10,h-10,seed);
 };
 const screen=(xx,yy,w,h,seed)=>{
  p(xx,yy,w,h,border);p(xx+3,yy+3,w-6,h-6,'#263942');
  p(xx+4,yy+4,w-8,2,'#718789');p(xx+w-6,yy+4,2,h-9,'#172832');
  for(let i=0;i<3;i++){
   let len=Math.max(5,w-18-(i*6+seed*3)%(Math.max(6,w-22)));
   p(xx+7,yy+8+i*5,len,2,i===1?'#a7b5a0':'#799e99');
  }
  p(xx+7,yy+h-7,w-20,1,'#45636e');
 };
 const book=(xx,yy,w,h,seed=1)=>{
  p(xx,yy,w,h,'#26272c');p(xx+2,yy+2,w-4,h-4,ivory);
  p(xx+2,yy+2,4,h-4,'#9a927b');p(xx+w-4,yy+4,2,h-7,'#ded5bd');
  for(let i=0;i<4;i++)p(xx+9,yy+7+i*5,w-19-i*2,1,i%2?'#9b9184':'#6e7776');
  if(seed%2)p(xx+w-14,yy+4,7,3,rust);
 };
 shadow(x,y,kind==='facilityPump'?75:kind==='facilityArchive'||kind==='facilityLocker'?55:35);
 cx.save();cx.imageSmoothingEnabled=false;cx.translate(Math.round(x),Math.round(y));
 switch(kind){
 case 'monitor':{
  // CRT display with actual side depth, adjustable stand, vents and key labels.
  metal(-26,-59,52,42,3);
  p(-22,-55,42,32,'#222d35');screen(-19,-52,36,24,2);
  for(let i=0;i<7;i++)p(20,-50+i*4,3,2,i%2?iron:shade);
  p(-7,-17,14,13,outer);p(-11,-5,22,3,iron);p(-23,-2,46,5,border);
  p(-19,-1,38,2,steel);p(16,-13,3,3,bronze);rivet(-22,-58);rivet(20,-58);
  break;
 }
 case 'pipe':{
  // Pipes have curved elbows, clamps, oxidation and distinct metallic ridges.
  p(-8,-58,18,64,border);p(-6,-56,14,60,iron);
  p(-5,-56,3,60,lit);p(4,-56,2,60,shade);
  p(-15,-39,30,12,border);p(-14,-38,28,9,steel);
  p(-12,-37,25,2,lit);p(-11,-30,24,2,shade);
  for(let i=0;i<4;i++)p(-10,-52+i*15,18,1,'#81918b');
  grain(-5,-56,11,55,6,lit,18);rivet(-13,-35);rivet(10,-35);
  break;
 }
 case 'facilityFolder':{
  // A loose paper folio, not a rectangular floating button.
  p(-16,-13,34,17,border);p(-14,-16,29,15,'#bcae8c');
  p(-17,-18,31,17,ivory);p(-14,-17,27,2,'#ded4bd');
  for(let i=0;i<4;i++)p(-13,-12+i*3,19-i*3,1,'#77736d');
  p(6,-17,6,4,'#8b6658');p(-14,-4,8,2,bronze);
  break;
 }
 case 'facilitySupplies':{
  // Two stacked cardboard cartons, a kraft-paper label and three bottles.
  p(-35,-21,70,23,border);
  p(-32,-20,64,18,'#806b54');p(-31,-19,62,2,'#b49c76');
  grain(-30,-18,60,16,2,'#c6ae81',35);
  p(-36,-41,52,22,border);p(-34,-39,48,18,'#8b765e');
  p(-34,-39,48,2,'#b7a282');
  p(-24,-36,24,9,'#d0c6ae');p(-21,-34,18,2,'#77776e');
  for(let i=0;i<3;i++){let bx=14+i*10;p(bx-5,-40,9,17,'#829e99');p(bx-4,-42,7,3,'#d3d1bd');p(bx-3,-38,5,10,'#b1c2bb');p(bx-5,-29,9,2,'#ded5b8')}
  p(-17,-21,2,18,'#bca487');p(12,-21,2,18,'#bca487');
  break;
 }
 case 'facilityPump':{
  // Low maintenance pump: visible electric motor, pipe loops and control wheel.
  p(-47,-23,91,27,border);p(-44,-21,85,23,shade);
  p(-42,-18,26,14,iron);p(-40,-16,22,10,steel);
  for(let i=0;i<8;i++)p(-37+i*3,-16,1,10,shade);
  metal(-16,-42,38,40,5);
  p(-12,-35,30,24,outer);p(-9,-33,22,3,lit);
  for(let i=0;i<5;i++)p(-9,-27+i*4,25,1,i%2?steel:shade);
  p(16,-55,14,35,border);p(18,-53,10,31,steel);p(20,-51,3,27,lit);
  p(22,-63,7,12,iron);p(21,-65,9,4,shade);
  p(-2,-46,5,9,bronze);p(1,-51,3,6,'#cbb692');
  p(27,-15,10,10,bronze);p(30,-12,4,4,shade);
  for(let i=0;i<3;i++)rivet(-32+i*27,-2);
  break;
 }
 case 'facilityArchive':
 case 'facilityLocker':
 case 'caseCabinet':
 case 'caseIndex':
 case 'caseLocker':{
  // High-density filing cabinet: separate raised drawer fronts, labels, locks,
  // scuffed bevels and two stable feet (not a rectangular flat gray mass).
  const wide=kind==='facilityLocker'||kind==='caseLocker';
  const ww=wide?62:49,hh=wide?78:81,x0=-Math.round(ww/2);
  metal(x0,-hh,ww,hh,7);
  p(x0+4,-hh+6,ww-8,hh-11,'#455058');
  const drawers=wide?4:5,dH=Math.floor((hh-20)/drawers);
  for(let i=0;i<drawers;i++){
   const yy=-hh+10+i*dH;
   p(x0+6,yy,ww-12,dH-3,border);
   p(x0+8,yy+2,ww-16,dH-7,'#647279');
   p(x0+9,yy+3,ww-18,1,lit);
   grain(x0+11,yy+4,ww-23,dH-11,11+i,'#e1dac7',8);
   p(x0+12,yy+4,17,6,'#b7aa8d');p(x0+14,yy+6,12,1,shade);
   p(x0+ww-16,yy+5,9,4,shade);p(x0+ww-14,yy+6,5,2,bronze);
  }
  p(x0+2,-3,9,5,border);p(x0+ww-11,-3,9,5,border);
  rivet(x0+3,-hh+2);rivet(x0+ww-7,-hh+2);
  break;
 }
 case 'facilityLedger':
 case 'caseLedger':{
  p(-22,-33,44,31,border);p(-20,-31,40,27,steel);
  p(-18,-29,36,6,'#4e5b63');
  book(-21,-52,43,24,1);p(-16,-49,32,2,ivory);
  p(8,-29,7,5,bronze);
  for(let i=0;i<4;i++)p(-15,-16+i*3,24-i*2,1,shade);
  break;
 }
 case 'caseCart':{
  p(-29,-53,58,7,border);p(-27,-52,54,4,steel);p(-25,-52,50,1,lit);
  p(-26,-46,5,48,iron);p(21,-46,5,48,iron);
  p(-25,-27,50,6,border);p(-22,-25,44,2,steel);
  p(-25,-7,50,7,border);p(-23,-5,46,3,steel);
  for(const dx of [-24,19]){p(dx,1,10,7,border);p(dx+2,2,6,5,steel)}
  for(let i=0;i<3;i++){let xx=-19+i*13;p(xx,-68,8,15,'#53656c');p(xx+1,-70,6,3,ivory);p(xx+2,-63,4,7,'#97b1a9');p(xx+1,-58,6,2,ivory)}
  p(14,-64,10,12,'#c3bba5');p(15,-63,8,2,ivory);
  grain(-22,-24,43,16,4,ivory,16);
  break;
 }
 case 'caseWaste':{
  p(-15,-31,30,7,border);p(-13,-35,26,4,steel);
  p(-12,-27,24,31,outer);p(-10,-25,20,27,steel);p(8,-24,2,24,shade);
  p(-6,-19,12,10,ivory);p(-4,-17,8,2,rust);
  for(let i=0;i<5;i++)p(-9+i*4,-4,1,5,shade);
  grain(-9,-24,18,24,17,lit,18);
  break;
 }
 default:cx.restore();return false;
 }
 cx.restore();return true;
}
