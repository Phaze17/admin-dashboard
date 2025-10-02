# Error Handling Quick Reference

Quick reference for common error handling patterns.

## Table of Contents

- [Setup](#setup)
- [Basic Usage](#basic-usage)
- [Common Patterns](#common-patterns)
- [Hooks](#hooks)
- [Components](#components)
- [API Client](#api-client)
- [Error Codes](#error-codes)

---

## Setup

### 1. Configure Logger (main.tsx)

```typescript
import { configureErrorLogger } from '@/lib/errors';

configureErrorLogger({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enableConsoleLogging: import.meta.env.DEV,
  enableRemoteLogging: true,
});
```

### 2. Add Error Boundary (App.tsx)

```typescript
import { ErrorBoundary } from '@/components/errors';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 3. Add Offline Indicator (Layout.tsx)

```typescript
import { OfflineIndicator } from '@/lib/errors';

<OfflineIndicator />
```

---

## Basic Usage

### Simple Error Handling

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ErrorDisplay } from '@/components/errors';

const { error, handleError, clearError } = useErrorHandler();

try {
  await api.call();
} catch (err) {
  handleError(err);
}

<ErrorDisplay error={error} onDismiss={clearError} />
```

### Async Operations

```typescript
import { useAsyncError } from '@/hooks/useErrorHandler';

const { loading, error, execute } = useAsyncError();

const loadData = () => execute(() => api.fetchData());

<button onClick={loadData} disabled={loading}>Load</button>
```

---

## Common Patterns

### Network Request

```typescript
import { apiClient } from '@/lib/errors';

const data = await apiClient.get('/endpoint', {
  timeout: 10000,
  retry: { maxAttempts: 3, baseDelay: 1000 }
});
```

### Form Validation

```typescript
import { useFormValidation } from '@/hooks/useErrorHandler';

const { errors, validate } = useFormValidation();

const isValid = validate(formData, {
  email: (v) => !v ? 'Required' : undefined,
});
```

### Supabase Query

```typescript
import { ErrorParser } from '@/lib/errors';

const { data, error } = await supabase.from('table').select();
if (error) throw ErrorParser.fromSupabaseError(error);
```

### Offline Support

```typescript
import { offlineHandler } from '@/lib/errors';

await offlineHandler.executeWithOfflineSupport(
  () => api.save(data),
  { id: 'save-1', maxRetries: 3 }
);
```

---

## Hooks

### useErrorHandler()

```typescript
const {
  error,           // Current error
  handleError,     // Handle an error
  clearError,      // Clear error
  hasError,        // Boolean flag
} = useErrorHandler({ component: 'MyComponent' });
```

### useAsyncError()

```typescript
const {
  loading,         // Loading state
  error,           // Current error
  execute,         // Execute async function
  clearError,      // Clear error
  hasError,        // Boolean flag
} = useAsyncError();
```

### useErrorRecovery()

```typescript
const {
  loading,         // Loading state
  error,           // Current error
  execute,         // Execute function
  retry,           // Retry function
  retryCount,      // Current retry count
  canRetry,        // Can retry?
} = useErrorRecovery(() => api.fetch(), {
  maxRetries: 3,
  onRetry: (attempt) => console.log(attempt),
});
```

### useFormValidation()

```typescript
const {
  errors,          // Error map
  hasErrors,       // Boolean flag
  validate,        // Validate function
  setFieldError,   // Set error for field
  clearFieldError, // Clear field error
  clearAllErrors,  // Clear all errors
} = useFormValidation();
```

---

## Components

### ErrorBoundary

```typescript
<ErrorBoundary
  fallback={(error, reset) => <CustomFallback />}
  onError={(error) => console.log(error)}
  resetKeys={[location.pathname]}
>
  <App />
</ErrorBoundary>
```

### ErrorDisplay

```typescript
<ErrorDisplay
  error={error}
  onRetry={handleRetry}
  onDismiss={clearError}
  variant="inline" // "inline" | "toast" | "banner"
/>
```

### ErrorAlert

```typescript
<ErrorAlert
  error={error}
  title="Error"
  onClose={clearError}
/>
```

### Success/Warning/Info Alerts

```typescript
<SuccessAlert message="Success!" onClose={() => {}} />
<WarningAlert message="Warning!" onClose={() => {}} />
<InfoAlert message="Info!" onClose={() => {}} />
```

---

## API Client

### Basic Requests

```typescript
import { apiClient } from '@/lib/errors';

// GET
const data = await apiClient.get('/users');

// POST
const user = await apiClient.post('/users', { name: 'John' });

// PUT
const updated = await apiClient.put('/users/1', { name: 'Jane' });

// DELETE
await apiClient.delete('/users/1');
```

### With Options

```typescript
const data = await apiClient.get('/users', {
  timeout: 5000,
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    shouldRetry: (error, attempt) => error.retryable,
    onRetry: (error, attempt, delay) => console.log(attempt),
  },
});
```

### Custom Headers

```typescript
apiClient.setDefaultHeader('Authorization', `Bearer ${token}`);
apiClient.removeDefaultHeader('Authorization');
```

---

## Error Codes

| Code | Description | Retryable |
|------|-------------|-----------|
| `NETWORK_ERROR` | Network issues | ✅ |
| `API_ERROR` | API failures | ❌ |
| `VALIDATION_ERROR` | Validation failures | ❌ |
| `AUTH_ERROR` | Auth failures | ❌ |
| `NOT_FOUND` | Resource not found | ❌ |
| `FORBIDDEN` | Permission denied | ❌ |
| `RATE_LIMIT` | Rate limited | ✅ |
| `SERVER_ERROR` | Server errors | ✅ |
| `TIMEOUT_ERROR` | Timeout | ✅ |
| `OFFLINE_ERROR` | Offline | ✅ |
| `DATABASE_ERROR` | DB errors | ✅ |
| `PERMISSION_ERROR` | No permission | ❌ |

---

## Creating Custom Errors

```typescript
import { AppError, ErrorCode, ErrorSeverity } from '@/lib/errors';

throw new AppError(
  'Technical message for logs',
  ErrorCode.VALIDATION_ERROR,
  {
    userMessage: 'User-friendly message',
    severity: ErrorSeverity.MEDIUM,
    validationErrors: [
      { field: 'email', message: 'Invalid email' }
    ],
    metadata: { additionalInfo: 'value' },
    retryable: false,
  }
);
```

---

## Checking Error Types

```typescript
import { ErrorCode } from '@/lib/errors';

if (error.code === ErrorCode.NETWORK_ERROR) {
  // Handle network error
}

if (error.retryable) {
  // Retry logic
}

if (error.validationErrors) {
  // Display field errors
}
```

---

## Parsing Errors

```typescript
import { ErrorParser } from '@/lib/errors';

// HTTP Response
const error = ErrorParser.fromHttpResponse(response, body);

// Network Error
const error = ErrorParser.fromNetworkError(networkError);

// Supabase Error
const error = ErrorParser.fromSupabaseError(supabaseError);

// Unknown Error
const error = ErrorParser.fromUnknownError(unknownError);

// Validation Errors
const error = ErrorParser.fromValidationErrors([
  { field: 'email', message: 'Invalid' }
]);
```

---

## Logging Errors

```typescript
import { ErrorLogger } from '@/lib/errors';

// Async logging (batched)
ErrorLogger.log(error, {
  component: 'UserProfile',
  action: 'updateProfile',
  additionalData: { userId: '123' },
});

// Sync logging (immediate)
await ErrorLogger.logSync(error, context);

// Flush queue manually
await ErrorLogger.flush();
```

---

## Retry Logic

```typescript
import { RetryHandler } from '@/lib/errors';

const result = await RetryHandler.executeWithRetry(
  () => api.fetch(),
  {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    shouldRetry: (error, attempt) => error.retryable,
    onRetry: (error, attempt, delay) => {
      console.log(`Retry ${attempt} after ${delay}ms`);
    },
  }
);
```

---

## Testing

### Test Hook

```typescript
import { renderHook, act } from '@testing-library/react';

test('useErrorHandler', () => {
  const { result } = renderHook(() => useErrorHandler());

  act(() => {
    result.current.handleError(new Error('Test'));
  });

  expect(result.current.hasError).toBe(true);
});
```

### Test Error Boundary

```typescript
import { render, screen } from '@testing-library/react';

test('ErrorBoundary', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

---

## Full Example

```typescript
import { useErrorRecovery } from '@/hooks/useErrorHandler';
import { ErrorDisplay, OfflineIndicator } from '@/components/errors';
import { apiClient } from '@/lib/errors';

function UserProfile() {
  const {
    loading,
    error,
    execute,
    retry,
    canRetry,
  } = useErrorRecovery(
    () => apiClient.get('/user/profile'),
    {
      maxRetries: 3,
      component: 'UserProfile',
    }
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div>
        <ErrorDisplay error={error} />
        {canRetry && (
          <button onClick={retry}>Retry</button>
        )}
      </div>
    );
  }

  return (
    <>
      <OfflineIndicator />
      <div>Profile content</div>
    </>
  );
}
```

---

For complete documentation, see:
- **[ERROR_HANDLING_GUIDE.md](ERROR_HANDLING_GUIDE.md)** - Full guide
- **[ERROR_HANDLING_EXAMPLES.md](ERROR_HANDLING_EXAMPLES.md)** - Examples
