# Error Handling System

A comprehensive, production-ready error handling system for React web applications with TypeScript, featuring graceful degradation, user-friendly messages, offline support, and error logging.

## Features

- ✅ **Type-Safe Error Handling** - Strongly typed error codes and messages
- ✅ **Automatic Retry Logic** - Exponential backoff with configurable options
- ✅ **Offline Support** - Request queuing and automatic retry when back online
- ✅ **Error Logging** - Automatic logging to Supabase with batching
- ✅ **React Integration** - Hooks, Error Boundaries, and UI components
- ✅ **User-Friendly Messages** - Context-aware error messages for users
- ✅ **Graceful Degradation** - Fallback mechanisms for failed operations
- ✅ **Network Error Handling** - Timeout, retry, and connection management
- ✅ **Validation Support** - Field-level and form validation
- ✅ **Supabase Integration** - Built-in Supabase error parsing

## Quick Start

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js react react-dom
npm install -D typescript @types/react @types/react-dom
```

### 2. Initialize Error Logger

```typescript
// main.tsx
import { configureErrorLogger } from '@/lib/errors';

configureErrorLogger({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enableConsoleLogging: import.meta.env.DEV,
  enableRemoteLogging: true,
});
```

### 3. Wrap Your App with Error Boundary

```typescript
import { ErrorBoundary } from '@/components/errors';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### 4. Use Error Handling Hooks

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { error, handleError, clearError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const data = await api.getData();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div>
      {error && <ErrorDisplay error={error} onDismiss={clearError} />}
    </div>
  );
}
```

## Project Structure

```
src/
├── lib/
│   └── errors/
│       ├── types.ts              # Error types and AppError class
│       ├── error-parser.ts       # Parse various error types
│       ├── retry-handler.ts      # Retry logic with exponential backoff
│       ├── api-client.ts         # HTTP client with error handling
│       ├── offline-handler.ts    # Offline support and queuing
│       ├── error-logger.ts       # Error logging to Supabase
│       └── index.ts              # Exports
├── components/
│   └── errors/
│       ├── ErrorBoundary.tsx     # React Error Boundary
│       ├── ErrorDisplay.tsx      # Error display components
│       ├── ErrorAlert.tsx        # Alert components
│       └── index.ts              # Exports
└── hooks/
    └── useErrorHandler.ts        # React hooks for error handling

supabase/
└── migrations/
    └── 20240101000000_create_error_logs.sql  # Database schema

docs/
├── ERROR_HANDLING_GUIDE.md      # Complete guide
└── ERROR_HANDLING_EXAMPLES.md   # Practical examples
```

## Documentation

- **[Error Handling Guide](ERROR_HANDLING_GUIDE.md)** - Complete documentation
- **[Examples](ERROR_HANDLING_EXAMPLES.md)** - Practical examples for common scenarios
- **[API Documentation](API_DOCUMENTATION.md)** - API endpoint documentation
- **[Component Template](COMPONENT_DOCUMENTATION_TEMPLATE.md)** - Component documentation

## Core Concepts

### Error Types

All errors extend the `AppError` class with the following properties:

```typescript
class AppError {
  code: ErrorCode;           // NETWORK_ERROR, API_ERROR, etc.
  message: string;           // Technical message
  userMessage: string;       // User-friendly message
  severity: ErrorSeverity;   // LOW, MEDIUM, HIGH, CRITICAL
  retryable: boolean;        // Can this error be retried?
  validationErrors?: Array;  // Field validation errors
  metadata?: object;         // Additional context
}
```

### Error Codes

- `NETWORK_ERROR` - Network connectivity issues
- `API_ERROR` - API request failures
- `VALIDATION_ERROR` - Input validation failures
- `AUTH_ERROR` - Authentication failures
- `NOT_FOUND` - Resource not found
- `FORBIDDEN` - Permission denied
- `RATE_LIMIT` - Rate limit exceeded
- `SERVER_ERROR` - Server-side errors
- `TIMEOUT_ERROR` - Request timeout
- `OFFLINE_ERROR` - Offline/no connection
- `DATABASE_ERROR` - Database operation failures
- `PERMISSION_ERROR` - Insufficient permissions

## Usage Examples

### Basic Error Handling

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ErrorDisplay } from '@/components/errors';

function Component() {
  const { error, handleError, clearError } = useErrorHandler();

  const doSomething = async () => {
    try {
      await api.doSomething();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      {error && <ErrorDisplay error={error} onDismiss={clearError} />}
      <button onClick={doSomething}>Do Something</button>
    </>
  );
}
```

### API Calls with Retry

```typescript
import { apiClient } from '@/lib/errors';

const data = await apiClient.get('/users', {
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
  },
  timeout: 10000,
});
```

### Form Validation

```typescript
import { useFormValidation } from '@/hooks/useErrorHandler';

const { errors, validate, clearFieldError } = useFormValidation();

const isValid = validate(formData, {
  email: (value) => !value ? 'Email required' : undefined,
  password: (value) => value.length < 8 ? 'Too short' : undefined,
});
```

### Offline Support

```typescript
import { offlineHandler, OfflineIndicator } from '@/lib/errors';

// Add offline indicator
<OfflineIndicator />

// Execute with offline support
await offlineHandler.executeWithOfflineSupport(
  () => api.save(data),
  { id: 'save-operation', maxRetries: 3 }
);
```

### Error Recovery

```typescript
import { useErrorRecovery } from '@/hooks/useErrorHandler';

const { loading, error, execute, retry, canRetry } = useErrorRecovery(
  () => api.fetchData(),
  { maxRetries: 3 }
);

useEffect(() => {
  execute();
}, []);
```

## Database Setup

Run the migration to create the error logs table:

```sql
-- See supabase/migrations/20240101000000_create_error_logs.sql
```

The table supports:
- Error tracking and monitoring
- User-specific error logs
- Admin dashboard access
- RLS policies for security

## Environment Variables

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Best Practices

1. **Always use AppError** for consistent error handling
2. **Provide user-friendly messages** separate from technical details
3. **Use Error Boundaries** to catch unexpected errors
4. **Log errors with context** for debugging
5. **Handle retryable errors** with automatic retry logic
6. **Parse all external errors** (HTTP, Supabase, etc.)
7. **Clear errors appropriately** on user actions or navigation
8. **Use appropriate severity levels** for proper prioritization

## Testing

```typescript
// Test error handlers
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

test('handles errors', () => {
  const { result } = renderHook(() => useErrorHandler());

  act(() => {
    result.current.handleError(new Error('Test'));
  });

  expect(result.current.hasError).toBe(true);
});
```

## Contributing

When adding new error types or handlers:

1. Update `ErrorCode` enum in `types.ts`
2. Add default messages in `AppError` class
3. Update parsers if needed
4. Add examples to documentation
5. Write tests for new functionality

## License

[Your License Here]

## Support

- Documentation: See ERROR_HANDLING_GUIDE.md
- Examples: See ERROR_HANDLING_EXAMPLES.md
- Issues: [Your issue tracker]
