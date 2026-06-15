import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '@sdkwork/sdkwork-course-h5-core'
import { MobilePageHeader } from '@sdkwork/sdkwork-course-h5-commons'

export function MobileRegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAppStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('涓ゆ杈撳叆鐨勫瘑鐮佷笉涓€鑷?)
      setIsLoading(false)
      return
    }

    try {
      // Call auth API through SDK
      const response = await fetch('/app/v3/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      
      const data = await response.json()
      
      if (data.code === '2000' && data.data) {
        setUser({
          id: data.data.id || '1',
          name: name,
          email: email,
        })
        navigate('/')
      } else {
        setError(data.msg || '娉ㄥ唽澶辫触锛岃绋嶅悗鍐嶈瘯')
      }
    } catch {
      setError('娉ㄥ唽澶辫触锛岃绋嶅悗鍐嶈瘯')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobilePageHeader title="娉ㄥ唽" showBack onBack={() => navigate(-1)} />
      
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold">鍒涘缓鏂拌处鎴?/h2>
          <p className="text-gray-600 text-sm mt-1">娉ㄥ唽鍚庡紑濮嬩綘鐨勫涔犱箣鏃?/p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                濮撳悕
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="璇疯緭鍏ュ鍚?
              />
            </div>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="璇疯緭鍏ュ瘑鐮?
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                纭瀵嗙爜
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="璇峰啀娆¤緭鍏ュ瘑鐮?
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold active:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '娉ㄥ唽涓?..' : '娉ㄥ唽'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            宸叉湁璐︽埛锛焮' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              绔嬪嵆鐧诲綍
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

