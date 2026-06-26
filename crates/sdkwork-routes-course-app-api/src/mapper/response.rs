use serde_json::Value;

pub fn wrap_success(data: Value) -> Value {
    serde_json::json!({ "code": "2000", "msg": "SUCCESS", "data": data })
}

pub fn wrap_list(items: Vec<Value>) -> Value {
    wrap_success(serde_json::json!({ "items": items }))
}
