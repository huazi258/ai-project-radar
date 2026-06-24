import type { AiAnalysisPreview, LearningRecord } from "@/types/record";
import type { ProjectCardData, ProjectPrdPreview } from "@/types/project";

export const mockRecords: LearningRecord[] = [
  {
    id: "1",
    title: "用 AI 辅助整理 React 学习笔记",
    content:
      "今天尝试用 AI 把 React Hooks 的学习笔记重新整理成结构化内容。我先输入了原始笔记，然后让 AI 输出摘要、技能标签和下一步练习任务。过程中发现 prompt 如果没有明确 JSON 或 Markdown 结构，结果会比较发散。",
    type: "ai_usage",
    typeLabel: "AI 使用记录",
    tags: ["React", "AI", "Prompt"],
    createdAt: "今天 09:30",
    summary:
      "通过 AI 整理 React Hooks 笔记，初步形成了摘要、技能标签和后续练习任务。",
  },
  {
    id: "2",
    title: "完成 Next.js App Router 入门练习",
    content:
      "完成了 App Router 的 layout、page 和 route segment 基础练习，理解了页面组织方式。",
    type: "tutorial_note",
    typeLabel: "教程笔记",
    tags: ["Next.js", "App Router"],
    createdAt: "昨天 21:10",
    summary:
      "掌握了 App Router 的基础目录结构，可以开始拆分静态页面和组件。",
  },
  {
    id: "3",
    title: "想到一个学习复盘自动整理工具",
    content:
      "希望把每天的学习记录自动整理成项目想法和 PRD，减少从笔记到作品之间的断层。",
    type: "project_idea",
    typeLabel: "项目灵感",
    tags: ["学习复盘", "项目化"],
    createdAt: "周一 18:45",
    summary:
      "从日常学习复盘中提炼项目机会，适合转化为 AI 学习项目雷达的核心功能。",
  },
];

export const mockRecordAnalysis: AiAnalysisPreview = {
  summary:
    "这条记录展示了如何用 AI 将 React Hooks 学习笔记整理为结构化成果，并发现 prompt 输出格式需要提前约束。",
  skills: ["React Hooks", "Prompt 设计", "Markdown 整理", "学习复盘"],
  nextActions: [
    "补充一个 React Hooks 小练习并记录过程",
    "把 AI 输出格式固定为 JSON 和 Markdown 两部分",
    "将这条记录转化为一个学习笔记整理工具的项目卡片",
  ],
  markdown:
    "## React Hooks 学习笔记整理\n\n- 技能：React Hooks、Prompt 设计、Markdown 整理\n- 问题：AI 输出格式需要更明确\n- 下一步：完成一个 Hooks 小练习并生成项目卡片",
};

export const mockProjects: ProjectCardData[] = [
  {
    id: "1",
    name: "Learning Log Analyzer",
    description:
      "把学习记录整理成摘要、技能标签、暴露问题和下一步行动的 AI 学习复盘工具。",
    targetUser: "正在学习 AI、编程和全栈开发的个人学习者",
    painPoint:
      "学习过程中产生了大量零散记录，但很难把这些内容沉淀成可展示的项目成果。",
    mvpScope: [
      "新建学习记录",
      "展示记录详情",
      "预留 AI 分析结果区域",
      "生成项目卡片",
      "复制 Markdown",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "AI API"],
    status: "idea",
    createdAt: "今天 10:20",
  },
  {
    id: "2",
    name: "Prompt Practice Board",
    description:
      "用于记录 prompt 练习、对比输出效果并沉淀可复用模板的练习看板。",
    targetUser: "正在练习 AI 工具使用的人",
    painPoint: "prompt 练习结果没有被系统化记录和复盘。",
    mvpScope: ["Prompt 记录", "结果摘要", "模板收藏"],
    techStack: ["Next.js", "TypeScript", "Markdown"],
    status: "planning",
    createdAt: "昨天 19:40",
  },
  {
    id: "3",
    name: "Tutorial Note Radar",
    description:
      "把教程笔记转化为练习任务和项目灵感，帮助学习者从看教程走向动手做。",
    targetUser: "跟教程学习编程的初学者",
    painPoint: "教程看完后缺少可执行的练习路径。",
    mvpScope: ["笔记录入", "任务提取", "项目建议"],
    techStack: ["Next.js", "Tailwind CSS"],
    status: "idea",
    createdAt: "周一 18:45",
  },
];

export const mockProjectPrd: ProjectPrdPreview = {
  title: "简易 PRD 预览",
  markdown:
    "# Learning Log Analyzer\n\n## 1. 项目背景\n学习记录容易分散，缺少项目化整理方式。\n\n## 2. MVP 功能\n- 新建记录\n- AI 分析结果展示\n- 项目卡片生成\n- Markdown 复制\n\n## 3. 验收标准\n用户可以从一条学习记录看到结构化项目方向。",
};

export const dashboardStats = [
  { label: "本周记录数量", value: "12", description: "比上周多 3 条" },
  { label: "项目数量", value: "4", description: "2 个正在规划中" },
];
