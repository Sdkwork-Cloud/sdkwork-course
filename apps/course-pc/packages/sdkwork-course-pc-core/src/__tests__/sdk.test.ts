import { createCourseSdk } from '../sdk'

describe('CourseSdk', () => {
  const config = {
    appApi: {
      baseUrl: 'http://localhost:8080',
      prefix: '/app/v3/api',
    },
  }

  it('creates SDK with correct structure', () => {
    const sdk = createCourseSdk(config)
    expect(sdk).toBeDefined()
    expect(sdk.categories).toBeDefined()
    expect(sdk.courses).toBeDefined()
    expect(sdk.offerings).toBeDefined()
    expect(sdk.enrollments).toBeDefined()
    expect(sdk.sections).toBeDefined()
    expect(sdk.lessons).toBeDefined()
    expect(sdk.progress).toBeDefined()
    expect(sdk.comments).toBeDefined()
    expect(sdk.reactions).toBeDefined()
    expect(sdk.applications).toBeDefined()
  })

  it('has list method for categories', () => {
    const sdk = createCourseSdk(config)
    expect(typeof sdk.categories.list).toBe('function')
  })

  it('has retrieve method for categories', () => {
    const sdk = createCourseSdk(config)
    expect(typeof sdk.categories.retrieve).toBe('function')
  })

  it('has list method for courses', () => {
    const sdk = createCourseSdk(config)
    expect(typeof sdk.courses.list).toBe('function')
  })

  it('has retrieve method for courses', () => {
    const sdk = createCourseSdk(config)
    expect(typeof sdk.courses.retrieve).toBe('function')
  })

  it('has create method for enrollments', () => {
    const sdk = createCourseSdk(config)
    expect(typeof sdk.enrollments.create).toBe('function')
  })

  it('has list method for enrollments', () => {
    const sdk = createCourseSdk(config)
    expect(typeof sdk.enrollments.list).toBe('function')
  })

  it('has create method for comments', () => {
    const sdk = createCourseSdk(config)
    expect(typeof sdk.comments.create).toBe('function')
  })

  it('has replace method for reactions', () => {
    const sdk = createCourseSdk(config)
    expect(typeof sdk.reactions.replace).toBe('function')
  })
})
