import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CourseCard } from '../components/CourseCard'

describe('CourseCard', () => {
  const defaultProps = {
    id: '1',
    title: 'Test Course',
    description: 'This is a test course',
    lessonsCount: 10,
    studentsCount: 100,
    rating: '4.5',
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders course title', () => {
    render(<CourseCard {...defaultProps} />)
    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })

  it('renders course description', () => {
    render(<CourseCard {...defaultProps} />)
    expect(screen.getByText('This is a test course')).toBeInTheDocument()
  })

  it('renders lessons count', () => {
    render(<CourseCard {...defaultProps} />)
    expect(screen.getByText('馃摎 10璇?)).toBeInTheDocument()
  })

  it('renders students count', () => {
    render(<CourseCard {...defaultProps} />)
    expect(screen.getByText('馃懃 100浜?)).toBeInTheDocument()
  })

  it('renders rating', () => {
    render(<CourseCard {...defaultProps} />)
    expect(screen.getByText('猸?4.5')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<CourseCard {...defaultProps} />)
    fireEvent.click(screen.getByText('Test Course').closest('div')!)
    expect(defaultProps.onClick).toHaveBeenCalledWith('1')
  })

  it('renders instructor when provided', () => {
    render(<CourseCard {...defaultProps} instructor="John Doe" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const propsWithoutDescription = { ...defaultProps, description: undefined }
    render(<CourseCard {...propsWithoutDescription} />)
    expect(screen.queryByText('This is a test course')).not.toBeInTheDocument()
  })
})



