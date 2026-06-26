use serde_json::Value;

pub fn wrap_success(data: Value) -> Value {
    serde_json::json!({ "code": "2000", "msg": "SUCCESS", "data": data })
}
