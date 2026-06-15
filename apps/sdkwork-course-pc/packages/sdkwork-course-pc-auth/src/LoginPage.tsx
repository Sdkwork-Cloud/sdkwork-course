import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '@sdkwork/sdkwork-course-pc-core'

export function LoginPage() {
  const navigate = useNavigate()
  const { setUser, setLoading, setError } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setErrorLocal] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorLocal('')

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
        setErrorLocal(data.msg || '鐧诲綍澶辫触锛岃妫€鏌ラ偖绠卞拰瀵嗙爜')
      }
    } catch {
      setErrorLocal('鐧诲綍澶辫触锛岃绋嶅悗鍐嶈瘯')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            鐧诲綍鎮ㄧ殑璐︽埛
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            鎴栬€厈' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              娉ㄥ唽鏂拌处鎴?            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                閭鍦板潃
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="閭鍦板潃"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                瀵嗙爜
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="瀵嗙爜"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                璁颁綇鎴?              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                蹇樿瀵嗙爜锛?              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? '鐧诲綍涓?..' : '鐧诲綍'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



