import React from 'react'

export interface MobileLoadingProps {
  text?: string
}

export function MobileLoading({ text }: MobileLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      {text && <p className="mt-3 text-gray-600 text-sm">{text}</p>}
    </div>
  )
}

