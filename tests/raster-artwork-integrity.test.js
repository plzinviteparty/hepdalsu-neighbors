'use strict';
// node tests/raster-artwork-integrity.test.js
// Confirms that real raster assets are committed and correctly wired into the game.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p));
const source=p=>read(p).toString('utf8');
const images=[
 {file:'art/intro-female-road-final.webp',w:1280,h:768,hash:'5136761cb3f07b478fe22eac03c5dc908d9153f82e245044547786dc6321a31e'},
 {file:'art/intro-female-mansion-final.webp',w:1280,h:768,hash:'9009a11626641d84892f6128f1d0406a7fdecfe0e12613fde7bdd92f80133fd8'},
 {file:'art/dalsu-encounter-final.webp',w:1280,h:768,hash:'05b044e942a5ae099e3031a94bd54f04f167f1b1289fb18afd56eb68c2e6ae43'},
 {file:'art/reporter-evidence-final.webp',w:720,h:720,hash:'b0436104332de1b0fb525c8ddc7d773ee74721202c9fb97aab5728b6ad637604'}
];
for(const im of images){
 const b=read(im.file);
 assert(b.length>20000,im.file+' unexpected small or empty image');
 assert.equal(b.toString('ascii',0,4),'RIFF',im.file+' missing RIFF header');
 assert.equal(b.toString('ascii',8,12),'WEBP',im.file+' not a WebP file');
 assert.equal(b.toString('ascii',12,16),'VP8 ',im.file+' unexpected codec');
 assert.equal(b.subarray(23,26).toString('hex'),'9d012a',im.file+' invalid VP8 frame');
 assert.equal(b.readUInt16LE(26)&0x3fff,im.w,im.file+' width mismatch');
 assert.equal(b.readUInt16LE(28)&0x3fff,im.h,im.file+' height mismatch');
 assert.equal(crypto.createHash('sha256').update(b).digest('hex'),im.hash,
  im.file+' changed; review the artwork before accepting new assets');
}
const game=source('game.js');
const prologue=source('prologue.js');
const raster=source('raster.js');
const puzzles=source('tactile-puzzles.js');
const css=source('style.css');
const html=source('index.html');
for(const name of images.map(i=>i.file)){
 assert(game.includes(name)||prologue.includes(name)||raster.includes(name)||puzzles.includes(name),
  'Uploaded image is not connected to game code: '+name);
}
assert(game.includes('cinematicArtwork=document.createElement('),
 'Cutscene image not mounted outside the pixelated canvas');
assert(game.includes("cinematicArtwork.src=CINEMATIC_ART[target]"),
 'Cutscene image source not connected to state changes');
assert(css.includes('object-fit:cover;image-rendering:auto;'),
 'Cutscene illustrations are subject to pixel scaling');
assert(puzzles.includes("const detectivePhotoImage='art/reporter-evidence-final.webp'"),
 'Photo evidence puzzle has reverted to placeholder SVG');
assert(puzzles.includes("b.style.backgroundImage="),'Photo fragments do not load image');
assert(html.includes('game.js?v=raster-art-1'),'Browser may load an old JS file');
assert(html.includes('tactile-puzzles.js?v=raster-art-1'),'Photo puzzle cache not refreshed');
for(const stale of ['art/intro-female-road.svg','art/intro-female-mansion.svg','art/dalsu-encounter-remaster.svg']){
 assert(!game.includes(stale),'Live cutscene reverted to old SVG: '+stale);
}
console.log(JSON.stringify({passed:true,realRasterAssets:images.length,
 totalImageBytes:images.reduce((v,i)=>v+read(i.file).length,0),imageDimensions:images.map(i=>[i.file,i.w,i.h])},null,2));
