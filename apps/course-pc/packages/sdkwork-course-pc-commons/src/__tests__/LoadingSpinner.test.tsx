import React from 'react'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '../components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders without text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders with text', () => {
    render(<LoadingSpinner text="Loading..." />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('applies correct size class for sm', () => {
    render(<LoadingSpinner size="sm" />)
    const spinner = screen.getByRole('status')
    expect(spinner.firstChild).toHaveClass('h-4', 'w-4')
  })

  it('applies correct size class for md', () => {
    render(<LoadingSpinner size="md" />)
    const spinner = screen.getByRole('status')
    expect(spinner.firstChild).toHaveClass('h-8', 'w-8')
  })

  it('applies correct size class for lg', () => {
    render(<LoadingSpinner size="lg" />)
    const spinner = screen.getByRole('status')
    expect(spinner.firstChild).toHaveClass('h-12', 'w-12')
  })
})
