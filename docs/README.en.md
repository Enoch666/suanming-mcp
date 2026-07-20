<div align="center">

# 🔮 Xuanji Pavilion · suanming-mcp

**Traditional Chinese Aesthetic × Programmer Humor &nbsp;|&nbsp; Ink-Wash HTML Reports &nbsp;|&nbsp; Bazi · Liuyao · Divination · Naming · Coder's Almanac**

**中文** → [../README.md](../README.md)

[![GitHub stars](https://img.shields.io/github/stars/Enoch666/suanming-mcp?style=flat)](https://github.com/Enoch666/suanming-mcp/stargazers)
[![MCP Server](https://img.shields.io/badge/MCP-Server-blue)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/npm/v/suanming-mcp)](https://www.npmjs.com/package/suanming-mcp)
[![license](https://img.shields.io/badge/license-MIT-green)](../LICENSE)
[![Skill](https://img.shields.io/badge/Agent-Skill-orange.svg)](../SKILL.md)

</div>

---

A MCP (Model Context Protocol) fortune-telling server with **zero external dependencies** (MCP SDK only), generating ink-wash style HTML reports on traditional rice paper texture. Supports **Claude Code**, **Codex**, **OpenCode**, **Cursor**, **Windsurf**, and all MCP-compatible tools.

## ✨ Six Fortune-Telling Arts

| Tool | Function | Input | Output | Style |
|------|----------|-------|--------|-------|
| `fortune_bazi` | Bazi Chart | Birth date/time + gender | Four Pillars, Five Elements, Day Master, Daily Fortune | 🏮 Traditional |
| `fortune_liuyao` | Liuyao Divination | Question (optional) | Original & Changed Hexagram, Line Analysis | 🏮 Traditional |
| `fortune_qian` | Oracle Drawing | Question (optional) | Oracle number, 7-character poem, interpretation | 🏮 Traditional |
| `fortune_name` | Name Scoring | Name (2-4 characters) | Five-Grid Analysis, 81 Numerology, Overall Score | 🏮 Traditional |
| `fortune_mingming` | Name Generation | Surname + birth info | 5 candidates with five-element analysis | 🏮 Traditional |
| `fortune_coder` | Coder's Almanac | Programming language | Daily do's & don'ts, Bug Rate, Efficiency, Slacking Index | 💻 Humor |

## 📦 Installation

```bash
npm install -g suanming-mcp
```

## ⚙️ Configuration

### Claude Code

Add to `.mcp.json` or `~/.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "suanming": {
      "command": "npx",
      "args": ["-y", "suanming-mcp"]
    }
  }
}
```

### OpenCode / Cursor / Windsurf

Add the same server configuration in the respective MCP config file.

## 🎯 Usage

Just chat naturally with your AI assistant:

- "Calculate my Bazi, born May 20, 1990 at 10 AM, male"
- "Cast a divination about my career"
- "Draw an oracle for wealth"
- "Score the name John Smith"
- "Generate names with surname Li, born March 15, 2024"
- "Is today good for writing Python?"

## 🎨 Visual Design

All results are rendered as ink-wash style HTML pages:

- Rice paper texture background (CSS noise overlay)
- Calligraphy title font (Google Fonts Ma Shan Zheng)
- Cinnabar seal stamp ("玄机阁印")
- Bagua symbols (Unicode ☰☱☲☳☴☵☶☷)
- Vertical oracle text, fade-in animations

## ⚠️ Disclaimer

This project is for **entertainment and learning purposes only**. Do NOT make life-changing decisions based on its outputs. See [USE_AND_RISK_NOTICE.md](./USE_AND_RISK_NOTICE.md) for details.

## 📄 License

MIT © 2026
