export interface RouteConfig {
  path: string
  title: string
  icon?: string
}

export const appRoutes: RouteConfig[] = [
  { path: '/', title: '棣栭〉' },
  { path: '/courses', title: '璇剧▼' },
  { path: '/live', title: '鐩存挱' },
  { path: '/my', title: '鎴戠殑瀛︿範' },
]

export const courseRoutes: RouteConfig[] = [
  { path: '/courses', title: '璇剧▼鍒楄〃' },
  { path: '/courses/:id', title: '璇剧▼璇︽儏' },
  { path: '/courses/:id/learn', title: '璇剧▼瀛︿範' },
]

export const liveRoutes: RouteConfig[] = [
  { path: '/live', title: '鐩存挱鍒楄〃' },
  { path: '/live/:id', title: '鐩存挱璇︽儏' },
]



