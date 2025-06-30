# DOCKER

## CHUẨN BỊ

- tạo 1 file .env
- copy toàn bộ biến .env.example qua .env

## RUN DOCKER

docker compose up

- mongodb :27018
- backend :3000
- meilisearch :7700

# LƯU Ý

## Nếu bạn đã từng build docker 1 lần xin hãy chạy dòng lệnh sau:

### Nếu container đang chạy

- docker compose down

### Container đã dừng

- docker compose build

### sau đó docker compose up để chạy lại
