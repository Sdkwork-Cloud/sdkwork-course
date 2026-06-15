import React from 'react'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '../components/EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No Data" />)
    expect(screen.getByText('No Data')).toBeInTheDocument()
  })

  it('renders default icon', () => {
    render(<EmptyState title="No Data" />)
    expect(screen.getByText('馃摥')).toBeInTheDocument()
  })

  it('renders custom icon', () => {
    render(<EmptyState title="No Data" icon="馃攳" />)
    expect(screen.getByText('馃攳')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="No Data" description="Try again later" />)
    expect(screen.getByText('Try again later')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<EmptyState title="No Data" />)
    expect(screen.queryByText('Try again later')).not.toBeInTheDocument()
  })

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="No Data"
        action={<button>Retry</button>}
      />
    )
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })
})



