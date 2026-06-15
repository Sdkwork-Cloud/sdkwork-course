import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppStore, CourseSdkProvider } from '@sdkwork/sdkwork-course-h5-core'
import { MobileLoginPage, MobileRegisterPage } from '@sdkwork/sdkwork-course-h5-auth'
import { MobileCourseListPage, MobileCourseDetailPage } from '@sdkwork/sdkwork-course-h5-courses'
import { MobileLessonPlayerPage } from '@sdkwork/sdkwork-course-h5-lessons'
import { MobileLiveSessionListPage, MobileLiveSessionDetailPage } from '@sdkwork/sdkwork-course-h5-live'
import { MobileMyLearningPage } from '@sdkwork/sdkwork-course-h5-progress'

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
                <span className="text-lg">馃彔</span>
                <span>棣栭〉</span>
              </a>
              <a href="/courses" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                <span className="text-lg">馃摎</span>
                <span>璇剧▼</span>
              </a>
              <a href="/live" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                <span className="text-lg">馃摵</span>
                <span>鐩存挱</span>
              </a>
              {isAuthenticated ? (
                <a href="/my" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                  <span className="text-lg">馃懁</span>
                  <span>鎴戠殑</span>
                </a>
              ) : (
                <a href="/login" className="flex flex-col items-center text-xs text-gray-600 active:text-blue-600">
                  <span className="text-lg">馃懁</span>
                  <span>鐧诲綍</span>
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
          <h2 className="text-xl font-bold">娆㈣繋鍥炴潵</h2>
        ) : (
          <h2 className="text-xl font-bold">娆㈣繋鏉ュ埌鍦ㄧ嚎璇剧▼骞冲彴</h2>
        )}
      </div>
      <div className="space-y-4">
        <a href="/courses" className="block bg-white rounded-lg shadow p-4 active:bg-gray-50 transition-colors">
          <h3 className="font-semibold mb-2">鐑棬璇剧▼</h3>
          <p className="text-sm text-gray-600">鎺㈢储鎴戜滑鐨勭簿鍝佽绋?/p>
        </a>
        <a href="/live" className="block bg-white rounded-lg shadow p-4 active:bg-gray-50 transition-colors">
          <h3 className="font-semibold mb-2">鐩存挱璇惧爞</h3>
          <p className="text-sm text-gray-600">鍙備笌瀹炴椂浜掑姩瀛︿範</p>
        </a>
        {isAuthenticated ? (
          <a href="/my" className="block bg-white rounded-lg shadow p-4 active:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">鎴戠殑瀛︿範</h3>
            <p className="text-sm text-gray-600">鏌ョ湅瀛︿範杩涘害</p>
          </a>
        ) : (
          <a href="/register" className="block bg-white rounded-lg shadow p-4 active:bg-gray-50 transition-colors">
            <h3 className="font-semibold mb-2">绔嬪嵆娉ㄥ唽</h3>
            <p className="text-sm text-gray-600">寮€濮嬩綘鐨勫涔犱箣鏃?/p>
          </a>
        )}
      </div>
    </div>
  )
}

export default App

