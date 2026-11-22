'use strict';
// Optional post-pursuit backtracking prevents missed evidence from soft-locking
// patient 05 identification or final case reconstruction. The passage is closed
// until the player has legitimately reached the refuge.
(()=>{
 if(!MAPS.loop||!MAPS.wreck||!MAPS.bedroom)throw Error('Required journey maps are missing');
 const mappings=[
  {room:'wreck',id:'refugeServiceDoor',x:4,y:14,label:'잠금 해제된 점검 통로',
   to:'loop',arrival:[11,12],
   before:'대피실 옆에 좁은 점검 통로가 이어져 있다. 복도로 돌아가 미처 확인하지 못한 기록을 찾을 수 있겠다.',
   after:'순환 복도로 돌아왔다. 이미 해제한 점검 통로를 통해 대피실로 다시 갈 수 있다.'},
  {room:'loop',id:'loopServiceDoor',x:12,y:11,label:'비상 대피실 연결 통로',
   need:'refugeReached',to:'wreck',arrival:[5,14],
   before:'비상 대피실로 이어지는 좁은 통로다. 안쪽 출입문의 잠금이 해제되어 있다.',
   after:'비상 대피실로 돌아왔다. 별관과 최종 출입구가 이곳에서 이어진다.'}
 ];
 for(const d of mappings){
  if(MAPS[d.room].objects.some(o=>o.id===d.id)||SCRIPTS[d.id])throw Error('Duplicate service passage '+d.id);
  MAPS[d.room].objects.push(O(d.id,d.x,d.y,'door',d.label,d.need?{need:d.need}:{}));
  SCRIPTS[d.id]=[T(d.before),R(d.to,...d.arrival),T(d.after)];
  DOOR_ACTIONS[d.id]='들어가기';
  SCRIPTS['doorAsk_'+d.id]=[{choice:d.label,doorConfirm:true,options:[
   {text:'들어가기',to:'doorGo_'+d.id},
   {text:'머무르기',to:'doorStay'}]}];
  SCRIPTS['doorGo_'+d.id]=[{op:'enterDoor',id:d.id}];
 }
 const final=SCRIPTS.finalChoice?.find(n=>n.choice);
 if(!final||!Array.isArray(final.options))throw Error('Final escape menu unavailable');
 if(!final.options.some(o=>o.to==='returnToRefuge'))
  final.options.push({text:'대피실로 돌아가 남은 기록을 확인한다',to:'returnToRefuge'});
 SCRIPTS.returnToRefuge=[
  T('남은 자료를 확인한 다음 돌아오자.'),
  R('wreck',5,14),
  T('대피실의 점검 통로를 통해 앞서 지나온 구역에도 돌아갈 수 있다.')
 ];
 const end=SCRIPTS.rescued;
 if(!end?.some(n=>n.op==='flag'&&n.key==='refugeReached'))throw Error('Refuge transition is incomplete');
 end.push(T('대피실 옆의 점검 통로는 다시 순환 복도로 이어진다. 미처 찾지 못한 기록이 있다면 돌아갈 수 있을 것 같다.'));
})();
