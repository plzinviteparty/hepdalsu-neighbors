'use strict';
/*
 * Hand-authored 2px-grid characters (NOT cutouts or sheet crops).
 * All four directions share one anatomy, palette and grounded feet position.
 * These are shipped as resolution-independent nearest-neighbour pixel geometry.
 */
const REMASTER_PALETTES={
 guard:{outline:'#161b22',deep:'#242932',dark:'#333843',mid:'#4c515a',light:'#666974',
  trim:'#a9a298',metal:'#c4bca7',skin:'#d0afa1',skinShade:'#977869',hair:'#25232b',
  shoe:'#1b1c23',eye:'#28202a',glow:'#d3ba89'},
 patient05:{outline:'#24222a',deep:'#3b353e',dark:'#51444b',mid:'#b6a9a4',light:'#d6c7bb',
  trim:'#eee0d0',metal:'#e9d6bd',skin:'#e7c8bf',skinShade:'#b69391',hair:'#332d38',
  shoe:'#3f3336',eye:'#59414b',glow:'#c46f68'},
 dalsu:{outline:'#231a20',deep:'#3c2628',dark:'#512d2d',mid:'#783d3a',light:'#a75c4c',
  trim:'#a27a51',metal:'#c2a06d',skin:'#d6b3a0',skinShade:'#9d7867',hair:'#54423e',
  shoe:'#261e23',eye:'#433036',glow:'#d7ad61'}
};
function drawRemasterSprite(kind,x,y,face='down'){
 const palette=REMASTER_PALETTES[kind];if(!palette)return false;
 if(!cx||typeof cx.fillRect!=='function')return false;
 const p=palette,side=face==='left'||face==='right',back=face==='up';
 const tick=typeof frameTime==='number'?frameTime:0;
 const active=kind==='guard'||
   (kind==='patient05'&&s?.party?.includes('patient05'))||
   (kind==='dalsu'&&s?.room==='loop'&&!s?.script);
 const step=active?Math.floor(tick*7+(x+y)*.013)%2:0;
 const rise=active?step:0;
 const rr=(a,b,w,h,color)=>{cx.fillStyle=color;cx.fillRect(Math.round(a),Math.round(b),Math.round(w),Math.round(h));};
 const shade=(a,b,w,h)=>rr(a,b,w,h,p.deep);
 const front=()=>!back;
 cx.save();
 cx.translate(Math.round(x/2)*2,Math.round(y/2)*2);
 cx.scale(face==='left'?-2:2,2);
 // Stable center foot anchor; the art never shifts when facing changes.
 shadow(0,0,kind==='dalsu'?26:20);
 // Boots and two separately moving legs.
 const legL=active?(step?-2:1):0,legR=active?(step?1:-2):0;
 rr(-9+legL,-6,8,6,p.shoe);rr(2+legR,-6,8,6,p.shoe);
 rr(-9+legL,-4,9,3,p.outline);rr(2+legR,-4,9,3,p.outline);
 rr(-8+legL,-15,7,11,p.dark);rr(2+legR,-15,7,11,p.deep);
 rr(-7+legL,-14,2,7,p.mid);rr(3+legR,-14,2,7,p.mid);
 rr(-1,-16,3,14,p.outline);
 // Outer dark silhouette for sleeves, lapels and hem.
 rr(-11,-32+rise,22,20,p.outline);
 rr(-10,-31+rise,20,18,p.dark);
 rr(-13,-29+rise,4,18,p.outline);rr(10,-29+rise,4,18,p.outline);
 rr(-12,-28+rise,4,14,p.mid);rr(10,-28+rise,3,14,p.deep);
 rr(-12,-15+rise,5,5,p.skinShade);rr(10,-15+rise,4,5,p.skinShade);
 rr(-11,-15+rise,4,4,p.skin);rr(10,-15+rise,3,4,p.skin);
 if(kind==='guard'){
  rr(-9,-30+rise,18,17,p.mid);
  rr(-8,-29+rise,5,16,p.light);
  rr(3,-29+rise,5,16,p.dark);
  rr(-9,-20+rise,18,3,p.deep);
  rr(-7,-18+rise,14,2,p.trim);
  rr(-2,-20+rise,4,4,p.outline);
  rr(-2,-19+rise,4,2,p.metal);
  rr(-7,-26+rise,4,5,p.trim);
  rr(-6,-25+rise,3,3,p.dark);
  rr(6,-25+rise,4,5,p.trim);
  rr(7,-24+rise,2,2,p.glow);
  if(!back&&!side){rr(-2,-30+rise,4,12,p.deep);rr(-1,-26+rise,2,6,p.metal);}
  // Flashlight held in right hand.
  rr(12,-18+rise,4,5,p.outline);rr(13,-17+rise,3,3,p.metal);
  rr(15,-17+rise,2,2,p.glow);
 }else if(kind==='patient05'){
  // Hospital wrap tunic with gathered sleeves, not a dress or ghost sheet.
  rr(-11,-30+rise,22,21,p.mid);rr(-10,-30+rise,19,16,p.light);
  rr(-9,-29+rise,18,12,p.trim);
  rr(-10,-20+rise,20,4,p.light);
  rr(-10,-16+rise,20,5,p.mid);
  rr(-6,-29+rise,10,9,p.skinShade);rr(-5,-28+rise,9,8,p.trim);
  rr(-3,-26+rise,5,2,p.light);rr(-1,-24+rise,2,4,p.mid);
  rr(-6,-19+rise,12,2,p.skinShade);rr(-5,-18+rise,10,1,p.trim);
  rr(-11,-23+rise,3,9,p.mid);rr(10,-22+rise,3,8,p.light);
  rr(-11,-13+rise,4,2,p.trim);rr(-11,-13+rise,3,1,p.glow); // band
  rr(-8,-14+rise,15,2,p.light);
  if(side){rr(-2,-26+rise,8,4,p.mid);rr(-2,-23+rise,7,1,p.trim);}
 }else{
  // Heo Dalsu: broad wine-coloured coat, gold brocade waistcoat.
  rr(-12,-33+rise,24,21,p.mid);
  rr(-11,-32+rise,5,18,p.light);rr(6,-32+rise,5,18,p.dark);
  rr(-7,-31+rise,14,19,p.deep);
  rr(-5,-30+rise,10,16,p.trim);
  rr(-5,-28+rise,10,3,p.dark);
  for(let j=0;j<4;j++){rr(-4+(j%2)*5,-26+j*3+rise,3,1,j%2?p.metal:p.deep);}
  rr(-2,-30+rise,4,9,p.metal);rr(-1,-29+rise,2,8,p.dark);
  rr(-12,-19+rise,24,5,p.deep);rr(-12,-15+rise,24,4,p.mid);
  rr(-11,-15+rise,22,2,p.outline);
  rr(5,-27+rise,4,4,p.metal);rr(6,-26+rise,2,2,p.glow);
  rr(7,-18+rise,3,2,p.light);
 }
 // Face and haircut — no independent scaling between characters.
 const headY=kind==='dalsu'?-47:kind==='patient05'?-45:-46;
 const headW=kind==='dalsu'?19:18;
 const hx=-Math.round(headW/2);
 rr(hx-2,headY-1,headW+4,20,p.outline);
 rr(hx-1,headY,headW+2,18,p.hair);
 if(kind==='guard'){
  rr(-8,headY+8,16,11,p.skinShade);
  rr(-7,headY+8,14,10,p.skin);
  if(!back){rr(-5,headY+13,10,3,p.skinShade);rr(-4,headY+11,8,2,p.skin);}
  // Uniform cap with a visible reinforced brim in every direction.
  rr(-12,headY-5,24,7,p.outline);
  rr(-10,headY-7,20,4,p.mid);
  rr(-9,headY-7,18,2,p.light);
  rr(-13,headY-1,26,3,p.deep);
  rr(-2,headY-6,4,3,p.trim);rr(-1,headY-5,2,1,p.glow);
  if(!back){rr(side?2:-5,headY+11,side?3:2,2,p.eye);if(!side)rr(3,headY+11,2,2,p.eye);}
 }else if(kind==='patient05'){
  rr(-8,headY+5,16,15,p.skinShade);
  rr(-7,headY+6,14,13,p.skin);
  rr(-11,headY+2,21,7,p.hair);
  rr(-11,headY+7,4,11,p.hair);
  rr(7,headY+6,4,11,p.hair);
  rr(-11,headY+12,5,7,p.dark);
  if(back){rr(-8,headY+6,16,11,p.dark);rr(-7,headY+8,14,11,p.hair);}
  else if(side){
   rr(2,headY+12,3,2,p.eye);
   rr(6,headY+13,2,3,p.skinShade);
   rr(0,headY+17,5,1,p.skinShade);
  }else{
   rr(-6,headY+11,4,2,p.skinShade);rr(3,headY+11,4,2,p.skinShade);
   rr(-5,headY+12,3,2,p.eye);rr(3,headY+12,3,2,p.eye);
   rr(-4,headY+13,1,1,p.trim);rr(4,headY+13,1,1,p.trim);
   rr(-1,headY+17,3,1,p.skinShade);
  }
  rr(-7,headY+2,5,6,p.dark);rr(2,headY+2,6,7,p.hair);
 }else{
  // Elder hairline, weary lids, disturbing but subtle smile.
  rr(-10,headY+5,20,15,p.skinShade);
  rr(-9,headY+6,18,13,p.skin);
  rr(-11,headY+1,22,7,p.hair);
  rr(-9,headY-3,17,5,p.deep);
  rr(-8,headY-4,7,3,p.hair);
  rr(4,headY-2,6,4,p.trim);
  rr(-10,headY+8,3,8,p.hair);
  rr(8,headY+7,3,7,p.hair);
  if(back){rr(-9,headY+8,18,9,p.hair);rr(-7,headY+11,14,5,p.deep);}
  else if(side){
   rr(3,headY+12,4,2,p.eye);rr(5,headY+14,3,2,p.skinShade);
   rr(0,headY+17,7,1,p.dark);rr(3,headY+18,4,1,p.skinShade);
  }else{
   rr(-6,headY+11,5,2,p.hair);rr(2,headY+11,5,2,p.hair);
   rr(-5,headY+13,3,2,p.eye);rr(3,headY+13,3,2,p.eye);
   rr(-6,headY+16,3,1,p.skinShade);rr(5,headY+16,3,1,p.skinShade);
   rr(-3,headY+19,8,1,p.skinShade);
   rr(-2,headY+18,7,1,p.deep);
   rr(-1,headY+19,5,1,p.trim);
  }
 }
 cx.restore();
 return true;
}
