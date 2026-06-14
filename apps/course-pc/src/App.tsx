import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppStore, CourseSdkProvider } from '@sdkwork/course-pc-core'
import { LoginPage, RegisterPage } from '@sdkwork/course-pc-auth'
import { CourseListPage, CourseDetailPage } from '@sdkwork/course-pc-courses'
import { LessonPlayerPage } from '@sdkwork/course-pc-lessons'
import { LiveSessionListPage, LiveSessionDetailPage } from '@sdkwork/course-pc-live'
import { MyLearningPage } from '@sdkwork/course-pc-progress'

const queryClient = new QueryClient()

const sdkConfig = {
  appApi: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    prefix: '/app/v3/api',
  },
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  const { isAuthenticated, user, logout } = useAppStore()

  return (
    <CourseSdkProvider config={sdkConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <div className="flex items-center">
                    <a href="/" className="text-xl font-bold text-blue-600">SDKWork Course</a>
                  </div>
                  <nav className="flex items-center space-x-4">
                    <a href="/" className="text-gray-600 hover:text-gray-900">首页</a>
                    <a href="/courses" className="text-gray-600 hover:text-gray-900">课程</a>
                    <a href="/live" className="text-gray-600 hover:text-gray-900">直播</a>
                    {isAuthenticated ? (
                      <>
                        <a href="/my" className="text-gray-600 hover:text-gray-900">我的学习</a>
                        <span className="text-gray-600">欢迎, {user?.name}</span>
                        <button
                          onClick={logout}
                          className="text-red-600 hover:text-red-700"
                        >
                          退出
                        </button>
                      </>
                    ) : (
                      <>
                        <a href="/login" className="text-gray-600 hover:text-gray-900">登录</a>
                        <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">注册</a>
                      </>
                    )}
                  </nav>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/courses" element={<CourseListPage />} />
                <Route path="/courses/:id" element={<CourseDetailPage />} />
                <Route path="/courses/:courseId/learn/:lessonId" element={
                  <ProtectedRoute>
                    <LessonPlayerPage />
                  </ProtectedRoute>
                } />
                <Route path="/live" element={<LiveSessionListPage />} />
                <Route path="/live/:id" element={<LiveSessionDetailPage />} />
                <Route path="/my" element={
                  <ProtectedRoute>
                    <MyLearningPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </CourseSdkProvider>
  )
}

function HomePage() {
  const { isAuthenticated } = useAppStore()
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">欢迎来到在线课程平台</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/courses" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">热门课程</h3>
          <p className="text-gray-600">探索我们的精品课程</p>
        </a>
        <a href="/live" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2">直播课堂</h3>
          <p className="text-gray-600">参与实时互动学习</p>
        </a>
        {isAuthenticated ? (
          <a href="/my" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">我的学习</h3>
            <p className="text-gray-600">查看学习进度</p>
          </a>
        ) : (
          <a href="/register" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2">立即注册</h3>
            <p className="text-gray-600">开始你的学习之旅</p>
          </a>
        )}
      </div>
    </div>
  )
}

export default App
