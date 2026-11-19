#!/usr/bin/env python3
"""게시판 홍보 한 장 만들기.
promo/찰스의숲_홍보.html      : 이미지가 파일 안에 들어 있는 판(한 파일로 끝)
promo/찰스의숲_홍보_링크판.html : 이미지를 공개 주소에서 불러오는 판(게시판이 큰 본문을 막을 때)
게시판 편집기는 <style>·스크립트를 지우는 경우가 많아 표 + 인라인 스타일로만 짠다.
"""
import base64, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = ROOT / 'promo' / 'img'
URL = 'https://myc2102-hue.github.io/'
HOST = URL + 'promo/img/'

FONT = "'Pretendard','Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif"
BG, CARD, LINE = '#101c26', '#182a38', '#2a4254'
TEXT, SUB, GOLD = '#f5ecd9', '#b7c6cf', '#ffb957'

FEATURES = [
    ('01_night_fire', '🔥 모닥불 앞에서 불멍', '은하수 아래 호숫가에 둘러앉아 수다 떨고, 멍하니 불을 바라보세요.'),
    ('04_hunt', '🦊 귀여운 동물 친구들과 생존', '나무를 치면 장작과 열매, 사냥하면 고기. 배고픔과 추위를 버텨야 해요.'),
    ('03_shop', '🛒 매점 쪼랭이', '모은 것은 팔고 성냥·열매를 사세요. 숲의 물가는 모두가 쓴 골드에 따라 오르내려요.'),
    ('07_lantern', '🏮 고민은 풍등에 태워 보내기', '고민 두루마리에 적은 글은 나만 보여요. 풍등이 하늘로 오르는 모습은 모두가 함께 봅니다.'),
]
POSTERS = [
    ('ai_01_bulmung', '고민을 태워버리고 힐링하세요'),
    ('ai_02_hunt', '귀여운 동물친구들과 생존하세요'),
    ('ai_03_shop', '쪼랭이 매점에서 장비를 챙기세요'),
    ('ai_04_aurora', '친구들과 모닥불에 모여요'),
]
POINTS = [
    ('설치·가입 없음', '별명만 적으면 바로 입장'),
    ('PC·폰·태블릿', '브라우저만 있으면 어디서나'),
    ('다 같이 한 숲', '접속한 사람 모두 같은 모닥불'),
    ('생존 시간 랭킹', '누가 제일 오래 버티나'),
]


def build(src):
    def img(name, alt, radius='12px'):
        return (f'<img src="{src(name)}" alt="{alt}" width="100%" '
                f'style="display:block;width:100%;height:auto;border:0;border-radius:{radius};">')

    def feature(f):
        name, title, body = f
        return (f'<td width="50%" valign="top" style="padding:8px;">'
                f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
                f'style="background:{CARD};border:1px solid {LINE};border-radius:14px;"><tr><td style="padding:10px 10px 0;">'
                f'{img(name, title, "9px")}</td></tr><tr><td style="padding:12px 14px 16px;font-family:{FONT};">'
                f'<div style="font-size:16px;line-height:1.4;font-weight:700;color:{TEXT};">{title}</div>'
                f'<div style="margin-top:6px;font-size:13.5px;line-height:1.6;color:{SUB};">{body}</div>'
                f'</td></tr></table></td>')

    rows = ''.join('<tr>' + feature(FEATURES[i]) + feature(FEATURES[i + 1]) + '</tr>' for i in range(0, len(FEATURES), 2))
    points = ''.join(
        f'<td width="25%" valign="top" align="center" style="padding:6px;font-family:{FONT};">'
        f'<div style="font-size:14px;line-height:1.4;font-weight:700;color:{GOLD};">{a}</div>'
        f'<div style="margin-top:4px;font-size:12.5px;line-height:1.5;color:{SUB};">{b}</div></td>' for a, b in POINTS)

    posters = ''.join(f'<td width="25%" valign="top" style="padding:6px;">{img(n, a, "12px")}</td>' for n, a in POSTERS)

    return f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>모여봐요 찰스의 숲</title>
</head>
<body style="margin:0;padding:0;background:#e9eef1;">
<!-- 게시판에 붙일 때는 아래 표 전체(시작 ~ 끝 주석 사이)를 복사하세요 -->
<!-- 시작 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e9eef1;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:720px;background:{BG};border-radius:20px;">
  <tr><td style="padding:14px 14px 0;">{img('hero', '모여봐요 찰스의 숲', '14px')}</td></tr>
  <tr><td align="center" style="padding:26px 28px 6px;font-family:{FONT};">
    <div style="font-size:13px;letter-spacing:2px;font-weight:700;color:{GOLD};">숲속 호숫가 힐링 생존 게임</div>
    <div style="margin-top:10px;font-size:28px;line-height:1.35;font-weight:800;color:{TEXT};">오늘 밤, 모닥불 앞에서 만나요</div>
    <div style="margin-top:12px;font-size:15px;line-height:1.7;color:{SUB};">모닥불 하나를 두고 다 같이 모여 밤을 나는 작은 숲입니다.<br>장작을 넣어 불을 지키고, 배고픔과 추위를 함께 버텨 보세요.</div>
  </td></tr>
  <tr><td align="center" style="padding:20px 28px 8px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="{GOLD}" style="background:{GOLD};border-radius:999px;">
      <a href="{URL}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 34px;font-family:{FONT};font-size:17px;font-weight:800;color:#2a1a05;text-decoration:none;">🌲 지금 숲에 들어가기</a>
    </td></tr></table>
    <div style="margin-top:10px;font-family:{FONT};font-size:13px;color:{SUB};"><a href="{URL}" target="_blank" rel="noopener" style="color:{SUB};">{URL}</a></div>
  </td></tr>
  <tr><td style="padding:14px 22px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid {LINE};border-bottom:1px solid {LINE};"><tr><td style="padding:12px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>{points}</tr></table>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:16px 16px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>{posters}</tr></table>
  </td></tr>
  <tr><td style="padding:8px 14px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{rows}</table>
  </td></tr>
  <tr><td style="padding:14px 22px 0;">{img('06_camp_day', '낮의 숲 캠프', '14px')}</td></tr>
  <tr><td align="center" style="padding:22px 28px 30px;font-family:{FONT};">
    <div style="font-size:18px;line-height:1.5;font-weight:800;color:{TEXT};">모닥불이 꺼지면 숲의 모두가 위험해요</div>
    <div style="margin-top:8px;font-size:14px;line-height:1.7;color:{SUB};">혼자보다 여럿이 훨씬 오래 버팁니다. 점심시간이나 퇴근 뒤에 잠깐 들러 주세요.<br>하루는 24분, 밤이 오면 모닥불 곁으로 모이면 됩니다.</div>
    <div style="margin-top:16px;font-size:15px;font-weight:700;"><a href="{URL}" target="_blank" rel="noopener" style="color:{GOLD};">{URL}</a></div>
  </td></tr>
</table>
</td></tr></table>
<!-- 끝 -->
</body>
</html>
'''


def data_uri(name):
    return 'data:image/jpeg;base64,' + base64.b64encode((IMG / f'{name}.jpg').read_bytes()).decode()


out = ROOT / 'promo'
(out / '찰스의숲_홍보.html').write_text(build(data_uri), encoding='utf-8')
(out / '찰스의숲_홍보_링크판.html').write_text(build(lambda n: f'{HOST}{n}.jpg'), encoding='utf-8')
for f in sorted(out.glob('*.html')):
    print(f.name, f'{f.stat().st_size / 1024:.0f} KB')
