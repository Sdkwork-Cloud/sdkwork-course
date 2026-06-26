use serde_json::Value;

use crate::manifest::build_route_manifest;

pub fn build_router() -> Value {
    build_route_manifest()
}
