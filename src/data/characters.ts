export interface NameChar {
  strokes: number;
  wuxing: "金" | "木" | "水" | "火" | "土";
  meaning: string;
}

export const NAME_CHARS: Record<string, NameChar> = {
  // 金字部
  "鑫": { strokes: 24, wuxing: "金", meaning: "财富兴盛" },
  "铭": { strokes: 14, wuxing: "金", meaning: "铭记不忘，才华出众" },
  "锐": { strokes: 15, wuxing: "金", meaning: "锐意进取，敏锐聪慧" },
  "钧": { strokes: 12, wuxing: "金", meaning: "雷霆万钧，有威严" },
  "锦": { strokes: 16, wuxing: "金", meaning: "锦绣前程，美好" },
  "钰": { strokes: 13, wuxing: "金", meaning: "珍宝，高贵" },
  "钦": { strokes: 12, wuxing: "金", meaning: "钦敬，令人敬佩" },
  "铎": { strokes: 21, wuxing: "金", meaning: "大铃，警示，有威严" },
  "铮": { strokes: 16, wuxing: "金", meaning: "铮铮铁骨，刚正" },
  "铠": { strokes: 18, wuxing: "金", meaning: "铠甲，保护，坚韧" },
  "银": { strokes: 14, wuxing: "金", meaning: "银光闪闪，纯洁" },
  "锋": { strokes: 15, wuxing: "金", meaning: "锋芒毕露，锐利" },
  "锡": { strokes: 16, wuxing: "金", meaning: "赐予，珍贵" },
  "镜": { strokes: 19, wuxing: "金", meaning: "明镜高悬，清醒" },
  "钢": { strokes: 16, wuxing: "金", meaning: "刚强坚毅，百炼成钢" },
  "铃": { strokes: 13, wuxing: "金", meaning: "铃声清脆，悦耳" },
  "钟": { strokes: 17, wuxing: "金", meaning: "钟灵毓秀，汇聚灵气" },
  "瑞": { strokes: 14, wuxing: "金", meaning: "祥瑞，吉祥如意" },

  // 木字部
  "林": { strokes: 8, wuxing: "木", meaning: "生机勃勃，繁荣" },
  "森": { strokes: 12, wuxing: "木", meaning: "茂盛繁荣，深厚" },
  "柏": { strokes: 9, wuxing: "木", meaning: "坚韧不拔，长青" },
  "松": { strokes: 8, wuxing: "木", meaning: "坚韧高洁，长寿" },
  "桐": { strokes: 10, wuxing: "木", meaning: "高洁优雅，凤凰所栖" },
  "梓": { strokes: 11, wuxing: "木", meaning: "栋梁之材，故乡情" },
  "楷": { strokes: 13, wuxing: "木", meaning: "楷模典范，正直" },
  "楠": { strokes: 13, wuxing: "木", meaning: "珍贵木材，稳重" },
  "槿": { strokes: 15, wuxing: "木", meaning: "朝花夕拾，美丽" },
  "荣": { strokes: 14, wuxing: "木", meaning: "繁荣昌盛，荣耀" },
  "棠": { strokes: 12, wuxing: "木", meaning: "甘棠遗爱，仁政" },
  "栋": { strokes: 12, wuxing: "木", meaning: "栋梁之才，中坚" },
  "柳": { strokes: 9, wuxing: "木", meaning: "柳暗花明，柔美" },
  "桂": { strokes: 10, wuxing: "木", meaning: "桂冠，荣誉，芳香" },
  "桦": { strokes: 16, wuxing: "木", meaning: "白桦挺拔，正直" },
  "枫": { strokes: 13, wuxing: "木", meaning: "红叶如火，热情" },
  "樱": { strokes: 21, wuxing: "木", meaning: "樱花烂漫，美丽" },
  "棋": { strokes: 12, wuxing: "木", meaning: "棋高一着，智慧" },
  "柯": { strokes: 9, wuxing: "木", meaning: "枝叶繁茂，有规矩" },
  "桥": { strokes: 16, wuxing: "木", meaning: "桥梁，连接沟通" },
  "楚": { strokes: 13, wuxing: "木", meaning: "清楚明白，聪慧" },
  "梦": { strokes: 14, wuxing: "木", meaning: "梦想成真，追求" },

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
  "渊": { strokes: 12, wuxing: "水", meaning: "学识渊博，深不可测" },
  "溪": { strokes: 14, wuxing: "水", meaning: "溪水潺潺，灵动" },
  "漫": { strokes: 15, wuxing: "水", meaning: "浪漫自由，不受拘束" },
  "潇": { strokes: 20, wuxing: "水", meaning: "潇洒自如，飘逸" },
  "沛": { strokes: 8, wuxing: "水", meaning: "精力充沛，旺盛" },
  "泓": { strokes: 9, wuxing: "水", meaning: "水深而广，包容" },
  "淳": { strokes: 12, wuxing: "水", meaning: "淳朴善良，真诚" },
  "深": { strokes: 12, wuxing: "水", meaning: "深沉内敛，有内涵" },
  "澍": { strokes: 16, wuxing: "水", meaning: "及时雨，恩泽" },
  "洛": { strokes: 10, wuxing: "水", meaning: "洛水，文化底蕴" },

  // 火字部
  "煜": { strokes: 13, wuxing: "火", meaning: "光明照耀，辉煌" },
  "烨": { strokes: 16, wuxing: "火", meaning: "光辉灿烂，耀眼" },
  "炜": { strokes: 9, wuxing: "火", meaning: "光明，有文采" },
  "焕": { strokes: 11, wuxing: "火", meaning: "焕然一新，光彩" },
  "灵": { strokes: 7, wuxing: "火", meaning: "灵动聪慧，机敏" },
  "昭": { strokes: 9, wuxing: "火", meaning: "昭示天下，光明正大" },
  "明": { strokes: 8, wuxing: "火", meaning: "光明磊落，智慧" },
  "昱": { strokes: 9, wuxing: "火", meaning: "日光，光明，前程似锦" },
  "晟": { strokes: 11, wuxing: "火", meaning: "兴盛旺盛，光明" },
  "昊": { strokes: 8, wuxing: "火", meaning: "昊天罔极，广阔" },
  "昕": { strokes: 8, wuxing: "火", meaning: "黎明，新的开始" },
  "旭": { strokes: 6, wuxing: "火", meaning: "旭日东升，朝气蓬勃" },
  "昂": { strokes: 8, wuxing: "火", meaning: "气宇轩昂，自信" },
  "昀": { strokes: 8, wuxing: "火", meaning: "日光，温暖和煦" },
  "炫": { strokes: 9, wuxing: "火", meaning: "光彩炫目，耀眼" },
  "晖": { strokes: 13, wuxing: "火", meaning: "春晖普照，温暖" },
  "煦": { strokes: 13, wuxing: "火", meaning: "和煦温暖，亲切" },
  "照": { strokes: 13, wuxing: "火", meaning: "照耀四方，光明" },

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
  "岚": { strokes: 7, wuxing: "土", meaning: "山间雾气，神秘" },
  "岩": { strokes: 8, wuxing: "土", meaning: "岩石般坚毅，可靠" },
  "峙": { strokes: 9, wuxing: "土", meaning: "对峙而立，稳重" },
  "岑": { strokes: 7, wuxing: "土", meaning: "小而高的山，独特" },
  "峥": { strokes: 11, wuxing: "土", meaning: "峥嵘岁月，不平凡" },
  "峦": { strokes: 12, wuxing: "土", meaning: "峰峦起伏，雄伟" },
  "屹": { strokes: 6, wuxing: "土", meaning: "屹立不倒，坚定" },
  "域": { strokes: 11, wuxing: "土", meaning: "疆域广阔，眼界开阔" },
  "堂": { strokes: 11, wuxing: "土", meaning: "堂堂正正，光明" },
  "墉": { strokes: 14, wuxing: "土", meaning: "城墙，坚固可靠" },

  // 通用好字（多义）
  "文": { strokes: 4, wuxing: "水", meaning: "文采斐然，有才华" },
  "华": { strokes: 14, wuxing: "水", meaning: "才华横溢，中华气韵" },
  "雅": { strokes: 12, wuxing: "木", meaning: "高雅脱俗，优雅" },
  "正": { strokes: 5, wuxing: "金", meaning: "正直不阿，端正" },
  "宏": { strokes: 7, wuxing: "水", meaning: "宏图大展，广阔" },
  "志": { strokes: 7, wuxing: "火", meaning: "志存高远，有理想" },
  "博": { strokes: 12, wuxing: "水", meaning: "博学多才，广博" },
  "睿": { strokes: 14, wuxing: "金", meaning: "睿智通达，聪明" },
  "轩": { strokes: 10, wuxing: "土", meaning: "气宇轩昂，高大" },
  "逸": { strokes: 15, wuxing: "土", meaning: "飘逸洒脱，超逸" },
  "哲": { strokes: 10, wuxing: "火", meaning: "明哲睿智，有智慧" },
  "德": { strokes: 15, wuxing: "火", meaning: "品德高尚，仁德" },
  "宁": { strokes: 14, wuxing: "火", meaning: "宁静致远，安宁" },
  "远": { strokes: 17, wuxing: "土", meaning: "远见卓识，长远" },
  "然": { strokes: 12, wuxing: "金", meaning: "自然从容，淡然" },
  "恒": { strokes: 10, wuxing: "水", meaning: "持之以恒，恒久" },
  "思": { strokes: 9, wuxing: "金", meaning: "深思熟虑，有思想" },
  "悦": { strokes: 11, wuxing: "金", meaning: "喜悦快乐，愉悦" },

  // 勇武字
  "勇": { strokes: 9, wuxing: "土", meaning: "勇敢无畏，勇猛" },
  "威": { strokes: 9, wuxing: "土", meaning: "威风凛凛，有威严" },
  "豪": { strokes: 14, wuxing: "水", meaning: "豪迈不羁，大气" },
  "杰": { strokes: 8, wuxing: "木", meaning: "杰出卓越，优秀" },
  "龙": { strokes: 16, wuxing: "火", meaning: "龙腾虎跃，尊贵" },
  "鹏": { strokes: 19, wuxing: "水", meaning: "鹏程万里，志向远大" },
  "腾": { strokes: 20, wuxing: "火", meaning: "腾飞崛起，进步" },
  "飞": { strokes: 9, wuxing: "水", meaning: "飞翔高远，自由" },

  // 柔美字（男女通用）
  "雪": { strokes: 11, wuxing: "水", meaning: "冰雪聪明，纯洁" },
  "雨": { strokes: 8, wuxing: "水", meaning: "雨露滋润，恩惠" },
  "晴": { strokes: 12, wuxing: "火", meaning: "晴朗明媚，开心" },
  "瑶": { strokes: 15, wuxing: "火", meaning: "美玉，珍贵美好" },
  "琪": { strokes: 13, wuxing: "木", meaning: "美玉，珍奇" },
  "琳": { strokes: 13, wuxing: "木", meaning: "琳琅满目，美好" },
  "璇": { strokes: 16, wuxing: "火", meaning: "美玉，珍贵" },
  "瑾": { strokes: 16, wuxing: "火", meaning: "美玉，品德高尚" },
  "瑜": { strokes: 14, wuxing: "金", meaning: "美玉，瑕不掩瑜" },
  "秀": { strokes: 7, wuxing: "金", meaning: "秀丽优秀，出众" },
  "慧": { strokes: 15, wuxing: "水", meaning: "智慧聪慧，聪明" },
  "敏": { strokes: 11, wuxing: "水", meaning: "敏而好学，机敏" },
  "静": { strokes: 16, wuxing: "金", meaning: "宁静致远，沉稳" },
  "婉": { strokes: 11, wuxing: "土", meaning: "温婉柔美，和顺" },
  "婷": { strokes: 12, wuxing: "火", meaning: "婷婷玉立，优美" },
  "妍": { strokes: 7, wuxing: "水", meaning: "美丽动人，美好" },
  "嫣": { strokes: 14, wuxing: "土", meaning: "嫣然一笑，美丽" },
  "芳": { strokes: 10, wuxing: "木", meaning: "芳香四溢，美好" },
  "兰": { strokes: 23, wuxing: "木", meaning: "兰花高雅，君子之风" },
  "莲": { strokes: 17, wuxing: "木", meaning: "莲花高洁，出淤泥不染" },
  "薇": { strokes: 19, wuxing: "木", meaning: "蔷薇美丽，坚韧" },
};

/** 简体字到繁体/康熙字笔画映射 */
export const STROKE_MAP: Record<string, number> = {
  "王": 5, "李": 7, "张": 11, "刘": 15, "陈": 16, "杨": 13, "赵": 14,
  "黄": 12, "周": 8, "吴": 7, "徐": 10, "孙": 10, "胡": 11, "朱": 6,
  "高": 10, "林": 8, "何": 7, "郭": 15, "马": 10, "罗": 19, "梁": 11,
  "宋": 7, "郑": 19, "谢": 17, "韩": 17, "唐": 10, "冯": 12, "于": 3,
  "董": 15, "萧": 19, "程": 12, "曹": 11, "袁": 10, "邓": 19, "许": 11,
  "傅": 12, "沈": 8, "曾": 12, "彭": 12, "吕": 7, "苏": 22, "卢": 16,
  "蒋": 17, "蔡": 17, "贾": 13, "丁": 2, "魏": 18, "薛": 19, "叶": 15,
  "阎": 16, "余": 7, "潘": 16, "杜": 7, "戴": 18, "夏": 10, "钟": 17,
  "汪": 8, "田": 5, "任": 6, "姜": 9, "范": 15, "方": 4, "石": 5,
  "姚": 9, "谭": 19, "廖": 14, "邹": 17, "熊": 16, "金": 8, "陆": 16,
  "郝": 14, "孔": 4, "白": 5, "崔": 11, "康": 11, "毛": 4, "邱": 12,
  "秦": 10, "江": 7, "史": 5, "顾": 21, "侯": 9, "邵": 12, "孟": 8,
  "龙": 16, "万": 15, "段": 9, "雷": 13, "钱": 16, "汤": 13, "尹": 4,
  "黎": 15, "易": 8, "常": 11, "武": 8, "乔": 12, "贺": 12, "赖": 16,
  "龚": 22, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6,
  "七": 7, "八": 8, "九": 9, "十": 10,
};

/**
 * 获取单字的康熙笔画数
 * 优先从 NAME_CHARS 或 STROKE_MAP 获取，否则用 Unicode 估算
 */
export function getStrokes(char: string): number {
  if (NAME_CHARS[char]) return NAME_CHARS[char].strokes;
  if (STROKE_MAP[char]) return STROKE_MAP[char];
  // 简单估算：CJK 统一汉字范围
  const code = char.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FFF) {
    return Math.max(1, Math.min(30, Math.floor((code - 0x4E00) / 500) + 4));
  }
  return 1;
}
