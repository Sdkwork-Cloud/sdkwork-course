# SDKWork Course PC Application

This is the PC application root for the SDKWork course management system.

## Architecture

- **Root**: `apps/course-pc/`
- **Standard**: `APP_PC_ARCHITECTURE_SPEC.md`
- **UI Framework**: React + TypeScript
- **Build Tool**: Vite

## Package Taxonomy

- `sdkwork-course-pc-core` — Core runtime, SDK clients, IAM integration
- `sdkwork-course-pc-commons` — Shared UI components, hooks, utilities
- `sdkwork-course-pc-shell` — App shell, routing, layout
- `sdkwork-course-pc-courses` — Course browsing, search, details
- `sdkwork-course-pc-lessons` — Video learning, progress tracking
- `sdkwork-course-pc-live` — Live session management
- `sdkwork-course-pc-community` — Comments, reactions, discussions

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```
