import type { AiRecordAnalysis } from "@/types/ai";

export async function mockAnalyzeRecord(): Promise<AiRecordAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    summary:
      "这条学习记录已经具备转化为项目线索的基础：有明确学习主题、实践过程和后续可展开的问题。",
    skills: ["学习复盘", "问题拆解", "项目化思维", "Markdown 整理"],
    problems: [
      "记录中还缺少明确的验收标准",
      "下一步行动可以再拆得更小",
      "项目目标用户还没有完全定义",
    ],
    next_actions: [
      "补充这条记录对应的学习目标",
      "把遇到的问题整理成 2 到 3 个待解决任务",
      "尝试把记录转成一个最小项目卡片",
    ],
    markdown_output:
      "## AI 分析摘要\n\n这条记录适合继续沉淀为一个学习项目。\n\n### 技能标签\n- 学习复盘\n- 问题拆解\n- 项目化思维\n\n### 暴露问题\n- 缺少明确验收标准\n- 下一步行动还可以继续拆分\n\n### 下一步行动\n- 补充学习目标\n- 拆分待解决任务\n- 转成项目卡片草稿",
  };
}
