'use strict';
// Run from repository root: node tests/story-continuity-regression.test.js
// Guards the final loaded story, not overwritten first-pass definitions.
// Old event IDs are intentionally retained to support v1 save restoration.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const modules=[
 'story.js','facility-revision.js','mansion-route.js','paradise-lore.js',
 'fasting-room.js','evidence-puzzles.js','detective-route.js',
 'pixel-polish.js','observation-polish.js','capture-cinematic.js',
 'story-continuity.js','prop-readability.js','facility-tone.js',
 'ritual-readability.js','dormitory-furnishings.js','tactile-puzzles.js',
 'case-board.js','pursuit-polish.js','companion-rescue.js',
 'companion-investigation.js','companion-relationships.js',
 'companion-banter.js','companion-reactivity.js','companion-tension.js','route-backtrack.js'
];
const world=new Function(modules.map(read).join('\n')+
 '\nreturn {MAPS,SCRIPTS,ENDINGS,REQUIRED_PARTY,COMPANION_REACTIONS,COMPANION_ACTION_REACTIONS,COMPANION_TENSION_PROFILES};')();
const {MAPS,SCRIPTS,ENDINGS,REQUIRED_PARTY,
 COMPANION_REACTIONS,COMPANION_ACTION_REACTIONS,COMPANION_TENSION_PROFILES}=world;
const oldFantasy=/외계인|슬라임|UFO|하치와레|치이카와|오데|브리아노|프롬 파티|두부지|댄스 타임/;
assert.equal(Object.keys(MAPS).length,14,'The authored game should have 14 areas');
assert.equal(REQUIRED_PARTY.join(','),'kim,jubin,changwon,nasol,patient05');
const labels=Object.values(MAPS).flatMap(map=>[map.name,map.mission,...map.objects.map(o=>o.label)]).join('\n');
assert(!oldFantasy.test(labels),'Old fantasy-game text remains in active map labels');
const currentScenes=[
 'intro','man','bone','mirror','cat','exitProm','landingDoor','nurse',
 'bathExit','backroom','button','rewrite','chaseIntro','rescued',
 'family','wake','clock','finalChoice','happyReveal','bestReveal','truthReveal'
];
for(const scene of currentScenes){
 assert(SCRIPTS[scene],'Missing live story scene: '+scene);
 const content=SCRIPTS[scene].map(node=>[node.say,node.choice].filter(Boolean).join(' ')).join('\n');
 assert(!oldFantasy.test(content),'Old fantasy-game dialogue in '+scene);
}
assert(!SCRIPTS.intro.some(n=>/개발 안내|임시로 남아|개편 중/.test(n.say||'')),
 'Development placeholder leaked into playable prologue');
assert(SCRIPTS.rescued.some(n=>n.op==='flag'&&n.key==='refugeReached'),
 'Human escape route does not mark refuge arrival');
assert(!SCRIPTS.rescued.some(n=>n.op==='flag'&&n.key==='ufoDone'),
 'Legacy UFO flag should not be written by new playthroughs');
assert(MAPS.wreck.objects.some(o=>o.id==='refugeServiceDoor'),'No return route from refuge');
assert(MAPS.loop.objects.some(o=>o.id==='loopServiceDoor'&&o.need==='refugeReached'),'Backtrack shortcut is open before pursuit');
assert(SCRIPTS.finalChoice.some(n=>n.options?.some(o=>o.to==='returnToRefuge')),'Final room cannot return to missing evidence');
assert(SCRIPTS.returnToRefuge?.some(n=>n.op==='room'&&n.room==='wreck'),'Final return does not reach refuge');
assert(!MAPS.wreck.props.some(([kind])=>kind==='ufo'),
 'Old UFO furniture remained in the refuge');
assert(!SCRIPTS.danceIntro.some(n=>n.mini),
 'Retired dance minigame should not be playable');
for(const [id,e] of Object.entries(ENDINGS)){
 assert(!oldFantasy.test(e.type+' '+e.title+' '+e.text+' '+e.hint),
  'Legacy ending presentation: '+id);
}
const links=[];
for(const [scene,nodes] of Object.entries(SCRIPTS))for(const n of nodes){
 if(n.jump)links.push([scene,n.jump]);
 if(n.branch)links.push([scene,n.yes],[scene,n.no]);
 if(n.op==='allParty')links.push([scene,n.yes],[scene,n.no]);
 if(n.choice)for(const option of n.options)links.push([scene,option.to]);
}
for(const [from,to] of links)assert(SCRIPTS[to],'Broken dialogue route: '+from+' -> '+to);
assert.equal(COMPANION_REACTIONS.length,35,'Missing ambient/action reactions');
assert.equal(COMPANION_ACTION_REACTIONS.length,16,'Missing action reactions');
assert.equal(Object.keys(COMPANION_TENSION_PROFILES).length,5,'Missing character psychology');
const html=read('index.html');
for(const module of modules){
 const pattern='src="'+module+'?';
 assert(html.includes(pattern),'Missing module from HTML: '+module);
}
assert(html.indexOf('companion-reactivity.js')<html.indexOf('companion-tension.js'),
 'Tension layer must load after reactions');
assert(html.indexOf('companion-tension.js')<html.indexOf('game.js'),
 'Tension layer must load before game runtime');
const engine=read('game.js');
assert(engine.includes('f.refugeReached||f.ufoDone'),
 'Old v1 save flag is no longer recognized');
assert(engine.includes("s.flags.ufoDone||['wreck','bedroom','annex05'].includes(s.room)"),'Old escape saves are not migrated');
assert(engine.includes("const STORE='hepdalsu-neighbors-v1'"),
 'Save namespace must not silently change');
console.log(JSON.stringify({passed:true,areas:Object.keys(MAPS).length,
 storyLinksChecked:links.length,endingCount:Object.keys(ENDINGS).length,
 companionReactions:COMPANION_REACTIONS.length},null,2));
