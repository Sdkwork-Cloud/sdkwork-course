import { loadRuntimeConfig } from './environment'

export interface CourseSdkClients {
  appApi: {
    baseUrl: string
    prefix: string
  }
}

export function createSdkClients(): CourseSdkClients {
  const config = loadRuntimeConfig()
  
  return {
    appApi: {
      baseUrl: config.apiBaseUrl,
      prefix: config.appApiPrefix,
    },
  }
}



