FROM rust:1.85-alpine AS builder

WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
COPY src ./src
RUN apk add --no-cache musl-dev && \
    cargo build --release

FROM alpine:3.20
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/target/release/rs-service .
EXPOSE 8080
CMD ["./rs-service"]
