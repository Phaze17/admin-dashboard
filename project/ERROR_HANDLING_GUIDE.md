# Comprehensive Error Handling Guide

This guide provides a complete error handling strategy for your web application, including graceful degradation, user-friendly error messages, offline support, and error logging.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Usage Examples](#usage-examples)
5. [Error Types](#error-types)
6. [Best Practices](#best-practices)
7. [Testing](#testing)

---

## Overview

This error handling system provides:

- **Centralized Error Management**: Consistent error handling across the application
- **Type-Safe Errors**: Strongly typed error codes and messages
- **Graceful Degradation**: Automatic retry logic and fallback mechanisms
- **User-Friendly Messages**: Context-aware error messages for users
- **Offline Support**: Request queuing when offline
- **Error Logging**: Automatic logging to Supabase
- **React Integration**: Hooks and components for React applications

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Application Layer                   │
│  (Components, Hooks, User Interactions)             │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Error Handling Layer                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  ErrorBoundary  │  useErrorHandler  │ Hooks  │  │
│  └──────────────────────────────────────────────┘  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│               Core Error Services                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  ErrorParser  │  RetryHandler  │  ApiClient  │  │
│  └──────────────────────────────────────────────┘  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│            Logging & Monitoring                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  ErrorLogger  │  OfflineHandler  │  Supabase │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Error Types (`src/lib/errors/types.ts`)

Defines all error types, codes, and the base `AppError` class.

**Error Codes:**
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

**Error Severities:**
- `LOW` - Minor issues, non-critical
- `MEDIUM` - Moderate issues, may impact functionality
- `HIGH` - Serious issues, significant impact
- `CRITICAL` - Critical failures, requires immediate attention

### 2. Error Parser (`src/lib/errors/error-parser.ts`)

Converts various error types into standardized `AppError` instances.

**Methods:**
- `fromHttpResponse()` - Parse HTTP response errors
- `fromNetworkError()` - Parse network errors
- `fromSupabaseError()` - Parse Supabase errors
- `fromUnknownError()` - Parse unknown errors
- `fromValidationErrors()` - Parse validation errors

### 3. Error Boundary (`src/components/errors/ErrorBoundary.tsx`)

React Error Boundary component that catches errors in component trees.

**Features:**
- Automatic error catching
- Custom fallback UI
- Error logging
- Reset functionality
- Reset on prop changes

### 4. Error Display Components (`src/components/errors/`)

User-friendly error display components:

- `ErrorDisplay` - Flexible error display with variants (inline, toast, banner)
- `ErrorAlert` - Error alert with dismiss functionality
- `SuccessAlert`, `WarningAlert`, `InfoAlert` - Status alerts
- `ErrorToast` - Auto-dismissing toast notifications
- `ErrorBanner` - Sticky banner for persistent errors

### 5. API Client (`src/lib/errors/api-client.ts`)

HTTP client with built-in error handling and retry logic.

**Features:**
- Automatic error parsing
- Timeout support
- Retry logic
- Request/response interceptors
- TypeScript support

### 6. Retry Handler (`src/lib/errors/retry-handler.ts`)

Implements exponential backoff retry logic.

**Features:**
- Configurable max attempts
- Exponential backoff
- Custom retry conditions
- Jitter for distributed systems
- Abort support

### 7. Offline Handler (`src/lib/errors/offline-handler.ts`)

Manages offline scenarios and request queuing.

**Features:**
- Online/offline detection
- Request queuing
- Automatic retry when back online
- Queue persistence
- Status indicator component

### 8. Error Logger (`src/lib/errors/error-logger.ts`)

Logs errors to console and Supabase.

**Features:**
- Console logging with formatting
- Batch logging to Supabase
- Configurable sampling
- Context tracking
- Session management

### 9. React Hooks (`src/hooks/useErrorHandler.ts`)

React hooks for error handling:

- `useErrorHandler()` - Basic error handling
- `useAsyncError()` - Async operation error handling
- `useRetry()` - Retry logic
- `useErrorRecovery()` - Automatic error recovery
- `useFormValidation()` - Form validation

---

## Usage Examples

### Basic Error Handling with Hook

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { error, handleError, clearError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const data = await api.getData();
      return data;
    } catch (err) {
      handleError(err, { action: 'fetchData' });
    }
  };

  return (
    <div>
      {error && (
        <ErrorDisplay error={error} onDismiss={clearError} />
      )}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

### Async Operations with Loading States

```typescript
import { useAsyncError } from '@/hooks/useErrorHandler';

function DataFetcher() {
  const { loading, error, execute, clearError } = useAsyncError();

  const loadData = async () => {
    const data = await execute(
      () => api.getData(),
      { action: 'loadData' }
    );

    if (data) {
      console.log('Data loaded:', data);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <ErrorDisplay error={error} onDismiss={clearError} />}
      <button onClick={loadData} disabled={loading}>
        Load Data
      </button>
    </div>
  );
}
```

### Error Boundary Usage

```typescript
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary
      onError={(error) => console.log('Error caught:', error)}
      resetKeys={[location.pathname]}
    >
      <YourApp />
    </ErrorBoundary>
  );
}

// Or use HOC
const SafeComponent = withErrorBoundary(MyComponent, {
  onError: (error) => console.error(error),
});
```

### API Client with Retry

```typescript
import { apiClient } from '@/lib/errors/api-client';

// Simple request
const data = await apiClient.get('/users');

// With retry logic
const data = await apiClient.get('/users', {
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    shouldRetry: (error, attempt) => {
      return error.retryable && attempt < 3;
    },
    onRetry: (error, attempt, delay) => {
      console.log(`Retry attempt ${attempt} after ${delay}ms`);
    },
  },
});

// With timeout
const data = await apiClient.post('/users', userData, {
  timeout: 5000,
});
```

### Handling Network Errors

```typescript
import { apiClient } from '@/lib/errors/api-client';
import { ErrorParser } from '@/lib/errors/error-parser';

async function fetchUser(id: string) {
  try {
    const user = await apiClient.get(`/users/${id}`, {
      timeout: 10000,
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
      },
    });
    return user;
  } catch (error) {
    const appError = ErrorParser.fromUnknownError(error);

    if (appError.code === ErrorCode.NETWORK_ERROR) {
      console.log('Network error, showing offline message');
    } else if (appError.code === ErrorCode.NOT_FOUND) {
      console.log('User not found');
    }

    throw appError;
  }
}
```

### Offline Support

```typescript
import { offlineHandler } from '@/lib/errors/offline-handler';

// Execute with offline support
async function saveData(data: any) {
  try {
    await offlineHandler.executeWithOfflineSupport(
      () => api.save(data),
      {
        id: `save-${data.id}`,
        maxRetries: 3,
      }
    );
    console.log('Data saved successfully');
  } catch (error) {
    if (error.code === ErrorCode.OFFLINE_ERROR) {
      console.log('Data will be saved when back online');
    } else {
      console.error('Failed to save data:', error);
    }
  }
}

// Use offline indicator
import { OfflineIndicator } from '@/lib/errors/offline-handler';

function App() {
  return (
    <>
      <OfflineIndicator />
      <YourApp />
    </>
  );
}
```

### Form Validation

```typescript
import { useFormValidation } from '@/hooks/useErrorHandler';

interface FormData {
  email: string;
  password: string;
  name: string;
}

function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
  });

  const { errors, hasErrors, validate, clearFieldError } =
    useFormValidation<FormData>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(formData, {
      email: (value) => {
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return undefined;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return undefined;
      },
      name: (value) => {
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return undefined;
      },
    });

    if (!isValid) {
      return;
    }

    // Submit form
    try {
      await api.signup(formData);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            clearFieldError('email');
          }}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            clearFieldError('password');
          }}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            clearFieldError('name');
          }}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <button type="submit" disabled={hasErrors}>
        Sign Up
      </button>
    </form>
  );
}
```

### Error Recovery with Retry

```typescript
import { useErrorRecovery } from '@/hooks/useErrorHandler';

function DataLoader() {
  const {
    loading,
    error,
    execute,
    retry,
    retryCount,
    canRetry,
  } = useErrorRecovery(
    () => api.fetchData(),
    {
      maxRetries: 3,
      onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
      component: 'DataLoader',
    }
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <ErrorDisplay error={error} />
        {canRetry && (
          <button onClick={retry}>
            Retry ({retryCount}/{3})
          </button>
        )}
      </div>
    );
  }

  return <div>Data loaded successfully</div>;
}
```

### Supabase Error Handling

```typescript
import { createClient } from '@supabase/supabase-js';
import { ErrorParser } from '@/lib/errors/error-parser';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    throw ErrorParser.fromSupabaseError(error);
  }

  return data;
}

// Usage
try {
  const users = await fetchUsers();
  console.log('Users:', users);
} catch (error) {
  const appError = error as AppError;

  if (appError.code === ErrorCode.AUTH_ERROR) {
    console.log('Please sign in to view users');
  } else if (appError.code === ErrorCode.PERMISSION_ERROR) {
    console.log('You do not have permission to view users');
  } else {
    console.error('Failed to fetch users:', appError.userMessage);
  }
}
```

### Configuring Error Logger

```typescript
import { configureErrorLogger } from '@/lib/errors/error-logger';

// Initialize at app startup
configureErrorLogger({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY,
  enableConsoleLogging: process.env.NODE_ENV !== 'production',
  enableRemoteLogging: true,
  batchSize: 10,
  batchInterval: 5000,
  sampleRate: 0.5, // Log 50% of low severity errors
});
```

---

## Error Types

### Network Errors

**Causes:**
- No internet connection
- DNS resolution failure
- Server unreachable
- Request timeout

**Handling:**
```typescript
if (error.code === ErrorCode.NETWORK_ERROR) {
  // Show offline indicator
  // Queue request for retry
  // Suggest checking connection
}
```

### API Errors

**Causes:**
- 4xx HTTP status codes
- 5xx HTTP status codes
- Invalid response format

**Handling:**
```typescript
if (error.code === ErrorCode.API_ERROR) {
  // Show user-friendly message
  // Log for debugging
  // Provide retry option if retryable
}
```

### Validation Errors

**Causes:**
- Invalid input format
- Missing required fields
- Business rule violations

**Handling:**
```typescript
if (error.code === ErrorCode.VALIDATION_ERROR) {
  // Display field-specific errors
  // Highlight invalid fields
  // Provide correction suggestions
}
```

### Authentication Errors

**Causes:**
- Invalid credentials
- Expired session
- Missing authentication token

**Handling:**
```typescript
if (error.code === ErrorCode.AUTH_ERROR) {
  // Redirect to login
  // Clear stored credentials
  // Prompt for re-authentication
}
```

---

## Best Practices

### 1. Always Use AppError

```typescript
// ✅ Good
throw new AppError(
  'Failed to fetch user',
  ErrorCode.API_ERROR,
  { userMessage: 'Unable to load user data. Please try again.' }
);

// ❌ Bad
throw new Error('Failed to fetch user');
```

### 2. Provide User-Friendly Messages

```typescript
// ✅ Good
const error = new AppError(
  'Network timeout after 30s',
  ErrorCode.TIMEOUT_ERROR,
  {
    userMessage: 'The request took too long. Please check your connection and try again.',
  }
);

// ❌ Bad
const error = new AppError(
  'ETIMEDOUT',
  ErrorCode.TIMEOUT_ERROR
);
```

### 3. Use Error Boundaries

```typescript
// ✅ Good - Wrap sections that might error
<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>

// ❌ Bad - No error boundary
<ComplexComponent />
```

### 4. Log Errors with Context

```typescript
// ✅ Good
ErrorLogger.log(error, {
  component: 'UserProfile',
  action: 'updateProfile',
  additionalData: { userId: user.id },
});

// ❌ Bad
ErrorLogger.log(error);
```

### 5. Handle Retryable Errors

```typescript
// ✅ Good
if (error.retryable) {
  await RetryHandler.executeWithRetry(fetchData, {
    maxAttempts: 3,
    baseDelay: 1000,
  });
}

// ❌ Bad - Ignore retryable flag
throw error;
```

### 6. Parse All External Errors

```typescript
// ✅ Good
try {
  const { data, error } = await supabase.from('users').select();
  if (error) throw ErrorParser.fromSupabaseError(error);
} catch (error) {
  const appError = ErrorParser.fromUnknownError(error);
  handleError(appError);
}

// ❌ Bad - Use raw errors
try {
  const { data, error } = await supabase.from('users').select();
  if (error) throw error;
} catch (error) {
  console.error(error);
}
```

### 7. Clear Errors Appropriately

```typescript
// ✅ Good - Clear on user action
const handleDismiss = () => {
  clearError();
  onClose();
};

// ✅ Good - Clear on navigation
useEffect(() => {
  clearError();
}, [location.pathname]);

// ❌ Bad - Never clear
// Error persists indefinitely
```

### 8. Use Appropriate Severity Levels

```typescript
// ✅ Good
new AppError('Validation failed', ErrorCode.VALIDATION_ERROR, {
  severity: ErrorSeverity.LOW,
});

new AppError('Database connection lost', ErrorCode.DATABASE_ERROR, {
  severity: ErrorSeverity.CRITICAL,
});

// ❌ Bad - Everything is critical
new AppError('Validation failed', ErrorCode.VALIDATION_ERROR, {
  severity: ErrorSeverity.CRITICAL,
});
```

---

## Testing

### Testing Error Handlers

```typescript
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

describe('useErrorHandler', () => {
  it('handles errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error('Test error'));
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.hasError).toBe(true);
  });

  it('clears errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error('Test error'));
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });
});
```

### Testing Error Boundaries

```typescript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

function ThrowError() {
  throw new Error('Test error');
}

describe('ErrorBoundary', () => {
  it('catches errors and displays fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('calls onError callback', () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });
});
```

### Testing API Client

```typescript
import { apiClient } from '@/lib/errors/api-client';

describe('ApiClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('handles successful requests', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    const result = await apiClient.get('/test');
    expect(result).toEqual({ data: 'test' });
  });

  it('handles error responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: { message: 'Not found' } }),
      headers: new Headers({ 'content-type': 'application/json' }),
    });

    await expect(apiClient.get('/test')).rejects.toThrow(AppError);
  });
});
```

---

## Configuration

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Error Logging
VITE_ENABLE_ERROR_LOGGING=true
VITE_ERROR_SAMPLE_RATE=0.5
```

### Initialize at App Startup

```typescript
// main.tsx or App.tsx
import { configureErrorLogger } from '@/lib/errors/error-logger';

configureErrorLogger({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enableConsoleLogging: import.meta.env.DEV,
  enableRemoteLogging: true,
});
```

---

## Troubleshooting

### Errors Not Being Logged

**Check:**
1. Supabase credentials are correct
2. Error logger is configured
3. RLS policies allow insertion
4. Network connection is available

### Error Boundary Not Catching Errors

**Check:**
1. Error Boundary wraps the component
2. Error is thrown during render
3. Error is not caught elsewhere
4. Component is inside Error Boundary tree

### Retry Logic Not Working

**Check:**
1. Error is marked as retryable
2. Max attempts not exceeded
3. Retry conditions are met
4. No abort signal active

---

## Additional Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Supabase Error Handling](https://supabase.com/docs/guides/api#error-handling)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

This error handling system provides a robust foundation for managing errors in your application. Customize and extend as needed for your specific requirements.
