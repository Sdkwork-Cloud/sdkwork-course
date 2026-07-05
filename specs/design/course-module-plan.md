# SDKWork Course Module Plan

Production module layout for the professional course system.

## Boundaries

- Course owns VOD course metadata, live course sessions, blended offerings,
  enrollment, learning progress, comments, reactions, course applications, and
  course audit logs.
- Appbase IAM owns login, tenant, organization, user, role, permission, and
  token-derived request context.
- Drive owns file upload, object storage lifecycle, download grants, and
  Drive-backed `MediaResource` delivery.
- Commerce or an integrating application owns purchase, subscription,
  settlement, refund, and entitlement source-of-truth.
- Live provider adapters own provider-specific room provisioning, short-lived
  join token creation, recording callbacks, and provider error normalization.

## Owned Modules

| Module | Responsibility |
| --- | --- |
| `crates/sdkwork-content-course-service` | Domain service and provider ports |
| `crates/sdkwork-content-course-repository-sqlx` | SQLx persistence |
| `crates/sdkwork-routes-course-app-api` | Learner `/app/v3/api` HTTP surface |
| `crates/sdkwork-routes-course-backend-api` | Operator `/backend/v3/api` HTTP surface |
| `crates/sdkwork-routes-course-http-auth` | Dual-token bridge + SdkWork envelopes |
| `crates/sdkwork-course-embedded-bootstrap` | Embedded gateway assembly wiring |
| `crates/sdkwork-course-database-host` | `sdkwork-database` lifecycle host |
| `database/` | Baseline DDL, seeds, drift policy |
| `sdks/sdkwork-course-app-sdk` | Generated app SDK family |
| `sdks/sdkwork-course-backend-sdk` | Generated backend SDK family |
| `apps/sdkwork-course-pc` / `h5` / `mini-program` | Client application roots |

## Implementation Status

- [x] HTTP runtime uses `sdkwork-web-framework` (`SdkWorkApiResponse`, `ProblemDetail`)
- [x] Database lifecycle owned by `sdkwork-database` baseline + CLI
- [x] Frontend clients consume generated SDKs with TokenManager (no raw course HTTP)
- [x] Drive integration via generated Rust/TS Drive SDKs; course stores references only
- [x] IAM login/session via `@sdkwork/iam-app-sdk`
- [x] OpenAPI authorities materialized with SdkWork v3 envelopes
- [x] `deployments/deploy.yaml` declares cloud runtime dependencies

## Deferred Integrations

- Live provider RPC adapter (port abstraction is in place)
- External entitlement source-of-truth (local embedded port for greenfield)
- `sdkwork-discovery` (only required when RPC services are introduced)

## Verification

```bash
pnpm verify
node scripts/materialize-course-openapi.mjs
```
