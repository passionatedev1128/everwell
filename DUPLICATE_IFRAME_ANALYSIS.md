# Deep Analysis: Why Two Iframe Elements Are Created

## Root Causes Identified

### 1. **React.StrictMode Double Execution** (PRIMARY CAUSE)
- **Location**: `frontend/src/main.jsx:47`
- **Issue**: React.StrictMode is enabled, which causes `useEffect` to run **twice** in development mode
- **Impact**: The effect runs once, then immediately runs again before cleanup

### 2. **Race Condition in Initialization Guards**
- **Location**: `SimplyBookWidget.jsx:161-163`
- **Issue**: The guards check `isWidgetInitializing`, but this is set synchronously while `widget.init()` is **asynchronous**
- **Timeline**:
  ```
  Effect Run 1:
    - Sets isWidgetInitializing = true (line 170)
    - Calls widget.init() (line 259) ← ASYNC, takes time
    - Effect Run 2 starts BEFORE iframe is created:
      - Checks isWidgetInitializing (true) ✓ Should block
      - BUT: If there's any delay or the check happens before line 170 executes...
  
  Effect Run 2 (StrictMode):
    - May pass guards if timing is off
    - Also calls widget.init()
    - Creates second iframe
  ```

### 3. **Script.onload Manual Trigger**
- **Location**: `SimplyBookWidget.jsx:350-354`
- **Issue**: When script already exists, we manually call `script.onload()` which can trigger initialization again
- **Problem**: This bypasses the normal flow and might not respect the guards

### 4. **SimplyBook Library Async Behavior**
- **Issue**: `widget.init()` is asynchronous and creates iframes after a delay
- **Impact**: Multiple `init()` calls can be in-flight simultaneously, each creating an iframe

### 5. **Global Flags Reset Timing**
- **Issue**: Global flags (`isWidgetInitializing`, `widgetInitialized`) are module-level but cleanup resets refs
- **Problem**: In StrictMode, cleanup runs between the two effect runs, potentially resetting state

## The Exact Problem Flow

```
Time 0ms:  React.StrictMode triggers Effect Run 1
Time 1ms:  - Sets isWidgetInitializing = true
Time 2ms:  - Calls widget.init('simplybook_widget') ← ASYNC
Time 3ms:  React.StrictMode triggers Effect Run 2 (cleanup + re-run)
Time 4ms:  - Cleanup from Run 1 executes (but init() still running)
Time 5ms:  - Checks guards... might pass if timing is off
Time 6ms:  - Also calls widget.init('simplybook_widget') ← ASYNC
Time 7ms:  Both init() calls complete, creating 2 iframes
```

## Solutions Needed

1. **Use a more robust singleton pattern** - Store widget instance globally
2. **Add a lock mechanism** - Prevent concurrent init() calls
3. **Check for existing widget instance** - Before creating new one
4. **Debounce initialization** - Add small delay to batch StrictMode runs
5. **Store init promise** - Track if init is in progress

