# SDKWork Course Backend SDK

This SDK family is generated from the `sdkwork-course-backend-api` authority
contract for `/backend/v3/api`.

## Contract

- SDK family: `sdkwork-course-backend-sdk`
- API authority: `sdkwork-course-backend-api`
- API prefix: `/backend/v3/api`
- Audience: backend consoles, operators, control-plane integrations, and admin automation
- Package: `@sdkwork/course-backend-sdk`
- Generated language: TypeScript
- OpenAPI authority: `openapi/sdkwork-course-backend-api.openapi.yaml`
- Generator input: `openapi/sdkwork-course-backend-api.sdkgen.yaml`
- Owner-only operations: `19`
- SDK dependencies: `[]`

Clients call generated resource methods for course management, sections,
lessons, relations, application review, comment moderation, and engagement
queries. Auth tokens are supplied through generated SDK auth/bootstrap APIs;
clients must not send `X-Request-Id`.

## Generation

Run from `D:\sdkwork-opensource\sdkwork-course`:

```powershell
powershell -ExecutionPolicy Bypass -File .\sdks\sdkwork-course-backend-sdk\bin\generate-sdk.ps1 -Languages typescript
```

The wrapper calls `D:\javasource\spring-ai-plus\sdk\sdkwork-sdk-generator\bin\sdkgen.js`
from `@sdkwork/sdk-generator` version `1.0.0` with `--standard-profile sdkwork-v3`.

Generated output:

- TypeScript workspace: `sdkwork-course-backend-sdk-typescript`
- Transport root: `sdkwork-course-backend-sdk-typescript/generated/server-openapi`

Do not hand-edit files under `generated/server-openapi`. Fix the OpenAPI
authority or generator input, then regenerate.

## Verification

```powershell
node --test scripts/course-workspace-boundary.test.mjs
powershell -ExecutionPolicy Bypass -File .\sdks\sdkwork-course-backend-sdk\bin\generate-sdk.ps1 -Languages typescript
node .\sdks\sdkwork-course-backend-sdk\sdkwork-course-backend-sdk-typescript\generated\server-openapi\bin\publish-core.mjs --language typescript --project-dir .\sdks\sdkwork-course-backend-sdk\sdkwork-course-backend-sdk-typescript\generated\server-openapi --action check
node .\sdks\sdkwork-course-backend-sdk\sdkwork-course-backend-sdk-typescript\generated\server-openapi\bin\publish-core.mjs --language typescript --project-dir .\sdks\sdkwork-course-backend-sdk\sdkwork-course-backend-sdk-typescript\generated\server-openapi --action build
```
