'use strict';
// Visual polish pass: native crisp-edge pixel work for the detective chapter.
// Uses the same 2x logical canvas grid as existing sprites (82px character height).
(()=>{
  const m=MAPS.annex05;
  // The ordinary potted plant belongs to the old room layout, not a monitored ward.
  m.props=m.props.filter(([kind])=>kind!=='plant');
  m.props.push(
    ['caseCabinet',24,10],
    ['caseCart',10,9],
    ['caseCurtain',13,8],
    ['caseIV',20,11],
    ['caseNotice',6,4],
    ['caseWaste',24,16],
    ['caseCeilingLight',17,3],
    ['caseDivider',22,13],
    ['caseObservationGlass',13,4],
    ['caseRoomNumber',5,4],
    ['caseSink',25,16],
    ['caseWallVent',24,4]
  );
  m.mission='05번 병실을 조사하고 이관 기록과 환자의 진술을 확인하자';
  // Three key quest objects use physical furniture instead of floating book icons.
  MAPS.wreck.objects.find(o=>o.id==='detectiveLocker').kind='caseLocker';
  MAPS.wreck.objects.find(o=>o.id==='accidentLedger').kind='caseLedger';
  MAPS.annex05.objects.find(o=>o.id==='patientIndex').kind='caseIndex';
  const labels=[
    ['caseCabinet',24,10,'잠긴 약품장','낡은 약품장이다. 약병에는 관리번호만 남아 있다.'],
    ['caseCart',10,9,'이동식 처치대','바퀴에 녹이 슨 처치대다. 소독솜 봉투는 비어 있다.'],
    ['caseCurtain',13,8,'반쯤 닫힌 커튼','커튼 안쪽에 오래된 혈압 측정표가 걸려 있었다. 숫자는 대부분 지워져 있다.'],
    ['caseNotice',6,4,'별관 안내판','「관찰 대상자의 외부 출입은 담당자 승인 후 허가」라는 글씨가 적혀 있다.'],
    ['caseWaste',24,16,'의료 폐기물통','봉투 안에 사용한 거즈와 빈 포장재가 보인다. 별다른 단서는 없다.']
  ];
  for(const [kind,x,y,label,description] of labels){
    const id='annexScenery_'+kind;
    SCENERY.annex05.push({id,x,y,kind,label,scenery:true,rx:kind==='caseCurtain'?1:0,ry:0});
    SCRIPTS[id]=[T(description)];
  }
})();

function drawPatient05Pixel(x,y,face='down'){
 if(typeof drawAtlasSprite==='function'&&drawAtlasSprite('patient05',x,y,face))return;
 if(typeof drawRemasterSprite==='function'&&drawRemasterSprite('patient05',x,y,face))return;
  shadow(x,y,31);
  cx.save();
  cx.translate(Math.round(x/2)*2,Math.round(y/2)*2);
  cx.scale(2,2);
  const p=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x,y,w,h)};
  const outline='#262a35',hair='#303039',hairLight='#56515b',hairShade='#211f2a',
        skin='#e3c7b9',shadowSkin='#b48e8a',lightSkin='#f1dbca',
        gown='#82959b',gownLight='#a6b9b8',gownShade='#596f79',gownDeep='#405360';
  // Soft indoor shadow and slippers.
  p(-9,-4,7,4,outline);p(3,-4,7,4,outline);
  p(-8,-5,6,2,'#8c8587');p(4,-5,6,2,'#8c8587');
  // Bare ankles and rumpled trousers.
  p(-7,-15,6,12,'#6c828c');p(2,-15,6,12,gownShade);
  p(-5,-6,2,3,'#d0b5a9');p(4,-6,2,3,'#bfa39b');
  p(-8,-15,16,3,outline);
  // Loose, slightly oversized hospital gown, with offset fold.
  p(-12,-28,24,15,outline);
  p(-10,-27,20,13,gown);
  p(-8,-26,4,12,gownLight);p(7,-25,3,10,gownShade);
  p(-10,-17,19,2,gownShade);p(-7,-19,2,5,gownShade);p(3,-21,2,6,gownLight);
  p(-4,-27,3,10,gownLight);p(-1,-27,2,12,'#c0cac4');p(1,-23,2,6,gownDeep);
  // Sleeves & thin arms.
  p(-15,-26,5,11,outline);p(11,-26,5,11,outline);
  p(-14,-25,4,8,gownShade);p(11,-25,4,8,gown);
  p(-14,-17,4,6,skin);p(12,-17,4,6,shadowSkin);
  p(-14,-14,4,2,'#ddd2c1');p(12,-14,4,2,'#d5c9b9');
  // Patient bracelet with a single dark pixel identifying the tag.
  p(-15,-15,6,3,'#e2ddd1');p(-12,-15,2,2,'#53606b');
  // Collar and neck.
  p(-4,-31,8,5,shadowSkin);
  p(-6,-30,5,5,gownLight);p(1,-30,5,5,gownLight);
  p(-2,-28,4,3,skin);
  // Head: 4 separate directional faces instead of mirroring one sprite.
  if(face==='up'){
    p(-11,-44,22,16,hairShade);p(-10,-45,20,15,hair);
    p(-9,-40,18,9,hairLight);p(-7,-37,14,6,hair);
    p(-11,-34,5,8,hairShade);p(7,-34,4,8,hairShade);
    p(-4,-33,8,2,gownLight);p(-6,-40,12,2,'#393642');
    p(7,-42,3,4,'#665e67');
  }else if(face==='left'||face==='right'){
    const flip=face==='right';
    cx.save();
    if(flip)cx.scale(-1,1);
    p(-10,-42,19,15,hairShade);p(-9,-41,18,13,hair);
    p(-9,-37,16,11,shadowSkin);p(-9,-38,15,10,skin);
    p(-11,-41,6,8,hair);p(-10,-33,5,8,hairShade);
    p(-8,-42,13,4,hairLight);
    p(-10,-31,4,2,skin);p(-9,-35,2,2,outline);
    p(-9,-28,3,1,shadowSkin);p(6,-31,4,5,hairShade);
    p(-2,-41,9,2,hair);
    cx.restore();
  }else{
    p(-11,-42,22,15,hairShade);
    p(-9,-41,18,15,skin);p(-9,-39,18,5,lightSkin);
    p(-11,-44,22,8,hair);p(-9,-45,16,3,hairLight);
    p(-11,-41,6,14,hairShade);p(7,-42,5,15,hairShade);
    p(-8,-39,6,7,hair);p(1,-41,7,4,hair);
    p(-7,-33,3,2,outline);p(4,-33,3,2,outline);
    p(-6,-32,2,1,'#78646d');p(5,-32,1,1,'#78646d');
    p(-2,-29,4,1,shadowSkin);
    p(-7,-27,14,2,shadowSkin);
    p(8,-38,3,4,hairLight);
  }
  cx.restore();
}

// The supplemental props use 2px steps, muted shades and finite highlights.
// All are code-native canvased sprites, never CSS-rounded placeholder shapes.
function drawAnnexProp(kind,x,y){
  if(!kind.startsWith('case'))return false;
  const p=(xx,yy,w,h,color)=>{cx.fillStyle=color;cx.fillRect(Math.round(xx),Math.round(yy),w,h)};
  if(!['caseNotice','caseCeilingLight'].includes(kind))shadow(x,y,26);
  cx.save();cx.translate(Math.round(x/2)*2,Math.round(y/2)*2);cx.scale(2,2);
  const dark='#29343f',metal='#71878b',edge='#9caeaa',light='#c6c7b8',rust='#8d746d';
  switch(kind){
    case 'caseLocker':
      p(-20,-70,40,70,dark);p(-17,-67,34,64,'#6a787d');
      p(-15,-65,30,60,'#4b6069');
      p(-14,-65,2,58,edge);p(0,-65,2,59,dark);
      p(-11,-57,7,2,'#84918e');p(5,-57,7,2,'#84918e');
      p(-5,-37,3,8,'#c1bcab');p(4,-37,3,8,'#c1bcab');
      p(-13,-19,11,8,'#c6bfaa');p(-11,-17,7,2,'#887d6e');
      p(3,-19,10,8,'#a18f86');p(5,-17,6,2,'#695d59');
      p(-22,-3,44,5,'#2e3d45');break;
    case 'caseLedger':
      p(-19,-36,38,34,dark);p(-16,-32,32,26,'#677b7c');
      p(-15,-31,30,4,'#b1a995');
      p(-18,-39,36,8,'#8f8d7a');
      p(-13,-45,27,7,'#c5b99d');p(-8,-47,17,3,'#ded3b4');
      for(let i=0;i<4;i++)p(-9,-42+i*3,18-i*2,1,'#85766c');
      p(11,-17,3,7,edge);p(-20,-2,40,4,'#354851');break;
    case 'caseIndex':
      p(-17,-42,34,42,dark);p(-15,-39,30,37,'#667a7e');
      for(let i=0;i<3;i++){
       p(-13,-36+i*11,26,10,'#455861');
       p(-11,-35+i*11,22,3,'#899c9c');
       p(-5,-31+i*11,10,2,'#cec2a9');
      }
      p(-18,-3,36,4,'#303e49');break;
    case 'caseCabinet':
      p(-17,-46,34,45,dark);p(-15,-44,30,41,metal);
      p(-13,-42,26,36,'#485d66');p(-12,-40,24,2,edge);
      for(let i=0;i<3;i++){p(-11,-36+i*10,22,2,metal);p(-8,-34+i*10,4,6,'#b1aa9a');p(-3,-34+i*10,5,5,'#7d9b9b');p(5,-33+i*10,4,5,'#aa8e79')}
      p(11,-28,2,8,light);p(-17,-4,34,4,'#394a53');break;
    case 'caseCart':
      p(-15,-37,30,4,edge);p(-14,-33,28,6,metal);
      p(-14,-27,4,27,dark);p(10,-27,4,27,dark);
      p(-12,-20,24,3,metal);p(-12,-6,24,3,metal);
      p(-14,0,7,4,'#343d44');p(8,0,7,4,'#343d44');
      p(-10,-44,17,7,light);p(-7,-43,4,5,'#b7afa0');p(3,-43,4,5,rust);
      p(7,-36,5,3,'#9fa6a1');break;
    case 'caseCurtain':
      // Horizontal overhead rod with stained fabric folds.
      p(-36,-73,72,3,edge);
      for(let i=0;i<9;i++){p(-34+i*8,-70,7,62,i%2?'#5b7580':'#8da2a2');p(-33+i*8,-69,2,60,i%2?'#657f84':'#b0b8ad')}
      p(-34,-13,68,3,'#74878a');p(-19,-34,13,2,'#879493');
      p(14,-46,11,3,'#606c72');break;
    case 'caseIV':
      p(-2,-68,4,66,metal);p(-13,-68,26,3,edge);
      p(-12,-69,3,9,edge);p(9,-69,3,9,edge);
      p(5,-61,7,17,'#a8bbba');p(6,-60,5,13,'#d4d5cb');
      p(7,-59,3,4,'#8eaeb4');p(0,-44,10,2,'#536873');
      p(-12,-2,24,3,dark);p(-14,0,7,3,dark);p(8,0,7,3,dark);break;
    case 'caseNotice':
      p(-30,-66,60,45,dark);p(-27,-63,54,39,'#d1c5aa');p(-23,-59,46,4,'#887e76');
      for(let i=0;i<5;i++){p(-22,-50+i*5,42-(i%3)*8,2,'#847e76')}
      p(-27,-66,10,4,'#9e9c8b');p(19,-25,9,3,'#b19a89');break;
    case 'caseObservationGlass':{
      // Viewing window faces the monitored bed, with steel frame and
      // fluorescent reflections. Align to the original 2px pixel grid.
      p(-57,-70,114,51,dark);p(-54,-67,108,45,'#778a87');
      p(-51,-64,102,39,'#222f37');p(-48,-62,97,35,'#36474d');
      p(-42,-61,30,32,'#4c6262');p(-34,-57,11,25,'#607474');
      p(13,-60,22,31,'#566967');p(39,-58,5,28,'#839a90');
      p(-57,-47,114,4,'#2e4046');p(-4,-65,5,40,'#233037');
      p(-59,-69,118,4,'#92a19a');p(-60,-23,120,5,'#253641');
      for(let i=0;i<4;i++){p(-56+i*35,-69,4,3,'#222c34');p(-57+i*35,-23,4,4,'#222c34')}
      break;
    }
    case 'caseRoomNumber':{
      p(-18,-53,36,39,'#27333b');p(-16,-51,32,35,'#9b9c8d');
      p(-14,-49,28,31,'#444e53');p(-11,-47,23,27,'#b9b5a1');
      p(-9,-43,4,19,'#353d42');p(-9,-43,15,4,'#353d42');
      p(-9,-34,14,4,'#353d42');p(3,-34,4,10,'#353d42');
      p(-9,-24,16,4,'#353d42');p(9,-49,4,4,'#8b6f60');
      break;
    }
    case 'caseSink':{
      p(-22,-37,44,7,'#3b4950');p(-18,-40,36,8,'#9ba7a0');
      p(-17,-34,34,16,'#d5d7c9');p(-11,-31,22,8,'#aeb9b1');
      p(-18,-18,36,5,'#6a7d7e');p(-16,-13,32,13,'#5a6b70');
      p(-11,-10,23,3,'#83918c');p(-2,-43,4,10,'#617a80');
      p(-5,-45,10,3,'#bec4b7');p(-19,-3,38,4,'#34434a');
      break;
    }
    case 'caseWallVent':{
      p(-26,-57,52,30,'#26343c');p(-23,-54,46,24,'#8b9893');
      p(-20,-51,40,19,'#3b4b50');for(let i=0;i<5;i++)p(-18,-49+i*4,36,2,'#9bab9d');
      p(-24,-57,7,4,'#b4afa1');p(18,-30,5,4,'#43545a');
      break;
    }
    case 'caseWaste':
p(-11,-31,22,31,dark);p(-10,-28,20,27,'#64757a');
      p(-13,-33,26,6,edge);p(-7,-23,14,12,'#b09d83');p(-4,-21,8,8,'#746a66');
      p(-8,-4,16,2,'#36454a');break;
    case 'caseCeilingLight':
      p(-34,-76,68,9,'#5a6972');p(-30,-74,60,5,'#d9d7be');
      p(-29,-72,58,2,'#f1e7c7');p(-34,-67,68,2,'#87988e');break;
    case 'caseDivider':
      p(-2,-63,4,63,metal);p(-29,-61,58,2,edge);p(-27,-58,54,44,'#53636c');
      for(let i=0;i<5;i++){p(-25+i*11,-57,9,43,i%2?'#61737b':'#8d9c9b')}
      p(-27,-14,54,3,'#4b606a');p(-25,-2,8,3,dark);p(17,-2,8,3,dark);break;
    default:cx.restore();return false;
  }
  cx.restore();return true;
}
function drawAnnexFloorDetails(){
  if(s.room!=='annex05')return;
  const p=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x-camera.x),Math.round(y-camera.y),w,h)};
  // Stained grout, floor drain, luggage drag marks and a faint trail toward the chart.
  for(const [tx,ty] of [[7,15],[11,13],[16,16],[21,14],[22,9]]){
    const x=tx*TS,y=ty*TS;
    p(x+4,y+21,11,2,'#2639432f');p(x+17,y+8,8,2,'#bac4b018');
    p(x+23,y+23,3,3,'#35444a42');
  }
  p(8*TS+9,14*TS+13,17,15,'#45565b');
  for(let j=0;j<3;j++)p(8*TS+12,14*TS+16+j*4,11,2,'#202e36');
  for(let i=0;i<5;i++)p(20*TS+i*12,13*TS+i*4,8,2,'#3d4f5638');
}
function drawAnnexLighting(){
  if(s.room!=='annex05')return;
  const lx=17*TS+16-camera.x,ly=4*TS-camera.y;
  cx.save();
  cx.fillStyle='rgba(9,14,24,0.11)';cx.fillRect(0,0,640,384);
  const glow=cx.createRadialGradient(lx,ly,4,lx,ly,265);
  glow.addColorStop(0,'rgba(216,229,198,0.10)');
  glow.addColorStop(.55,'rgba(144,164,148,0.045)');
  glow.addColorStop(1,'rgba(28,36,43,0)');
  cx.fillStyle=glow;cx.fillRect(0,0,640,384);
  cx.restore();
}
