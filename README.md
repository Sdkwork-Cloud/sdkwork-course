# SDKWork Course
repository-kind: application

`sdkwork-course` owns the SDKWork course system. It carries authored API
contracts, database contracts, Rust service and repository crates, route crates,
OpenAPI authority documents, and generated SDK workspaces for app and backend
callers.

This workspace is intentionally separate from `sdkwork-appbase`. Appbase remains
the reusable foundation for IAM, runtime bootstrap, and shared UI concerns.
Course-specific records and APIs live here.

## Boundaries

- Course catalog: categories, instructors, courses, offerings, sections,
  lessons, and Drive-backed resource references.
- Course learning: enrollments, learning progress, lesson progress, live
  sessions, and replay handling.
- Course governance: author submissions, review workflow, comment moderation,
  reactions, reports, and audit logs.
- SDK families: `sdkwork-course-app-sdk` and `sdkwork-course-backend-sdk`.

The course workspace does not own sales, purchase, billing, or settlement flows.
Access decisions can be injected by an integrating application through explicit
adapters, but this workspace keeps learning content and governance independent
from those systems.

## Layout

```text
sdkwork-course/
  apis/
  crates/
  sdks/
  specs/
  scripts/
```

## Verification

Run the local governance checks from the repository root:

```powershell
pnpm verify
pnpm run db:validate
pnpm run check:openapi-drift
```

`pnpm verify` includes workspace boundary tests, database contract checks, API envelope validation, OpenAPI drift checks, repository composition checks, PC/H5 TypeScript type checks, and `cargo test --workspace`.

Optional per-app type checks:

```powershell
cd apps/sdkwork-course-pc
pnpm typecheck

cd ../sdkwork-course-h5
pnpm typecheck
```

Build generated SDK runtimes when OpenAPI authorities change:

```powershell
pnpm run api:materialize
cd sdks/sdkwork-course-app-sdk/sdkwork-course-app-sdk-typescript/generated/server-openapi
pnpm run build
```

Run Rust verification:

```powershell
cargo test --workspace
```


## SDKWork Documentation Contract

Domain: content
Capability: course-workspace
Package type: rust-crate
Status: standard

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- None declared in `specs/component.spec.json`.

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

This module follows the canonical standards linked from `specs/component.spec.json`, including deployment and runtime configuration rules where applicable.

### Security

Do not add secrets, live tokens, manual auth headers, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `pnpm verify` (includes `typecheck:apps`)

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.

## Documentation Canon

- [docs/README.md](docs/README.md)
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md)
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md)

## Application Roots

- [apps directory index](apps/README.md)
