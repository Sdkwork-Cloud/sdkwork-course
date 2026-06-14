import React from 'react'

export interface MobilePageHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: React.ReactNode
}

export function MobilePageHeader({ title, showBack, onBack, rightAction }: MobilePageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={onBack}
            className="mr-3 text-gray-600 hover:text-gray-900"
          >
            ← 返回
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  )
}
