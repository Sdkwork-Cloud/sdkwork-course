# SDKWork Course App SDK

This SDK family is generated from the `sdkwork-course-app-api` authority
contract for `/app/v3/api`.

## Contract

- SDK family: `sdkwork-course-app-sdk`
- API authority: `sdkwork-course-app-api`
- API prefix: `/app/v3/api`
- Audience: app, desktop, mobile, H5, and user-facing clients
- Package: `@sdkwork/course-app-sdk`
- Generated language: TypeScript
- OpenAPI authority: `openapi/sdkwork-course-app-api.openapi.yaml`
- Generator input: `openapi/sdkwork-course-app-api.sdkgen.yaml`
- Owner-only operations: `7`
- SDK dependencies: `[]`

Clients call generated resource methods for course categories, courses,
sections, lessons, relations, and author applications. Auth tokens are supplied
through generated SDK auth/bootstrap APIs; clients must not send `X-Request-Id`.

## Generation

Run from `D:\sdkwork-opensource\sdkwork-course`:

```powershell
powershell -ExecutionPolicy Bypass -File .\sdks\sdkwork-course-app-sdk\bin\generate-sdk.ps1 -Languages typescript
```

The wrapper calls `D:\javasource\spring-ai-plus\sdk\sdkwork-sdk-generator\bin\sdkgen.js`
from `@sdkwork/sdk-generator` version `1.0.0` with `--standard-profile sdkwork-v3`.

Generated output:

- TypeScript workspace: `sdkwork-course-app-sdk-typescript`
- Transport root: `sdkwork-course-app-sdk-typescript/generated/server-openapi`

Do not hand-edit files under `generated/server-openapi`. Fix the OpenAPI
authority or generator input, then regenerate.

## Verification

```powershell
node --test scripts/course-workspace-boundary.test.mjs
powershell -ExecutionPolicy Bypass -File .\sdks\sdkwork-course-app-sdk\bin\generate-sdk.ps1 -Languages typescript
node .\sdks\sdkwork-course-app-sdk\sdkwork-course-app-sdk-typescript\generated\server-openapi\bin\publish-core.mjs --language typescript --project-dir .\sdks\sdkwork-course-app-sdk\sdkwork-course-app-sdk-typescript\generated\server-openapi --action check
node .\sdks\sdkwork-course-app-sdk\sdkwork-course-app-sdk-typescript\generated\server-openapi\bin\publish-core.mjs --language typescript --project-dir .\sdks\sdkwork-course-app-sdk\sdkwork-course-app-sdk-typescript\generated\server-openapi --action build
```
