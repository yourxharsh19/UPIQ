# UPIQ Project Commands Cheatsheet

## Docker Operations
### Check Running Containers
```bash
docker ps
```

### Restart All Services (Clean Slate)
```bash
# Stop and remove all containers
docker rm -f $(docker ps -aq)

# Start everything fresh
cd upiq-backend
docker compose -f docker-compose.local.yml up -d
```

### Rebuild & Restart a Specific Service (e.g., User Auth)
```bash
# 1. Build the image
cd upiq-backend/UserAuthenticationService
docker build -t upiq-user-auth-service:latest .

# 2. Restart content with new image
cd .. # Back to upiq-backend
docker compose -f docker-compose.local.yml up -d --force-recreate user-auth-service
```

## Database Access
### Access User Database (PostgreSQL)
View all registered users:
```bash
docker exec -it user-auth-db psql -U postgres -d userauthdb -c "SELECT * FROM users;"
```

Interactive SQL Shell:
```bash
docker exec -it user-auth-db psql -U postgres -d userauthdb
# Type \q to exit
```

## Logs & Debugging
### Check Service Logs
```bash
docker logs -f user-auth-service
docker logs -f api-gateway
docker logs -f eureka-server
```

### Restart API Gateway (Fix 503 Errors)
If you see "503 Service Unavailable" after restarting a service:
```bash
docker restart api-gateway
```
