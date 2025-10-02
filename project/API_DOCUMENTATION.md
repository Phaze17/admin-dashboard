# API Documentation

## Overview

This API provides [brief description of your API's purpose]. All endpoints use JSON for request and response bodies unless otherwise specified.

**Base URL:** `https://[your-project-id].supabase.co/functions/v1`

## Authentication

All API endpoints require authentication unless marked as public. Include the following headers in your requests:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Authentication Methods

#### 1. Anonymous Key (Public Access)
```http
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```
Use for public endpoints and client-side requests. This key respects Row Level Security (RLS) policies.

#### 2. Service Role Key (Admin Access)
```http
Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY
```
Use for server-side operations that bypass RLS. **Never expose this key in client-side code.**

#### 3. User JWT Token
```http
Authorization: Bearer USER_JWT_TOKEN
```
Obtained after user authentication via `supabase.auth.signInWithPassword()` or similar methods.

## Global Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes (except public endpoints) | Bearer token for authentication |
| `Content-Type` | Yes (for POST/PUT) | Must be `application/json` |
| `X-Client-Info` | No | Client information for logging |

## Rate Limiting

- **Rate Limit:** 60 requests per minute per IP address
- **Burst Limit:** 10 requests per second

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response.

## Common Response Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | Request successful |
| `201 Created` | Resource created successfully |
| `204 No Content` | Request successful, no content to return |
| `400 Bad Request` | Invalid request parameters or body |
| `401 Unauthorized` | Missing or invalid authentication token |
| `403 Forbidden` | Authenticated but not authorized for this resource |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource conflict (e.g., duplicate entry) |
| `422 Unprocessable Entity` | Validation error |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Server error |
| `503 Service Unavailable` | Service temporarily unavailable |

## Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context about the error"
    }
  }
}
```

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_REQUEST` | Request validation failed |
| `UNAUTHORIZED` | Authentication failed |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource already exists |
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Unexpected server error |

---

## Endpoints

### Example Resource: Users

#### Get All Users

Retrieve a paginated list of users.

**Endpoint:** `GET /users`

**Authentication:** Required (User JWT)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `limit` | integer | No | 20 | Items per page (max: 100) |
| `sort_by` | string | No | `created_at` | Field to sort by |
| `order` | string | No | `desc` | Sort order: `asc` or `desc` |
| `search` | string | No | - | Search term for filtering |

**Request Example:**

```http
GET /users?page=1&limit=10&sort_by=email&order=asc
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Response Example (200 OK):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_items": 45,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `400 Bad Request` - Invalid query parameters

---

#### Get User by ID

Retrieve a specific user by their ID.

**Endpoint:** `GET /users/:id`

**Authentication:** Required (User JWT)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | User's unique identifier |

**Request Example:**

```http
GET /users/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Response Example (200 OK):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "Software developer",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "details": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

---

#### Create User

Create a new user account.

**Endpoint:** `POST /users`

**Authentication:** Required (Service Role)

**Request Body:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `email` | string | Yes | Valid email format, unique | User's email address |
| `name` | string | Yes | 2-100 characters | User's full name |
| `password` | string | Yes | Min 8 characters | User's password |
| `bio` | string | No | Max 500 characters | User biography |

**Request Example:**

```http
POST /users
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "password": "SecurePass123!",
  "bio": "Designer and developer"
}
```

**Response Example (201 Created):**

```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "bio": "Designer and developer",
    "created_at": "2024-02-01T09:15:00Z",
    "updated_at": "2024-02-01T09:15:00Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request body
- `409 Conflict` - Email already exists
- `422 Unprocessable Entity` - Validation error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Email is already registered",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

---

#### Update User

Update an existing user's information.

**Endpoint:** `PUT /users/:id`

**Authentication:** Required (User JWT - own account or Service Role)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | User's unique identifier |

**Request Body:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | string | No | 2-100 characters | User's full name |
| `bio` | string | No | Max 500 characters | User biography |
| `avatar_url` | string | No | Valid URL | Profile picture URL |

**Request Example:**

```http
PUT /users/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "John Updated Doe",
  "bio": "Senior software developer"
}
```

**Response Example (200 OK):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Updated Doe",
    "bio": "Senior software developer",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-02-01T11:20:00Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request body
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Cannot update another user's account
- `404 Not Found` - User not found
- `422 Unprocessable Entity` - Validation error

---

#### Delete User

Delete a user account.

**Endpoint:** `DELETE /users/:id`

**Authentication:** Required (Service Role)

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | User's unique identifier |

**Request Example:**

```http
DELETE /users/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
Content-Type: application/json
```

**Response Example (204 No Content):**

No response body.

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - User not found

---

## Webhooks

If your API sends webhooks, document them here.

### Webhook Event: user.created

Triggered when a new user is created.

**Payload Example:**

```json
{
  "event": "user.created",
  "timestamp": "2024-02-01T09:15:00Z",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "created_at": "2024-02-01T09:15:00Z"
  }
}
```

**Signature Verification:**

All webhooks include an `X-Signature` header containing an HMAC SHA256 signature. Verify it using your webhook secret:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

---

## SDKs and Code Examples

### JavaScript/TypeScript

```typescript
// Using Supabase Client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Calling an edge function
const { data, error } = await supabase.functions.invoke('users', {
  body: { name: 'John Doe', email: 'john@example.com' }
});

// Using fetch
const response = await fetch(
  `${process.env.VITE_SUPABASE_URL}/functions/v1/users`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com'
    })
  }
);

const data = await response.json();
```

### Python

```python
import requests
import os

url = f"{os.getenv('SUPABASE_URL')}/functions/v1/users"
headers = {
    'Authorization': f"Bearer {os.getenv('SUPABASE_ANON_KEY')}",
    'Content-Type': 'application/json'
}
data = {
    'name': 'John Doe',
    'email': 'john@example.com'
}

response = requests.post(url, json=data, headers=headers)
result = response.json()
```

### cURL

```bash
curl -X POST \
  https://[your-project-id].supabase.co/functions/v1/users \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

---

## Pagination

All list endpoints support pagination using the following pattern:

**Query Parameters:**
- `page`: Page number (1-indexed)
- `limit`: Items per page (default: 20, max: 100)

**Response Structure:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total_items": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Filtering and Searching

Most list endpoints support filtering and searching:

**Query Parameters:**
- `search`: Full-text search across relevant fields
- `filter[field]`: Filter by specific field value
- `sort_by`: Field to sort by
- `order`: Sort order (`asc` or `desc`)

**Example:**

```http
GET /users?search=john&filter[role]=admin&sort_by=created_at&order=desc
```

---

## Versioning

This API uses URL versioning. The current version is `v1`.

**Format:** `/functions/v1/endpoint`

When breaking changes are introduced, a new version will be released (e.g., `/functions/v2/endpoint`). Previous versions will be supported for at least 6 months after a new version is released.

---

## Best Practices

1. **Always handle errors gracefully** - Check both HTTP status codes and error response bodies
2. **Implement retry logic** - Use exponential backoff for failed requests
3. **Cache responses** - Reduce API calls by caching data when appropriate
4. **Use pagination** - Don't fetch all data at once for large datasets
5. **Validate input** - Validate data on the client before sending requests
6. **Secure your keys** - Never expose service role keys in client-side code
7. **Monitor rate limits** - Track your API usage to avoid hitting rate limits

---

## Support and Contact

- **Documentation:** [Your documentation URL]
- **Status Page:** [Your status page URL]
- **Support Email:** support@example.com
- **API Issues:** [Your issue tracker URL]

---

## Changelog

### Version 1.0.0 (2024-02-01)
- Initial API release
- User management endpoints
- Authentication system

---

## License

[Your API License Information]
