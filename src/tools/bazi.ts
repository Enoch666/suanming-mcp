import { renderFortuneHTML } from "../render/template.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, WUXING_MAP, BRANCH_WUXING } from "./bazi-helpers.js";

interface BaziParams {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: "male" | "female";
  calendar?: "solar" | "lunar";
}

export interface FortuneResult {
  htmlPath: string;
  summary: string;
  html: string;
}

const OUTPUT_DIR = join(homedir(), ".suanming");
try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch {}

const ZODIAC = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

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

function getLuckAdvice(index: number, _gender: string): string {
  const advices = [
    "诸事顺遂，宜把握良机，大胆前行。",
    "运势平稳向好，适合做重要决定。",
    "吉凶参半，宜守不宜攻，多观察。",
    "今日宜低调行事，避免口舌是非。",
    "建议今日以静制动，少说多做。",
  ];
  return advices[index];
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

  const wuxingCount: Record<string, number> = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };
  for (const p of pillars) {
    wuxingCount[WUXING_MAP[p.stem]]++;
    wuxingCount[BRANCH_WUXING[p.branch]]++;
  }

  const zodiacAnimal = ZODIAC[EARTHLY_BRANCHES.indexOf(yearBranch)];
  const dayMasterAnalysis = analyzeDayMaster(dayStem);

  const today = new Date();
  const luckSeed = year + month + day + today.getFullYear() + today.getMonth() + today.getDate();
  const luckLevels = ["大吉", "吉", "平", "小凶", "凶"];
  const luckIndex = luckSeed % 5;
  const luckColors = ["#c41e1e", "#d4342c", "#8b7355", "#666", "#999"];

  const genderText = gender === "male" ? "乾造" : "坤造";

  const content = `
<p class="no-indent"><span class="label">${genderText} · 八字排盘</span></p>
<div class="flex-row">
  ${pillars.map(p => `
    <div class="pillar-box">
      <div class="pillar-label">${p.label}</div>
      <div class="pillar-chars">${p.stem}${p.branch}</div>
    </div>
  `).join("")}
</div>
<p><span class="label">生肖：</span>${zodiacAnimal}</p>
<p><span class="label">日主：</span>${dayStem} — ${dayMasterAnalysis}</p>
<p><span class="label">五行分布：</span>${Object.entries(wuxingCount).map(([k, v]) => `${k}(${v})`).join(" · ")}</p>
<hr class="divider">
<p style="font-size:20px;text-align:center;color:${luckColors[luckIndex]};font-family:'Ma Shan Zheng','Noto Serif SC',cursive;" class="no-indent">
  今日运势：${luckLevels[luckIndex]}
</p>
<p style="text-align:center;color:#8b7355;" class="no-indent">${getLuckAdvice(luckIndex, gender)}</p>
`;

  const html = renderFortuneHTML(`${yearStem}${yearBranch}年 四柱八字`, content);
  const filePath = join(OUTPUT_DIR, `suanming-bazi-${Date.now()}.html`);
  writeFileSync(filePath, html, "utf-8");

  const summary = `${genderText}：${yearStem}${yearBranch}年 ${monthStem}${monthBranch}月 ${dayStem}${dayBranch}日 ${hourStem}${hourBranch}时。日主${dayStem}。今日运势${luckLevels[luckIndex]}。`;

  return { htmlPath: filePath, summary, html };
}
