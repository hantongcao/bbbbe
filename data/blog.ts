import type { BlogPost } from "@/lib/types"

export const ALL_BLOG_POSTS: BlogPost[] = [
  {
    slug: "mastering-react-hooks",
    title: "精通 React Hooks (2025版)",
    date: "2025年6月30日",
    readTime: "12 分钟阅读",
    excerpt: "深入探讨 React Hooks 的高级模式、最佳实践，包括自定义 Hooks 和性能优化。",
    tags: ["React", "前端", "JavaScript"],
    category: "React",
    imageUrl: "/placeholder.svg?width=1200&height=600",
    content: `
          <p class="lead">React Hooks 彻底改变了我们编写组件的方式。它们允许我们在不编写类的情况下使用 state 和其他 React 特性。本文将带您从基础知识到可以在当今项目中使用的先进模式。</p>
          <h2>自定义 Hooks 的力量</h2>
          <p>Hooks 最强大的功能之一是能够创建自己的 Hooks。自定义 Hooks 允许您将组件逻辑提取到可重用的函数中。自定义 Hook 是一个名称以“use”开头的 JavaScript 函数，并且可以调用其他 Hooks。</p>
          <h2>高级模式</h2>
          <p>除了自定义 Hooks，还有几种高级模式可以帮助您编写更清晰、性能更高的 React 应用。</p>
          <blockquote><p>“掌握 React Hooks 的关键在于理解何时以及为何使用每一个 Hook。这不仅仅是了解 API，更是理解 React 渲染行为的底层原理。”</p></blockquote>
          <h2>结论</h2>
          <p>React Hooks 是现代 React 开发的基础部分。通过掌握它们并理解高级模式，您可以构建更高效、可维护和可扩展的应用程序。继续尝试和构建吧！</p>
      `,
  },
  {
    slug: "the-art-of-ui-design",
    title: "极简主义UI设计艺术",
    date: "2025年6月25日",
    readTime: "8 分钟阅读",
    excerpt: "探索创造简洁、直观且美观的用户界面的原则，从而提升用户体验。",
    tags: ["UI/UX", "设计", "Web"],
    category: "UI/UX",
    imageUrl: "/placeholder.svg?width=1200&height=600",
  },
  {
    slug: "building-scalable-apis",
    title: "使用 Node.js 构建可扩展API",
    date: "2025年6月20日",
    readTime: "15 分钟阅读",
    excerpt: "使用 Node.js、Express 和 TypeScript 为现代应用构建健壮、高性能API的策略。",
    tags: ["后端", "Node.js", "API"],
    category: "后端",
    imageUrl: "/placeholder.svg?width=1200&height=600",
  },
  {
    slug: "css-grid-flexbox",
    title: "CSS Grid 与 Flexbox：现代布局方案",
    date: "2025年6月15日",
    readTime: "10 分钟阅读",
    excerpt: "一份关于何时使用 CSS Grid 和 Flexbox 来轻松创建复杂、响应式布局的综合指南。",
    tags: ["CSS", "前端", "布局"],
    imageUrl: "/placeholder.svg?width=1200&height=600",
  },
  {
    slug: "devops-for-frontend",
    title: "前端开发者的 CI/CD 实践",
    date: "2025年6月10日",
    readTime: "11 分钟阅读",
    excerpt: "学习如何使用 GitHub Actions 为您的前端项目设置持续集成和部署流水线。",
    tags: ["DevOps", "CI/CD", "前端"],
    imageUrl: "/placeholder.svg?width=1200&height=600",
  },
  {
    slug: "web-accessibility-basics",
    title: "Web 可访问性 (a11y) 入门",
    date: "2025年6月5日",
    readTime: "9 分钟阅读",
    excerpt: "了解 Web 可访问性的重要性，以及如何在您的应用中实现基本的 a11y 功能。",
    tags: ["可访问性", "Web", "最佳实践"],
    imageUrl: "/placeholder.svg?width=1200&height=600",
  },
]
