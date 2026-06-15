import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '@sdkwork/sdkwork-course-h5-core'
import { MobilePageHeader } from '@sdkwork/sdkwork-course-h5-commons'

export function MobileLoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Call auth API through SDK
      const response = await fetch('/app/v3/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (data.code === '2000' && data.data) {
        setUser({
          id: data.data.id || '1',
          name: data.data.name || email.split('@')[0],
          email: email,
        })
        navigate('/')
      } else {
        setError(data.msg || '鐧诲綍澶辫触锛岃妫€鏌ラ偖绠卞拰瀵嗙爜')
      }
    } catch {
      setError('鐧诲綍澶辫触锛岃绋嶅悗鍐嶈瘯')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobilePageHeader title="鐧诲綍" showBack onBack={() => navigate(-1)} />
      
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold">娆㈣繋鍥炴潵</h2>
          <p className="text-gray-600 text-sm mt-1">鐧诲綍鎮ㄧ殑璐︽埛缁х画瀛︿範</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                閭鍦板潃
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="璇疯緭鍏ラ偖绠?
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                瀵嗙爜
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="璇疯緭鍏ュ瘑鐮?
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  璁颁綇鎴?                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                蹇樿瀵嗙爜锛?              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold active:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '鐧诲綍涓?..' : '鐧诲綍'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            杩樻病鏈夎处鎴凤紵{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              绔嬪嵆娉ㄥ唽
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

