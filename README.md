# AI Meeting - 智能面试管理系统

一个基于 Next.js 14 构建的全栈 AI 面试管理平台，集成了多种 AI 功能模块，包括智能面试、代码生成、学习管理和算法练习等。

## 🚀 项目概述

AI Meeting 是一个综合性的 AI 驱动平台，旨在提供完整的面试管理解决方案。项目采用模块化设计，包含多个独立的功能模块，每个模块都可以独立运行和扩展。

## 🛠️ 技术栈

### 前端技术

- **Next.js 14** - React 全栈框架，使用 App Router
- **TypeScript** - 类型安全的 JavaScript 超集
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 现代化的 UI 组件库
- **Radix UI** - 无样式的 UI 原语组件
- **Lucide React** - 精美的图标库

### 后端技术

- **Prisma** - 现代化数据库 ORM
- **MySQL** - 关系型数据库
- **Next.js API Routes** - 服务端 API
- **Vercel AI SDK** - AI 集成工具包

### AI 集成

- **多模型支持**：
  - OpenAI GPT 系列
  - Anthropic Claude
  - Google AI
  - Mistral
  - DeepSeek
  - 阿里云通义千问
- **Mem0** - AI 记忆管理系统
- **LangChain** - AI 应用开发框架

### 其他工具

- **Supabase** - 身份认证和数据库
- **PostHog** - 产品分析
- **Vercel Analytics** - 性能监控
- **E2B** - 代码执行沙箱

## 📁 项目结构

```
app/
├── (AI)/                    # AI聊天模块
│   └── components/          # AI聊天组件
├── (Algo)/                  # 算法练习模块
│   ├── array.js            # 数组算法
│   ├── stack.js            # 栈数据结构
│   ├── string.js           # 字符串算法
│   └── class.js            # 面向对象设计模式
├── (Kids)/                  # 代码生成模块
│   ├── actions/            # 服务端操作
│   └── apiss/              # API路由
├── (Meeting)/               # 面试管理模块
│   ├── components/         # 面试组件
│   ├── hooks/              # 自定义Hooks
│   └── Meet/               # 面试流程
├── (Study)/                 # 学习管理模块
│   ├── components/         # 学习组件
│   └── Main/               # 主学习界面
└── api/                     # API路由
    ├── chat/               # 聊天API
    ├── memory/             # 记忆管理API
    ├── interViewer/        # 面试官API
    └── timer/              # 计时器API
```

## 🎯 核心功能

### 1. 智能面试系统 (Meeting)

- **面试时间线管理** - 基于时间轴的面试流程控制
- **实时计时器** - 精确的面试时间跟踪
- **AI 面试官** - 智能化的面试对话
- **记忆系统** - 基于 Mem0 的面试记忆管理
- **评分系统** - 自动化的面试评分
- **PDF 文档处理** - 职位要求和简历解析

### 2. AI 代码生成 (Kids)

- **多模板支持** - Next.js、Vue.js、Streamlit、Gradio 等
- **实时预览** - 代码生成后的即时预览
- **沙箱执行** - 安全的代码执行环境
- **多模态输入** - 支持文本和图片输入
- **流式响应** - 实时的代码生成过程

### 3. 学习管理系统 (Study)

- **场景化学习** - 多种学习场景支持
- **API 密钥管理** - 安全的密钥配置
- **学习进度跟踪** - 个人学习记录
- **多媒体支持** - 图片和语音学习

### 4. 算法练习 (Algo)

- **数据结构实现** - 栈、链表、数组等
- **设计模式** - 面向对象设计模式
- **算法题解** - 常见算法问题解决方案

### 5. AI 聊天助手 (AI)

- **多模型支持** - 集成多种 AI 模型
- **上下文记忆** - 智能的对话记忆
- **流式对话** - 实时的对话体验

## 🚀 快速开始

### 环境要求

- Node.js 18+
- MySQL 8.0+
- Git

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd AiMeeting
```

2. **安装依赖**

```bash
npm install
```

3. **环境配置**
   创建 `.env.local` 文件：

```env
# 数据库配置
DATABASE_URL="mysql://username:password@localhost:3306/ai_meeting"

# AI模型配置
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
NEXT_API_key="your-aliyun-key"

# Mem0配置
MEM0_API_KEY="your-mem0-key"
MEM0_ORGANIZATION_NAME="your-org"
MEM0_PROJECT_NAME="your-project"

# Supabase配置
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-key"

# 其他配置
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. **数据库初始化**

```bash
npx prisma generate
npx prisma db push
```

5. **启动开发服务器**

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 📊 数据库设计

### 核心数据模型

```prisma
model User {
  id        String            @id @default(uuid())
  name      String
  email     String            @unique
  password  String
  content   String            @db.Text
  aiSummary String            @db.Text
  records   InterviewRecord[]
}

model InterviewSession {
  id                 String            @id @default(uuid())
  startTime          DateTime
  endTime            DateTime?
  status             String            @default("pending")
  candidateName      String?
  position           String?
  interviewer        String?
  technicalScore     Float?
  communicationScore Float?
  overallScore       Float?
  records            InterviewRecord[]
}

model InterviewRecord {
  id        String           @id @default(uuid())
  userId    String
  sessionId String
  step      Int
  content   String           @db.Text
  timestamp DateTime         @default(now())
  type      String
  session   InterviewSession @relation(fields: [sessionId], references: [id])
  user      User             @relation(fields: [userId], references: [id])
}
```

## 🔧 开发指南

### 添加新的 AI 模型

1. 在 `lib/models.json` 中添加模型配置
2. 在 `lib/models.ts` 中添加提供商配置
3. 更新 UI 组件以支持新模型

### 添加新的面试模板

1. 在 `app/api/chat/prompt.ts` 中定义新的提示词
2. 在 `app/(Meeting)/components/InterviewTimeline.tsx` 中添加时间线配置
3. 更新相关的 API 路由

### 扩展记忆系统

1. 在 `lib/memory.ts` 中添加新的记忆类型
2. 在 `app/api/memory/` 中添加相应的 API 端点
3. 更新前端组件以支持新的记忆功能

## 🚀 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 部署到生产环境

### Docker 部署

```bash
# 构建镜像
docker build -t ai-meeting .

# 运行容器
docker run -p 3000:3000 ai-meeting
```

## 📈 性能优化

- **代码分割** - 使用动态导入减少初始包大小
- **缓存策略** - 实现多层缓存机制
- **数据库优化** - 使用联合索引优化查询性能
- **AI 响应优化** - 流式响应和记忆管理

## 🔒 安全特性

- **身份认证** - 基于 Supabase 的安全认证
- **API 限流** - 防止 API 滥用
- **数据加密** - 敏感数据加密存储
- **输入验证** - 严格的输入验证和清理

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [E2B](https://e2b.dev) - 代码执行沙箱
- [Vercel AI SDK](https://sdk.vercel.ai) - AI 集成工具
- [shadcn/ui](https://ui.shadcn.com) - UI 组件库
- [Prisma](https://prisma.io) - 数据库 ORM


⭐ 如果这个项目对你有帮助，请给我们一个星标！
