import { renderFortuneHTML } from "../render/template.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { FortuneResult } from "./bazi.js";

const OUTPUT_DIR = join(homedir(), ".suanming");
try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch {}

interface CoderParams {
  language: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const YI_ITEMS = [
  "写单元测试", "重构旧代码", "推代码上线", "写文档注释", "Code Review",
  "学习新技术", "优化性能", "删无用代码", "写自动化脚本", "修 bug",
  "画架构图", "写 PR 描述", "整理 TODO", "升级依赖", "加日志",
];

const JI_ITEMS = [
  "周五下午部署", "不写测试直接上线", "手写 SQL 拼接字符串", "强行重命名变量",
  "git push --force", "npm install 不明来源的包", "忽略 lint 警告",
  "在生产环境 debug", "对同事甩锅", "通宵改需求", "边开会边写代码",
  "复制粘贴 StackOverflow 代码不看", "rm -rf 裸奔", "改完代码不跑测试",
  "打开 50 个 Chrome Tab 不关",
];

const LUCKY_LANGUAGES = [
  "Python", "Rust", "TypeScript", "Go", "Kotlin", "Swift", "Zig", "Elixir",
  "Lua", "Ruby", "C#", "Julia", "Scala", "Haskell", "OCaml", "Clojure",
  "Dart", "R", "Bash", "HTML", "CSS", "SQL", "GraphQL", "WebAssembly",
];

const WISDOMS = [
  "今天的注释比代码值钱，多写。",
  "能跑就行，别过度优化——除非你是真的闲。",
  "别跟产品经理讲道理，今天的天象不太支持。",
  "你的 IDE 今天会格外卡，建议换 Vim。",
  "QA 今天眼皮会跳，你懂的。",
  "今天适合研究新的编程范式，不适合用它写业务代码。",
  "中午多吃点，下午有惊喜 bug 等着你。",
  "Stack Overflow 今天会救你一命。",
  "今天写的代码，下个月你会骂自己写得烂。——这就是成长。",
  "AI 写的代码也是代码，跑了再说。",
  "重启大法今天成功率高达 99.9%。",
  "今天不适合看别人的代码，容易血压升高。",
  "如果你觉得今天很顺利，一定是漏了什么。",
  "GitHub Copilot 今天心情不错，多喂它代码。",
  "把电脑重启一下，很多问题就莫名其妙解决了。",
  "今天开会时适合默默写代码，但不适合被发现。",
  "多写一行注释，少写一个 bug。今天的铁律。",
  "你的咖啡因浓度直接决定了今天代码的质量。",
  "不是你的代码有 bug，是宇宙在测试你的耐心。",
  "print 调试永远是最有效的调试方式，今天也不例外。",
  "今日宜用正则表达式解决一切问题（不要这样做）。",
  "今天写的 CSS，明天就会被 PM 要求改掉，所以随便写写。",
  "你的 commit message 今天会格外有诗意。",
  "今天不适合 merge 分支，适合摸鱼和思考人生。",
  "undefined is not a function —— 今天你会见到它。",
  "NullPointerException 在暗中观察你。",
  "今天的代码会在凌晨 3 点才跑出 bug，所以早点睡。",
  "Don't repeat yourself. —— 除非今天赶时间。",
  "今天特别适合写 TODO 注释，但不适合完成它们。",
  "你的键盘今天会敲出比平时更多的分号，不知道为什么。",
];

export async function fortuneCoder(params: CoderParams): Promise<FortuneResult> {
  const lang = params.language.trim() || "JavaScript";
  const today = new Date();
  const dateKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const seed = hashCode(lang) + dateKey;

  const rng = (n: number): number => {
    return ((seed * (n + 1) * 16807 + n * 48271) % 2147483647 + 2147483647) % 2147483647;
  };

  const yiIdx = rng(1) % YI_ITEMS.length;
  const yiIdx2 = rng(2) % YI_ITEMS.length;
  const yiIdx3 = rng(3) % YI_ITEMS.length;
  const yiItems = [...new Set([YI_ITEMS[yiIdx], YI_ITEMS[yiIdx2], YI_ITEMS[yiIdx3]])];

  const jiIdx = rng(4) % JI_ITEMS.length;
  const jiIdx2 = rng(5) % JI_ITEMS.length;
  const jiItems = [...new Set([JI_ITEMS[jiIdx], JI_ITEMS[jiIdx2]])];

  const bugRate = 10 + (rng(6) % 81);
  const efficiency = 10 + (rng(7) % 81);
  const moyu = 10 + (rng(8) % 91);

  const luckyIdx = rng(9) % LUCKY_LANGUAGES.length;
  let unluckyIdx = rng(10) % LUCKY_LANGUAGES.length;
  if (unluckyIdx === luckyIdx) unluckyIdx = (unluckyIdx + 1) % LUCKY_LANGUAGES.length;

  const wisdomIdx = rng(11) % WISDOMS.length;

  const statColor = (v: number) => v >= 70 ? "#c41e1e" : v >= 50 ? "#d4342c" : "#8b7355";
  const statLabel = (v: number) => v >= 80 ? "高" : v >= 50 ? "中" : "低";

  const content = `
<p class="no-indent" style="text-align:center;">
  <span class="pixel-text">${lang}</span>
  <span style="color:#8b7355;margin:0 8px;">·</span>
  <span style="color:#8b7355;">${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日</span>
</p>
<hr class="divider">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0;">
  <div class="card" style="border-color:#c41e1e;">
    <div style="text-align:center;color:#c41e1e;font-family:'Ma Shan Zheng','Noto Serif SC',cursive;font-size:20px;margin-bottom:12px;">宜</div>
    ${yiItems.map(item => `<p style="text-align:center;font-size:15px;text-indent:0;margin-bottom:8px;">✅ ${item}</p>`).join("")}
  </div>
  <div class="card" style="border-color:#666;">
    <div style="text-align:center;color:#666;font-family:'Ma Shan Zheng','Noto Serif SC',cursive;font-size:20px;margin-bottom:12px;">忌</div>
    ${jiItems.map(item => `<p style="text-align:center;font-size:15px;text-indent:0;margin-bottom:8px;">🚫 ${item}</p>`).join("")}
  </div>
</div>
<hr class="divider">
<p style="text-align:center;font-family:'Ma Shan Zheng','Noto Serif SC',cursive;font-size:20px;color:#8b7355;" class="no-indent">今日代码气运</p>
<div class="coder-stats">
  <div class="coder-stat">
    <div class="stat-value" style="color:${statColor(bugRate)};">${bugRate}%</div>
    <div class="stat-label">Bug 率 · ${statLabel(bugRate)}</div>
  </div>
  <div class="coder-stat">
    <div class="stat-value" style="color:${statColor(efficiency)};">${efficiency}%</div>
    <div class="stat-label">效率指数 · ${statLabel(efficiency)}</div>
  </div>
  <div class="coder-stat">
    <div class="stat-value" style="color:${statColor(moyu)};">${moyu}%</div>
    <div class="stat-label">摸鱼指数 · ${statLabel(moyu)}</div>
  </div>
</div>
<hr class="divider">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0;">
  <div class="card" style="text-align:center;">
    <div style="font-size:12px;color:#8b7355;">幸运语言</div>
    <div style="font-size:20px;color:#c41e1e;font-family:'Ma Shan Zheng','Noto Serif SC',cursive;">${LUCKY_LANGUAGES[luckyIdx]}</div>
  </div>
  <div class="card" style="text-align:center;">
    <div style="font-size:12px;color:#8b7355;">背运语言</div>
    <div style="font-size:20px;color:#666;font-family:'Ma Shan Zheng','Noto Serif SC',cursive;">${LUCKY_LANGUAGES[unluckyIdx]}</div>
  </div>
</div>
<hr class="divider">
<p style="text-align:center;font-size:18px;font-family:'Ma Shan Zheng','Noto Serif SC',cursive;color:#1a1a1a;" class="no-indent">
  "${WISDOMS[wisdomIdx]}"
</p>
`;

  const html = renderFortuneHTML(`程序员黄历 · ${lang}`, content);
  const filePath = join(OUTPUT_DIR, `suanming-coder-${Date.now()}.html`);
  writeFileSync(filePath, html, "utf-8");

  const summary = `【程序员黄历 · ${lang}】宜${yiItems.join("、")}。忌${jiItems.join("、")}。Bug率${bugRate}%，效率${efficiency}%，摸鱼指数${moyu}%。幸运语言${LUCKY_LANGUAGES[luckyIdx]}。${WISDOMS[wisdomIdx]}`;

  return { htmlPath: filePath, summary, html };
}
