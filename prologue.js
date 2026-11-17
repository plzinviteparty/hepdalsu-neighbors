'use strict';
// Dedicated pixel-art prologue plates. Rendered at the game's 640x384 logical resolution.
function drawProloguePlate(step,time,ctx){
 const W=640,H=384;
 const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const line=(x1,y1,x2,y2,c,w=1)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()};
 const poly=(points,c)=>{ctx.fillStyle=c;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()};
 const fog=(cy,opacity=.2)=>{for(let i=0;i<9;i++){const yy=cy+i*7,xx=((i*71+Math.sin(time*.13+i)*24)%810)-110;rect(xx,yy,250+(i%3)*40,6,'rgba(183,202,197,'+(opacity*(1-i/12))+')')}};
 const grain=(amount=1300)=>{for(let i=0;i<amount;i++){const x=(i*179+((i*i*13)%641))%640,y=(i*131+((i*i*7)%389))%384;rect(x,y,1+(i%3===0?1:0),1,i%5===0?'#b9c1ad12':'#02080d26')}};
 const pine=(x,y,s=1)=>{const h=105*s;rect(x-3*s,y-h*.4,6*s,h*.55,'#101d20');for(let k=0;k<4;k++){const yy=y-h+k*19*s;poly([[x,yy],[x-33*s+k*3*s,yy+54*s],[x+31*s-k*3*s,yy+54*s]],k%2?'#142629':'#172d2d')}};
 const vignette=()=>{const g=ctx.createRadialGradient(320,180,60,320,190,420);g.addColorStop(0,'#07090a00');g.addColorStop(.8,'#05070a40');g.addColorStop(1,'#020306d9');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)};
 const sky=(top,bottom)=>{const g=ctx.createLinearGradient(0,0,0,384);g.addColorStop(0,top);g.addColorStop(1,bottom);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)};
 const roadside=()=>{sky('#0c1723','#62706a');poly([[0,155],[85,132],[166,163],[268,124],[360,149],[480,125],[640,146],[640,384],[0,384]],'#172528');for(let i=0;i<15;i++)pine(i*52-15,166+(i*17%27),.75+(i%4)*.14);poly([[0,245],[640,214],[640,384],[0,384]],'#313e3d');poly([[0,301],[640,258],[640,384],[0,384]],'#354341');line(0,318,640,272,'#a2a9a044',4);for(let i=0;i<11;i++){const xx=i*72+7;line(xx,311-xx*.073,xx+32,309-(xx+32)*.073,'#d1c2a380',3)}for(let i=0;i<45;i++){const x=(i*47)%640,y=277+(i*17)%95;rect(x,y,8+i%5,1,i%2?'#9aaba027':'#101d2050')}};
 const car=(x,y,scale=1,crashed=false)=>{ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);poly(crashed?[[-89,12],[-74,-27],[-11,-48],[72,-18],[91,16],[80,33],[-78,33]]:[[-94,10],[-72,-29],[-21,-45],[61,-29],[93,10],[90,33],[-85,33]],'#18262c');poly([[-70,-22],[-24,-40],[54,-23],[71,5],[-81,5]],'#3c5157');poly([[-62,-17],[-23,-32],[-5,-10],[-64,-8]],'#68818b');poly([[-2,-33],[49,-22],[61,-6],[2,-8]],'#5b737a');rect(-89,12,177,23,'#263941');rect(-86,30,172,7,'#10191d');for(const xx of [-58,57]){rect(xx-21,23,42,21,'#10181a');rect(xx-13,29,26,24,'#080e11');rect(xx-6,35,12,13,'#536066')}rect(-87,8,18,9,'#bda77b');rect(68,8,18,9,'#b7a181');if(crashed){line(-10,-33,16,-11,'#0c1920',3);line(4,-34,20,-21,'#93a4a4',2);poly([[70,11],[91,17],[76,30]],'#172328')}ctx.restore()};
 const mansion=()=>{sky('#0b131c','#435352');for(let i=0;i<13;i++)pine(i*57-20,234+(i%3)*13,1.25);fog(175,.10);poly([[156,188],[163,104],[221,96],[234,140],[272,111],[383,111],[414,139],[425,96],[483,105],[489,193]],'#10191e');rect(177,176,290,124,'#283236');rect(212,142,214,155,'#36403d');rect(260,113,126,34,'#283037');poly([[247,112],[324,66],[401,112]],'#111b20');poly([[206,144],[318,92],[437,144]],'#1b2529');rect(296,222,52,75,'#11191c');rect(306,235,29,62,'#243033');for(const [x,y] of [[202,171],[256,171],[378,171],[426,171],[214,231],[400,231],[317,132]]){rect(x,y,18,32,'#0b151a');rect(x+2,y+2,14,27,x===378&&y===171?'#cfb978':'#263235');rect(x+8,y,2,30,'#171b1d');rect(x,y+15,18,2,'#171b1d')}for(let i=0;i<11;i++){rect(143+i*35,299,13,18,'#1b2627')}rect(139,310,374,8,'#161d1e');poly([[0,384],[260,304],[377,304],[640,384]],'#384442');for(let i=0;i<16;i++){const x=i*43;line(x,380,x+140,321,'#66736c26',1)}fog(248,.15);fog(307,.22)};
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(step<=1){roadside(); // windshield POV: hands, dash, wet glass
  poly([[0,0],[640,0],[640,384],[0,384],[0,0]],'rgba(8,13,18,0.08)');
  poly([[0,0],[88,0],[128,200],[0,322]],'#0c1217');poly([[640,0],[548,0],[518,204],[640,320]],'#0c1217');
  poly([[0,310],[132,283],[508,284],[640,310],[640,384],[0,384]],'#12191e');
  poly([[172,384],[196,334],[251,312],[380,312],[447,340],[463,384]],'#253037');
  ctx.strokeStyle='#10181e';ctx.lineWidth=15;ctx.beginPath();ctx.arc(320,373,77,Math.PI*1.09,Math.PI*1.91);ctx.stroke();
  for(let i=0;i<25;i++){const x=(i*151)%640,y=(i*89)%250;line(x,y,x-11,y+25,'#a9c1c65c',1);}
  const shake=step===1?Math.sin(time*45)*3:0;if(step===1){rect(0,0,640,384,'#a4b0b015');line(100+shake,58,340,280,'#e7eddb74',3);line(350,25,249,180,'#d0e1e085',2)}
 }else if(step===2){roadside();car(330,270,1.28,true);fog(180,.16);rect(0,0,640,384,'#0b131b38')}
 else if(step<=4){roadside();car(175,279,.9,true);fog(132,.32);fog(243,.29);for(let i=0;i<12;i++){const xx=(i*53+31)%640;rect(xx,335+(i%4)*12,17,2,'#9fb4ab25')}}
 else if(step<=7){mansion();if(step>=6){rect(0,0,640,384,'#070b1260');rect(270,195,100,150,'#11181966')}if(step===7){const g=ctx.createRadialGradient(320,210,1,320,210,460);g.addColorStop(0,'#15141400');g.addColorStop(1,'#060607d1');ctx.fillStyle=g;ctx.fillRect(0,0,640,384)}}
 else if(step===8){rect(0,0,640,384,'#050709')}
 else {sky('#171b20','#393b3b');rect(0,0,640,76,'#22262b');poly([[0,45],[640,45],[640,111],[0,90]],'#3e4546');rect(0,298,640,86,'#333535');for(let i=0;i<12;i++)line(i*55,299,230+i*20,384,'#60605c2d');rect(34,88,48,200,'#252c2e');rect(545,100,43,200,'#222a2e');rect(405,118,77,102,'#20282b');rect(414,132,57,75,'#63716b28');rect(93,120,88,122,'#2c3333');rect(106,132,63,94,'#141b20');rect(0,0,640,384,'#050b1438')}
 vignette();grain(1400);
 if(step===1){rect(0,0,640,384,'#c9d4c524')}
 if(step===7){const a=ctx.createLinearGradient(0,0,0,384);a.addColorStop(0,'#1a0b0b03');a.addColorStop(1,'#2c09093b');ctx.fillStyle=a;ctx.fillRect(0,0,640,384)}
 ctx.restore();
}
