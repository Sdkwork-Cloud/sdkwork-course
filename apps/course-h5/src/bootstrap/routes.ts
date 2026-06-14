export interface RouteConfig {
  path: string
  title: string
  icon?: string
}

export const appRoutes: RouteConfig[] = [
  { path: '/', title: '首页', icon: '🏠' },
  { path: '/courses', title: '课程', icon: '📚' },
  { path: '/live', title: '直播', icon: '📺' },
  { path: '/my', title: '我的', icon: '👤' },
]

export const courseRoutes: RouteConfig[] = [
  { path: '/courses', title: '课程列表' },
  { path: '/courses/:id', title: '课程详情' },
  { path: '/courses/:id/learn', title: '课程学习' },
]

export const liveRoutes: RouteConfig[] = [
  { path: '/live', title: '直播列表' },
  { path: '/live/:id', title: '直播详情' },
]
