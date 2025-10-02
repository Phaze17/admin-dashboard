# API Endpoint Documentation Template

Use this template when documenting new API endpoints. Copy and fill in the details for each endpoint.

---

## [Endpoint Name]

[Brief description of what this endpoint does and its purpose]

**Endpoint:** `[METHOD] /path/to/endpoint`

**Authentication:** [Required/Optional/Public] ([Authentication type if required])

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param_name` | string/integer/uuid | Yes/No | Description of the parameter |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `param_name` | string/integer/boolean | Yes/No | default_value | Description of the parameter |

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Header-Name` | Yes/No | Description of the header |

### Request Body

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `field_name` | string/integer/object/array | Yes/No | Constraints (e.g., min/max length, format) | Description of the field |

**Request Schema:**

```json
{
  "field_name": "value",
  "nested_object": {
    "sub_field": "value"
  },
  "array_field": ["item1", "item2"]
}
```

### Request Example

```http
[METHOD] /path/to/endpoint?param=value
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "field_name": "example_value"
}
```

```bash
# cURL Example
curl -X [METHOD] \
  https://[your-project-id].supabase.co/functions/v1/path/to/endpoint \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "field_name": "example_value"
  }'
```

```typescript
// TypeScript Example
const response = await fetch(
  `${supabaseUrl}/functions/v1/path/to/endpoint`,
  {
    method: '[METHOD]',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      field_name: 'example_value'
    })
  }
);

const data = await response.json();
```

```python
# Python Example
import requests

url = f"{supabase_url}/functions/v1/path/to/endpoint"
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}
data = {
    'field_name': 'example_value'
}

response = requests.[method](url, json=data, headers=headers)
result = response.json()
```

### Response

#### Success Response (200/201/204)

**Status Code:** `[STATUS_CODE] [Status Name]`

**Response Headers:**

| Header | Description |
|--------|-------------|
| `Header-Name` | Description of the header |

**Response Body:**

```json
{
  "data": {
    "id": "uuid",
    "field_name": "value",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "additional_info": "value"
  }
}
```

**Response Schema:**

| Field | Type | Description |
|-------|------|-------------|
| `data` | object | Main response data |
| `data.id` | uuid | Unique identifier |
| `data.field_name` | string | Description |

#### Error Responses

##### 400 Bad Request

Invalid request parameters or body.

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "field_name": "Field is required"
    }
  }
}
```

##### 401 Unauthorized

Missing or invalid authentication token.

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid authentication token",
    "details": {}
  }
}
```

##### 403 Forbidden

Authenticated but not authorized for this resource.

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource",
    "details": {}
  }
}
```

##### 404 Not Found

Resource not found.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": {
      "resource_id": "uuid"
    }
  }
}
```

##### 409 Conflict

Resource conflict (e.g., duplicate entry).

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Resource already exists",
    "details": {
      "field_name": "value"
    }
  }
}
```

##### 422 Unprocessable Entity

Validation error.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field_name": "Validation error message"
    }
  }
}
```

##### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retry_after": 60
    }
  }
}
```

##### 500 Internal Server Error

Unexpected server error.

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "details": {}
  }
}
```

### Notes

- [Any special considerations or notes about this endpoint]
- [Performance characteristics]
- [Rate limiting specifics]
- [Caching behavior]
- [Deprecation warnings if applicable]

### Related Endpoints

- `[METHOD] /related/endpoint` - [Description]
- `[METHOD] /another/endpoint` - [Description]

### Examples

#### Example 1: [Use Case Description]

[Description of the use case]

**Request:**

```http
[METHOD] /path/to/endpoint
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "example": "data"
}
```

**Response:**

```json
{
  "data": {
    "result": "success"
  }
}
```

#### Example 2: [Another Use Case]

[Description of another use case]

**Request:**

```http
[METHOD] /path/to/endpoint?param=value
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

```json
{
  "data": {
    "items": []
  }
}
```

### Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2024-01-15 | 1.0.0 | Initial release |
| 2024-02-01 | 1.1.0 | Added new field `field_name` |

---

## Quick Reference

**Endpoint:** `[METHOD] /path/to/endpoint`
**Auth:** [Required/Optional/Public]
**Rate Limit:** [X requests per minute]

**Quick Example:**

```bash
curl -X [METHOD] \
  'https://[project-id].supabase.co/functions/v1/path?param=value' \
  -H 'Authorization: Bearer TOKEN'
```

---

## Testing

### Test Cases

1. **Happy Path**
   - Description: [What should happen in the ideal case]
   - Expected: [Expected result]

2. **Error Cases**
   - Missing required field: [Expected error]
   - Invalid format: [Expected error]
   - Unauthorized access: [Expected error]

### Postman Collection

Import this endpoint into Postman:

```json
{
  "name": "[Endpoint Name]",
  "request": {
    "method": "[METHOD]",
    "header": [
      {
        "key": "Authorization",
        "value": "Bearer {{access_token}}"
      },
      {
        "key": "Content-Type",
        "value": "application/json"
      }
    ],
    "url": {
      "raw": "{{base_url}}/path/to/endpoint?param={{param_value}}",
      "host": ["{{base_url}}"],
      "path": ["path", "to", "endpoint"],
      "query": [
        {
          "key": "param",
          "value": "{{param_value}}"
        }
      ]
    },
    "body": {
      "mode": "raw",
      "raw": "{\n  \"field_name\": \"value\"\n}"
    }
  }
}
```

---

## Security Considerations

- [List any security considerations specific to this endpoint]
- [Authentication requirements]
- [Authorization checks]
- [Input validation]
- [Rate limiting]
- [Data privacy concerns]

---

## Performance

- **Average Response Time:** [X ms]
- **Rate Limit:** [X requests per minute]
- **Caching:** [Yes/No - describe caching strategy]
- **Pagination:** [If applicable, describe pagination]

---

## Migration Guide

If this endpoint replaces a deprecated endpoint:

### From v1 to v2

**Old Endpoint:** `[METHOD] /old/path`
**New Endpoint:** `[METHOD] /new/path`

**Changes:**
- [List of breaking changes]
- [How to migrate]
- [Timeline for deprecation]

**Example Migration:**

Before:
```javascript
// Old code
```

After:
```javascript
// New code
```
