# Error Handling Examples

Practical examples for common error scenarios in web applications.

## Table of Contents

1. [Network Failures](#network-failures)
2. [API Errors](#api-errors)
3. [Validation Failures](#validation-failures)
4. [Authentication Errors](#authentication-errors)
5. [Offline Scenarios](#offline-scenarios)
6. [Database Errors](#database-errors)
7. [Form Validation](#form-validation)
8. [File Upload Errors](#file-upload-errors)
9. [Real-Time Errors](#real-time-errors)
10. [Payment Processing Errors](#payment-processing-errors)

---

## Network Failures

### Example 1: Handling Connection Timeout

```typescript
import { apiClient } from '@/lib/errors/api-client';
import { ErrorCode } from '@/lib/errors/types';

async function fetchUserData(userId: string) {
  try {
    const user = await apiClient.get(`/users/${userId}`, {
      timeout: 10000, // 10 second timeout
      retry: {
        maxAttempts: 3,
        baseDelay: 2000,
        onRetry: (error, attempt, delay) => {
          console.log(`Retrying after ${delay}ms (attempt ${attempt})`);
        },
      },
    });

    return user;
  } catch (error) {
    if (error.code === ErrorCode.TIMEOUT_ERROR) {
      // Show user-friendly timeout message
      return {
        success: false,
        message: 'The request took too long. Please check your connection.',
      };
    }

    if (error.code === ErrorCode.NETWORK_ERROR) {
      // Show offline message
      return {
        success: false,
        message: 'Unable to connect. Please check your internet connection.',
      };
    }

    throw error;
  }
}
```

### Example 2: Graceful Degradation for Images

```typescript
import React, { useState } from 'react';

function UserAvatar({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Retry loading image
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false);
      }, 1000 * (retryCount + 1));
    } else {
      // Show fallback
      setImageError(true);
    }
  };

  if (imageError && retryCount >= maxRetries) {
    // Fallback avatar
    return (
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
        <span className="text-gray-600 font-semibold">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={`${src}?retry=${retryCount}`}
      alt={alt}
      className="w-12 h-12 rounded-full object-cover"
      onError={handleError}
    />
  );
}
```

---

## API Errors

### Example 1: Handling 404 Not Found

```typescript
import { apiClient } from '@/lib/errors/api-client';
import { ErrorCode } from '@/lib/errors/types';

async function getPost(postId: string) {
  try {
    const post = await apiClient.get(`/posts/${postId}`);
    return { success: true, data: post };
  } catch (error) {
    if (error.code === ErrorCode.NOT_FOUND) {
      return {
        success: false,
        message: 'This post no longer exists or has been removed.',
        redirect: '/posts',
      };
    }

    return {
      success: false,
      message: error.userMessage,
    };
  }
}

// Usage in component
function PostPage({ postId }: { postId: string }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPost(postId).then(result => {
      if (result.success) {
        setPost(result.data);
      } else {
        setError(result.message);
        if (result.redirect) {
          setTimeout(() => navigate(result.redirect), 3000);
        }
      }
    });
  }, [postId]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <p className="text-gray-500 mt-2">Redirecting...</p>
      </div>
    );
  }

  return <div>{/* Render post */}</div>;
}
```

### Example 2: Handling Rate Limiting

```typescript
import { apiClient } from '@/lib/errors/api-client';
import { ErrorCode } from '@/lib/errors/types';

async function searchUsers(query: string) {
  try {
    const results = await apiClient.get('/search/users', {
      params: { q: query },
    });
    return results;
  } catch (error) {
    if (error.code === ErrorCode.RATE_LIMIT) {
      const retryAfter = error.retryAfter || 60;

      return {
        error: true,
        message: `Too many searches. Please wait ${retryAfter} seconds.`,
        retryAfter,
      };
    }

    throw error;
  }
}

// Usage with countdown
function SearchComponent() {
  const [rateLimited, setRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSearch = async (query: string) => {
    const result = await searchUsers(query);

    if (result.error && result.retryAfter) {
      setRateLimited(true);
      setCountdown(result.retryAfter);

      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div>
      {rateLimited && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <p>Too many searches. Please wait {countdown} seconds.</p>
        </div>
      )}
      {/* Search UI */}
    </div>
  );
}
```

---

## Validation Failures

### Example 1: Field-Level Validation

```typescript
import { useFormValidation } from '@/hooks/useErrorHandler';

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

function SignupForm() {
  const [formData, setFormData] = useState<SignupForm>({
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const { errors, validate, clearFieldError } = useFormValidation<SignupForm>();

  const validationRules = {
    email: (value: string) => {
      if (!value) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      return undefined;
    },
    password: (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 8) {
        return 'Password must be at least 8 characters';
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Password must contain uppercase, lowercase, and number';
      }
      return undefined;
    },
    confirmPassword: (value: string) => {
      if (!value) return 'Please confirm your password';
      if (value !== formData.password) {
        return 'Passwords do not match';
      }
      return undefined;
    },
    terms: (value: boolean) => {
      if (!value) return 'You must accept the terms and conditions';
      return undefined;
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validate(formData, validationRules);
    if (!isValid) return;

    // Submit form
    try {
      await apiClient.post('/auth/signup', formData);
      // Success
    } catch (error) {
      // Handle API errors
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            clearFieldError('email');
          }}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            clearFieldError('password');
          }}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData({ ...formData, confirmPassword: e.target.value });
            clearFieldError('confirmPassword');
          }}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          checked={formData.terms}
          onChange={(e) => {
            setFormData({ ...formData, terms: e.target.checked });
            clearFieldError('terms');
          }}
          className={errors.terms ? 'border-red-500' : ''}
        />
        <label htmlFor="terms" className="ml-2 text-sm">
          I accept the terms and conditions
        </label>
      </div>
      {errors.terms && (
        <p className="text-sm text-red-600">{errors.terms}</p>
      )}

      <button type="submit" className="w-full btn-primary">
        Sign Up
      </button>
    </form>
  );
}
```

### Example 2: Server-Side Validation Errors

```typescript
import { ErrorParser } from '@/lib/errors/error-parser';
import { ErrorCode } from '@/lib/errors/types';

async function updateProfile(data: ProfileData) {
  try {
    const result = await apiClient.put('/profile', data);
    return { success: true, data: result };
  } catch (error) {
    if (error.code === ErrorCode.VALIDATION_ERROR) {
      // Display validation errors from server
      return {
        success: false,
        validationErrors: error.validationErrors,
      };
    }

    return {
      success: false,
      message: error.userMessage,
    };
  }
}

// Usage in component
function ProfileForm() {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: ProfileData) => {
    const result = await updateProfile(data);

    if (!result.success) {
      if (result.validationErrors) {
        const errorMap: Record<string, string> = {};
        result.validationErrors.forEach(err => {
          errorMap[err.field] = err.message;
        });
        setServerErrors(errorMap);
      }
    }
  };

  return (
    <form>
      {/* Form fields */}
      {Object.entries(serverErrors).map(([field, message]) => (
        <div key={field} className="text-red-600 text-sm">
          {field}: {message}
        </div>
      ))}
    </form>
  );
}
```

---

## Authentication Errors

### Example: Session Expiration

```typescript
import { apiClient } from '@/lib/errors/api-client';
import { ErrorCode } from '@/lib/errors/types';
import { useNavigate } from 'react-router-dom';

function useAuthenticatedRequest() {
  const navigate = useNavigate();

  const makeRequest = async <T,>(
    requestFn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      return await requestFn();
    } catch (error) {
      if (error.code === ErrorCode.AUTH_ERROR) {
        // Clear local auth state
        localStorage.removeItem('auth_token');

        // Show session expired message
        alert('Your session has expired. Please sign in again.');

        // Redirect to login
        navigate('/login', {
          state: { returnUrl: window.location.pathname },
        });

        return null;
      }

      throw error;
    }
  };

  return { makeRequest };
}

// Usage
function UserDashboard() {
  const { makeRequest } = useAuthenticatedRequest();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    makeRequest(() => apiClient.get('/user/dashboard')).then(data => {
      if (data) setUserData(data);
    });
  }, []);

  return <div>{/* Dashboard content */}</div>;
}
```

---

## Offline Scenarios

### Example 1: Offline Queue with Status

```typescript
import { offlineHandler } from '@/lib/errors/offline-handler';
import { ErrorCode } from '@/lib/errors/types';

function TaskManager() {
  const [pendingTasks, setPendingTasks] = useState<string[]>([]);

  const addTask = async (task: Task) => {
    try {
      await offlineHandler.executeWithOfflineSupport(
        () => apiClient.post('/tasks', task),
        {
          id: `task-${task.id}`,
          maxRetries: 3,
        }
      );

      // Task saved successfully
      console.log('Task saved');
    } catch (error) {
      if (error.code === ErrorCode.OFFLINE_ERROR) {
        // Add to pending list
        setPendingTasks(prev => [...prev, task.title]);

        // Show success message (will be synced later)
        alert('Task saved offline. Will sync when connection is restored.');
      } else {
        // Show error
        alert(error.userMessage);
      }
    }
  };

  return (
    <div>
      {pendingTasks.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <p className="font-medium">Pending sync:</p>
          <ul className="list-disc list-inside">
            {pendingTasks.map((task, i) => (
              <li key={i}>{task}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Task form */}
    </div>
  );
}
```

### Example 2: Optimistic Updates

```typescript
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  const toggleTodo = async (id: string) => {
    // Optimistic update
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    setSyncStatus('syncing');

    try {
      await offlineHandler.executeWithOfflineSupport(
        () => apiClient.patch(`/todos/${id}/toggle`),
        { id: `toggle-${id}` }
      );

      setSyncStatus('synced');
    } catch (error) {
      if (error.code === ErrorCode.OFFLINE_ERROR) {
        setSyncStatus('syncing'); // Will sync later
      } else {
        // Rollback optimistic update
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
        setSyncStatus('error');
        alert('Failed to update todo');
      }
    }
  };

  return (
    <div>
      {syncStatus === 'syncing' && (
        <div className="text-yellow-600 text-sm">Syncing...</div>
      )}
      {syncStatus === 'error' && (
        <div className="text-red-600 text-sm">Sync failed</div>
      )}
      {/* Todo list */}
    </div>
  );
}
```

---

## Database Errors

### Example: Supabase RLS Violation

```typescript
import { createClient } from '@supabase/supabase-js';
import { ErrorParser } from '@/lib/errors/error-parser';
import { ErrorCode } from '@/lib/errors/types';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function deletePost(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    const appError = ErrorParser.fromSupabaseError(error);

    if (appError.code === ErrorCode.PERMISSION_ERROR) {
      return {
        success: false,
        message: 'You can only delete your own posts.',
      };
    }

    if (appError.code === ErrorCode.DATABASE_ERROR) {
      return {
        success: false,
        message: 'Failed to delete post. Please try again.',
      };
    }

    throw appError;
  }

  return { success: true };
}
```

---

## Form Validation

See [Validation Failures](#validation-failures) section above.

---

## File Upload Errors

### Example: File Upload with Progress and Error Handling

```typescript
function FileUploader() {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<AppError | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      setError(
        new AppError(
          'File too large',
          ErrorCode.VALIDATION_ERROR,
          {
            userMessage: 'File size must be less than 10MB',
          }
        )
      );
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(
        new AppError(
          'Invalid file type',
          ErrorCode.VALIDATION_ERROR,
          {
            userMessage: 'Only JPEG, PNG, and WebP images are allowed',
          }
        )
      );
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress((e.loaded / e.total) * 100);
        }
      });

      await new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(
              ErrorParser.fromHttpResponse(
                new Response(xhr.responseText, { status: xhr.status })
              )
            );
          }
        });

        xhr.addEventListener('error', () => {
          reject(ErrorParser.fromNetworkError(new Error('Upload failed')));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      setProgress(100);
      setUploading(false);
    } catch (err) {
      const appError = ErrorParser.fromUnknownError(err);
      setError(appError);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
        disabled={uploading}
      />

      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}

      {error && (
        <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      )}
    </div>
  );
}
```

---

## Real-Time Errors

### Example: WebSocket Error Handling

```typescript
import { createClient } from '@supabase/supabase-js';
import { ErrorParser } from '@/lib/errors/error-parser';

function useRealtimeSubscription(table: string, callback: (payload: any) => void) {
  const [error, setError] = useState<AppError | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          setConnected(true);
          setError(null);
        } else if (status === 'CLOSED') {
          setConnected(false);
          setError(
            new AppError(
              'Realtime connection closed',
              ErrorCode.NETWORK_ERROR,
              {
                userMessage: 'Live updates disconnected. Reconnecting...',
              }
            )
          );
        } else if (status === 'CHANNEL_ERROR') {
          setConnected(false);
          setError(
            ErrorParser.fromSupabaseError(err || new Error('Channel error'))
          );
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback]);

  return { connected, error };
}

// Usage
function LiveFeed() {
  const handleUpdate = (payload: any) => {
    console.log('Update received:', payload);
  };

  const { connected, error } = useRealtimeSubscription('posts', handleUpdate);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full ${
            connected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm">
          {connected ? 'Live' : 'Disconnected'}
        </span>
      </div>

      {error && <ErrorDisplay error={error} variant="banner" />}

      {/* Feed content */}
    </div>
  );
}
```

---

## Payment Processing Errors

### Example: Stripe Payment Errors

```typescript
import { ErrorCode } from '@/lib/errors/types';

async function processPayment(paymentMethodId: string, amount: number) {
  try {
    const result = await apiClient.post('/payments/process', {
      paymentMethodId,
      amount,
    });

    return { success: true, data: result };
  } catch (error) {
    // Handle specific payment errors
    if (error.statusCode === 402) {
      return {
        success: false,
        userMessage: 'Payment declined. Please check your card details.',
        code: 'card_declined',
      };
    }

    if (error.code === ErrorCode.VALIDATION_ERROR) {
      return {
        success: false,
        userMessage: 'Invalid payment information. Please check your details.',
        code: 'invalid_payment',
      };
    }

    return {
      success: false,
      userMessage: 'Payment processing failed. Please try again.',
      code: 'processing_error',
    };
  }
}

// Usage
function CheckoutForm() {
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (paymentData: PaymentData) => {
    setProcessing(true);
    setPaymentError(null);

    const result = await processPayment(
      paymentData.paymentMethodId,
      paymentData.amount
    );

    if (result.success) {
      // Payment successful
      navigate('/payment/success');
    } else {
      setPaymentError(result.userMessage);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {paymentError && (
        <ErrorAlert
          error={
            new AppError(paymentError, ErrorCode.API_ERROR, {
              userMessage: paymentError,
            })
          }
          title="Payment Failed"
          onClose={() => setPaymentError(null)}
        />
      )}

      {/* Payment form fields */}

      <button type="submit" disabled={processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
```

---

These examples cover the most common error scenarios. Adapt them to your specific use cases and requirements.
