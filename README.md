# Three.js Sandbox

Personal playground for experimenting with 3D web development, testing out new features, and practicing with Three.js and related libraries. Used for prototyping ideas, exploring creative visualizations, and deepening my understanding of 3D modeling and rendering.

## Setup

```bash
# Install dependencies
npm i

# Run the local server
npm run dev

# Build for production in dist/ directory
npm run build
```

# EventEmitter Class Documentation

## Purpose

The `EventEmitter` class provides a flexible and powerful mechanism for event handling. It enables objects to subscribe to and trigger custom events, making it easier to manage and decouple event-driven behavior within an application.

This class can be particularly useful for scenarios where different parts of an application need to communicate without being tightly coupled. By using event listeners and triggers, the `EventEmitter` allows seamless notification when specific events occur.

## Use Cases

-   **Animation Lifecycle**: Signal when an animation has started, completed, or been interrupted.
-   **User Interactions**: Notify when an object has been clicked or hovered over.
-   **Game State Management**: Inform when a player is out of bounds, wins, or loses.
-   **Resource Loading**: Trigger events when all assets, data, or resources are fully loaded.
-   **Custom UI Components**: Handle custom component events like opening, closing, or refreshing.

## Methods

### `constructor()`

Initializes a new `EventEmitter` instance with a `callbacks` object to store event listeners.

---

### on(names, callback)

Registers a callback function for the specified event or events.

**Parameters:**

-   `_names` (`string`): The name of the event or a space-separated list of events.

-   `callback` (`function`): The function to call when the event is triggered.

**Returns:**

-   `this`: Returns the current `EventEmitter` instance for chaining.

**Usage:**

```javascript

```

---

### `off(_names)`

Removes one or more event listeners based on the provided event names.

**Parameters:**

-   `_names` (`string`): The name(s) of the event(s) to remove. Can include namespaces.

**Returns:**

-   `this`: Returns the current `EventEmitter` instance for chaining.

**Usage:**

```javascript
emitter.off("animationComplete");
emitter.off("player.outOfBounds");
```

---

### `trigger(_name, _args)`

Invokes all callbacks associated with a specified event.

**Parameters:**

-   `_name` (`string`): The event name to trigger.
-   `_args` (`Array`): Optional arguments to pass to the event listeners.

**Returns:**

-   `any`: The result of the last executed callback, if any.

**Usage:**

```javascript
emitter.trigger("animationComplete", [animationId]);
emitter.trigger("player.outOfBounds", [player]);
```

---

### `resolveNames(_names)`

Parses and cleans up the provided event names.

**Parameters:**

-   `_names` (`string`): Comma or space-separated list of event names.

**Returns:**

-   `Array<string>`: An array of cleaned event names.

---

### `resolveName(name)`

Splits an event name into its value and namespace.

**Parameters:**

-   `name` (`string`): The event name to resolve.

**Returns:**

-   `Object`: An object containing `original`, `value`, and `namespace` properties.

**Usage:**

```javascript
const resolved = emitter.resolveName("player.outOfBounds");
console.log(resolved);
// { original: 'player.outOfBounds', value: 'player', namespace: 'outOfBounds' }
```

---

## Example Usage

```javascript
const emitter = new EventEmitter();

// Register an event listener
emitter.on("animationComplete", (id) => {
    console.log(`Animation ${id} finished`);
});

// Trigger the event
emitter.trigger("animationComplete", [42]);

// Remove the event listener
emitter.off("animationComplete");
```

## Notes

-   Events can be namespaced using a `.` (dot) notation (e.g., `player.outOfBounds`).
-   Namespaces help to organize and manage events more efficiently.
-   Ensure to clean up listeners with `off` to avoid memory leaks.
