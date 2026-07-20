import { renderFortuneHTML } from "../render/template.js";
import { NAME_CHARS, getStrokes } from "../data/characters.js";
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, WUXING_MAP, BRANCH_WUXING } from "./bazi-helpers.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { FortuneResult } from "./bazi.js";

const OUTPUT_DIR = join(homedir(), ".suanming");
try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch {}

interface MingmingParams {
  surname: string;
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  gender?: "male" | "female";
  count?: number;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const lucky81: Record<number, number> = {
  1:95, 3:95, 5:90, 6:85, 7:85, 8:90, 11:95, 13:90, 15:95, 16:95,
  17:80, 18:90, 21:95, 23:95, 24:95, 25:90, 29:90, 31:95, 32:95, 33:95,
  35:90, 37:90, 38:65, 39:95, 41:95, 45:90, 47:95, 48:90, 52:90, 61:90,
  63:95, 65:95, 67:90, 68:90, 72:90, 73:80, 81:95,
};

function wugeTo81(num: number): number {
  if (num <= 0) return 1;
  return ((num - 1) % 81) + 1;
}

function wugeScore(tian: number, ren: number, di: number, wai: number, zong: number): number {
  const scores = [tian, ren, di, wai, zong].map(n => lucky81[wugeTo81(n)] || 50);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** 计算八字五行缺失 */
function getMissingWuxing(year: number, month: number, day: number, hour: number): string[] {
  const yearStem = HEAVENLY_STEMS[(year - 4) % 10];
  const yearBranch = EARTHLY_BRANCHES[(year - 4) % 12];
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearStem);
  const monthStem = HEAVENLY_STEMS[((yearStemIndex * 2) + month - 1) % 10];
  const monthBranch = EARTHLY_BRANCHES[(month + 1) % 12];

  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
  const dayStem = HEAVENLY_STEMS[((10 + (diffDays % 10 + 10) % 10) % 10)];

  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const dayBranch = EARTHLY_BRANCHES[((10 + (diffDays % 12 + 12) % 12) % 12)];
  const hourStem = HEAVENLY_STEMS[((dayStemIndex * 2) + Math.floor((hour + 1) / 2) % 12) % 10];
  const hourBranch = EARTHLY_BRANCHES[Math.floor((hour + 1) / 2) % 12];

  const wuxingCount: Record<string, number> = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };
  const pillars = [
    { stem: yearStem, branch: yearBranch },
    { stem: monthStem, branch: monthBranch },
    { stem: dayStem, branch: dayBranch },
    { stem: hourStem, branch: hourBranch },
  ];
  for (const p of pillars) {
    wuxingCount[WUXING_MAP[p.stem]]++;
    wuxingCount[BRANCH_WUXING[p.branch]]++;
  }

  return Object.entries(wuxingCount)
    .filter(([, count]) => count === 0)
    .map(([wx]) => wx);
}

export async function fortuneMingming(params: MingmingParams): Promise<FortuneResult> {
  const surname = params.surname.trim();
  if (surname.length === 0) throw new Error("姓氏不能为空");

  const surStrokes = getStrokes(surname);
  const year = params.year || 2024;
  const month = params.month || 1;
  const day = params.day || 1;
  const hour = params.hour || 12;

  const missingWx = getMissingWuxing(year, month, day, hour);
  const today = new Date();
  const seed = hashCode(surname) + year + month + day + hour + today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  // 收集候选字库
  const allChars = Object.entries(NAME_CHARS);

  // 优先选五行补缺的字
  const priorityChars: typeof allChars = [];
  const otherChars: typeof allChars = [];
  for (const entry of allChars) {
    if (missingWx.includes(entry[1].wuxing)) {
      priorityChars.push(entry);
    } else {
      otherChars.push(entry);
    }
  }

  // 生成候选名字
  interface Candidate {
    name: string;
    fullName: string;
    score: number;
    wuxing: string;
    meaning: string;
  }

  const candidates: Candidate[] = [];
  const usedNames = new Set<string>();

  // 三字名
  const pool = [...priorityChars, ...otherChars];
  for (let attempt = 0; attempt < 500 && candidates.length < 8; attempt++) {
    const s = (seed * (attempt + 1) * 16807 + attempt * 48271) % 2147483647;
    const i1 = Math.abs(s) % pool.length;
    const i2 = Math.abs(((s * 48271) % 2147483647)) % pool.length;
    if (i1 === i2) continue;

    const c1 = pool[i1][0];
    const c2 = pool[i2][0];
    const fullName = surname + c1 + c2;
    if (usedNames.has(fullName)) continue;
    usedNames.add(fullName);

    const s1 = getStrokes(c1);
    const s2 = getStrokes(c2);
    const tian = surStrokes + 1;
    const ren = surStrokes + s1;
    const di = s1 + s2;
    const wai = surStrokes + s2;
    const zong = surStrokes + s1 + s2;
    const score = wugeScore(tian, ren, di, wai, zong);

    const wx1 = pool[i1][1].wuxing;
    const wx2 = pool[i2][1].wuxing;
    const hasPriority = missingWx.some(w => wx1 === w || wx2 === w);

    candidates.push({
      name: c1 + c2,
      fullName,
      score: hasPriority ? Math.min(100, score + 10) : score,
      wuxing: `${wx1}${wx2}`,
      meaning: `${pool[i1][1].meaning}；${pool[i2][1].meaning}`,
    });
  }

  // 排序取 top 5
  candidates.sort((a, b) => b.score - a.score);
  const top5 = candidates.slice(0, 5);

  const wxMissingText = missingWx.length > 0
    ? `八字五行缺：${missingWx.join("、")}，起名时优先补${missingWx.join("、")}属性字`
    : "八字五行俱全，起名选择自由";

  const nameCards = top5.map((c, i) => {
    const scoreColor = c.score >= 90 ? "#c41e1e" : c.score >= 80 ? "#d4342c" : c.score >= 70 ? "#8b7355" : "#666";
    const stars = c.score >= 95 ? "★★★★★" : c.score >= 85 ? "★★★★☆" : c.score >= 70 ? "★★★☆☆" : c.score >= 50 ? "★★☆☆☆" : "★☆☆☆☆";
    return `
    <div class="name-candidate">
      <div class="candidate-score" style="color:${scoreColor};">${c.score}分 ${stars}</div>
      <div class="candidate-name">${c.fullName}</div>
      <p style="text-align:center;font-size:13px;color:#8b7355;margin-top:8px;" class="no-indent">五行：${c.wuxing}</p>
      <p style="text-align:center;font-size:13px;color:#8b7355;" class="no-indent">寓意：${c.meaning}</p>
      ${i === 0 ? '<div style="position:absolute;top:12px;left:16px;color:#c41e1e;font-size:12px;">★ 推荐</div>' : ''}
    </div>`;
  }).join("");

  const content = `
<p class="no-indent" style="text-align:center;">
  <span style="font-family:'Ma Shan Zheng','Noto Serif SC',cursive;font-size:24px;">姓氏：${surname}</span>
</p>
<p><span class="label">八字参考：</span>${year}年${month}月${day}日${hour}时</p>
<p><span class="label">五行分析：</span>${wxMissingText}</p>
<hr class="divider">
<p class="no-indent" style="text-align:center;font-family:'Ma Shan Zheng','Noto Serif SC',cursive;font-size:20px;color:#8b7355;">— 候选名字 —</p>
${nameCards}
`;

  const html = renderFortuneHTML(`起名 · ${surname}氏`, content);
  const filePath = join(OUTPUT_DIR, `suanming-mingming-${Date.now()}.html`);
  writeFileSync(filePath, html, "utf-8");

  const summary = `姓氏${surname}，生成${top5.length}个候选名字：${top5.map(c => `${c.fullName}(${c.score}分)`).join("、")}。${wxMissingText}。`;

  return { htmlPath: filePath, summary, html };
}
