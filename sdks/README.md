# SDKWork Course SDK Workspace

This directory owns SDK generation for the SDKWork Course API authorities.

## Families

| Family | API authority | Prefix | Audience | Generated languages |
| --- | --- | --- | --- | --- |
| `sdkwork-course-app-sdk` | `sdkwork-course-app-api` | `/app/v3/api` | App, desktop, mobile, H5, and user-facing clients | TypeScript |
| `sdkwork-course-backend-sdk` | `sdkwork-course-backend-api` | `/backend/v3/api` | Backend consoles, operators, control-plane integrations, and admin automation | TypeScript |

Only course-owned routes are present in these authorities. Shared auth, bootstrap,
and request-context capabilities stay outside this owner-only SDK workspace and
are integrated by the hosting application runtime.

## Generator

- Package: `@sdkwork/sdk-generator`
- Entrypoint: `D:\javasource\spring-ai-plus\sdk\sdkwork-sdk-generator\bin\sdkgen.js`
- Version: `1.0.0`
- Standard profile: `sdkwork-v3`

The family wrapper scripts call this canonical generator and fail when it is not
available. Generated transport output lives under each family language workspace
at `generated/server-openapi`; do not edit generated files directly.

## Commands

Run from `D:\sdkwork-opensource\sdkwork-course`:

```powershell
powershell -ExecutionPolicy Bypass -File .\sdks\sdkwork-course-app-sdk\bin\generate-sdk.ps1 -Languages typescript
powershell -ExecutionPolicy Bypass -File .\sdks\sdkwork-course-backend-sdk\bin\generate-sdk.ps1 -Languages typescript
```

Current committed and verified generated output is TypeScript only. Additional
generator-supported languages must be generated, verified, and then declared in
the family assembly and component spec before being treated as supported output.
