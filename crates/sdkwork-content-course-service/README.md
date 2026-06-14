# sdkwork-content-course-service

Domain: content  
Capability: course  
Package type: rust-crate  
Status: standard

This crate owns SDKWork course business contracts, use-case service traits, repository ports, and provider ports for VOD and live online course workflows.

It intentionally does not depend on HTTP frameworks or SQLx repository implementations. Route crates and repository crates consume this crate through its public exports.

## Public API

- `sdkwork_content_course_service::*`

## Verification

- `cargo test -p sdkwork-content-course-service`
