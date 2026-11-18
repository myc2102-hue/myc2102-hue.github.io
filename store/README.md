# Play 스토어 등록 재료 (2026-11-18)
- `icon-512.png` — 앱 아이콘(512×512, PNG). `icons/icon-512.png` 와 같음.
- `feature-1024x500.jpg` — 그래픽 이미지(1024×500). 키아트 위쪽을 잘라 만든 것.
- 스크린샷(폰 세로 2장 이상, 가로도 가능): 사용자가 폰에서 직접 캡처해 올린다.
- 개인정보 처리방침 주소: https://myc2102-hue.github.io/privacy.html
- 짧은 설명(80자 이내): 숲속 호숫가 모닥불에 모여 함께 살아남는 힐링 생존 게임
- 긴 설명 초안: `listing.md`

## AI 홍보 이미지 (store/screens, 1080×1920)
- Figma 파일 "찰스의 숲 스토어 이미지"(https://www.figma.com/design/T5RM6m31c26Ps7gUY1EP3k)에서 generate_image 로 뽑은 원본(864×1536) 4장에 Swift(AppKit, NotoSansKR Black/Bold)로 문구를 얹은 것.
- 01 불멍 "고민을 태워버리고 힐링하세요" · 02 사냥 "귀여운 동물친구들과 생존하세요" · 03 매점 "쪼랭이 매점에서 장비를 챙기세요" · 04 오로라 "친구들과 모닥불에 모여요".
- Play 스크린샷 칸에 넣을 때는 실제 게임 캡처 2장 이상을 앞에 두고 이 그림들은 뒤에 두는 것을 권장(정책상 "앱을 정확히 보여주는 이미지" 요구).

## 실제 게임 캡처 (store/shots, 1920×1080 가로)
- `_tools/shoot.js` 로 찍는다: 로컬 http 서버(8765) + 헤드리스 Chrome(CDP 9333, 터치 에뮬레이션 → 모바일 UI, 640×360 @3x) 로 `?shot=1&solo=1` 촬영 모드에 들어가 장면을 세팅하고 캡처. 샌드박스 밖(터미널)에서 `node _tools/shoot.js [장면번호…]`.
- 촬영 모드(index.html `SHOT`): `hour` 고정, 혼자 모드, 글귀·토스트·힌트 숨김, `window.__shot`(가짜 친구 `friend()`, `setHour`, `setExposure`, `collapse`).
- 장면: 01 밤 모닥불(친구 3명·말풍선) · 02 오로라 가루 · 03 쪼랭이 매점 · 04 사슴·여우 사냥 · 05 가방 열기 · 06 낮 캠프 전경.
- Play 에 올릴 땐 이 6장을 앞에, AI 홍보 그림(screens/)은 뒤에.
