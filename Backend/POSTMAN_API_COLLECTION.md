# UPIQ Microservices - Postman API Collection

## Base URLs

### API Gateway (Recommended - All requests go through here)
```
http://localhost:8080
```

### Direct Service URLs (For testing individual services)
- **Eureka Server**: `http://localhost:8761`
- **User Authentication Service**: `http://localhost:8081`
- **PDF Parser Service**: `http://localhost:8082`
- **Transaction Service**: `http://localhost:8083`
- **Category Service**: `http://localhost:8084`

---

## 🔐 Authentication

Most endpoints require JWT authentication. Follow these steps:

1. **Register a new user** (Public endpoint)
2. **Login** to get JWT token (Public endpoint)
3. **Use the token** in Authorization header for protected endpoints:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

The API Gateway automatically extracts user info from JWT and adds `X-User-Id` header to downstream services.

---

## 📋 API Endpoints

### 🔵 1. USER AUTHENTICATION SERVICE

#### Public Endpoints (No JWT Required)

#### 1.1 Register User
```
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "userName": "johndoe",
  "password": "password123",
  "role": "USER"  // Optional: "USER" or "ADMIN", defaults to "USER"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "message": "User registered successfully!"
  },
  "message": "User registered successfully"
}
```

#### 1.2 Login
```
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### 1.3 Health Check
```
GET http://localhost:8080/health/health

Response (200 OK):
{
  "success": true,
  "data": "UPIQ-User-Authentication-Service is running",
  "message": "Service is healthy"
}
```

---

#### Protected Endpoints (JWT Required)

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
```

#### 1.4 Get All Users
```
GET http://localhost:8080/api/v1/users
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "fullName": null,
      "role": "USER",
      "active": true,
      "createdAt": "2024-01-01T10:00:00",
      "lastLoginAt": null
    }
  ],
  "message": "Users retrieved successfully"
}
```

#### 1.5 Get User by Email
```
GET http://localhost:8080/api/v1/users/email/{email}
Authorization: Bearer <token>

Example:
GET http://localhost:8080/api/v1/users/email/user@example.com

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": null,
    "role": "USER",
    "active": true,
    "createdAt": "2024-01-01T10:00:00",
    "lastLoginAt": null
  },
  "message": "User retrieved successfully"
}
```

#### 1.6 Get User by Username
```
GET http://localhost:8080/api/v1/users/username/{username}
Authorization: Bearer <token>

Example:
GET http://localhost:8080/api/v1/users/username/johndoe
```

#### 1.7 Get Current User Profile
```
GET http://localhost:8080/api/v1/users/me
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": null,
    "role": "USER",
    "active": true,
    "createdAt": "2024-01-01T10:00:00",
    "lastLoginAt": null
  },
  "message": "User retrieved successfully"
}
```

---

### 🟢 2. CATEGORY SERVICE

**All endpoints require JWT authentication**

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
```
*(Note: API Gateway automatically adds X-User-Id header from JWT)*

#### 2.1 Create Category
```
POST http://localhost:8080/api/categories
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Food & Dining",
  "type": "expense",  // Must be "income" or "expense"
  "description": "Restaurants, groceries, food delivery"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Food & Dining",
    "type": "expense",
    "description": "Restaurants, groceries, food delivery"
  },
  "message": "Category created successfully"
}
```

#### 2.2 Get All Categories
```
GET http://localhost:8080/api/categories
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Food & Dining",
      "type": "expense",
      "description": "Restaurants, groceries, food delivery"
    },
    {
      "id": 2,
      "name": "Salary",
      "type": "income",
      "description": "Monthly salary"
    }
  ],
  "message": "Categories retrieved successfully"
}
```

#### 2.3 Get Categories by Type
```
GET http://localhost:8080/api/categories/type/{type}
Authorization: Bearer <token>

Examples:
GET http://localhost:8080/api/categories/type/expense
GET http://localhost:8080/api/categories/type/income

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Food & Dining",
      "type": "expense",
      "description": "Restaurants, groceries, food delivery"
    }
  ],
  "message": "Categories retrieved successfully"
}
```

#### 2.4 Get Category by ID
```
GET http://localhost:8080/api/categories/{id}
Authorization: Bearer <token>

Example:
GET http://localhost:8080/api/categories/1

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Food & Dining",
    "type": "expense",
    "description": "Restaurants, groceries, food delivery"
  },
  "message": "Category retrieved successfully"
}
```

#### 2.5 Update Category
```
PUT http://localhost:8080/api/categories/{id}
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "Food & Dining Updated",
  "type": "expense",
  "description": "Updated description"
}

Example:
PUT http://localhost:8080/api/categories/1

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Food & Dining Updated",
    "type": "expense",
    "description": "Updated description"
  },
  "message": "Category updated successfully"
}
```

#### 2.6 Delete Category
```
DELETE http://localhost:8080/api/categories/{id}
Authorization: Bearer <token>

Example:
DELETE http://localhost:8080/api/categories/1

Response (200 OK):
{
  "success": true,
  "data": null,
  "message": "Category deleted successfully"
}
```

#### 2.7 Health Check
```
GET http://localhost:8080/api/categories/health
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": "UPIQ-Category-Service is running",
  "message": "Service is healthy"
}
```

---

### 🟡 3. TRANSACTION SERVICE

**All endpoints require JWT authentication**

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
```

#### 3.1 Create Transaction
```
POST http://localhost:8080/api/transactions
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "amount": 1500.50,
  "type": "expense",  // Must be "income" or "expense"
  "category": "Food & Dining",
  "description": "Lunch at restaurant",
  "paymentMethod": "UPI"  // Optional: "UPI", "Cash", "Card", "Net Banking"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "amount": 1500.50,
    "type": "expense",
    "category": "Food & Dining",
    "description": "Lunch at restaurant",
    "date": "2024-01-15T12:30:00",
    "paymentMethod": "UPI"
  },
  "message": "Transaction created successfully"
}
```

#### 3.2 Get All User Transactions
```
GET http://localhost:8080/api/transactions
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "amount": 1500.50,
      "type": "expense",
      "category": "Food & Dining",
      "description": "Lunch at restaurant",
      "date": "2024-01-15T12:30:00",
      "paymentMethod": "UPI"
    },
    {
      "id": 2,
      "userId": 1,
      "amount": 50000.00,
      "type": "income",
      "category": "Salary",
      "description": "Monthly salary",
      "date": "2024-01-01T09:00:00",
      "paymentMethod": "Net Banking"
    }
  ],
  "message": "Transactions retrieved successfully"
}
```

#### 3.3 Get Transactions by Category
```
GET http://localhost:8080/api/transactions/category/{category}
Authorization: Bearer <token>

Example:
GET http://localhost:8080/api/transactions/category/Food%20%26%20Dining

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "amount": 1500.50,
      "type": "expense",
      "category": "Food & Dining",
      "description": "Lunch at restaurant",
      "date": "2024-01-15T12:30:00",
      "paymentMethod": "UPI"
    }
  ],
  "message": "Transactions retrieved successfully"
}
```

#### 3.4 Get Transaction by ID
```
GET http://localhost:8080/api/transactions/{id}
Authorization: Bearer <token>

Example:
GET http://localhost:8080/api/transactions/1

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "amount": 1500.50,
    "type": "expense",
    "category": "Food & Dining",
    "description": "Lunch at restaurant",
    "date": "2024-01-15T12:30:00",
    "paymentMethod": "UPI"
  },
  "message": "Transaction retrieved successfully"
}
```

#### 3.5 Delete Transaction
```
DELETE http://localhost:8080/api/transactions/{id}
Authorization: Bearer <token>

Example:
DELETE http://localhost:8080/api/transactions/1

Response (200 OK):
{
  "success": true,
  "data": null,
  "message": "Transaction deleted successfully"
}
```

---

### 🟣 4. PDF PARSER SERVICE

**All endpoints require JWT authentication (except health)**

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
```

#### 4.1 Upload and Parse File (PDF/CSV)
```
POST http://localhost:8080/api/parser/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: [Select PDF or CSV file]

Response (200 OK):
{
  "success": true,
  "data": {
    "totalTransactions": 10,
    "successfulParses": 8,
    "failedParses": 2,
    "transactions": [
      {
        "amount": 1500.50,
        "type": "expense",
        "category": null,
        "description": "Paid to Restaurant ABC",
        "date": "2024-01-15T12:30:00",
        "paymentMethod": "UPI"
      }
    ],
    "errors": [
      "Invalid transaction: null",
      "Invalid transaction: null"
    ],
    "message": "Successfully parsed 8 transactions from statement.pdf"
  },
  "message": "File parsed successfully"
}
```

#### 4.2 Health Check
```
GET http://localhost:8080/api/parser/health
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": "UPIQ-PDFParser-Service is running",
  "message": "Service is healthy"
}
```

---

## 📝 Postman Collection Setup

### Environment Variables

Create a Postman environment with these variables:

```
BASE_URL: http://localhost:8080
JWT_TOKEN: (will be set after login)
USER_ID: (will be extracted from JWT)
```

### Pre-request Script (for protected endpoints)

Add this to your Postman collection's pre-request script:

```javascript
// Auto-add JWT token to requests
if (pm.environment.get("JWT_TOKEN")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("JWT_TOKEN")
    });
}
```

### Test Script (for Login endpoint)

Add this to the Login request's Tests tab:

```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.success && jsonData.data && jsonData.data.token) {
        pm.environment.set("JWT_TOKEN", jsonData.data.token);
        console.log("JWT Token saved to environment");
    }
}
```

---

## 🔄 Testing Workflow

### Step 1: Register a User
```
POST http://localhost:8080/api/v1/auth/register
```

### Step 2: Login
```
POST http://localhost:8080/api/v1/auth/login
```
**Save the token from response to your Postman environment**

### Step 3: Create Categories
```
POST http://localhost:8080/api/categories
```

### Step 4: Create Transactions
```
POST http://localhost:8080/api/transactions
```

### Step 5: Query Transactions
```
GET http://localhost:8080/api/transactions
GET http://localhost:8080/api/transactions/category/{category}
```

### Step 6: Upload and Parse PDF/CSV
```
POST http://localhost:8080/api/parser/upload
```

---

## ⚠️ Error Responses

### Standard Error Format
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "errors": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  },
  "path": "/api/v1/auth/register"
}
```

### Common HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation error or invalid input
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🧪 Quick Test Examples

### Complete Flow Example

1. **Register:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "userName": "testuser",
    "password": "password123"
  }'
```

2. **Login:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Create Category (use token from login):**
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Food",
    "type": "expense",
    "description": "Food expenses"
  }'
```

4. **Create Transaction:**
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500.00,
    "type": "expense",
    "category": "Food",
    "description": "Lunch"
  }'
```

---

## 📌 Notes

1. **JWT Token Expiration**: Tokens expire after 1 hour (3600000ms). Re-login to get a new token.

2. **User ID Header**: The API Gateway automatically extracts user ID from JWT and adds it as `X-User-Id` header to downstream services. You don't need to manually add this header.

3. **CORS**: All endpoints support CORS from any origin.

4. **File Upload**: Maximum file size is 10MB for PDF/CSV uploads.

5. **Category Types**: Must be exactly "income" or "expense" (case-insensitive).

6. **Transaction Types**: Must be exactly "income" or "expense" (case-insensitive).

---

## 🚀 Service Startup Order

1. **Eureka Server** (Port 8761)
2. **User Authentication Service** (Port 8081)
3. **Category Service** (Port 8084)
4. **Transaction Service** (Port 8083)
5. **PDF Parser Service** (Port 8082)
6. **API Gateway** (Port 8080)

All services will register with Eureka automatically on startup.

