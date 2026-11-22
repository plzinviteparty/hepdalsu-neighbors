# 실제 래스터 삽화 및 도트 스프라이트 적용 규격

## 지금 게임에 적용된 이미지
| 용도 | 실제 브라우저 이미지 | 표시 방식 |
| --- | --- | --- |
| 프롤로그 (사고 현장) | `art/intro-female-road-final.webp` (1280×768) | 픽셀 캔버스와 분리된 `img.cinematicArtwork` |
| 프롤로그 (저택 접근) | `art/intro-female-mansion-final.webp` (1280×768) | 위와 동일 |
| 허달수 조우 | `art/dalsu-encounter-final.webp` (1280×768) | 위와 동일 |
| 오은지 복구 사진 | `art/reporter-evidence-final.webp` (720×720) | 퍼즐 UI의 3×3 배경 이미지 |

- **실제 WebP 바이너리 파일**로 저장했고, SVG 도형을 그림으로 포장한 것이 아닙니다.
- PNG도 일반 브라우저 `img.src` / CSS `background-image`에서 같은 방식으로 지원됩니다.
- 저택 접근 삽화는 여성 탐정 인트로 원화의 다른 크롭입니다. 기존 남성 주인공 이미지 사용 금지.
- 오은지 사진은 이전 종합 아트보드에서 실제 그림 영역만 추출했습니다. 원본 사진 크기가 작으므로 이 장면은 추후 독립 고해상도 원화로 개선할 수 있습니다.

## 왜 인게임 도트는 아직 바꾸지 않았는가
기존 엔진은 `RASTER_MANIFEST.sprites`에서 방향별 **개별 PNG**를 불러와 발 위치를 맞춥니다. 생성형 이미지의 4열×2행 시트는 컷마다 여백·사람 크기·발 위치가 일정하지 않아 통째로 삽입하거나 자동으로 누끼 따서 쓰면 기존 캐릭터의 품질이 떨어집니다.

**이 시트를 실사용 자산이라고 주장하지 않습니다.** 우선 `visual-remaster.js`에 이미 구현된 코드 도트는 보존하고, 새 시트는 다음 절차를 통과한 뒤에만 대체합니다.

1. 상/하/좌/우 각 방향의 정지 프레임과 걷기 프레임이 서로 같은 캐릭터인지 수작업 검수
2. 4방향 **동일한 투명 캔버스 크기**와 발바닥 기준점(하단 정렬)으로 리드로잉
3. 각 프레임의 원본 픽셀 윤곽을 보존, 반투명 찌꺼기·다른 시트의 잔상 제거
4. `python tools/validate-sprite-directions.py down.png left.png right.png up.png` 실행
5. 통과한 방향별 파일을 `RASTER_MANIFEST.sprites`에 등록하고 `SPRITE_HEIGHT` 값을 실제 기존 캐릭터와 대조
6. 실제 이동·좌우 전환·충돌·추격 상황을 브라우저에서 육안 검수

## 회귀 검사
```sh
node tests/raster-artwork-integrity.test.js
node tests/story-continuity-regression.test.js
node tests/ending-route-simulation.test.js
```

검사는 바이너리 존재와 해시·이미지 크기·스크립트 참조를 검증합니다. 모바일/PC 전체 브라우저 실기 테스트를 대체하지 않습니다.
