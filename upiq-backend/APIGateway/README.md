# API Gateway Service

The API Gateway serves as the single entry point for all microservices in the UPIQ application. It handles routing, authentication, and CORS configuration.

## Port
- **API Gateway**: `8080`

## Service Routes

### User Authentication Service (Port 8081)
- **Public Endpoints** (No JWT required):
  - `POST /api/v1/auth/register` - Register a new user
  - `POST /api/v1/auth/login` - Login and get JWT token
  - `GET /health/health` - Health check

- **Protected Endpoints** (JWT required):
  - `GET /api/v1/users` - Get all users
  - `GET /api/v1/users/email/{email}` - Get user by email
  - `GET /api/v1/users/username/{username}` - Get user by username
  - `GET /api/v1/users/me` - Get current user profile

### PDF Parser Service (Port 8082)
- **Public Endpoints**:
  - `GET /api/parser/health` - Health check

- **Protected Endpoints** (JWT required):
  - `POST /api/parser/upload` - Upload and parse PDF/CSV file

### Transaction Service (Port 8083)
- **Protected Endpoints** (JWT required):
  - `POST /api/transactions` - Create a new transaction
  - `GET /api/transactions` - Get all user transactions
  - `GET /api/transactions/category/{category}` - Get transactions by category
  - `GET /api/transactions/{id}` - Get transaction by ID

### Category Service (Port 8084)
- **Protected Endpoints** (JWT required):
  - `POST /api/categories` - Create a new category
  - `GET /api/categories` - Get all user categories
  - `GET /api/categories/type/{type}` - Get categories by type (income/expense)
  - `GET /api/categories/{id}` - Get category by ID
  - `PUT /api/categories/{id}` - Update category
  - `DELETE /api/categories/{id}` - Delete category
  - `GET /api/categories/health` - Health check

## Authentication

The API Gateway uses JWT (JSON Web Token) for authentication. To access protected endpoints:

1. **Register/Login** to get a JWT token:
   ```bash
   curl -X POST http://localhost:8080/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
   ```

2. **Use the token** in the Authorization header:
   ```bash
   curl -X GET http://localhost:8080/api/categories \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

The gateway automatically:
- Validates the JWT token
- Extracts user information (userId, email) from the token
- Adds `X-User-Id` and `userId` headers to downstream services
- Returns 401 Unauthorized if the token is invalid or missing

## CORS Configuration

The gateway is configured to allow:
- All origins (`*`)
- All HTTP methods (GET, POST, PUT, DELETE, OPTIONS, PATCH)
- All headers
- Credentials

## Configuration

Service URLs are configured in `application.properties`:
```properties
user.auth.service.url=http://localhost:8081
pdf.parser.service.url=http://localhost:8082
transaction.service.url=http://localhost:8083
category.service.url=http://localhost:8084
```

JWT secret must match the UserAuthenticationService configuration.

## Running the Gateway

1. Ensure all microservices are running on their respective ports
2. Start the API Gateway:
   ```bash
   cd Backend/APIGateway
   ./mvnw spring-boot:run
   ```
3. The gateway will be available at `http://localhost:8080`

## Example Usage

### Register a new user
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe"
  }'
```

### Login and get token
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a category (requires JWT)
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Food",
    "type": "expense",
    "description": "Food expenses"
  }'
```

### Create a transaction (requires JWT)
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 50.00,
    "category": "Food",
    "description": "Lunch",
    "type": "expense"
  }'
```

## Architecture

The API Gateway:
1. Receives all client requests
2. Validates JWT tokens for protected routes
3. Routes requests to appropriate microservices
4. Adds user context (userId) to downstream service requests
5. Handles CORS for cross-origin requests

