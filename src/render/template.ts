export function renderFortuneHTML(
  title: string,
  content: string,
  extraStyles: string = ""
): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} - 玄机阁</title>
<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet">
<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes sealAppear {
    from { opacity: 0; transform: rotate(25deg) scale(0.5); }
    to { opacity: 0.85; transform: rotate(15deg) scale(1); }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background-color: #f5f0e8;
    background-image:
      url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    font-family: "Noto Serif SC", "SimSun", "STSong", serif;
    color: #2c2416;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
  }
  .scroll {
    max-width: 680px;
    width: 100%;
    background: linear-gradient(135deg, #faf6ef, #f5f0e8 20%, #faf6ef 50%, #f5f0e8 80%, #faf6ef);
    border: 1px solid #d4c5a0;
    border-radius: 4px;
    padding: 60px 50px 70px;
    box-shadow:
      0 2px 8px rgba(44,36,22,0.08),
      0 8px 32px rgba(44,36,22,0.06),
      inset 0 0 0 8px #faf6ef,
      inset 0 0 0 9px #d4c5a0;
    position: relative;
    animation: fadeIn 1.2s ease-out;
  }
  .scroll::before {
    content: '';
    position: absolute;
    top: 20px; left: 20px; right: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c41e1e, transparent);
  }
  .ornament {
    text-align: center;
    font-size: 28px;
    color: #8b7355;
    margin-bottom: 24px;
    letter-spacing: 16px;
    opacity: 0.6;
  }
  h1 {
    font-family: "Ma Shan Zheng", "Noto Serif SC", cursive;
    font-size: 42px;
    text-align: center;
    color: #1a1a1a;
    margin-bottom: 12px;
    letter-spacing: 6px;
    font-weight: normal;
  }
  .subtitle {
    text-align: center;
    color: #8b7355;
    font-size: 14px;
    margin-bottom: 40px;
    letter-spacing: 2px;
  }
  .content {
    line-height: 2;
    font-size: 16px;
  }
  .content p { margin-bottom: 16px; text-indent: 2em; }
  .content p.no-indent { text-indent: 0; }
  .content .label {
    color: #c41e1e;
    font-weight: bold;
  }
  .seal {
    position: absolute;
    bottom: 40px;
    right: 50px;
    width: 72px;
    height: 72px;
    border: 3px solid #d4342c;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d4342c;
    font-family: "Ma Shan Zheng", "Noto Serif SC", cursive;
    font-size: 20px;
    transform: rotate(15deg);
    opacity: 0.85;
    animation: sealAppear 0.8s ease-out 0.5s both;
    line-height: 1.3;
    text-align: center;
  }
  .divider {
    border: none;
    border-top: 1px solid #d4c5a0;
    margin: 30px 0;
    position: relative;
  }
  .divider::after {
    content: '\\25C6';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #faf6ef;
    padding: 0 12px;
    color: #c41e1e;
    font-size: 8px;
  }
  .tag {
    display: inline-block;
    padding: 2px 12px;
    border: 1px solid #c41e1e;
    border-radius: 2px;
    color: #c41e1e;
    font-size: 13px;
    margin: 0 4px;
  }
  .card {
    border: 1px solid #d4c5a0;
    border-radius: 4px;
    padding: 20px;
    margin: 16px 0;
    background: rgba(250,246,239,0.6);
  }
  .score {
    font-family: "Ma Shan Zheng", "Noto Serif SC", cursive;
    font-size: 48px;
    color: #c41e1e;
    text-align: center;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 16px 0;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin: 16px 0;
  }
  .flex-row {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 12px;
    margin: 24px 0;
  }
  .pillar-box {
    text-align: center;
    padding: 16px 20px;
    border: 1px solid #d4c5a0;
    border-radius: 4px;
    background: rgba(250,246,239,0.6);
    min-width: 80px;
  }
  .pillar-box .pillar-label {
    font-size: 12px;
    color: #8b7355;
    margin-bottom: 8px;
  }
  .pillar-box .pillar-chars {
    font-size: 32px;
    color: #1a1a1a;
    letter-spacing: 2px;
  }
  .hexagram-symbol {
    font-size: 64px;
    text-align: center;
    letter-spacing: 16px;
    margin: 16px 0;
  }
  .coder-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin: 20px 0;
  }
  .coder-stat {
    text-align: center;
    padding: 16px;
    border: 1px solid #d4c5a0;
    border-radius: 4px;
    background: rgba(250,246,239,0.6);
  }
  .coder-stat .stat-value {
    font-family: "Ma Shan Zheng", "Noto Serif SC", cursive;
    font-size: 36px;
    color: #1a1a1a;
  }
  .coder-stat .stat-label {
    font-size: 12px;
    color: #8b7355;
    margin-top: 4px;
  }
  .name-candidate {
    border: 1px solid #d4c5a0;
    border-radius: 4px;
    padding: 20px;
    margin: 16px 0;
    background: rgba(250,246,239,0.6);
    position: relative;
  }
  .name-candidate .candidate-name {
    font-family: "Ma Shan Zheng", "Noto Serif SC", cursive;
    font-size: 32px;
    color: #1a1a1a;
    text-align: center;
  }
  .name-candidate .candidate-score {
    position: absolute;
    top: 16px;
    right: 20px;
    font-size: 14px;
    color: #c41e1e;
  }
  .qian-verse {
    writing-mode: vertical-rl;
    text-orientation: upright;
    font-family: "Ma Shan Zheng", "Noto Serif SC", cursive;
    font-size: 24px;
    line-height: 2;
    letter-spacing: 4px;
    margin: 24px auto;
    padding: 20px;
    border-left: 1px solid #d4c5a0;
    border-right: 1px solid #d4c5a0;
    max-height: 300px;
    text-align: center;
  }
  .level-tag {
    display: inline-block;
    padding: 4px 16px;
    border-radius: 2px;
    font-size: 16px;
    font-weight: bold;
  }
  .level-shangshang { background: #fff0f0; color: #c41e1e; border: 1px solid #c41e1e; }
  .level-shang { background: #fff5f0; color: #d4342c; border: 1px solid #d4342c; }
  .level-zhongshang { background: #fffaf0; color: #b8860b; border: 1px solid #b8860b; }
  .level-zhong { background: #fffff0; color: #8b7355; border: 1px solid #8b7355; }
  .level-zhongxia { background: #f5fff5; color: #666; border: 1px solid #666; }
  .level-xia { background: #f0f0ff; color: #444; border: 1px solid #444; }
  .pixel-text {
    font-family: "Courier New", monospace;
    background: rgba(44,36,22,0.05);
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 14px;
  }
  @media (max-width: 600px) {
    .scroll { padding: 30px 20px 60px; }
    h1 { font-size: 28px; }
    .grid-2, .grid-3, .coder-stats { grid-template-columns: 1fr; }
    .pillar-box .pillar-chars { font-size: 24px; }
    .seal { width: 56px; height: 56px; font-size: 16px; bottom: 20px; right: 20px; }
  }
  ${extraStyles}
</style>
</head>
<body>
<div class="scroll">
  <div class="ornament">━ &#9671; &#10740; &#9671; ━</div>
  <h1>${escapeHtml(title)}</h1>
  <div class="subtitle">— 玄机阁 —</div>
  <hr class="divider">
  <div class="content">
    ${content}
  </div>
  <div class="seal">玄机<br>阁印</div>
</div>
</body>
</html>`;
}

export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (c) => map[c]);
}
