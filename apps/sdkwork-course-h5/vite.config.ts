import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const repoRoot = path.resolve(__dirname, '../..');

function dependencyRoot(dependencyId: string): string {
  return path.resolve(repoRoot, '..', dependencyId);
}

const generatedCourseAppSdkEntry = path.resolve(
  repoRoot,
  'sdks/sdkwork-course-app-sdk/sdkwork-course-app-sdk-typescript/src/index.ts',
);
const generatedIamAppSdkEntry = path.resolve(
  dependencyRoot('sdkwork-iam'),
  'sdks/sdkwork-iam-app-sdk/sdkwork-iam-app-sdk-typescript/src/index.ts',
);
const generatedDriveAppSdkEntry = path.resolve(
  dependencyRoot('sdkwork-drive'),
  'sdks/sdkwork-drive-app-sdk/sdkwork-drive-app-sdk-typescript/src/index.ts',
);
const sdkworkUtilsSourceRoot = path.resolve(
  dependencyRoot('sdkwork-utils'),
  'packages/sdkwork-utils-typescript/src',
);
const sdkworkSdkCommonSourceRoot = path.resolve(
  dependencyRoot('sdkwork-sdk-commons'),
  'sdkwork-sdk-common-typescript/src',
);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
    define: {
      'process.env.SDKWORK_ACCESS_TOKEN': JSON.stringify(env.SDKWORK_ACCESS_TOKEN ?? ''),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3001,
      proxy: {
        '/app/v3/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  };
});
