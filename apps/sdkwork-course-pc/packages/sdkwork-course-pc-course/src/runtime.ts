import type { CoursePcSdkPorts } from './sdkPorts';
import { configureCoursePcSdkPorts } from './sdkPorts';

export interface ConfigureCoursePcRuntimeOptions {
  sdkPorts: CoursePcSdkPorts;
}

export function configureCoursePcRuntime(options: ConfigureCoursePcRuntimeOptions): void {
  configureCoursePcSdkPorts(options.sdkPorts);
}
