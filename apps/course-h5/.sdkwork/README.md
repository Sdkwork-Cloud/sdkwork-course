# SDKWork Course H5 Application

This is the H5 application root for the SDKWork course management system.

## Architecture

- **Root**: `apps/course-h5/`
- **Standard**: `APP_H5_ARCHITECTURE_SPEC.md`
- **UI Framework**: React + TypeScript
- **Build Tool**: Vite
- **Mobile Host**: Capacitor (optional)

## Package Taxonomy

- `sdkwork-course-h5-core` — Core runtime, SDK clients, IAM integration
- `sdkwork-course-h5-commons` — Shared mobile UI components, hooks, utilities
- `sdkwork-course-h5-shell` — Mobile shell, routing, layout
- `sdkwork-course-h5-courses` — Course browsing, search, details
- `sdkwork-course-h5-lessons` — Video learning, progress tracking
- `sdkwork-course-h5-live` — Live session management
- `sdkwork-course-h5-community` — Comments, reactions, discussions

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Capacitor (iOS/Android)

```bash
pnpm cap:init
pnpm cap:add:ios
pnpm cap:add:android
pnpm cap:sync
pnpm cap:open:ios
pnpm cap:open:android
```
