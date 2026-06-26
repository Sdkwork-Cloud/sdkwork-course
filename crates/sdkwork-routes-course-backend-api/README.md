# sdkwork-routes-course-backend-api

Domain: content  
Capability: course  
Package type: rust-crate  
Surface: backend-api  
Status: standard

This crate owns the course administrator and operator HTTP route shape for
`/backend/v3/api`. It defines the stable route-path, handler, mapper, and
route-manifest modules used to materialize the backend API authority.

It must not own business rules, SQL, generated SDK output, or transport
credentials. The generated OpenAPI authority lives under `sdks/` and is
materialized from the authored `apis/backend-api/course/operations.json`
contract.

## Public API

- `sdkwork_routes_course_backend_api::*`

## Verification

- `cargo test -p sdkwork-routes-course-backend-api`

