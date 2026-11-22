# 허달수의 다정한 이웃들

도로 사고와 기억상실에서 시작하는 1인칭 조사형 미스터리·호러 방탈출 게임. 기존 《후두부가 웃는군》의 정적 웹 게임을 별도 저장소로 복제한 뒤, 낙원의 샘과 허달수, 실종자 05번을 추적하는 독립 이야기로 개편하고 있습니다.

## 현재 구현된 내용
- **14개 구역:** 저택 연회장·홀·병동·설비 구역·순환 복도·공동생활관·연구실·절식기도실·별관 관찰병실 등
- **주요 사건:** 교단 연혁·환자 및 이관 기록·수상한 연구 계획·차량 사고·실종 의뢰서 조사, 서정윤 구출 및 탈출 분기
- **시스템:** 조사형 증거 퍼즐, 증거 관계도, 직원 순찰 및 추격, 자동/수동 저장, 엔딩 기록, 모바일 이동 조작
- **동료 5명:** 차준영·김주호·이철민·오은지·서정윤. 동행 조건별 대화, 단서와 행동에 따른 대사, 공포·신뢰 변화 및 심리 상태 확인
- 인게임 픽셀 아트와 이벤트 장면의 연출을 다듬는 중입니다.

**개발 상태:** 주요 코드와 시나리오가 구현되어 있지만 PC·모바일에서 처음부터 각 엔딩까지의 실플레이 QA는 아직 완료되지 않았습니다. 완성판으로 간주하지 마세요.

## 구버전 호환성 및 청소 규칙
- 파일 `story.js`에는 초기 구현의 **옛 장면 정의와 키**가 일부 남아 있습니다. 이후 순서대로 로드하는 `facility-revision.js`, `mansion-route.js`, `paradise-lore.js`, `story-continuity.js` 등이 최종 게임 내용을 덮어씁니다. 초기 소스에 있는 옛 문구가 곧 실제 플레이 장면은 아닙니다.
- 이미 생성된 저장 기록을 유지하기 위해 `prom`, `bath`, `wreck`, `cat`, `ode`, `tofu` 같은 내부 ID를 섣불리 삭제하거나 변경하지 않습니다. 화면에 노출되는 이름·이야기·오브젝트 설명과는 구분해 주세요.
- 신규 탈출 완료 기록은 `refugeReached`로 저장합니다. 기존 세이브의 `ufoDone`은 퍼즐 완료 상태를 복원할 때만 호환 키로 인정합니다.
- 구형 래스터 애셋은 의존 관계와 실제 출력 화면을 확인한 뒤 정리합니다. 이름만 보고 삭제하면 픽셀 캐릭터나 저장 진행을 손상시킬 수 있습니다.
- 저장 네임스페이스는 계속 `hepdalsu-neighbors-v1`입니다. 원본 게임 저장소는 수정하지 않습니다.

## 정적 검증
저장소 루트에서 Node.js로 실행:
```sh
node tests/map-integrity.test.js
node tests/story-continuity-regression.test.js
node tests/pursuit-integrity.test.js
node tests/companion-relationships.test.js
node tests/companion-banter.test.js
node tests/companion-investigation.test.js
node tests/rescue-reactions.test.js
```
이 검사는 소스의 구성·장면 연결·접근성과 일부 시스템 회귀를 확인합니다. **실제 브라우저 플레이 검수를 대신하지는 않습니다.**

## 개발 참고
- 원형: https://plzinviteparty.github.io/ghost-hunt-halloween-party/occiput-relay/
- 초기 프로젝트는 공동 창작물에서 출발했습니다. 포트폴리오나 대외 공개에 사용하기 전에는 외부 IP·공동 창작 자산·레거시 이미지의 사용 권리와 사용 허락을 점검해야 합니다.
- 배포는 GitHub Pages에서 `main` 브랜치 루트를 사용합니다.
