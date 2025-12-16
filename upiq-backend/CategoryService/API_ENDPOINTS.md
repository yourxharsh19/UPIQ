# Category Service API Endpoints

## Base URL
`/api/categories`

## Headers Required
- `X-User-Id`: Long (User ID for all endpoints)

---

## 1. Create Category
**POST** `/api/categories`

**Request Body:**
```json
{
  "name": "Food",
  "type": "expense",
  "description": "Food and dining expenses"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Food",
  "type": "expense",
  "description": "Food and dining expenses"
}
```

**Validation:**
- `name`: Required, NotBlank
- `type`: Required, Must be "income" or "expense"
- `description`: Optional

---

## 2. Get All Categories
**GET** `/api/categories`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Food",
    "type": "expense",
    "description": "Food and dining expenses"
  },
  {
    "id": 2,
    "name": "Salary",
    "type": "income",
    "description": "Monthly salary"
  }
]
```

---

## 3. Get Categories by Type
**GET** `/api/categories/type/{type}`

**Path Parameters:**
- `type`: "income" or "expense"

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Food",
    "type": "expense",
    "description": "Food and dining expenses"
  }
]
```

---

## 4. Get Category by ID
**GET** `/api/categories/{id}`

**Path Parameters:**
- `id`: Long (Category ID)

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Food",
  "type": "expense",
  "description": "Food and dining expenses"
}
```

**Error:** `404 Not Found` if category doesn't exist or doesn't belong to user

---

## 5. Update Category
**PUT** `/api/categories/{id}`

**Path Parameters:**
- `id`: Long (Category ID)

**Request Body:**
```json
{
  "name": "Groceries",
  "type": "expense",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Groceries",
  "type": "expense",
  "description": "Updated description"
}
```

**Validation:**
- `name`: Required, NotBlank
- `type`: Optional, Must be "income" or "expense" if provided
- `description`: Optional

---

## 6. Delete Category
**DELETE** `/api/categories/{id}`

**Path Parameters:**
- `id`: Long (Category ID)

**Response:** `200 OK`
```
Category deleted successfully
```

**Error:** `404 Not Found` if category doesn't exist or doesn't belong to user

---

## 7. Health Check
**GET** `/api/categories/health`

**Response:** `200 OK`
```
Category Service is running
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid Request",
  "message": "Category type must be 'income' or 'expense'"
}
```

### 404 Not Found
```json
{
  "error": "Category Not Found",
  "message": "Category not found with id: 123"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error message"
}
```

---

## Testing with cURL

### Create Category
```bash
curl -X POST http://localhost:8083/api/categories \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "name": "Food",
    "type": "expense",
    "description": "Food expenses"
  }'
```

### Get All Categories
```bash
curl -X GET http://localhost:8083/api/categories \
  -H "X-User-Id: 1"
```

### Get Categories by Type
```bash
curl -X GET http://localhost:8083/api/categories/type/expense \
  -H "X-User-Id: 1"
```

### Get Category by ID
```bash
curl -X GET http://localhost:8083/api/categories/1 \
  -H "X-User-Id: 1"
```

### Update Category
```bash
curl -X PUT http://localhost:8083/api/categories/1 \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "name": "Groceries",
    "type": "expense",
    "description": "Updated"
  }'
```

### Delete Category
```bash
curl -X DELETE http://localhost:8083/api/categories/1 \
  -H "X-User-Id: 1"
```

### Health Check
```bash
curl -X GET http://localhost:8083/api/categories/health
```

