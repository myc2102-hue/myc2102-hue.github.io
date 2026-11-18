# 모여봐요 찰스의 숲

불멍 메타버스 게임. 브라우저에서 바로 열리는 정적 웹(HTML/JS) 으로 만들고, GitHub Pages 루트 주소에 배포한다.

- 공개 주소(예정): https://myc2102-hue.github.io/
- GitHub 저장소(만들어야 함): `myc2102-hue/myc2102-hue.github.io` — 루트 주소로 쓰려면 저장소 이름이 반드시 이것이어야 함
- 로컬 작업 폴더: `/Users/apple/Desktop/claude/찰스의숲`

## 폴더 구성
```
index.html            진입 페이지(게임 본체)
assets/               키 아트(keyart.jpg), Kenney 모델(models/)
database.rules.json   Firebase Realtime Database 규칙
_notes/               기획 메모(푸시 제외)
```

## 생존 리뉴얼 (2026-11-17)
- 입장: 익명 로그인(Google 계정 불필요). 모습은 사람 캐릭터 13명 중에서만 고른다(동물 모습은 2026-11-18 제외). 이름은 한글·영문·숫자 12자, 욕설 금지, 지금 숲에 있는 사람과 같은 이름 금지(`rooms/lake/names/{키}` 선점).
- 나무 치기(F 또는 클릭): 장작·열매가 랜덤으로 나온다. 나무는 3번 치면 90초 쉰다.
- 사냥: 여우·곰(북극곰)·사슴·토끼·돼지만 고기가 나온다. 나머지 동물은 놀라 도망만 간다. 잡힌 동물은 45초 뒤 다시 나타난다.
- 가방: 아래 가방 칸의 아이콘을 누르거나 숫자키로 쓴다. 열매·고기는 먹기, 장작은 모닥불에, 성냥은 꺼진 불 피우기, 오로라 가루는 모닥불에 뿌리기(25초 무지개), 고민 두루마리는 고민 적어 태우기. 메뉴에는 불멍 모드·소리·감정만 남겼다(장작 넣기·오로라·고민 버튼은 2026-11-18 제거).
- 게이지: 배고픔(약 7분 20초에 바닥) · 추위(불에서 떨어지면 약 2분 45초, 불 곁이면 12초에 회복). 기본 고갈 속도의 1.1배(2026-11-18). 바닥나면 쓰러져 반투명 유령이 되어 15초 동안 둥둥 떠다니다가 모닥불 곁에서 깨어나고 골드 10%를 잃는다. 유령은 어디든 통과하지만 아무것도 못 한다.
- 나무·동물은 모두에게 같은 자리에 있고 상태를 공유한다. 동물은 접속자 중 한 명(호스트)이 움직임을 정하고 나머지는 따라간다. 쉬는 나무·잡힌 동물은 모두에게 똑같다.
- 좌상단 생존 랭킹: 마지막으로 깨어난 뒤 버틴 시간 top 5.
- 낮·밤: 하루 24분(1분 = 1시간). 밤에는 추위가 빨리 깎이니 모닥불 곁에, 낮에는 멀리 다녀도 된다.
- 모바일(터치 화면·작은 창): 왼쪽 아래 조이스틱으로 걷고, 오른쪽 아래 점프·공격·🎒 가방·MENU 버튼, 왼쪽 조이스틱 위에 💬 채팅. 가방과 채팅은 버튼을 눌렀을 때만 열린다. 게이지는 위 가운데. 화면 드래그는 둘러보기, 두 손가락은 1인칭↔3인칭.
- 모닥불이 꺼지면(연료 0) 숲의 모두가 90초 만에 얼어붙고, 장작으로는 못 살린다. 성냥이 필요하다.
- 매점(모닥불 북동쪽, 주인 '매점 곰손'): 성냥·열매·고기·장작·오로라 가루·고민 두루마리를 사고, 가방 물건은 전부 팔 수 있다.
- 물가: `economy` 장부(풀린 골드 − 태운 골드, 등록 인원, 재고)로 계산. 1인당 300골드를 넘기면 물가 상승 → 사는 값 ↑, 파는 값 ↓, 접속 보상 ↓. 재고가 적은 물건은 비싸고 쌓이면 싸다.
- 접속 5분마다 골드 자동 지급(물가 반영, 5~40).
- 가방·골드·게이지는 `profiles/{uid}` 에 저장되고 같은 브라우저면 이어진다(익명 uid 유지).

### Firebase 준비
1. 콘솔 → Authentication → Sign-in method → **익명(Anonymous) 사용 설정** (한 번만). https://console.firebase.google.com/project/charles-forest-2026/authentication/providers
2. 규칙 배포(사용자 터미널, 사내 CA 필요):
   ```bash
   cd /Users/apple/Desktop/claude/찰스의숲 && security find-certificate -a -p /Library/Keychains/System.keychain > "$TMPDIR/cas.pem" && NODE_EXTRA_CA_CERTS="$TMPDIR/cas.pem" npx -y firebase-tools deploy --only database
   ```

## 배포 방법 (사용자 터미널)
1. github.com 에서 빈 저장소 `myc2102-hue.github.io` 생성(README 없이).
2. 아래 한 줄 실행:
   ```bash
   cd /Users/apple/Desktop/claude/찰스의숲 && git remote add origin https://myc2102-hue@github.com/myc2102-hue/myc2102-hue.github.io.git && git push -u origin main
   ```
3. 저장소 Settings → Pages → Branch `main` / `/ (root)` 저장. 1~2분 뒤 공개.
4. 이후 수정은 `git push` 만 하면 자동 반영.

## Google Play 등록 (2026-11-18 준비분)
웹 게임을 TWA(Trusted Web Activity) 껍데기로 감싸 올린다. 게임은 계속 GitHub Pages 에서 돌고, 앱은 그 주소를 전체 화면으로 연다.

- 사이트 쪽 준비(완료): `manifest.webmanifest`(이름·아이콘·standalone), `sw.js` + `offline.html`(설치 조건용 최소 서비스 워커, 게임 파일은 캐시 안 함), `icons/`(키아트에서 512·192·180 자른 것), `privacy.html`(개인정보 처리방침, 연락처 `CONTACT_EMAIL` 은 올리기 전에 채울 것), `.well-known/assetlinks.json`(앱 서명 지문 자리 `REPLACE_WITH_PLAY_APP_SIGNING_SHA256`), `.nojekyll`(점으로 시작하는 폴더가 Pages 에 올라가도록).
- 순서(사용자):
  1. https://pwabuilder.com 에 `https://myc2102-hue.github.io/` 입력 → Package for stores → Android. 패키지 이름은 `io.github.myc2102hue.charlesforest`(assetlinks 와 같게), 서명 키는 새로 만들기(zip 안 `signing-key-info.txt` 보관).
  2. Play Console(개인 계정, 25달러) → 앱 만들기 → 받은 `.aab` 를 **비공개 테스트** 트랙에 올린다. 개인 계정은 테스터 12명이 14일 이상 옵트인해야 정식 출시 신청이 열린다.
  3. Play Console → 설정 → 앱 무결성 → 앱 서명 키 인증서의 **SHA-256** 을 복사해 `.well-known/assetlinks.json` 의 자리에 붙이고 push(찰비스에게 값을 주면 됨). 이게 맞아야 앱에서 주소창이 사라진다.
  4. 스토어 등록정보: 아이콘 512, 그래픽 1024×500(키아트 자르면 됨), 스크린샷 폰 2장 이상, 개인정보처리방침 주소 `https://myc2102-hue.github.io/privacy.html`, 데이터 안전(익명 ID·닉네임·채팅 수집, 암호화 전송, 삭제 요청 가능), 콘텐츠 등급 설문(사용자 간 채팅 있음).
- 확인: 설치 뒤 주소창이 보이면 3번 지문이 틀린 것. PWABuilder 가 만든 패키지 이름과 assetlinks 의 `package_name` 이 같은지도 본다.
