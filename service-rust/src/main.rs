use axum::{routing::get, Json, Router};
use serde_json::{json, Value};
use std::env;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let app = Router::new()
        .route("/ping", get(ping))
        .route("/health", get(health));
    let addr = format!("0.0.0.0:{}", port);
    let listener = TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn ping() -> Json<Value> {
    Json(json!({
        "ok": true,
        "svc": "rust",
        "ts": std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis() as u64
    }))
}

async fn health() -> Json<Value> {
    Json(json!({ "ok": true }))
}
