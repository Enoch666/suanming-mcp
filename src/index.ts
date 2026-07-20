#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { fortuneBazi } from "./tools/bazi.js";
import { fortuneLiuyao } from "./tools/liuyao.js";
import { fortuneQian } from "./tools/qian.js";
import { fortuneName } from "./tools/name.js";
import { fortuneMingming } from "./tools/mingming.js";
import { fortuneCoder } from "./tools/coder.js";

const server = new Server(
  {
    name: "suanming-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "fortune_bazi",
      description: "八字排盘 — 输入出生年月日时和性别，推算四柱八字、五行分布、日主分析和今日运势",
      inputSchema: {
        type: "object",
        properties: {
          year: { type: "number", description: "出生年份（公历），如 1990" },
          month: { type: "number", description: "出生月份（公历），1-12" },
          day: { type: "number", description: "出生日期（公历），1-31" },
          hour: { type: "number", description: "出生小时（24小时制），0-23" },
          gender: { type: "string", enum: ["male", "female"], description: "性别：male=男, female=女" },
          calendar: { type: "string", enum: ["solar", "lunar"], description: "历法类型，默认 solar(公历)" },
        },
        required: ["year", "month", "day", "hour", "gender"],
      },
    },
    {
      name: "fortune_liuyao",
      description: "六爻起卦 — 心中默念问题，自动起卦得本卦变卦，解读卦象",
      inputSchema: {
        type: "object",
        properties: {
          question: { type: "string", description: "心中所想的问题（可选，不填则默认为运势）" },
        },
      },
    },
    {
      name: "fortune_qian",
      description: "抽签 — 从灵签筒中抽取一支签，得签文和解签白话文",
      inputSchema: {
        type: "object",
        properties: {
          question: { type: "string", description: "心中所想的问题（可选，默认为运势）" },
        },
      },
    },
    {
      name: "fortune_name",
      description: "姓名打分 — 输入姓名，五格剖象法分析天格/人格/地格/外格/总格，综合评分",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "需要分析的姓名，2-4个字" },
        },
        required: ["name"],
      },
    },
    {
      name: "fortune_mingming",
      description: "起名 — 输入姓氏和出生信息，根据八字五行补缺生成候选名字",
      inputSchema: {
        type: "object",
        properties: {
          surname: { type: "string", description: "姓氏，如 张、李、王" },
          year: { type: "number", description: "出生年份（公历），可选" },
          month: { type: "number", description: "出生月份（公历），可选" },
          day: { type: "number", description: "出生日期（公历），可选" },
          hour: { type: "number", description: "出生小时（24小时制），可选" },
          gender: { type: "string", enum: ["male", "female"], description: "性别（可选）" },
          count: { type: "number", description: "生成候选名字数量，默认5个" },
        },
        required: ["surname"],
      },
    },
    {
      name: "fortune_coder",
      description: "程序员黄历 — 输入编程语言，看今天的宜忌、代码气运和幸运语言",
      inputSchema: {
        type: "object",
        properties: {
          language: { type: "string", description: "你用的编程语言，如 Python、JavaScript、Rust" },
        },
        required: ["language"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: { htmlPath: string; summary: string; html: string };

    switch (name) {
      case "fortune_bazi":
        result = await fortuneBazi(args as {
          year: number;
          month: number;
          day: number;
          hour: number;
          gender: "male" | "female";
          calendar?: "solar" | "lunar";
        });
        break;
      case "fortune_liuyao":
        result = await fortuneLiuyao(args as { question?: string });
        break;
      case "fortune_qian":
        result = await fortuneQian(args as { question?: string });
        break;
      case "fortune_name":
        result = await fortuneName(args as { name: string });
        break;
      case "fortune_mingming":
        result = await fortuneMingming(args as {
          surname: string;
          year?: number;
          month?: number;
          day?: number;
          hour?: number;
          gender?: "male" | "female";
          count?: number;
        });
        break;
      case "fortune_coder":
        result = await fortuneCoder(args as { language: string });
        break;
      default:
        throw new Error(`未知工具: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: `✨ ${result.summary}\n\n📄 水墨命理页面已生成：${result.htmlPath}\n请用浏览器打开查看完整命理分析。`,
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `❌ 算命出错：${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🔮 玄机阁算命 MCP Server 已启动");
}

main().catch((error) => {
  console.error("启动失败:", error);
  process.exit(1);
});
