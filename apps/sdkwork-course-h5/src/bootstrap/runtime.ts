import { createSdkClients } from './sdkClients'
import { loadRuntimeConfig } from './environment'

export interface AppRuntime {
  config: ReturnType<typeof loadRuntimeConfig>
  sdk: ReturnType<typeof createSdkClients>
}

let runtime: AppRuntime | null = null

export function getRuntime(): AppRuntime {
  if (!runtime) {
    const config = loadRuntimeConfig()
    const sdk = createSdkClients()
    runtime = { config, sdk }
  }
  return runtime
}

