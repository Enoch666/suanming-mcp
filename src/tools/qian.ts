import { renderFortuneHTML } from "../render/template.js";
import { QIANWEN } from "../data/qianwen.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { FortuneResult } from "./bazi.js";

const OUTPUT_DIR = join(homedir(), ".suanming");
try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch {}

interface QianParams {
  question?: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const LEVEL_CLASSES: Record<string, string> = {
  "上上": "level-shangshang",
  "上": "level-shang",
  "中上": "level-zhongshang",
  "中": "level-zhong",
  "中下": "level-zhongxia",
  "下": "level-xia",
};

export async function fortuneQian(params: QianParams): Promise<FortuneResult> {
  const question = params.question || "运势";
  const today = new Date();
  const seed = hashCode(question) + today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % QIANWEN.length;
  const qian = QIANWEN[index];

  const levelClass = LEVEL_CLASSES[qian.level] || "level-zhong";

  const content = `
<p class="no-indent" style="text-align:center;color:#8b7355;">心中所问：${question}</p>
<div style="text-align:center;margin:24px 0;">
  <span class="level-tag ${levelClass}">第 ${qian.no} 签 · ${qian.level}</span>
</div>
<div class="qian-verse">${qian.poem}</div>
<hr class="divider">
<p><span class="label">解签：</span>${qian.explanation}</p>
`;

  const html = renderFortuneHTML(`灵签 · 第${qian.no}签`, content);
  const filePath = join(OUTPUT_DIR, `suanming-qian-${Date.now()}.html`);
  writeFileSync(filePath, html, "utf-8");

  const summary = `第${qian.no}签 · ${qian.level}。${qian.poem}。${qian.explanation}`;

  return { htmlPath: filePath, summary, html };
}
