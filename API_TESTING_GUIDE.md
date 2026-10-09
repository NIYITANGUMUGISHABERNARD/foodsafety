# Food Safety API Testing Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/api/auth/login`) require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Setup

### 1. Start the Server
```bash
cd backend
npm install
npm run dev
```

### 2. Login to Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Save the `token` from the response for subsequent requests.

---

## API Endpoints

### 🔐 Authentication

#### Login (Public)
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Create User (Admin Only)
```bash
POST /api/auth/create-user
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Quality Control Officer"
}
```

**Roles:** Admin, Quality Control Officer, Production Staff, Manager

---

### 👤 Users (Admin Only)

#### Get All Users
```bash
GET /api/users
Authorization: Bearer <admin_token>
```

#### Get One User
```bash
GET /api/users/:id
Authorization: Bearer <admin_token>
```

#### Update User
```bash
PUT /api/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "full_name": "Updated Name",
  "role": "Manager"
}
```

#### Delete User
```bash
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

**Roles:** Admin only for all operations

---

### 📦 Categories (Admin Only for Write)

#### Get All Categories
```bash
GET /api/categories
Authorization: Bearer <any_token>
```

#### Get One Category
```bash
GET /api/categories/:id
Authorization: Bearer <any_token>
```

#### Create Category (Admin Only)
```bash
POST /api/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "category_name": "Dairy Products"
}
```

#### Update Category (Admin Only)
```bash
PUT /api/categories/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "category_name": "Updated Category Name"
}
```

#### Delete Category (Admin Only)
```bash
DELETE /api/categories/:id
Authorization: Bearer <admin_token>
```

**Read:** All authenticated users
**Write:** Admin only

---

### 🏷️ Products (Admin Only for Write)

#### Get All Products
```bash
GET /api/products
Authorization: Bearer <any_token>
```

#### Get One Product
```bash
GET /api/products/:id
Authorization: Bearer <any_token>
```

#### Create Product (Admin Only)
```bash
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "product_name": "Milk",
  "category_id": 1
}
```

#### Update Product (Admin Only)
```bash
PUT /api/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "product_name": "Updated Product Name",
  "category_id": 2
}
```

#### Delete Product (Admin Only)
```bash
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

**Read:** All authenticated users
**Write:** Admin only

---

### 📦 Batches (Production Staff + Admin for Write)

#### Get All Batches
```bash
GET /api/batches
Authorization: Bearer <any_token>
```

#### Get One Batch
```bash
GET /api/batches/:id
Authorization: Bearer <any_token>
```

#### Create Batch (Production Staff + Admin)
```bash
POST /api/batches
Authorization: Bearer <production_staff_token_or_admin_token>
Content-Type: application/json

{
  "product_id": 1,
  "batch_number": "BATCH-001",
  "production_date": "2024-01-15",
  "expiry_date": "2024-07-15",
  "quantity": 1000.50
}
```

#### Update Batch (Production Staff + Admin)
```bash
PUT /api/batches/:id
Authorization: Bearer <production_staff_token_or_admin_token>
Content-Type: application/json

{
  "product_id": 1,
  "batch_number": "BATCH-001-UPDATED",
  "production_date": "2024-01-15",
  "expiry_date": "2024-07-15",
  "quantity": 1500.00
}
```

#### Delete Batch (Production Staff + Admin)
```bash
DELETE /api/batches/:id
Authorization: Bearer <production_staff_token_or_admin_token>
```

**Read:** All authenticated users
**Write:** Production Staff + Admin

---

### 🌡️ Storage Conditions (Production Staff + Admin for Write)

#### Get All Storage Records
```bash
GET /api/storage
Authorization: Bearer <any_token>
```

#### Get One Storage Record
```bash
GET /api/storage/:id
Authorization: Bearer <any_token>
```

#### Create Storage Record (Production Staff + Admin)
```bash
POST /api/storage
Authorization: Bearer <production_staff_token_or_admin_token>
Content-Type: application/json

{
  "batch_id": 1,
  "temperature": 4.5,
  "humidity": 65.0,
  "storage_type": "Refrigerated"
}
```

#### Update Storage Record (Production Staff + Admin)
```bash
PUT /api/storage/:id
Authorization: Bearer <production_staff_token_or_admin_token>
Content-Type: application/json

{
  "batch_id": 1,
  "temperature": 5.0,
  "humidity": 70.0,
  "storage_type": "Refrigerated"
}
```

#### Delete Storage Record (Production Staff + Admin)
```bash
DELETE /api/storage/:id
Authorization: Bearer <production_staff_token_or_admin_token>
```

**Read:** All authenticated users
**Write:** Production Staff + Admin

---

### 🔍 Inspections (Quality Control Officer + Admin for Write)

#### Get All Inspections
```bash
GET /api/inspections
Authorization: Bearer <any_token>
```

#### Get One Inspection
```bash
GET /api/inspections/:id
Authorization: Bearer <any_token>
```

#### Create Inspection (Quality Control Officer + Admin)
```bash
POST /api/inspections
Authorization: Bearer <qco_token_or_admin_token>
Content-Type: application/json

{
  "batch_id": 1,
  "inspected_by": 2,
  "inspection_status": "Passed",
  "remarks": "Quality standards met"
}
```

**inspection_status values:** "Passed", "Failed"

#### Update Inspection (Quality Control Officer + Admin)
```bash
PUT /api/inspections/:id
Authorization: Bearer <qco_token_or_admin_token>
Content-Type: application/json

{
  "batch_id": 1,
  "inspected_by": 2,
  "inspection_status": "Failed",
  "remarks": "Temperature exceeded threshold"
}
```

#### Delete Inspection (Quality Control Officer + Admin)
```bash
DELETE /api/inspections/:id
Authorization: Bearer <qco_token_or_admin_token>
```

**Read:** All authenticated users
**Write:** Quality Control Officer + Admin

---

### ⚠️ Risk Analysis (Quality Control Officer + Admin for Write)

#### Get All Risk Analyses
```bash
GET /api/risk
Authorization: Bearer <any_token>
```

#### Get One Risk Analysis
```bash
GET /api/risk/:id
Authorization: Bearer <any_token>
```

#### Create Risk Analysis (Quality Control Officer + Admin)
```bash
POST /api/risk
Authorization: Bearer <qco_token_or_admin_token>
Content-Type: application/json

{
  "batch_id": 1,
  "risk_level": "Warning",
  "ai_score": 75.5
}
```

**risk_level values:** "Safe", "Warning", "Unsafe"

#### Update Risk Analysis (Quality Control Officer + Admin)
```bash
PUT /api/risk/:id
Authorization: Bearer <qco_token_or_admin_token>
Content-Type: application/json

{
  "batch_id": 1,
  "risk_level": "Unsafe",
  "ai_score": 85.0
}
```

#### Delete Risk Analysis (Quality Control Officer + Admin)
```bash
DELETE /api/risk/:id
Authorization: Bearer <qco_token_or_admin_token>
```

#### AI Risk Evaluation (Quality Control Officer + Admin)
```bash
POST /api/risk/evaluate/:batchId
Authorization: Bearer <qco_token_or_admin_token>
```

**Read:** All authenticated users
**Write:** Quality Control Officer + Admin

---

### 🚨 Alerts (Quality Control Officer + Admin for Write)

#### Get All Alerts
```bash
GET /api/alerts
Authorization: Bearer <any_token>
```

#### Get One Alert
```bash
GET /api/alerts/:id
Authorization: Bearer <any_token>
```

#### Create Alert (Quality Control Officer + Admin)
```bash
POST /api/alerts
Authorization: Bearer <qco_token_or_admin_token>
Content-Type: application/json

{
  "batch_id": 1,
  "risk_id": 1,
  "alert_message": "Temperature exceeded safe threshold",
  "alert_type": "Temperature Warning",
  "status": "Unread"
}
```

**status values:** "Unread", "Read"

#### Update Alert (Quality Control Officer + Admin)
```bash
PUT /api/alerts/:id
Authorization: Bearer <qco_token_or_admin_token>
Content-Type: application/json

{
  "batch_id": 1,
  "risk_id": 1,
  "alert_message": "Updated alert message",
  "alert_type": "Temperature Warning",
  "status": "Read"
}
```

#### Delete Alert (Quality Control Officer + Admin)
```bash
DELETE /api/alerts/:id
Authorization: Bearer <qco_token_or_admin_token>
```

**Read:** All authenticated users
**Write:** Quality Control Officer + Admin

---

### 📊 Dashboards (Manager + Admin)

#### Get Dashboard Data
```bash
GET /api/dashboards
Authorization: Bearer <manager_token_or_admin_token>
```

**Response:**
```json
{
  "totalProducts": 10,
  "totalBatches": 25,
  "unsafeBatches": 2
}
```

**Access:** Manager + Admin only

---

## Role Permissions Summary

| Resource | Read | Create | Update | Delete |
|----------|------|--------|--------|--------|
| **Users** | Admin | Admin | Admin | Admin |
| **Categories** | All | Admin | Admin | Admin |
| **Products** | All | Admin | Admin | Admin |
| **Batches** | All | Prod Staff + Admin | Prod Staff + Admin | Prod Staff + Admin |
| **Storage** | All | Prod Staff + Admin | Prod Staff + Admin | Prod Staff + Admin |
| **Inspections** | All | QCO + Admin | QCO + Admin | QCO + Admin |
| **Risk Analysis** | All | QCO + Admin | QCO + Admin | QCO + Admin |
| **Alerts** | All | QCO + Admin | QCO + Admin | QCO + Admin |
| **Dashboards** | Manager + Admin | - | - | - |

---

## Testing Tools

### Using cURL
```bash
# Example: Get all products
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the endpoints above
2. Set base URL to `http://localhost:5000/api`
3. Add Authorization header with Bearer token
4. Test each endpoint according to role permissions

### Using VS Code REST Client
Create a file `api-test.http`:
```http
@baseUrl = http://localhost:5000/api
@token = YOUR_TOKEN_HERE

### Get All Products
GET {{baseUrl}}/products
Authorization: Bearer {{token}}

### Create Product (Admin)
POST {{baseUrl}}/products
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "product_name": "Test Product",
  "category_id": 1
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied for role: Production Staff"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "error": "Database connection error"
}
```

---

## Testing Checklist

- [ ] Test login with different roles
- [ ] Test read operations with each role
- [ ] Test write operations with authorized roles
- [ ] Test write operations with unauthorized roles (should return 403)
- [ ] Test endpoints without authentication (should return 401)
- [ ] Test invalid tokens (should return 401)
- [ ] Test CRUD operations for all 8 tables
- [ ] Test dashboard access for Manager and Admin
- [ ] Test AI risk evaluation endpoint
