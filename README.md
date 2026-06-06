# SDKWork Course

`sdkwork-course` owns the SDKWork course system. It carries course contracts,
local/private Rust runtime logic, SQLx storage, OpenAPI authority documents, and
generated SDK workspaces for app and backend callers.

This workspace is intentionally separate from `sdkwork-appbase`. Appbase remains
the reusable foundation for IAM, runtime bootstrap, and shared UI concerns.
Course-specific records and APIs live here.

## Boundaries

- Course catalog: categories, course cards, detail pages, sections, lessons, and
  related-course graph rows.
- Course governance: author submissions, review workflow, comment moderation,
  engagement metrics, and audit rows.
- Course media references: thumbnail and lesson media snapshots are modeled as
  media resource references without owning media storage.
- SDK families: `sdkwork-course-app-sdk` and `sdkwork-course-backend-sdk`.

The course workspace does not own sales, purchase, billing, or settlement flows.
Access decisions can be injected by an integrating application through explicit
adapters, but this workspace keeps learning content and governance independent
from those systems.

## Layout

```text
sdkwork-course/
  packages/
    common/course/sdkwork-course-contracts
    native-rust/course/sdkwork-course-rust
  sdks/
    sdkwork-course-app-sdk
    sdkwork-course-backend-sdk
  specs/
  scripts/
```

## Verification

Run the local governance checks:

```powershell
node --test scripts/course-workspace-boundary.test.mjs
```

Run Rust verification:

```powershell
cargo test
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

- `pnpm typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.
