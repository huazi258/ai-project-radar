# AI Project Radar V2 页面结构

## 1. 页面设计原则

第二版页面围绕“个人 AI 学习工作台”展开。首页和 Dashboard 需要让用户快速进入三个核心模块：

- 学习记录
- 结构化表达
- 项目思考

页面结构应保持简单，优先复用第一版已有的登录、记录、项目和 PRD 页面能力。

## 2. 推荐路由总览

```text
/
/login
/dashboard

/learning
/learning/new
/learning/[id]

/structure
/structure/new
/structure/[id]

/project-thinking
/project-thinking/new
/project-thinking/[id]

/records
/records/new
/records/[id]

/projects
/projects/[id]

/settings
```

## 3. 首页 /

首页用于展示产品定位和进入工作台入口。

模块：

- 产品名称：AI Project Radar
- 一句话定位：个人 AI 学习工作台
- 三个核心能力入口说明
- 开始使用按钮

第一版已有首页可以保留，但文案需要从“记录转项目”扩展为“学习、表达、项目思考”。

## 4. Dashboard /dashboard

Dashboard 是第二版的主工作台。

模块：

- 欢迎语
- 三个模块入口卡片
- 最近学习记录
- 最近结构化表达
- 最近项目思考
- 最近项目卡片

入口卡片：

```text
学习记录 -> /learning/new
结构化表达 -> /structure/new
项目思考 -> /project-thinking/new
```

第一版的记录和项目统计可以继续保留，但不应让 Dashboard 变成复杂数据分析页。

## 5. 学习记录页面

### 5.1 /learning

学习记录列表页。

模块：

- 页面标题
- 新建学习记录按钮
- 学习记录列表
- 每条记录展示标题、类型、标签、创建时间、是否已有 AI 分析

### 5.2 /learning/new

新建学习记录页。

模块：

- 标题输入
- 学习类型选择
- 标签输入
- 学习内容输入
- 保存按钮
- 保存并分析按钮

### 5.3 /learning/[id]

学习记录详情页。

模块：

- 原始学习内容
- AI 学习分析按钮
- AI 分析结果
- 复制 Markdown 按钮
- 生成项目思考按钮

说明：

第二版可以暂时让 `/learning` 复用第一版 `/records` 的实现思路。是否保留 `/records` 作为旧路由，需要在开发阶段决定。

## 6. 结构化表达页面

### 6.1 /structure

结构化表达历史列表。

模块：

- 页面标题
- 新建表达整理按钮
- 表达记录列表
- 每条记录展示标题、输入摘要、创建时间

### 6.2 /structure/new

新建结构化表达页。

模块：

- 标题输入
- 场景选择
- 原始描述输入
- 表达目标选择
- AI 整理按钮

场景建议：

- 学习复盘
- 需求描述
- Codex 任务
- 项目说明
- 普通表达优化

### 6.3 /structure/[id]

结构化表达详情页。

模块：

- 原始输入
- AI 整理结果
- 要点拆分
- 可复制 Markdown
- 可选 Codex 任务提示词

## 7. 项目思考页面

### 7.1 /project-thinking

项目思考列表页。

模块：

- 页面标题
- 新建项目思考按钮
- 项目思考记录列表
- 每条记录展示标题、项目方向、状态、创建时间

### 7.2 /project-thinking/new

新建项目思考页。

模块：

- 标题输入
- 项目想法输入
- 当前阶段选择
- 约束条件输入
- AI 项目规划按钮

当前阶段建议：

- idea
- planning
- building
- review

### 7.3 /project-thinking/[id]

项目思考详情页。

模块：

- 原始想法
- AI 项目方向
- 目标用户
- 核心痛点
- MVP 范围
- 推荐技术方案
- 风险提示
- 生成项目卡片按钮
- 生成 PRD 按钮
- 复制 Markdown 按钮

说明：

项目思考可以直接生成 projects 数据，也可以先保存为独立思考记录，再由用户决定是否转成项目卡片。

## 8. 第一版路由兼容

第一版已有路由：

```text
/records
/records/new
/records/[id]
/projects
/projects/[id]
```

第二版建议：

- `/records` 暂时保留，避免破坏第一版功能。
- 新增 `/learning` 作为更贴近第二版定位的入口。
- `/projects` 继续作为最终项目卡片库。
- `/project-thinking` 作为项目想法进入项目卡片前的工作区。

## 9. 导航结构

主导航建议：

```text
工作台
学习记录
结构化表达
项目思考
项目库
设置
```

不建议在第二版加入过多导航层级。三个核心模块应始终保持一跳可达。
