import React from 'react'
import { render, screen } from '@testing-library/react'
import { PageHeader } from '../components/PageHeader'

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Test Title" subtitle="Test Subtitle" />)
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(<PageHeader title="Test Title" />)
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument()
  })

  it('renders actions when provided', () => {
    render(
      <PageHeader
        title="Test Title"
        actions={<button>Action Button</button>}
      />
    )
    expect(screen.getByText('Action Button')).toBeInTheDocument()
  })
})
