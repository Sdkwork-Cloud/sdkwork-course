# sdkwork-router-course-app-api

Domain: content  
Capability: course  
Package type: rust-crate  
Surface: app-api  
Status: standard

This crate owns the course learner-facing HTTP route shape for `/app/v3/api`.
It defines the stable route-path, handler, mapper, and route-manifest modules
used to materialize the app API authority.

It must not own business rules, SQL, generated SDK output, or transport
credentials. The generated OpenAPI authority lives under `sdks/` and is
materialized from the authored `apis/app-api/course/operations.json` contract.

## Public API

- `sdkwork_router_course_app_api::*`

## Verification

- `cargo test -p sdkwork-router-course-app-api`

