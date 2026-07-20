# 算命 MCP Server — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个传统中国风+程序员整活风的算命 MCP Server，发布为 npm 包

**Architecture:** 单入口 MCP Server，6 个独立 tool 模块 + 1 个共享 HTML 模板引擎。每个 tool 接收参数返回 HTML 页面路径，浏览器打开查看。零外部依赖（仅 MCP SDK）。

**Tech Stack:** TypeScript, `@modelcontextprotocol/sdk`, Node.js >= 18

## Global Constraints

- 零外部依赖（仅 `@modelcontextprotocol/sdk`）
- Node.js >= 18
- 包名: `suanming-mcp`
- HTML 内联 CSS，运行时通过 Google Fonts 加载 `Ma Shan Zheng`
- 所有 tool 返回 `{ content: [{ type: "text", text: "..." }] }` 格式，其中 text 包含 HTML 文件路径
- 同一天同一输入必须产生相同结果（确定性随机）

## 文件结构

```
D:/workspace/study/算命/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts                    # MCP Server 入口
    ├── tools/
    │   ├── bazi.ts                 # 八字排盘
    │   ├── liuyao.ts              # 六爻起卦
    │   ├── qian.ts                # 抽签
    │   ├── name.ts                # 姓名打分
    │   ├── mingming.ts            # 起名
    │   └── coder.ts              # 程序员黄历
    ├── data/
    │   ├── hexagrams.ts           # 64卦数据
    │   ├── qianwen.ts             # 100签文
    │   └── characters.ts          # 起名用字库
    └── render/
        └── template.ts            # 水墨HTML模板
```

---

### Task 0: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`

**Interfaces:**
- Produces: npm 项目就绪，`npm install` 和 `npm run build` 可执行

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "suanming-mcp",
  "version": "1.0.0",
  "description": "传统中国风算命 MCP Server - 八字、六爻、抽签、姓名打分、起名、程序员黄历",
  "main": "dist/index.js",
  "bin": {
    "suanming-mcp": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc && node dist/index.js"
  },
  "keywords": ["mcp", "fortune-telling", "suanming", "chinese", "八字", "算命"],
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: 安装依赖**

```bash
cd "D:/workspace/study/算命" && npm install
```

---

### Task 1: 水墨 HTML 模板引擎

**Files:**
- Create: `src/render/template.ts`

**Interfaces:**
- Produces: `renderFortuneHTML(title: string, content: string, extraStyles?: string): string`

这是整个项目最重要的视觉层。生成带宣纸纹理、毛笔字体、朱砂印章的水墨 HTML。

- [ ] **Step 1: 实现模板函数**

```typescript
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
<title>${title} - 玄机阁</title>
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
    content: '◆';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #faf6ef;
    padding: 0 12px;
    color: #c41e1e;
    font-size: 8px;
  }
  ${extraStyles}
</style>
</head>
<body>
<div class="scroll">
  <div class="ornament">━ ◇ ⬩ ◇ ━</div>
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
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, c => map[c]);
}
```

- [ ] **Step 2: 编译验证**

```bash
cd "D:/workspace/study/算命" && npx tsc --noEmit
```

---

### Task 2: 数据文件

**Files:**
- Create: `src/data/hexagrams.ts`
- Create: `src/data/qianwen.ts`
- Create: `src/data/characters.ts`

**Interfaces:**
- Produces:
  - `HEXAGRAMS: Record<number, { name: string; symbol: string; judgment: string; interpretation: string }>`
  - `QIANWEN: Array<{ no: number; level: '上上'|'上'|'中上'|'中'|'中下'|'下'; poem: string; explanation: string }>`
  - `NAME_CHARS: Record<string, { strokes: number; wuxing: '金'|'木'|'水'|'火'|'土'; meaning: string }>`

**注意：** 64 卦和 100 签文的数据量较大，此 task 创建完整的结构化数据。以下是数据模式的完整示例，实际实现时需包含全部条目。

- [ ] **Step 1: 创建 64 卦数据**

```typescript
// src/data/hexagrams.ts
export interface Hexagram {
  name: string;
  symbol: string;
  judgment: string;
  interpretation: string;
}

export const HEXAGRAMS: Record<number, Hexagram> = {
  1: {
    name: "乾为天",
    symbol: "☰☰",
    judgment: "元亨利贞",
    interpretation: "乾卦六爻皆阳，象征天道刚健，创造万物。得此卦者，宜积极进取，自强不息，事业将有大成。"
  },
  2: {
    name: "坤为地",
    symbol: "☷☷",
    judgment: "元亨，利牝马之贞",
    interpretation: "坤卦六爻皆阴，象征大地柔顺，承载万物。得此卦者，宜以柔克刚，厚德载物，守正不争。"
  },
  3: {
    name: "水雷屯",
    symbol: "☵☳",
    judgment: "元亨利贞，勿用有攸往",
    interpretation: "屯卦象征万物初生，困难重重。云雷交加，草木萌动。得此卦者，事业初创，需耐心等待时机，不可贸然前行。"
  },
  // ... 完整 64 卦
};
```

- [ ] **Step 2: 创建 100 签文数据**

```typescript
// src/data/qianwen.ts
export interface QianWen {
  no: number;
  level: '上上' | '上' | '中上' | '中' | '中下' | '下';
  poem: string;
  explanation: string;
}

export const QIANWEN: QianWen[] = [
  {
    no: 1,
    level: "上上",
    poem: "一轮明月照清波，万里无云气象和。自有贵人相扶助，诸般顺遂不须多。",
    explanation: "此签大吉。如明月当空，前程光明。有贵人相助，凡事顺利。求财得财，求名得名。"
  },
  {
    no: 2,
    level: "中上",
    poem: "春风拂柳绿如烟，燕语莺啼二月天。莫道前途多险阻，花开时节自然妍。",
    explanation: "此签主中等偏上。虽有波折，但时机一到自然开花结果。宜耐心等待，不可急躁。"
  },
  // ... 完整 100 首签文
];
```

- [ ] **Step 3: 创建起名用字库**

```typescript
// src/data/characters.ts
export interface NameChar {
  strokes: number;
  wuxing: '金' | '木' | '水' | '火' | '土';
  meaning: string;
}

export const NAME_CHARS: Record<string, NameChar> = {
  // 金字部
  "鑫": { strokes: 24, wuxing: "金", meaning: "财富兴盛" },
  "铭": { strokes: 14, wuxing: "金", meaning: "铭记不忘，才华出众" },
  "锐": { strokes: 15, wuxing: "金", meaning: "锐意进取，敏锐聪慧" },
  "钧": { strokes: 12, wuxing: "金", meaning: "雷霆万钧，有威严" },
  "锦": { strokes: 16, wuxing: "金", meaning: "锦绣前程，美好" },
  // 木字部
  "林": { strokes: 8, wuxing: "木", meaning: "生机勃勃，繁荣" },
  "森": { strokes: 12, wuxing: "木", meaning: "茂盛繁荣，深厚" },
  "柏": { strokes: 9, wuxing: "木", meaning: "坚韧不拔，长青" },
  "松": { strokes: 8, wuxing: "木", meaning: "坚韧高洁，长寿" },
  "桐": { strokes: 10, wuxing: "木", meaning: "高洁优雅，凤凰所栖" },
  "梓": { strokes: 11, wuxing: "木", meaning: "栋梁之材，故乡情" },
  "楷": { strokes: 13, wuxing: "木", meaning: "楷模典范，正直" },
  "楠": { strokes: 13, wuxing: "木", meaning: "珍贵木材，稳重" },
  "槿": { strokes: 15, wuxing: "木", meaning: "朝花夕拾，美丽短暂" },
  "荣": { strokes: 14, wuxing: "木", meaning: "繁荣昌盛，荣耀" },
  // 水字部
  "涵": { strokes: 12, wuxing: "水", meaning: "内涵丰富，包容" },
  "源": { strokes: 14, wuxing: "水", meaning: "源源不断，根基深厚" },
  "瀚": { strokes: 20, wuxing: "水", meaning: "浩瀚无垠，学识渊博" },
  "泽": { strokes: 17, wuxing: "水", meaning: "恩泽广被，仁慈" },
  "洋": { strokes: 10, wuxing: "水", meaning: "胸怀宽广，远见" },
  "涛": { strokes: 18, wuxing: "水", meaning: "气势磅礴，有力" },
  "清": { strokes: 12, wuxing: "水", meaning: "清正廉明，纯洁" },
  "浩": { strokes: 11, wuxing: "水", meaning: "浩然正气，宏大" },
  "润": { strokes: 16, wuxing: "水", meaning: "温润如玉，滋养" },
  "澜": { strokes: 21, wuxing: "水", meaning: "波澜壮阔，有气魄" },
  // 火字部
  "煜": { strokes: 13, wuxing: "火", meaning: "光明照耀，辉煌" },
  "烨": { strokes: 16, wuxing: "火", meaning: "光辉灿烂，耀眼" },
  "炜": { strokes: 9, wuxing: "火", meaning: "光明，有文采" },
  "煜": { strokes: 13, wuxing: "火", meaning: "光明照耀" },
  "焕": { strokes: 11, wuxing: "火", meaning: "焕然一新，光彩" },
  "煜": { strokes: 13, wuxing: "火", meaning: "光明照耀，温暖" },
  "灵": { strokes: 7, wuxing: "火", meaning: "灵动聪慧，机敏" },
  "昭": { strokes: 9, wuxing: "火", meaning: "昭示天下，光明正大" },
  "明": { strokes: 8, wuxing: "火", meaning: "光明磊落，智慧" },
  "昱": { strokes: 9, wuxing: "火", meaning: "日光，光明，前程似锦" },
  // 土字部
  "宇": { strokes: 6, wuxing: "土", meaning: "气宇轩昂，胸怀广阔" },
  "安": { strokes: 6, wuxing: "土", meaning: "平安顺遂，安稳" },
  "峰": { strokes: 10, wuxing: "土", meaning: "登峰造极，卓越" },
  "城": { strokes: 10, wuxing: "土", meaning: "坚固可靠，稳重" },
  "坤": { strokes: 8, wuxing: "土", meaning: "厚德载物，包容" },
  "垚": { strokes: 9, wuxing: "土", meaning: "高山巍峨，崇高" },
  "岳": { strokes: 8, wuxing: "土", meaning: "高大如山，尊贵" },
  "基": { strokes: 11, wuxing: "土", meaning: "根基稳固，扎实" },
  "圣": { strokes: 5, wuxing: "土", meaning: "圣明睿智，高尚" },
  "培": { strokes: 11, wuxing: "土", meaning: "培养成才，积累" },
};
```

**实现者注意：** 以上为代表性条目。实际数据文件需包含完整的 64 卦、100 首签文、以及约 200+ 起名用字。签文按吉凶分布：上上 15 首、上 20 首、中上 20 首、中 20 首、中下 15 首、下 10 首。

---

### Task 3: 八字排盘 tool

**Files:**
- Create: `src/tools/bazi.ts`

**Interfaces:**
- Consumes: `renderFortuneHTML()` from `src/render/template.ts`
- Produces: `fortuneBazi(params: BaziParams): Promise<FortuneResult>`

```typescript
// src/tools/bazi.ts
import { renderFortuneHTML } from "../render/template.js";
import { writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

interface BaziParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: "male" | "female";
  calendar?: "solar" | "lunar";
}

interface FortuneResult {
  htmlPath: string;
  summary: string;
}

const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ZODIAC = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
const WUXING_MAP: Record<string, string> = {
  "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
  "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水"
};
const BRANCH_WUXING: Record<string, string> = {
  "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土", "巳": "火",
  "午": "火", "未": "土", "申": "金", "酉": "金", "戌": "土", "亥": "水"
};

function getYearStem(year: number): string {
  return HEAVENLY_STEMS[(year - 4) % 10];
}

function getYearBranch(year: number): string {
  return EARTHLY_BRANCHES[(year - 4) % 12];
}

function getMonthStem(yearStemIndex: number, month: number): string {
  const base = (yearStemIndex * 2) % 10;
  return HEAVENLY_STEMS[(base + month - 1) % 10];
}

function getMonthBranch(month: number): string {
  return EARTHLY_BRANCHES[(month + 1) % 12];
}

function getDayStemBranch(year: number, month: number, day: number): [string, string] {
  // 使用已知基点：1900年1月1日为甲戌日（干支序号 10）
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
  const stemIndex = ((diffDays % 10) + 10) % 10;
  const branchIndex = ((diffDays % 12) + 12) % 12;
  return [HEAVENLY_STEMS[(10 + stemIndex) % 10], EARTHLY_BRANCHES[(10 + branchIndex) % 12]];
}

function getHourStem(dayStemIndex: number, hour: number): string {
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  const base = (dayStemIndex * 2) % 10;
  return HEAVENLY_STEMS[(base + branchIndex) % 10];
}

function getHourBranch(hour: number): string {
  return EARTHLY_BRANCHES[Math.floor((hour + 1) / 2) % 12];
}

function analyzeDayMaster(dayStem: string): string {
  const analyses: Record<string, string> = {
    "甲": "甲木之人，如参天大树，正直刚强，有领导才能，但有时过于固执。",
    "乙": "乙木之人，如藤萝花草，柔韧灵活，善于适应，有艺术天赋。",
    "丙": "丙火之人，如太阳之光，热情开朗，光明磊落，有感染力。",
    "丁": "丁火之人，如灯烛之火，温和细腻，心思缜密，有洞察力。",
    "戊": "戊土之人，如城墙之土，稳重厚道，诚信可靠，有包容心。",
    "己": "己土之人，如田园之土，温和谦让，踏实肯干，有滋养之力。",
    "庚": "庚金之人，如刀剑之金，刚毅果断，有魄力，敢于变革。",
    "辛": "辛金之人，如珠玉之金，精致细腻，追求完美，有审美力。",
    "壬": "壬水之人，如江河之水，豁达大度，智慧灵动，有冒险精神。",
    "癸": "癸水之人，如雨露之水，细腻敏感，聪慧内敛，有洞察力。",
  };
  return analyses[dayStem] || "";
}

export async function fortuneBazi(params: BaziParams): Promise<FortuneResult> {
  const { year, month, day, hour, gender } = params;

  const yearStem = getYearStem(year);
  const yearBranch = getYearBranch(year);
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearStem);

  const monthStem = getMonthStem(yearStemIndex, month);
  const monthBranch = getMonthBranch(month);

  const [dayStem, dayBranch] = getDayStemBranch(year, month, day);
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);

  const hourStem = getHourStem(dayStemIndex, hour);
  const hourBranch = getHourBranch(hour);

  const pillars = [
    { label: "年柱", stem: yearStem, branch: yearBranch },
    { label: "月柱", stem: monthStem, branch: monthBranch },
    { label: "日柱", stem: dayStem, branch: dayBranch },
    { label: "时柱", stem: hourStem, branch: hourBranch },
  ];

  // 五行统计
  const wuxingCount: Record<string, number> = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };
  for (const p of pillars) {
    wuxingCount[WUXING_MAP[p.stem]]++;
    wuxingCount[BRANCH_WUXING[p.branch]]++;
  }

  const zodiacAnimal = ZODIAC[EARTHLY_BRANCHES.indexOf(yearBranch)];
  const dayMasterAnalysis = analyzeDayMaster(dayStem);

  // 今日运势（基于日期的确定性伪随机）
  const today = new Date();
  const luckSeed = year + month + day + today.getFullYear() + today.getMonth() + today.getDate();
  const luckLevels = ["大吉", "吉", "平", "小凶", "凶"];
  const luckIndex = luckSeed % 5;
  const luckColors = ["#c41e1e", "#d4342c", "#8b7355", "#666", "#999"];

  const genderText = gender === "male" ? "乾造" : "坤造";

  const content = `
<p class="label">${genderText} · 八字排盘</p>
<div style="display:flex;justify-content:space-around;margin:24px 0;flex-wrap:wrap;gap:12px;">
  ${pillars.map(p => `
    <div style="text-align:center;padding:16px 20px;border:1px solid #d4c5a0;border-radius:4px;background:rgba(250,246,239,0.6);">
      <div style="font-size:12px;color:#8b7355;margin-bottom:8px;">${p.label}</div>
      <div style="font-size:32px;color:#1a1a1a;letter-spacing:2px;">${p.stem}${p.branch}</div>
    </div>
  `).join("")}
</div>
<p><span class="label">生肖：</span>${zodiacAnimal}</p>
<p><span class="label">日主：</span>${dayStem} — ${dayMasterAnalysis}</p>
<p><span class="label">五行分布：</span>${Object.entries(wuxingCount).map(([k, v]) => `${k}(${v})`).join(" · ")}</p>
<hr class="divider">
<p style="font-size:20px;text-align:center;color:${luckColors[luckIndex]};font-family:'Ma Shan Zheng','Noto Serif SC',cursive;">
  今日运势：${luckLevels[luckIndex]}
</p>
<p style="text-align:center;color:#8b7355;">${getLuckAdvice(luckIndex, gender)}</p>
`;

  const html = renderFortuneHTML(`${yearStem}${yearBranch}年 四柱八字`, content);
  const filePath = join(tmpdir(), `suanming-bazi-${Date.now()}.html`);
  writeFileSync(filePath, html, "utf-8");

  const summary = `${genderText}：${yearStem}${yearBranch}年 ${monthStem}${monthBranch}月 ${dayStem}${dayBranch}日 ${hourStem}${hourBranch}时。日主${dayStem}。今日运势${luckLevels[luckIndex]}。`;

  return { htmlPath: filePath, summary };
}

function getLuckAdvice(index: number, gender: string): string {
  const advices = [
    "诸事顺遂，宜把握良机，大胆前行。",
    "运势平稳向好，适合做重要决定。",
    "吉凶参半，宜守不宜攻，多观察。",
    "今日宜低调行事，避免口舌是非。",
    "建议今日以静制动，少说多做。",
  ];
  return advices[index];
}
```

- [ ] **Step 2: 编译验证**

```bash
cd "D:/workspace/study/算命" && npx tsc --noEmit
```

---

### Task 4: 六爻起卦 tool

**Files:**
- Create: `src/tools/liuyao.ts`

**Interfaces:**
- Consumes: `renderFortuneHTML()` from `src/render/template.ts`, `HEXAGRAMS` from `src/data/hexagrams.ts`
- Produces: `fortuneLiuyao(params: LiuyaoParams): Promise<FortuneResult>`

[完整代码包含：确定性随机种子、六爻起卦算法（本卦+变卦）、64卦检索、HTML 渲染。卦象用 Unicode 八卦符号展示，标注变爻位置。]

---

### Task 5: 抽签 tool

**Files:**
- Create: `src/tools/qian.ts`

**Interfaces:**
- Consumes: `renderFortuneHTML()` from `src/render/template.ts`, `QIANWEN` from `src/data/qianwen.ts`
- Produces: `fortuneQian(params: QianParams): Promise<FortuneResult>`

[完整代码包含：基于问题文本的确定性哈希种子、签文抽取、吉凶标签带颜色、签文竖排样式。]

---

### Task 6: 姓名打分 tool

**Files:**
- Create: `src/tools/name.ts`

**Interfaces:**
- Consumes: `renderFortuneHTML()` from `src/render/template.ts`
- Produces: `fortuneName(params: NameParams): Promise<FortuneResult>`

[完整代码包含：简体转繁体笔画映射表、五格剖象法公式（天格/人格/地格/外格/总格）、三才配置分析、各格吉凶判断规则、综合评分算法。]

---

### Task 7: 起名 tool

**Files:**
- Create: `src/tools/mingming.ts`

**Interfaces:**
- Consumes: `renderFortuneHTML()` from `src/render/template.ts`, `NAME_CHARS` from `src/data/characters.ts`，八字分析来自 `src/tools/bazi.ts`
- Produces: `fortuneMingming(params: MingmingParams): Promise<FortuneResult>`

[完整代码包含：根据八字五行缺失筛选候选字、五格评分筛选、生成 5 个候选名字带分析、HTML 渲染候选列表。]

---

### Task 8: 程序员黄历 tool

**Files:**
- Create: `src/tools/coder.ts`

**Interfaces:**
- Consumes: `renderFortuneHTML()` from `src/render/template.ts`
- Produces: `fortuneCoder(params: CoderParams): Promise<FortuneResult>`

[完整代码包含：日期+语言名的确定性哈希种子、宜忌规则表（20+ 条幽默条目）、代码气运三维指数、幸运语言/背运语言、一句话忠告池（30+ 条）。HTML 样式混搭像素风小元素（等宽字体代码块 + 水墨底色）。]

---

### Task 9: MCP Server 入口整合

**Files:**
- Create: `src/index.ts`

**Interfaces:**
- Consumes: 所有 6 个 tool 模块
- Produces: 可运行的 MCP Server，注册全部 6 个 tool

[完整代码包含：MCP Server 初始化、ListTools 处理器（返回 6 个 tool 的 schema 定义）、CallTool 处理器（按 tool name 路由到对应模块）、stdio 传输层。]

---

### Task 10: README 和最终验证

**Files:**
- Create: `README.md`

[完整 README 包含：项目介绍（中英双语）、安装方式、Claude Code 配置示例、OpenCode 配置示例、6 个 tool 的使用说明、水墨风格截图示例、npm 发布命令。]

- [ ] **Step 最后: 完整编译 + 运行验证**

```bash
cd "D:/workspace/study/算命" && npm run build && node dist/index.js
```
