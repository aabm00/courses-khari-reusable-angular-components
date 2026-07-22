# Practice 14 - Microsyntax Playground (`myTimer`)
# CH9 - VIDEO 96 - 97

In this exercise we will take the custom `*myTimer` directive from the microsyntax playground and turn it into a real structural directive that exposes live timer state to the template. We will begin by modelling the timer with signals, then we will render the view with a template context, and finally we will make the directive reactive so changing the inputs creates a new timer with proper cleanup.

The starting project already contains a `MyTimer` directive with these inputs:
- `myTimer` for the interval in milliseconds.
- `myTimerFrom` for the starting value.
- `myTimerTo` for the maximum value.
- `myTimerStep` for the increment amount.

The application template uses the directive like this:

```html
<div
	*myTimer="int(); from: 1; to: 10; step: step(); let v = value; let s = state"
	class="content-presenter"
>
	<h3>Timer Status: {{ s }}</h3>
	<h3>Timer Value: {{ v }}</h3>
</div>
```

Right now the directive only logs its input values. It does not create an embedded view, it does not expose any live state to the template, and it does not start a real timer when the inputs change.

---

## Phase 1 - Modelling Timer State With Signals

In this phase we focus on the actual state machine behind the timer. The important idea is that there is only one truly stateful value here: the current timer value. Everything else can be derived from that value.

### Step 1
Open `src/app/directives/my-timer.directive.ts` and add the Angular primitives you need for a structural directive and signal-based state.

You will need imports for:
- `TemplateRef`
- `ViewContainerRef`
- `inject`
- `signal`
- `computed`

### Step 2
Inject both `TemplateRef` and `ViewContainerRef` into the directive.

You should end up with access to:
- The template associated with `*myTimer`
- The container where that template will be rendered

### Step 3
Create a private writable signal called `value`. This is the one piece of mutable timer state in the directive.

For now it can start at `0`:

```typescript
private readonly value = signal(0);
```

This signal will be updated over time as the timer runs.

### Step 4
Create a computed signal called `state` whose value depends on `value()` and `myTimerTo()`.

The rule is:
- If the current value is still below `myTimerTo()`, the state is `'running'`
- If the current value has reached `myTimerTo()`, the state is `'done'`

That means the timer status is derived state, not something you manually store.

### Step 5
Keep in mind what this means conceptually:
- `value` is the single stateful signal
- `state` is a computed projection of `value`

This separation is important because it keeps the timer logic simple and avoids storing redundant state that can get out of sync.

---

## Phase 2 - Rendering the Template Once

In this phase we build the structural directive part. Unlike `*myIf`, the presence of the view never changes here. The template should always exist exactly once, and the signals inside the context should update over time.

### Step 6
Create a `MyTimerContext` object inside the constructor and expose the signals that the template needs.

The context should include:
- `value`
- `state`
- `myTimer`
- `myTimerFrom`

Because the template should read these values reactively, expose them as signals rather than plain numbers.

### Step 7
When exposing `value`, pass a readonly version of the signal rather than the writable signal itself:

```typescript
value: this.value.asReadonly(),
```

This keeps the template context read-only while still allowing the directive to update the underlying state internally.

### Step 8
Use `ViewContainerRef.createEmbeddedView(...)` in the constructor to create the embedded view exactly once.

For this directive, the view itself is not conditional and it does not repeat. The only thing that changes over time is the signal state inside the context.

At this point the directive should render the template once, and the template should have access to the context values, even if the timer is not running yet.

---

## Phase 3 - Starting a New Timer When Inputs Change

In this phase we make the directive reactive. Whenever any of the timer inputs change, the directive should treat that as a new timer configuration and start over from the current inputs.

### Step 9
Create an `effect` inside the constructor.

This effect should read all timer inputs:
- `myTimer()`
- `myTimerFrom()`
- `myTimerTo()`
- `myTimerStep()`

Because the effect reads those signals, Angular will rerun it whenever any of them change.

### Step 10
Inside the effect, first create local copies of the input values.

For example:

```typescript
const interval = this.myTimer();
const from = this.myTimerFrom();
const to = this.myTimerTo();
const step = this.myTimerStep();
```

This ensures the interval callback closes over a stable snapshot of the configuration for that timer run.

### Step 11
Reset the current timer value to `from` before starting the interval:

```typescript
this.value.set(from);
```

This is important because a change to any input means we are starting a fresh timer, not continuing the previous one.

### Step 12
Create a `setInterval(...)` that updates the current value by `step` on every tick.

Clamp the next value so it never exceeds `to`:

```typescript
this.value.update(v => Math.min(v + step, to));
```

For this exercise you can assume all input values are positive, so you only need to handle the forward-counting case.

### Step 13
Inside the interval callback, stop the timer once the value reaches `to`.

That means after updating the value, if the current value is now greater than or equal to `to`, call `clearInterval(...)`.

This gives the directive the correct runtime behavior:
- The timer starts from `from`
- It increases by `step`
- It never exceeds `to`
- It stops itself when it is done

### Step 14
Verify the runtime behavior in the app:
- The view renders immediately
- `Timer Value` starts at `1`
- `Timer Status` changes from `running` to `done` when the value reaches `10`
- Clicking the interval and step buttons starts a new timer using the latest inputs

---

## Phase 4 - Cleaning Up Previous Intervals

At this point the directive mostly works, but there is still a subtle bug. Every time the effect reruns, a new interval is created. If we do not clean up the previous interval, multiple timers will continue running at the same time.

### Step 15
Update the effect to use the cleanup callback:

```typescript
effect((onCleanup) => {
	// timer setup
});
```

This gives you a place to tear down the previous interval before the effect runs again.

### Step 16
Register cleanup logic that clears the interval created by the current effect run:

```typescript
onCleanup(() => clearInterval(id));
```

Now the lifecycle becomes:
1. Inputs are read
2. A timer is created
3. Inputs change
4. The old timer is cleaned up
5. A new timer is created from the latest inputs

### Step 17
Verify that changing the interval or step repeatedly does not cause overlapping timers.

The timer should always behave as if exactly one interval is active.

---

## Expected Result

By the end of the exercise:
- `MyTimer` creates a single embedded view using `TemplateRef` and `ViewContainerRef`.
- The directive exposes a template context containing live signals.
- `value` is the single writable signal that represents timer state.
- `state` is a computed signal derived from `value`.
- An `effect` creates a new timer whenever the timer inputs change.
- The timer never exceeds `myTimerTo()` and stops itself when it reaches the target.
- Cleanup logic ensures that only one interval is active at a time.
