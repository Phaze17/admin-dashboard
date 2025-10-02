# API Documentation Tools & Recommendations

This guide provides recommendations for automatic API documentation generation tools that integrate well with Supabase Edge Functions.

---

## Recommended Tools

### 1. OpenAPI/Swagger (Recommended)

**Best for:** Standard REST APIs with comprehensive tooling support

**Setup with Supabase Edge Functions:**

Install dependencies:
```bash
npm install openapi3-ts
```

Create an OpenAPI specification file:

```typescript
// openapi-spec.ts
import { OpenAPIObject } from 'openapi3-ts';

export const openApiSpec: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'Your API',
    version: '1.0.0',
    description: 'API documentation',
    contact: {
      email: 'support@example.com'
    }
  },
  servers: [
    {
      url: 'https://your-project.supabase.co/functions/v1',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid'
          },
          email: {
            type: 'string',
            format: 'email'
          },
          name: {
            type: 'string'
          },
          created_at: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'object' }
            }
          }
        }
      }
    }
  },
  paths: {
    '/users': {
      get: {
        summary: 'Get all users',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20, maximum: 100 }
          }
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total_items: { type: 'integer' },
                        total_pages: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a user',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'name', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  name: { type: 'string', minLength: 2, maxLength: 100 },
                  password: { type: 'string', minLength: 8 },
                  bio: { type: 'string', maxLength: 500 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    }
  }
};
```

**Serve the OpenAPI spec via Edge Function:**

```typescript
// supabase/functions/api-docs/index.ts
import { openApiSpec } from './openapi-spec.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  return new Response(JSON.stringify(openApiSpec), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
});
```

**Tools to visualize OpenAPI specs:**
- **Swagger UI:** Interactive API documentation
- **Redoc:** Clean, responsive documentation
- **Stoplight Elements:** Modern API documentation
- **Postman:** Import OpenAPI spec for testing

---

### 2. TypeDoc (For TypeScript Projects)

**Best for:** TypeScript codebases with detailed type information

**Installation:**
```bash
npm install --save-dev typedoc
```

**Configuration (typedoc.json):**
```json
{
  "entryPoints": ["./supabase/functions"],
  "out": "docs",
  "excludePrivate": true,
  "excludeProtected": true,
  "plugin": ["typedoc-plugin-markdown"],
  "readme": "API_DOCUMENTATION.md"
}
```

**Generate docs:**
```bash
npx typedoc
```

---

### 3. JSDoc (For JavaScript Projects)

**Best for:** JavaScript projects with inline documentation

**Installation:**
```bash
npm install --save-dev jsdoc
```

**Example usage:**
```javascript
/**
 * Get all users with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @returns {Promise<{data: User[], pagination: Object}>} Users list with pagination
 * @throws {Error} When authentication fails
 */
async function getUsers({ page = 1, limit = 20 } = {}) {
  // Implementation
}
```

**Generate docs:**
```bash
npx jsdoc -r ./supabase/functions -d ./docs
```

---

### 4. Postman Collections

**Best for:** Interactive API testing and documentation

**Export format:**
```json
{
  "info": {
    "name": "Your API",
    "description": "API Documentation",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{access_token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/users?page=1&limit=20",
              "host": ["{{base_url}}"],
              "path": ["users"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "20" }
              ]
            }
          },
          "response": []
        }
      ]
    }
  ]
}
```

**Benefits:**
- Import into Postman for testing
- Generate code snippets in multiple languages
- Share with team members
- Auto-generate documentation

---

### 5. API Blueprint

**Best for:** Markdown-based API documentation

**Example:**
```markdown
# Your API

## Users Collection [/users]

### List All Users [GET]

+ Parameters
    + page: 1 (number, optional) - Page number
    + limit: 20 (number, optional) - Items per page

+ Request (application/json)
    + Headers
            Authorization: Bearer YOUR_TOKEN

+ Response 200 (application/json)
    + Body
            {
                "data": [
                    {
                        "id": "uuid",
                        "email": "user@example.com",
                        "name": "John Doe"
                    }
                ]
            }
```

**Tools:**
- **Apiary:** Online API documentation platform
- **Aglio:** Generate static HTML documentation

---

### 6. AsyncAPI (For Webhooks & Events)

**Best for:** Documenting asynchronous APIs and webhooks

**Example:**
```yaml
asyncapi: 2.6.0
info:
  title: Your API Events
  version: 1.0.0
channels:
  user/created:
    subscribe:
      message:
        payload:
          type: object
          properties:
            event:
              type: string
              const: user.created
            timestamp:
              type: string
              format: date-time
            data:
              type: object
```

---

### 7. Docusaurus (For Full Documentation Sites)

**Best for:** Complete documentation websites with versioning

**Installation:**
```bash
npx create-docusaurus@latest docs classic
```

**Features:**
- Markdown-based documentation
- Versioning support
- Search functionality
- React components
- Dark mode
- Mobile responsive

---

## Automated Documentation Workflow

### Option 1: Generate from Code Comments

```typescript
// supabase/functions/users/index.ts

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
Deno.serve(async (req: Request) => {
  // Implementation
});
```

Use tools like:
- `swagger-jsdoc` to extract OpenAPI from comments
- `typedoc` for TypeScript documentation

---

### Option 2: Schema-First Approach

1. Define OpenAPI schema first
2. Generate types from schema
3. Validate requests against schema
4. Auto-generate documentation

**Tools:**
- `openapi-typescript` - Generate TypeScript types
- `express-openapi-validator` - Validate requests
- `swagger-ui-express` - Serve documentation

---

### Option 3: CI/CD Integration

```yaml
# .github/workflows/docs.yml
name: Generate API Documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm install

      - name: Generate OpenAPI spec
        run: npm run generate-openapi

      - name: Generate HTML docs
        run: npx redoc-cli bundle openapi.json -o docs/index.html

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

---

## Best Practices

1. **Keep documentation in sync with code**
   - Use code comments or schema-first approach
   - Automate documentation generation
   - Include in CI/CD pipeline

2. **Provide examples for every endpoint**
   - Request examples
   - Response examples
   - Error examples
   - Code snippets in multiple languages

3. **Version your API documentation**
   - Document breaking changes
   - Maintain docs for previous versions
   - Clear migration guides

4. **Make it interactive**
   - Use Swagger UI or similar tools
   - Allow users to test endpoints
   - Provide sandbox environment

5. **Include authentication guide**
   - How to obtain tokens
   - How to use tokens
   - Token refresh process
   - Security best practices

6. **Document rate limits and quotas**
   - Request limits
   - Response headers
   - How to handle rate limiting

7. **Provide SDKs and code examples**
   - Official SDKs for popular languages
   - Code examples for common use cases
   - Sample applications

---

## Recommended Setup for Supabase Projects

For a Supabase-based API, I recommend:

1. **OpenAPI 3.0 specification** (openapi-spec.ts)
   - Standard format
   - Wide tool support
   - Easy to maintain

2. **Swagger UI** for interactive documentation
   - Deploy as static site
   - Or serve via edge function

3. **Redoc** for clean, printable docs
   - Better for public-facing documentation
   - Professional appearance

4. **TypeDoc** if using TypeScript
   - Leverage existing type information
   - Generate docs from code comments

5. **Postman Collection** for team collaboration
   - Easy sharing and testing
   - Generate client code

---

## Example Project Structure

```
project/
├── API_DOCUMENTATION.md          # Main documentation
├── API_DOCUMENTATION_TOOLS.md    # This file
├── openapi-spec.ts               # OpenAPI specification
├── supabase/
│   └── functions/
│       ├── api-docs/             # Serve OpenAPI spec
│       │   └── index.ts
│       └── users/                # Example endpoint
│           └── index.ts
├── docs/                         # Generated documentation
│   ├── index.html                # Swagger UI or Redoc
│   └── assets/
└── package.json
```

---

## Next Steps

1. Choose a documentation tool based on your needs
2. Set up automated documentation generation
3. Integrate documentation into your CI/CD pipeline
4. Host documentation on GitHub Pages, Vercel, or similar
5. Keep documentation updated with each API change

For questions or support, refer to the official documentation of each tool.
