# SDKWork Course Frontend Application Plan

## 概述

基于已有的 Rust 后端和 TypeScript SDK 构建完整的在线课程应用，支持 PC、移动端、H5 三端。

## 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Apps                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  PC Web  │  │  Mobile  │  │    H5    │              │
│  │ (React)  │  │ (React)  │  │ (React)  │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       └──────────────┼──────────────┘                   │
│                      ▼                                  │
│            ┌─────────────────┐                          │
│            │  Shared Hooks   │                          │
│            │  & Components   │                          │
│            └────────┬────────┘                          │
│                     ▼                                   │
│            ┌─────────────────┐                          │
│            │   Course SDK    │                          │
│            │   (TypeScript)  │                          │
│            └────────┬────────┘                          │
└─────────────────────┼───────────────────────────────────┘
                      ▼
            ┌─────────────────┐
            │   Rust Backend  │
            │   (SQLx + Axum) │
            └─────────────────┘
```

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件**: shadcn/ui + Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router v6
- **HTTP 客户端**: 通过 SDK 封装
- **响应式设计**: 移动优先

## 目录结构

```
apps/
├── course-web/                    # PC Web 应用
│   ├── src/
│   │   ├── app/                   # 应用入口
│   │   ├── features/              # 功能模块
│   │   │   ├── categories/        # 课程分类
│   │   │   ├── courses/           # 课程列表/详情
│   │   │   ├── lessons/           # 课程学习
│   │   │   ├── live-sessions/     # 直播课程
│   │   │   ├── enrollments/       # 报名管理
│   │   │   ├── progress/          # 学习进度
│   │   │   ├── comments/          # 评论系统
│   │   │   └── applications/      # 课程申请
│   │   ├── shared/                # 共享组件
│   │   │   ├── components/        # UI 组件
│   │   │   ├── hooks/             # 自定义 Hooks
│   │   │   ├── layouts/           # 布局组件
│   │   │   └── utils/             # 工具函数
│   │   └── styles/                # 样式文件
│   ├── public/
│   └── package.json
│
├── course-mobile/                 # 移动端应用
│   └── (共享 course-web 代码)
│
└── course-h5/                     # H5 应用
    └── (共享 course-web 代码)
```

## 实施阶段

### Phase 1: 项目初始化与基础架构
- 创建 Vite + React + TypeScript 项目
- 配置 Tailwind CSS + shadcn/ui
- 集成 Course SDK
- 设置路由和布局

### Phase 2: 核心功能模块
- 课程分类浏览
- 课程列表与搜索
- 课程详情页
- 用户注册/登录

### Phase 3: 学习功能
- 课程报名
- 视频学习
- 学习进度跟踪
- 课程笔记

### Phase 4: 互动功能
- 评论系统
- 点赞/收藏
- 直播课程
- 问答互动

### Phase 5: 个人中心
- 学习记录
- 我的课程
- 个人资料
- 消息通知

### Phase 6: 后台管理
- 课程管理
- 学员管理
- 数据统计
- 内容审核

## 关键文件

| 文件 | 说明 |
|------|------|
| `apps/course-web/src/app/App.tsx` | 应用入口 |
| `apps/course-web/src/features/courses/CourseList.tsx` | 课程列表 |
| `apps/course-web/src/features/courses/CourseDetail.tsx` | 课程详情 |
| `apps/course-web/src/features/lessons/LessonPlayer.tsx` | 视频播放器 |
| `apps/course-web/src/shared/hooks/useCourse.ts` | 课程 Hooks |
| `apps/course-web/src/shared/components/CourseCard.tsx` | 课程卡片 |

## 验证方式

1. 运行 `pnpm dev` 启动开发服务器
2. 访问 http://localhost:5173 查看应用
3. 测试课程浏览、报名、学习等核心流程
4. 检查响应式布局在不同设备上的表现
