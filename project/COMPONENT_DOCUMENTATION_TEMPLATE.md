# Component Documentation Template

Use this template when documenting UI components, functions, utilities, or any reusable code modules. Copy and fill in the details for each component.

---

## Component Name: [ComponentName]

### Overview

**Purpose:** [Brief description of what the component does and why it exists]

**Category:** [e.g., Form Controls, Navigation, Layout, Feedback, Data Display, Utilities]

**Status:** [Stable/Beta/Experimental/Deprecated]

**Location:** `[path/to/component]`

**Last Updated:** [Date]

---

### Quick Start

```[language]
// Minimal working example
import { ComponentName } from './components/ComponentName';

<ComponentName
  requiredProp="value"
/>
```

---

### API Reference

#### Props/Parameters

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `propName` | `string` | Yes | - | Detailed description of the prop's purpose and behavior |
| `optionalProp` | `number` | No | `0` | Description with default value |
| `unionProp` | `'option1' \| 'option2'` | No | `'option1'` | Available options and their effects |
| `objectProp` | `{ field: string }` | No | `{}` | Structure and purpose of object properties |
| `callbackProp` | `(arg: Type) => void` | No | - | When this callback is invoked and with what data |

#### Type Definitions

```typescript
interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: number;
  unionProp?: 'option1' | 'option2';
  objectProp?: {
    field: string;
    nestedField?: boolean;
  };
  callbackProp?: (arg: ArgumentType) => void;
  children?: React.ReactNode;
}

type VariantType = 'primary' | 'secondary' | 'tertiary';
```

#### Events/Callbacks

| Event Name | Parameters | Description | When Triggered |
|------------|------------|-------------|----------------|
| `onClick` | `(event: MouseEvent) => void` | User clicks the component | On mouse click or Enter/Space key |
| `onChange` | `(value: string) => void` | Value changes | When internal state updates |
| `onSubmit` | `(data: FormData) => Promise<void>` | Form is submitted | When validation passes and user submits |

#### Return Value / Output

For functions and utilities:

| Return Type | Description |
|-------------|-------------|
| `ReturnType` | Description of what is returned and its structure |

**Example:**

```typescript
const result: ReturnType = functionName(params);
// result structure: { success: boolean, data: any, error?: string }
```

---

### Usage Examples

#### Basic Usage

```typescript
import { ComponentName } from '@/components/ComponentName';

function Example() {
  return (
    <ComponentName
      requiredProp="value"
    >
      Basic content
    </ComponentName>
  );
}
```

#### With Optional Props

```typescript
<ComponentName
  requiredProp="value"
  optionalProp={42}
  unionProp="option2"
  objectProp={{
    field: "nested value",
    nestedField: true
  }}
/>
```

#### With Event Handlers

```typescript
function InteractiveExample() {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    console.log('Value changed:', newValue);
    setValue(newValue);
  };

  return (
    <ComponentName
      requiredProp={value}
      onChange={handleChange}
      onClick={(e) => console.log('Clicked!', e)}
    />
  );
}
```

#### Advanced Usage

```typescript
function AdvancedExample() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.submit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentName
      requiredProp="value"
      optionalProp={100}
      loading={loading}
      onSubmit={handleSubmit}
      customRenderer={(item) => <CustomItem {...item} />}
    >
      <ChildComponent />
    </ComponentName>
  );
}
```

#### Common Patterns

##### Pattern 1: [Pattern Name]

```typescript
// Description of when to use this pattern
function PatternExample() {
  return (
    <ComponentName
      pattern="specific-configuration"
    />
  );
}
```

##### Pattern 2: [Another Pattern]

```typescript
// Description of this use case
function AnotherPattern() {
  // Implementation
}
```

#### With Other Components

```typescript
import { ComponentName } from '@/components/ComponentName';
import { RelatedComponent } from '@/components/RelatedComponent';

function ComposedExample() {
  return (
    <ComponentName requiredProp="value">
      <RelatedComponent nested />
    </ComponentName>
  );
}
```

---

### State Management

#### Internal State

| State Variable | Type | Description |
|----------------|------|-------------|
| `internalState` | `StateType` | What this state controls and when it changes |

#### Controlled vs Uncontrolled

**Controlled Mode:**
```typescript
// Parent manages state
const [value, setValue] = useState('');
<ComponentName value={value} onChange={setValue} />
```

**Uncontrolled Mode:**
```typescript
// Component manages its own state
<ComponentName defaultValue="initial" />
```

---

### Styling & Theming

#### CSS Classes

| Class Name | Applied When | Purpose |
|------------|--------------|---------|
| `.component-name` | Always | Base component styles |
| `.component-name--variant` | variant="variant" | Variant-specific styles |
| `.component-name--disabled` | disabled={true} | Disabled state styles |
| `.component-name__element` | - | Styles for internal element |

#### CSS Variables (Custom Properties)

```css
.component-name {
  /* Color */
  --component-bg-color: #ffffff;
  --component-text-color: #000000;
  --component-border-color: #e0e0e0;

  /* Sizing */
  --component-padding: 1rem;
  --component-border-radius: 0.5rem;
  --component-font-size: 1rem;

  /* Transitions */
  --component-transition-duration: 200ms;
  --component-transition-timing: ease-in-out;
}
```

#### Customization Example

```css
/* Override default styles */
.component-name {
  --component-bg-color: #f0f0f0;
  --component-padding: 1.5rem;
}
```

```typescript
// Inline styles
<ComponentName
  style={{ backgroundColor: 'lightblue' }}
  className="custom-class"
/>
```

#### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 640px) | Stack vertically, full width, touch-optimized |
| Tablet (640px - 1024px) | Adaptive layout, medium spacing |
| Desktop (> 1024px) | Horizontal layout, full features |

---

### Accessibility

#### ARIA Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `role` | `"button"` | Identifies the component's role |
| `aria-label` | `"Description"` | Accessible name when text content insufficient |
| `aria-disabled` | `"true"/"false"` | Indicates disabled state |
| `aria-expanded` | `"true"/"false"` | For expandable components |
| `aria-live` | `"polite"/"assertive"` | For dynamic content updates |

#### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to/from component |
| `Shift + Tab` | Move focus backward |
| `Enter` | Activate primary action |
| `Space` | Activate/toggle |
| `Escape` | Close/cancel |
| `Arrow Keys` | Navigate within component (if applicable) |

#### Screen Reader Support

- **Announcements:** Component state changes are announced appropriately
- **Labels:** All interactive elements have accessible labels
- **Instructions:** Complex interactions include ARIA descriptions
- **Live Regions:** Dynamic content updates use aria-live

#### Focus Management

- **Focus Indicators:** Visible focus outline (minimum 2px, high contrast)
- **Focus Trap:** Modal components trap focus within their boundaries
- **Focus Restoration:** Focus returns to trigger element when closing
- **Initial Focus:** Logical initial focus point on component mount

#### Color Contrast

- **Text:** Minimum 4.5:1 contrast ratio (WCAG AA)
- **Large Text:** Minimum 3:1 contrast ratio
- **Interactive Elements:** Minimum 3:1 contrast for focus indicators
- **Error States:** Not conveyed by color alone

---

### Performance

#### Optimization Techniques

- **Memoization:** Component uses `React.memo` for props comparison
- **Lazy Loading:** Heavy components are code-split and lazy loaded
- **Debouncing:** User input is debounced to reduce re-renders
- **Virtual Scrolling:** Large lists use virtualization

#### Performance Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Initial Render | < 16ms | Time to first paint |
| Re-render | < 8ms | Time for subsequent renders |
| Bundle Size | < 10kb | Gzipped component size |

#### Best Practices

```typescript
// Memoize callbacks
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Memoize expensive calculations
const computed = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Use proper keys for lists
{items.map(item => (
  <Item key={item.id} {...item} />
))}
```

---

### Edge Cases & Error Handling

#### Invalid Props

| Scenario | Behavior |
|----------|----------|
| Missing required prop | Throws error or logs warning in development |
| Invalid prop type | Falls back to default value |
| Out-of-range value | Clamps to valid range |

```typescript
// Example validation
if (!requiredProp) {
  console.error('ComponentName: requiredProp is required');
  return null;
}
```

#### Loading States

```typescript
<ComponentName
  loading={true}
  loadingText="Loading..."
  fallback={<Skeleton />}
/>
```

#### Empty States

```typescript
<ComponentName
  data={[]}
  emptyState={<EmptyMessage />}
  emptyText="No items found"
/>
```

#### Error States

```typescript
<ComponentName
  error={error}
  onRetry={handleRetry}
  errorBoundary={<ErrorFallback />}
/>
```

#### Overflow Scenarios

- **Long Text:** Truncates with ellipsis or wraps based on config
- **Many Items:** Implements pagination or infinite scroll
- **Large Content:** Uses scrollable container with visual indicators

#### Browser Compatibility

| Feature | Fallback | Browsers |
|---------|----------|----------|
| CSS Grid | Flexbox | IE 11 |
| CSS Variables | Static values | IE 11 |
| IntersectionObserver | Polyfill | IE 11, Safari < 12 |

---

### Dependencies

#### Required Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

#### Optional Dependencies

```json
{
  "@supabase/supabase-js": "^2.38.0",
  "date-fns": "^2.30.0"
}
```

**Impact:** [Describe what features require optional dependencies]

#### Peer Dependencies

```json
{
  "typescript": "^5.0.0"
}
```

**Note:** [Explain peer dependency requirements]

---

### Testing

#### Unit Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders with required props', () => {
    render(<ComponentName requiredProp="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ComponentName requiredProp="test" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles loading state', () => {
    render(<ComponentName requiredProp="test" loading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Integration Tests

```typescript
describe('ComponentName Integration', () => {
  it('works with form submission', async () => {
    const onSubmit = jest.fn();
    render(
      <Form onSubmit={onSubmit}>
        <ComponentName requiredProp="test" />
      </Form>
    );

    // Test integration logic
  });
});
```

#### Accessibility Tests

```typescript
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<ComponentName requiredProp="test" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

### Troubleshooting

#### Common Issues

##### Issue: Component doesn't render

**Cause:** Missing required props or invalid data

**Solution:**
```typescript
// Ensure all required props are provided
<ComponentName requiredProp="value" />
```

##### Issue: Styles not applying

**Cause:** CSS module imports or conflicting styles

**Solution:**
```typescript
// Import styles correctly
import styles from './ComponentName.module.css';
```

##### Issue: Events not firing

**Cause:** Event propagation stopped or component disabled

**Solution:**
```typescript
// Check disabled state and event handlers
<ComponentName
  disabled={false}
  onClick={handleClick}
/>
```

#### Debug Mode

```typescript
// Enable debug logging
<ComponentName
  debug={true}
  onDebug={(info) => console.log(info)}
/>
```

---

### Related Components

- **[RelatedComponent1]** - Similar component for different use case
- **[RelatedComponent2]** - Complementary component often used together
- **[RelatedComponent3]** - Alternative component with different features

---

### Migration Guide

#### From v1.x to v2.x

**Breaking Changes:**

1. **Prop Renamed:** `oldProp` → `newProp`
   ```typescript
   // Before
   <ComponentName oldProp="value" />

   // After
   <ComponentName newProp="value" />
   ```

2. **Event Signature Changed:** `onChange(value)` → `onChange(event, value)`
   ```typescript
   // Before
   const handleChange = (value) => { ... };

   // After
   const handleChange = (event, value) => { ... };
   ```

3. **Removed Feature:** `deprecatedFeature` removed
   ```typescript
   // Migration path: Use alternative approach
   <ComponentName alternativeFeature="value" />
   ```

**New Features:**

- Added `newFeature` prop for enhanced functionality
- Improved performance with automatic memoization
- Better TypeScript support with stricter types

**Migration Timeline:**

- v1.x support ends: [Date]
- Deprecation warnings in: v1.9.0
- Breaking changes in: v2.0.0

---

### Examples Gallery

#### Example 1: Basic Form Integration

```typescript
function FormExample() {
  const [value, setValue] = useState('');

  return (
    <form>
      <ComponentName
        requiredProp={value}
        onChange={setValue}
        placeholder="Enter value..."
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Example 2: With Validation

```typescript
function ValidatedExample() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (newValue: string) => {
    if (newValue.length < 3) {
      setError('Must be at least 3 characters');
      return false;
    }
    setError('');
    return true;
  };

  return (
    <ComponentName
      requiredProp={value}
      onChange={(val) => {
        setValue(val);
        validate(val);
      }}
      error={error}
    />
  );
}
```

#### Example 3: Async Operations

```typescript
function AsyncExample() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getData();
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentName
      requiredProp="value"
      loading={loading}
      data={data}
      onLoad={fetchData}
    />
  );
}
```

#### Example 4: With Supabase

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

function SupabaseExample() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from('items')
        .select('*');

      setItems(data || []);
    }

    fetchItems();
  }, []);

  const handleCreate = async (newItem: Item) => {
    const { data, error } = await supabase
      .from('items')
      .insert([newItem])
      .select()
      .single();

    if (!error && data) {
      setItems([...items, data]);
    }
  };

  return (
    <ComponentName
      requiredProp={items}
      onCreate={handleCreate}
    />
  );
}
```

---

### Security Considerations

- **Input Sanitization:** All user input is sanitized before rendering
- **XSS Prevention:** Uses safe rendering methods, no `dangerouslySetInnerHTML`
- **CSRF Protection:** Forms include CSRF tokens when applicable
- **Data Validation:** Server-side validation for all mutations
- **Permission Checks:** Respects RLS policies in Supabase

---

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2024-02-01 | Breaking: Renamed props, new features |
| 1.2.0 | 2024-01-15 | Added loading state support |
| 1.1.0 | 2023-12-01 | Improved accessibility |
| 1.0.0 | 2023-11-01 | Initial release |

---

### Resources

- **Source Code:** [Link to component file]
- **Storybook:** [Link to Storybook entry]
- **Design Specs:** [Link to Figma/design files]
- **Related Issues:** [Link to GitHub issues]
- **Discussion:** [Link to RFC or discussion]

---

### Contributing

To contribute improvements to this component:

1. Read the [Contributing Guide](CONTRIBUTING.md)
2. Create a feature branch
3. Add tests for new functionality
4. Update this documentation
5. Submit a pull request

---

### License

[Your license information]

---

### Support

- **Questions:** Open a discussion on GitHub
- **Bugs:** File an issue with reproduction steps
- **Feature Requests:** Open an issue with use case description
- **Security Issues:** Email security@example.com
