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
- 입장: 익명 로그인(Google 계정 불필요). 이름은 한글·영문·숫자 12자, 욕설 금지, 지금 숲에 있는 사람과 같은 이름 금지(`rooms/lake/names/{키}` 선점).
- 나무 치기(F 또는 클릭): 장작·열매가 랜덤으로 나온다. 나무는 3번 치면 90초 쉰다.
- 사냥: 여우·곰(북극곰)·사슴·토끼·돼지만 고기가 나온다. 나머지 동물은 놀라 도망만 간다. 잡힌 동물은 45초 뒤 다시 나타난다.
- 가방: 아래 가방 칸의 아이콘을 누르거나 숫자키로 쓴다. 열매·고기는 먹기, 장작은 모닥불에, 성냥은 꺼진 불 피우기.
- 게이지: 배고픔(8분에 바닥) · 추위(불에서 떨어지면 3분, 불 곁이면 12초에 회복). 바닥나면 쓰러져 8초 뒤 모닥불 곁에서 깨어나고 골드 10%를 잃는다.
- 모닥불이 꺼지면(연료 0) 숲의 모두가 90초 만에 얼어붙고, 장작으로는 못 살린다. 성냥이 필요하다.
- 매점(모닥불 북동쪽, 주인 '매점 곰손'): 성냥·열매·고기·장작을 사고, 가방 물건은 전부 팔 수 있다.
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
