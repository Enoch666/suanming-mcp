import { renderFortuneHTML } from "../render/template.js";
import { HEXAGRAMS } from "../data/hexagrams.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { FortuneResult } from "./bazi.js";

const OUTPUT_DIR = join(homedir(), ".suanming");
try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch {}

interface LiuyaoParams {
  question?: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const YAO_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

function getYaoSymbol(value: number): string {
  if (value === 6) return "老阴 ⚋→⚊";
  if (value === 7) return "少阳 ⚊";
  if (value === 8) return "少阴 ⚋";
  return "老阳 ⚊→⚋";
}

function yaoToOriginalLine(value: number): number {
  return value === 6 || value === 8 ? 0 : 1;
}

function yaoToChangedLine(value: number): number {
  if (value === 6) return 1;
  if (value === 9) return 0;
  return yaoToOriginalLine(value);
}

function linesToGuaNum(lines: number[]): number {
  let num = 0;
  for (let i = 0; i < 6; i++) {
    num += lines[i] * (1 << i);
  }
  return num + 1;
}

function el(tag: string, attrs: Record<string, string>, ...children: string[]): string {
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => ` ${k}="${v.replace(/"/g, '&quot;')}"`)
    .join("");
  const inner = children.join("");
  return "<" + tag + attrStr + ">" + inner + "</" + tag + ">";
}

function div(style: string, cls: string, inner: string): string {
  return `<div style="${style}" class="${cls}">${inner}</div>`;
}

function span(style: string, cls: string, text: string): string {
  return `<span style="${style}" class="${cls}">${text}</span>`;
}

export async function fortuneLiuyao(params: LiuyaoParams): Promise<FortuneResult> {
  const question = params.question || "运势";
  const today = new Date();
  const seed = hashCode(question) + today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const yaoValues: number[] = [];
  for (let i = 0; i < 6; i++) {
    const r = ((seed * (i + 1) * 16807 + i * 48271) % 2147483647 + 2147483647) % 2147483647;
    yaoValues.push(6 + (r % 4));
  }

  const originalLines = yaoValues.map(yaoToOriginalLine);
  const changedLines = yaoValues.map(yaoToChangedLine);

  const originalGua = linesToGuaNum(originalLines);
  const changedGua = linesToGuaNum(changedLines);

  const changingYaoIndexes: number[] = [];
  yaoValues.forEach((v, i) => {
    if (v === 6 || v === 9) changingYaoIndexes.push(i);
  });

  const original = HEXAGRAMS[originalGua];
  const changed = HEXAGRAMS[changedGua];

  // Build yao details
  let yaoDetailsHtml = "";
  for (let i = 0; i < yaoValues.length; i++) {
    const v = yaoValues[i];
    const isChanging = v === 6 || v === 9;
    const symStyle = "font-size:18px;" + (isChanging ? "color:#c41e1e;font-weight:bold;" : "");
    const tagStyle = "font-size:12px;color:" + (isChanging ? "#c41e1e" : "#8b7355") + ";";
    const tagText = isChanging ? "变爻" : "";
    yaoDetailsHtml +=
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px dotted #d4c5a0;">' +
      span("color:#8b7355;", "", YAO_NAMES[i]) +
      span(symStyle, "", getYaoSymbol(v)) +
      span(tagStyle, "", tagText) +
      "</div>";
  }

  // Build changing text
  let changingTextHtml: string;
  if (changingYaoIndexes.length > 0) {
    const positions = changingYaoIndexes.map(i => YAO_NAMES[i]).join("、");
    changingTextHtml = '<p><span class="label">变爻位置：</span>' + positions + '</p>';
  } else {
    changingTextHtml = '<p><span class="label">静卦：</span>六爻安静，无变爻</p>';
  }

  // Build changed hexagram section
  let changedSection = "";
  if (originalGua !== changedGua) {
    changedSection = '<p><span class="label">变卦解读：</span>' + changed.interpretation + '</p>';
  }

  const content =
    '<p class="no-indent" style="text-align:center;color:#8b7355;">所问之事：' + question + '</p>' +
    '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin:20px 0;">' +
    '<div style="text-align:center;">' +
    '<div class="hexagram-symbol">' + original.symbol + '</div>' +
    '<p style="font-size:18px;font-family:\'Ma Shan Zheng\',\'Noto Serif SC\',cursive;" class="no-indent">本卦：' + original.name + '</p>' +
    '<p style="font-size:13px;color:#8b7355;" class="no-indent">' + original.judgment + '</p>' +
    '</div>' +
    '<div style="font-size:32px;color:#8b7355;text-align:center;">→</div>' +
    '<div style="text-align:center;">' +
    '<div class="hexagram-symbol">' + changed.symbol + '</div>' +
    '<p style="font-size:18px;font-family:\'Ma Shan Zheng\',\'Noto Serif SC\',cursive;" class="no-indent">变卦：' + changed.name + '</p>' +
    '<p style="font-size:13px;color:#8b7355;" class="no-indent">' + changed.judgment + '</p>' +
    '</div>' +
    '</div>' +
    '<hr class="divider">' +
    '<p><span class="label">卦象解读：</span>' + original.interpretation + '</p>' +
    changedSection +
    changingTextHtml +
    '<hr class="divider">' +
    '<p style="font-size:14px;color:#8b7355;text-align:center;" class="no-indent">六爻详情</p>' +
    yaoDetailsHtml;

  const html = renderFortuneHTML("六爻起卦 · " + original.name, content);
  const filePath = join(OUTPUT_DIR, "suanming-liuyao-" + Date.now() + ".html");
  writeFileSync(filePath, html, "utf-8");

  let changeDesc: string;
  if (changingYaoIndexes.length > 0) {
    changeDesc = "变爻" + changingYaoIndexes.map(i => YAO_NAMES[i]).join("、");
  } else {
    changeDesc = "静卦无变爻";
  }

  const summary = "所问：" + question + "。本卦" + original.name + "(" + original.judgment + ")，变卦" + changed.name + "。" + changeDesc + "。" + original.interpretation;

  return { htmlPath: filePath, summary, html };
}
