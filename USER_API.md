# User Management API Documentation

## Overview

This API provides full CRUD (Create, Read, Update, Delete) operations for user management with role-based access control and proper authentication.

## Base URL

```
/api/users
```

## Authentication

All endpoints require authentication via JWT token. The token can be provided in one of two ways:

1. **HTTP-only Cookie**: `token` cookie (automatically set during login)
2. **Authorization Header**: `Authorization: Bearer <token>`

## User Roles

- **user**: Regular user with limited permissions
- **admin**: Administrator with full permissions

## Endpoints

### 1. Get All Users

```http
GET /api/users
```

**Authentication**: Required (Admin only)

**Description**: Retrieves a list of all users in the system.

**Response**:

```json
{
  "message": "Successfully retrieved all users",
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Codes**:

- `200`: Success
- `401`: Unauthorized (no token provided)
- `403`: Forbidden (not admin)

---

### 2. Get User by ID

```http
GET /api/users/:id
```

**Authentication**: Required (Owner or Admin)

**Parameters**:

- `id` (path parameter): User ID (positive integer)

**Description**: Retrieves a specific user by their ID. Users can only access their own profile unless they're an admin.

**Response**:

```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

**Status Codes**:

- `200`: Success
- `400`: Bad Request (invalid ID format)
- `401`: Unauthorized (no token provided)
- `403`: Forbidden (not owner or admin)
- `404`: Not Found (user doesn't exist)

---

### 3. Update User

```http
PUT /api/users/:id
```

**Authentication**: Required (Owner or Admin with restrictions)

**Parameters**:

- `id` (path parameter): User ID (positive integer)

**Request Body** (all fields optional, at least one required):

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "password": "newpassword123",
  "role": "admin"
}
```

**Business Rules**:

- Users can update their own profile (except role)
- Only admins can change user roles
- Users cannot change their own role (prevents privilege escalation)
- Passwords are automatically hashed when updated

**Validation**:

- `name`: 2-255 characters, trimmed
- `email`: Valid email format, lowercase, trimmed
- `password`: 6-128 characters
- `role`: Must be either "user" or "admin"

**Response**:

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "user",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T10:30:00.000Z"
  }
}
```

**Status Codes**:

- `200`: Success
- `400`: Bad Request (validation failed)
- `401`: Unauthorized (no token provided)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (user doesn't exist)

---

### 4. Delete User

```http
DELETE /api/users/:id
```

**Authentication**: Required (Admin only with self-deletion protection)

**Parameters**:

- `id` (path parameter): User ID (positive integer)

**Description**: Deletes a user from the system.

**Business Rules**:

- Only admins can delete users
- Admins cannot delete their own account (prevents system lockout)

**Response**:

```json
{
  "message": "User deleted successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Status Codes**:

- `200`: Success
- `400`: Bad Request (invalid ID format)
- `401`: Unauthorized (no token provided)
- `403`: Forbidden (not admin or trying to delete own account)
- `404`: Not Found (user doesn't exist)

## Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": "Additional validation details (when applicable)"
}
```

## Examples

### Update User Profile (Regular User)

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }'
```

### Change User Role (Admin Only)

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer admin-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

### Delete User (Admin Only)

```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer admin-jwt-token"
```

## Security Features

- **JWT Authentication**: All endpoints require valid JWT tokens
- **Role-Based Access Control**: Different permissions for users and admins
- **Ownership Validation**: Users can only access/modify their own resources
- **Password Security**: Passwords are hashed using bcrypt with salt rounds
- **Privilege Escalation Prevention**: Users cannot change their own roles
- **Admin Protection**: Admins cannot delete their own accounts
- **Input Validation**: All inputs are validated using Zod schemas
- **Request Logging**: All operations are logged for audit purposes
