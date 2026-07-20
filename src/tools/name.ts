import { renderFortuneHTML } from "../render/template.js";
import { getStrokes } from "../data/characters.js";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type { FortuneResult } from "./bazi.js";

const OUTPUT_DIR = join(homedir(), ".suanming");
try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch {}

interface NameParams {
  name: string;
}

function getWugeStrokes(chars: number[]): { tian: number; ren: number; di: number; wai: number; zong: number } {
  const [s1, s2, s3] = chars;
  const tian = s1 + 1;
  const ren = s3 ? s1 + s2 : s1 + s2;
  const di = s3 ? s2 + s3 : s2 + 1;
  const wai = s3 ? s1 + s3 : s1 + 1;
  const zong = chars.reduce((a, b) => a + b, 0);
  return { tian, ren, di, wai, zong };
}

function wugeTo81(num: number): number {
  if (num <= 0) return 1;
  return ((num - 1) % 81) + 1;
}

interface WugeResult {
  num: number;
  num81: number;
  score: number;
  desc: string;
}

const lucky81: Record<number, [string, number]> = {
  1: ["太极之数，万物开泰，生发无穷，利禄亨通。", 95],
  2: ["两仪之数，混沌未开，进退保守，志望难达。", 30],
  3: ["三才之数，天地人和，大事大业，繁荣昌盛。", 95],
  4: ["四象之数，待于生发，万事慎重，不具营谋。", 25],
  5: ["五行之数，五行俱全，循环相生，圆通畅达。", 90],
  6: ["六爻之数，发展变化，天赋美德，吉祥安泰。", 85],
  7: ["七政之数，精悍严谨，天赋之力，吉星照耀。", 85],
  8: ["八卦之数，八卦相荡，努力发达，贯彻志望。", 90],
  9: ["大成之数，含有凶险，有成有败，难以把握。", 45],
  10: ["终结之数，雪暗飘零，偶或有成，回顾茫然。", 20],
  11: ["旱苗逢雨，万物更新，调顺发达，繁荣富贵。", 95],
  12: ["掘井无泉，无理伸张，发展薄弱，虽生不足。", 25],
  13: ["春日牡丹，才艺多能，智谋奇略，忍柔当事。", 90],
  14: ["破兆沦落，浮沉不定，骨肉分离，多破大凶。", 15],
  15: ["福寿双全，福寿拱照，立身兴家，慈祥有德。", 95],
  16: ["厚重载德，安富尊荣，财官双美，功成名就。", 95],
  17: ["刚强不屈，权威刚强，突破万难，如能容忍。", 80],
  18: ["铁镜重磨，显达博学，有机变智，功成名就。", 90],
  19: ["风云蔽月，辛苦重来，虽有智谋，万事挫折。", 20],
  20: ["屋下藏金，非业破运，灾难重叠，进退维谷。", 15],
  21: ["明月中天，光风霁月，万物确立，官运亨通。", 95],
  22: ["秋草逢霜，困难疾弱，虽出豪杰，人生波折。", 25],
  23: ["壮丽果敢，旭日东升，名显四方，渐次进展。", 95],
  24: ["掘藏得金，家门余庆，金钱丰盈，白手成家。", 95],
  25: ["资性英敏，刚毅果断，才能奇特，自成大业。", 90],
  26: ["变怪异数，波澜重叠，豪杰侠义，终能奏功。", 60],
  27: ["增长无止，欲望无穷，自我强烈，多受毁谤。", 40],
  28: ["阔水浮萍，豪气侠义，四海漂泊，终生成败。", 35],
  29: ["智谋优秀，财力归集，名闻海内，成就大业。", 90],
  30: ["绝境逢生，沉浮不定，吉凶难分，大成大败。", 40],
  31: ["智勇得志，博得名利，统领众人，繁荣富贵。", 95],
  32: ["宝马金鞍，侥幸多望，贵人得助，财帛丰盈。", 95],
  33: ["旭日升天，鸾凤相会，名闻天下，隆昌至极。", 95],
  34: ["破家亡身，见识短浅，灾难不绝，难以成功。", 10],
  35: ["高楼望月，温和平静，智达通畅，文昌技艺。", 90],
  36: ["波澜重叠，沉浮万状，侠肝义胆，舍己成仁。", 45],
  37: ["猛虎出林，权威显达，热诚忠信，宜着雅量。", 90],
  38: ["磨铁成针，意志薄弱，刻意经营，才识非凡。", 65],
  39: ["富贵荣华，富贵至极，德泽四乡，子孙繁荣。", 95],
  40: ["退安保守，智谋胆力，冒险投机，沉浮不定。", 35],
  41: ["德望高大，事事如意，富贵繁荣，一帆风顺。", 95],
  42: ["寒蝉在柳，博识多能，精通世情，散漫无纪。", 55],
  43: ["散财破产，外祥内苦，邪途灾殃，财破身伤。", 10],
  44: ["烦闷辛苦，事不如意，乱世怪杰，逆境中成。", 20],
  45: ["顺风扬帆，新生泰和，顺水推舟，智谋可成。", 90],
  46: ["浪里淘金，罗网系身，离祖成家，历尽艰辛。", 30],
  47: ["点石成金，开花结果，权威进取，荣华富贵。", 95],
  48: ["古松立鹤，德智兼备，鹤立鸡群，威望荣达。", 90],
  49: ["转变不定，吉临则吉，凶来则凶，转凶为吉。", 45],
  50: ["小舟入海，一成一败，吉凶参半，先得后失。", 35],
  51: ["浮沉不定，盛衰交加，一盛一衰，竭力经营。", 40],
  52: ["达眼光明，卓识达眼，先见之明，理想实现。", 90],
  53: ["曲巷推车，外祥内苦，先甘后苦，晚年困苦。", 20],
  54: ["石上栽花，多难悲运，难望成功，沦落天涯。", 10],
  55: ["善始恶终，外美内苦，先吉后凶，先成后败。", 25],
  56: ["浪里行舟，历尽艰辛，四周障碍，缺乏勇气。", 20],
  57: ["日照春松，寒雪青松，夜莺吟春，必遭灾祸。", 55],
  58: ["晚行逆水，先苦后甜，宽宏大量，半凶半吉。", 45],
  59: ["寒蝉悲风，耐心缺乏，意志薄弱，无成之数。", 20],
  60: ["争名逐利，黑暗无光，心迷意乱，漂泊不定。", 15],
  61: ["牡丹芙蓉，名利双收，渐进向上，大业成就。", 90],
  62: ["寒冰枯木，基础虚弱，艰难困苦，灾祸频来。", 10],
  63: ["舟归平海，富贵荣达，身心安泰，福寿绵长。", 95],
  64: ["骨肉分离，骨肉分离，孤独悲愁，徒劳无功。", 10],
  65: ["巨流归海，富贵长寿，天长地久，事事成就。", 95],
  66: ["岩头走马，进退维谷，艰难不堪，内外不和。", 15],
  67: ["顺风扬帆，万事如意，天赋幸运，家道昌隆。", 90],
  68: ["发明创造，思虑周详，发明创造，独立精神。", 90],
  69: ["坐立不安，动摇不安，常陷逆境，不得时运。", 20],
  70: ["残菊逢霜，家运衰退，晚年凄凉，悲惨不绝。", 10],
  71: ["石上金花，备尝辛苦，内心劳苦，贯彻始终。", 40],
  72: ["月下老人，阴阳和合，良缘天定，家运隆昌。", 90],
  73: ["春兰秋菊，志高气傲，先劳后逸，终得安乐。", 80],
  74: ["残花待雨，沉沦逆境，秋叶落寞，智能无用。", 15],
  75: ["退守为安，退守保安，妄动招灾，宜守旧业。", 35],
  76: ["破败离散，骨肉分离，内外不和，败家之数。", 10],
  77: ["半凶半吉，先凶后吉，乐极生悲，先苦后甜。", 45],
  78: ["晚景凄凉，先甜后苦，中年发达，晚年凄凉。", 20],
  79: ["云头望月，挽回乏力，陷入逆境，精神苦闷。", 15],
  80: ["遁世入山，一生困难，辛劳不绝，早日隐遁。", 10],
  81: ["万物回春，最极之数，还本归元，繁荣发达。", 95],
};

function scoreToStar(score: number): string {
  if (score >= 95) return "★★★★★";
  if (score >= 85) return "★★★★☆";
  if (score >= 70) return "★★★☆☆";
  if (score >= 50) return "★★☆☆☆";
  return "★☆☆☆☆";
}

function scoreToColor(score: number): string {
  if (score >= 85) return "#c41e1e";
  if (score >= 70) return "#d4342c";
  if (score >= 50) return "#8b7355";
  return "#666";
}

function sanCaiAnalyze(tian: number, ren: number, di: number): string {
  const t = tian % 10;
  const r = ren % 10;
  const d = di % 10;
  const wuxingByLastDigit: Record<number, string> = {
    1: "木", 2: "木", 3: "火", 4: "火", 5: "土", 6: "土", 7: "金", 8: "金", 9: "水", 0: "水",
  };
  const tShengKe: Record<string, Record<string, string>> = {
    "木": { "木": "比和", "火": "相生", "土": "相克", "金": "被克", "水": "被生" },
    "火": { "木": "被生", "火": "比和", "土": "相生", "金": "相克", "水": "被克" },
    "土": { "木": "被克", "火": "被生", "土": "比和", "金": "相生", "水": "相克" },
    "金": { "木": "相克", "火": "被克", "土": "被生", "金": "比和", "水": "相生" },
    "水": { "木": "相生", "火": "相克", "土": "被克", "金": "被生", "水": "比和" },
  };
  const tWx = wuxingByLastDigit[t] || "土";
  const rWx = wuxingByLastDigit[r] || "土";
  const dWx = wuxingByLastDigit[d] || "土";
  const tr = tShengKe[tWx]?.[rWx] || "比和";
  const rd = tShengKe[rWx]?.[dWx] || "比和";

  if (tr === "相生" && rd === "相生") return "大吉 · 上下相生，运势顺遂";
  if (tr === "比和" && rd === "相生") return "吉 · 天地和谐，平稳安康";
  if (tr === "相生" && rd === "比和") return "吉 · 基础稳固，发展稳健";
  if (tr === "被生" && rd === "相生") return "中吉 · 得长辈助，根基渐固";
  if (tr === "相克" || rd === "相克") return "注意 · 五行有克，需多加调和";
  return "平 · 三才配置中平，顺其自然";
}

export async function fortuneName(params: NameParams): Promise<FortuneResult> {
  const name = params.name.trim();
  const chars = [...name];
  if (chars.length < 2 || chars.length > 4) {
    throw new Error("姓名需要 2-4 个字");
  }

  const strokes = chars.map(getStrokes);
  const wuge = getWugeStrokes(strokes);

  const grids: { label: string; name: string; num: number; num81: number; result: WugeResult }[] = [
    { label: "天格", name: "天", num: wuge.tian, num81: wugeTo81(wuge.tian), result: { num: wuge.tian, num81: wugeTo81(wuge.tian), score: lucky81[wugeTo81(wuge.tian)]?.[1] || 50, desc: lucky81[wugeTo81(wuge.tian)]?.[0] || "中平" } },
    { label: "人格", name: "人", num: wuge.ren, num81: wugeTo81(wuge.ren), result: { num: wuge.ren, num81: wugeTo81(wuge.ren), score: lucky81[wugeTo81(wuge.ren)]?.[1] || 50, desc: lucky81[wugeTo81(wuge.ren)]?.[0] || "中平" } },
    { label: "地格", name: "地", num: wuge.di, num81: wugeTo81(wuge.di), result: { num: wuge.di, num81: wugeTo81(wuge.di), score: lucky81[wugeTo81(wuge.di)]?.[1] || 50, desc: lucky81[wugeTo81(wuge.di)]?.[0] || "中平" } },
    { label: "外格", name: "外", num: wuge.wai, num81: wugeTo81(wuge.wai), result: { num: wuge.wai, num81: wugeTo81(wuge.wai), score: lucky81[wugeTo81(wuge.wai)]?.[1] || 50, desc: lucky81[wugeTo81(wuge.wai)]?.[0] || "中平" } },
    { label: "总格", name: "总", num: wuge.zong, num81: wugeTo81(wuge.zong), result: { num: wuge.zong, num81: wugeTo81(wuge.zong), score: lucky81[wugeTo81(wuge.zong)]?.[1] || 50, desc: lucky81[wugeTo81(wuge.zong)]?.[0] || "中平" } },
  ];

  const avgScore = Math.round(grids.reduce((s, g) => s + g.result.score, 0) / grids.length);
  const sanCai = sanCaiAnalyze(wuge.tian, wuge.ren, wuge.di);

  const gridCards = grids.map(g => `
    <div class="card" style="text-align:center;">
      <div style="font-size:12px;color:#8b7355;">${g.label}（${g.name}）</div>
      <div style="font-size:28px;color:#1a1a1a;margin:8px 0;">${g.num}</div>
      <div style="font-size:12px;color:#8b7355;">81数: ${g.num81}</div>
      <div style="color:${scoreToColor(g.result.score)};margin:4px 0;">${scoreToStar(g.result.score)}</div>
      <div style="font-size:12px;color:#8b7355;">${g.result.desc}</div>
    </div>
  `).join("");

  const content = `
<p class="no-indent" style="text-align:center;">
  <span style="font-family:'Ma Shan Zheng','Noto Serif SC',cursive;font-size:36px;">${name}</span>
</p>
<div class="score">${avgScore} 分</div>
<p style="text-align:center;color:#8b7355;" class="no-indent">${scoreToStar(avgScore)}</p>
<hr class="divider">
<p><span class="label">三才配置：</span>${sanCai}</p>
<div class="grid-2" style="margin-top:20px;">
  ${gridCards}
</div>
<hr class="divider">
<p><span class="label">笔画明细：</span>${chars.map((c, i) => `"${c}"(${strokes[i]}画)`).join(" + ")}</p>
`;

  const html = renderFortuneHTML(`姓名分析 · ${name}`, content);
  const filePath = join(OUTPUT_DIR, `suanming-name-${Date.now()}.html`);
  writeFileSync(filePath, html, "utf-8");

  const summary = `姓名"${name}"综合评分${avgScore}分。三才：${sanCai}。${grids.map(g => `${g.label}${g.num}(${g.result.desc})`).join("，")}`;

  return { htmlPath: filePath, summary, html };
}
