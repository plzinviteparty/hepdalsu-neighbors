'use strict';
// Dormitory visual continuity: replace fantasy props and repeated chair stacks
// while preserving the 50x30 maze, its stage-ordered scripts and all existing
// scenery IDs (old saves depend on them).
(()=>{
 const m=MAPS.backroom;
 const locker=m.props.find(p=>p[0]==='fireplace'&&p[1]===6&&p[2]===24);
 const sink=m.props.find(p=>p[0]==='bath'&&p[1]===26&&p[2]===10);
 if(locker)locker[0]='dormLockers';
 if(sink)sink[0]='dormWashstand';
 // Each changed item occupies the same footprint as a chairPile. The maze
 // walls and existing exits are not altered.
 const replacements={
  '2,11':'dormCrates','7,17':'dormLaundry','2,26':'dormLockers',
  '7,4':'dormCrates','12,11':'dormCot','17,17':'dormLinen',
  '12,26':'dormTrunk','17,4':'dormLockers','22,11':'dormLaundry',
  '27,17':'dormCot','22,26':'dormCrates','27,4':'dormTrunk',
  '32,11':'dormControl','37,17':'dormLockers','32,26':'dormLaundry',
  '37,4':'dormCrates','42,11':'dormCovered','47,17':'dormTrunk',
  '42,26':'dormCovered','47,4':'dormLinen',
  '6,19':'dormLinen','16,27':'dormTrunk','23,12':'dormCrates',
  '26,26':'dormLaundry','36,4':'dormControl','46,17':'dormCovered'
 };
 let changed=0;
 for(const entry of m.props){
  if(entry[0]!=='chairPile')continue;
  const name=replacements[entry[1]+','+entry[2]];
  if(name){entry[0]=name;changed++;}
 }
 const names={
  dormLockers:'번호 붙은 철제 사물함',
  dormWashstand:'공동 세면대',
  dormCrates:'접수 물품 상자',
  dormLaundry:'사용한 세탁물 바구니',
  dormCot:'간이 침상',
  dormLinen:'접힌 침구 더미',
  dormTrunk:'개인 짐가방',
  dormControl:'생활 점검 기록판',
  dormCovered:'천으로 덮인 가구'
 };
 const sampleNumber=(x,y)=>['12','18','31'][(x*3+y)%3];
 for(const s of SCENERY.backroom){
  const p=m.props.find(e=>e[1]===s.x&&e[2]===s.y);
  if(!p)continue;
  if(!names[p[0]])continue;
  const kind=p[0],number=sampleNumber(s.x,s.y);
  s.kind=kind;
  s.label=names[kind]+(kind==='dormLockers'?' · '+number+'번':'');
  const dialogue={
   dormLockers:[
    T('벽에 붙은 낡은 사물함은 숫자로만 구분되어 있었다. '+number+'번 문에 작은 녹 자국이 번졌다.'),
    T('문틈으로 접힌 흰옷과 슬리퍼가 보였다. 이름표는 없었다.')
   ],
   dormWashstand:[
    T('여러 사람이 함께 쓰던 긴 세면대였다. 수도꼭지는 세 개지만 가운데 것만 손잡이가 헐거웠다.'),
    T('거울 아래에는 「세면 후 물기를 닦을 것. 개인컵은 지정번호에 보관할 것」이라는 종이가 붙어 있었다.')
   ],
   dormCot:[
    T('간이 침대의 시트는 바짝 말라 있었다. 발치의 번호표가 한 번 떼었다 붙인 듯 구겨져 있다.'),
    T('사용자가 떠난 뒤에도 침구만 정리해 둔 것 같다.')
   ],
   dormLinen:[
    T('담요와 여벌 시트가 가지런히 접혀 있었다. 몇 장에는 손으로 적은 숫자가 남아 있다.'),
    T('세탁된 천인데도 눅눅한 냄새가 났다.')
   ],
   dormLaundry:[
    T('바구니에는 흰색 합숙복과 수건이 뒤섞여 있었다. 밑부분에는 물 얼룩이 말라붙었다.'),
    T('세탁물에도 사람 이름 대신 구역 번호가 적혀 있었다.')
   ],
   dormCrates:[
    T('종이상자에는 합숙복, 종이컵, 청소도구라는 낡은 물품 표가 붙어 있었다.'),
    T('상자 하나가 반쯤 찌그러져 있었지만 내용물은 모두 정해진 방향으로 정리돼 있었다.')
   ],
   dormTrunk:[
    T('개인용 짐가방이다. 잠금장치는 풀려 있지만 안에는 빈 봉투만 남아 있었다.'),
    T('자신의 물건을 챙겨 떠났는지, 누군가 대신 비웠는지는 알 수 없다.')
   ],
   dormControl:[
    T('관리 기록판의 날짜 아래에 점호, 세면, 복약 확인란이 줄지어 있었다.'),
    T('모든 칸을 같은 필체가 채웠다. 사물함 숫자는 보이지만 입소자의 이름은 적혀 있지 않다.')
   ],
   dormCovered:[
    T('큰 가구에 거친 천이 씌워져 있었다. 천 아래로 서랍 손잡이와 다리의 실루엣이 보였다.'),
    T('한쪽은 오래 전에 밀어 놓은 듯 바닥에 끌린 자국이 남아 있다.')
   ]
  }[kind];
  SCRIPTS[s.id]=dialogue;
 }
 // Small architectural clues, placed off the main route.
 m.props.push(['dormRuleboard',8,6],['dormNumberBoard',33,7]);
 SCENERY.backroom.push(
  {id:'dormRuleboardNote',x:8,y:6,kind:'dormRuleboard',label:'공동생활 수칙표',scenery:true,rx:1,ry:0},
  {id:'dormNumberBoardNote',x:33,y:7,kind:'dormNumberBoard',label:'점호·복약 번호 기록판',scenery:true,rx:1,ry:0}
 );
 SCRIPTS.dormRuleboardNote=[
  T('종이에 「취침 전 점호, 세면 후 정리, 개인 보관함 잠금 확인」이라는 수칙이 적혀 있었다.'),
  T('공동생활이라는 말 아래에는 「불필요한 외부 연락을 삼간다」는 조항이 덧붙어 있다.')
 ];
 SCRIPTS.dormNumberBoardNote=[
  T('번호 12, 18, 31이 여러 번 반복됐다. 생활 물품과 점호 순번을 관리하는 목록이었다.'),
  T('병동에서 보았던 환자 관리번호와 비슷한 방식이지만, 이 표만으로 같은 사람인지 단정할 수는 없다.')
 ];
 m.mission='반복되는 방을 구분하며 생활용품과 점호 기록을 조사하자';
})();

function drawDormitoryArt(kind,x,y){
 if(s.room!=='backroom'||!kind.startsWith('dorm'))return false;
 if(kind==='dormCot')return drawRasterProp('bed',x,y);
 const ink='#25212a',shadowCol='#302a30',rust='#81594c',brown='#5f483e',
  warm='#9a7b57',lit='#c3a67a',iron='#606467',ironLight='#9a9b8e',
  fabric='#9b9483',cream='#cbc3ab',ivory='#e0d6c1',moss='#5c675c';
 const p=(xx,yy,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(xx),Math.round(yy),w,h)};
 const grain=(xx,yy,w,h,seed,col=cream,steps=35)=>{
  for(let i=0;i<steps;i++){
   const gx=xx+((seed*11+i*31+i*i*7)%Math.max(2,w-3));
   const gy=yy+((seed*23+i*19+i*i*3)%Math.max(2,h-2));
   p(gx,gy,i%7===0?3:1,1,i%3===0?'#261b2445':col+'5c');
  }
 };
 const stud=(xx,yy)=>{p(xx,yy,4,4,ink);p(xx+1,yy+1,2,2,lit);p(xx+1,yy+1,1,1,ivory)};
 shadow(x,y,kind==='dormWashstand'?56:kind==='dormLockers'?43:33);
 cx.save();cx.imageSmoothingEnabled=false;cx.translate(Math.round(x),Math.round(y));
 switch(kind){
 case 'dormLockers':{
  // Three ventilated doors, numbers, handles and a slightly ajar compartment.
  p(-35,-80,70,83,ink);p(-33,-78,66,79,'#5d5b55');
  for(let i=0;i<3;i++){
   const bx=-31+i*22;
   p(bx,-74,20,70,ink);p(bx+2,-73,17,67,i===1?'#63584d':'#73716a');
   p(bx+3,-72,2,64,ironLight);p(bx+16,-72,2,64,shadowCol);
   for(let j=0;j<6;j++){
    p(bx+7,-63+j*3,8,1,ink);
    p(bx+8,-62+j*3,6,1,'#989083');
   }
   p(bx+4,-69,10,7,cream);p(bx+5,-68,8,2,lit);
   for(let j=0;j<3;j++)p(bx+6+j*2,-65,1,2,ink);
   p(bx+14,-31,2,11,ink);p(bx+14,-31,2,5,lit);
   grain(bx+4,-57,12,45,1+i,cream,20);
   stud(bx+2,-11);
  }
  p(-35,0,70,4,ink);p(-30,3,12,3,shadowCol);p(17,3,12,3,shadowCol);
  p(-10,-8,3,8,'#c1a889');p(-9,-7,1,6,ivory);
  break;
 }
 case 'dormWashstand':{
  // Wall plumbing, three separate taps, three distinct porcelain basins.
  p(-51,-78,102,57,ink);p(-49,-76,98,54,'#756d61');
  p(-45,-73,90,47,'#867f70');p(-43,-71,86,42,'#4b5658');
  p(-41,-68,81,2,'#abb1a6');grain(-42,-65,83,34,5,'#bdc2b8',36);
  p(-55,-30,110,15,ink);p(-52,-29,104,11,'#a8aca4');
  p(-52,-27,104,2,ivory);
  for(let i=0;i<3;i++){
   const bx=-36+i*35;
   p(bx-14,-23,28,14,ink);p(bx-12,-22,24,11,'#d3d4c7');
   p(bx-8,-20,16,6,'#858f8b');p(bx-3,-19,6,4,'#2e3738');
   p(bx-4,-44,8,18,ink);p(bx-3,-43,6,16,iron);
   p(bx-7,-46,14,4,ironLight);p(bx-7,-47,14,2,ivory);
   p(bx+2,-40,2,8,'#a8a9a3');
  }
  p(-46,-15,9,20,'#64665e');p(37,-15,9,20,'#64665e');
  p(-41,-4,7,3,ink);p(35,-4,7,3,ink);
  grain(-48,-28,97,10,18,cream,18);
  break;
 }
 case 'dormLinen':{
  p(-36,-22,72,23,ink);p(-33,-23,65,18,'#6b695f');
  for(let i=0;i<4;i++){
   const yy=-19-i*12,w=65-i*7,left=-Math.round(w/2);
   p(left-2,yy-10,w+4,14,ink);
   p(left,yy-10,w,12,i%2?fabric:'#ada38e');
   p(left+3,yy-9,w-6,2,cream);
   p(left+3,yy-3,w-7,2,'#6c7169');
   for(let k=0;k<6;k++)p(left+5+k*7,yy-4,2,2,i%2?cream:'#5c645f');
   grain(left+5,yy-8,w-9,8,3+i,cream,15);
  }
  break;
 }
 case 'dormLaundry':{
  p(-31,-40,62,40,ink);p(-29,-37,58,34,'#8c7459');
  p(-30,-40,60,7,lit);
  for(let i=0;i<9;i++){
   p(-27+i*7,-34,3,30,brown);
   for(let j=0;j<5;j++)p(-27+i*7,-30+j*6,6,1,'#bea782');
  }
  p(-26,-48,24,15,cream);p(-21,-52,27,18,'#a0a49a');
  p(1,-52,21,18,'#d2c8b4');p(3,-49,17,2,ivory);
  p(-18,-44,10,3,'#74665a');
  p(-32,-4,64,5,ink);p(-28,-3,56,2,lit);
  grain(-24,-31,48,25,17,cream,28);
  break;
 }
 case 'dormCrates':{
  const box=(bx,by,w,h,seed)=>{
   p(bx-2,by-2,w+4,h+4,ink);p(bx,by,w,h,'#7b6347');
   p(bx+2,by+2,w-4,3,'#b99a69');p(bx+2,by+h-4,w-4,2,brown);
   p(bx+4,by+7,w-8,7,cream);
   for(let i=0;i<3;i++)p(bx+7,by+9+i*2,w-16-i*4,1,'#5f5950');
   p(bx+w/2-3,by,6,h,'#ab8e67');
   grain(bx+2,by+2,w-5,h-5,seed,cream,23);
  };
  box(-32,-35,64,33,2);box(-23,-61,48,28,4);
  p(-8,-62,13,4,lit);p(20,-35,10,3,lit);
  break;
 }
 case 'dormTrunk':{
  p(-34,-35,68,39,ink);p(-31,-33,62,36,brown);
  p(-29,-31,58,8,'#8f735e');
  p(-32,-18,64,4,ink);p(-30,-16,60,2,lit);
  for(const bx of [-25,18]){
   p(bx,-33,9,34,ink);p(bx+2,-32,5,31,warm);
   p(bx+3,-31,2,28,lit);
  }
  p(-9,-35,18,5,ink);p(-7,-38,14,6,iron);
  p(-3,-17,6,9,lit);p(-2,-16,4,6,shadowCol);
  p(-31,2,9,4,ink);p(22,2,9,4,ink);
  grain(-20,-28,40,23,8,cream,28);
  break;
 }
 case 'dormControl':
 case 'dormRuleboard':
 case 'dormNumberBoard':{
  const broad=kind==='dormControl';
  const wide=broad?62:74,height=broad?65:52,left=-Math.round(wide/2);
  p(left,-height-12,wide,height+11,ink);
  p(left+3,-height-9,wide-6,height+5,brown);
  p(left+5,-height-7,wide-10,height+1,'#c1b398');
  p(left+8,-height-5,wide-16,5,'#877969');
  for(let i=0;i<6;i++){
   const yy=-height+4+i*8;
   p(left+8,yy,wide-16,1,'#8b7e70');
   p(left+11,yy+2,13,3,i%2?'#727466':'#807e72');
   for(let j=0;j<3;j++)p(left+28+j*10,yy+2,5,3,i===3&&j===1?rust:'#988d7b');
  }
  p(left+9,-height-11,9,6,'#a07c5d');p(left+wide-20,-height-10,9,6,'#947c61');
  grain(left+6,-height+2,wide-12,height-7,11,cream,29);
  break;
 }
 case 'dormCovered':{
  // The drape reveals dresser legs and a drawer outline beneath the fabric.
  p(-35,-34,70,40,ink);
  p(-32,-31,64,8,brown);p(-30,-24,60,23,shadowCol);
  p(-29,-14,5,20,brown);p(25,-14,5,20,brown);
  p(-26,-19,52,9,'#67574c');
  p(-25,-17,48,2,'#a38d71');
  p(-31,-55,62,31,'#8e8b7e');
  p(-29,-57,58,33,fabric);p(-25,-59,48,7,cream);
  p(-27,-48,12,33,'#b2a897');p(-14,-46,7,32,'#706f68');
  p(6,-47,5,35,cream);p(19,-47,8,33,'#706b66');
  for(let i=0;i<5;i++)p(-21+i*10,-54,3,25,i%2?cream:'#857b72');
  grain(-25,-53,49,31,15,cream,37);
  break;
 }
 default:cx.restore();return false;
 }
 cx.restore();return true;
}
