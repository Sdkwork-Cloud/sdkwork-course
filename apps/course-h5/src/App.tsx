import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppStore, CourseSdkProvider } from '@sdkwork/course-h5-core'
import { MobileLoginPage, MobileRegisterPage } from '@sdkwork/course-h5-auth'
import { MobileCourseListPage, MobileCourseDetailPage } from '@sdkwork/course-h5-courses'
import { MobileLessonPlayerPage } from '@sdkwork/course-h5-lessons'
import { MobileLiveSessionListPage, MobileLiveSessionDetailPage } from '@sdkwork/course-h5-live'
import { MobileMyLearningPage } from '@sdkwork/course-h5-progress'

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
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 pb-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<MobileLoginPage />} />
                <Route path="/register" element={<MobileRegisterPage />} />
                <Route path="/courses" element={<MobileCourseListPage />} />
                <Route path="/courses/:id" element={<MobileCourseDetailPage />} />
                <Route path="/courses/:courseId/learn/:lessonId" element={
                  <ProtectedRoute>
                    <MobileLessonPlayerPage />
                  </ProtectedRoute>
                } />
                <Route path="/live" element={<MobileLiveSessionListPage />} />
                <Route path="/live/:id" element={<MobileLiveSessionDetailPage />} />
                <Route path="/my" element={
                  <ProtectedRoute>
                    <MobileMyLearningPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
              <a href="/" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                <span className="text-lg">🏠</span>
                <span>首页</span>
              </a>
              <a href="/courses" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                <span className="text-lg">📚</span>
                <span>课程</span>
              </a>
              <a href="/live" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                <span className="text-lg">📺</span>
                <span>直播</span>
              </a>
              {isAuthenticated ? (
                <a href="/my" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                  <span className="text-lg">👤</span>
                  <span>我的</span>
                </a>
              ) : (
                <a href="/login" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                  <span className="text-lg">👤</span>
                  <span>登录</span>
                </a>
              )}
            </nav>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </CourseSdkProvider>
  )
}

function HomePage() {
  const { isAuthenticated } = useAppStore()
  
  return (
    <div className="p-4">
      <div className="mb-4">
        {isAuthenticated ? (
          <h2 className="text-xl font-bold">欢迎回来</h2>
        ) : (
          <h2 className="text-xl font-bold">欢迎来到在线课程平台</h2>
        )}
      </div>
      <div className="space-y-4">
        <a href="/courses" className="block bg-white rounded-lg shadow p-4 active:bg-gray-50 transition-colors">
          <h3 className="font-semibold mb-2">热门课程</h3>
          <p className="text-sm text-gray-600">探索我们的精品课程</p>
        </a>
        <a href="/live" className="block bg-white rounded-lg shadow p-4 active:bg-gray-50 transition-colors">
          <h3 className="font-semibold mb-2">直播课堂</h3>
          <p className="text-sm text-gray-600">参与实时互动学习</p>
        </a>
        {isAuthenticated ? (
          <a href="/my" className="block bg-white rounded-lg shadow p-4 active:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">我的学习</h3>
            <p className="text-sm text-gray-600">查看学习进度</p>
          </a>
        ) : (
          <a href="/register" className="block bg-white rounded-lg shadow p-4 active:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">立即注册</h3>
            <p className="text-sm text-gray-600">开始你的学习之旅</p>
          </a>
        )}
      </div>
    </div>
  )
}

export default App
