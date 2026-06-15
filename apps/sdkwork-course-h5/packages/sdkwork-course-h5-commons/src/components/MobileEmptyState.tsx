import React from 'react'

export interface MobileEmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export function MobileEmptyState({ icon = '馃摥', title, description, action }: MobileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <span className="text-3xl mb-3">{icon}</span>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-gray-600 text-sm mb-3">{description}</p>}
      {action}
    </div>
  )
}

