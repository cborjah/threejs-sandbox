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

This gives the event system a flexible way to group related events into namespaces, like "ui", "network", "animation", etc. So when you remove events, you could target an entire namespace or a specific event inside it.

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
// Experience class
constructor() {
    //...

    // Pass Experience's 'resize' method as a callback for when the 'trigger'
    // method is invoked within classes extending the EventEmitter class.
    this.sizes.on("resize", () => this.resize());
}

resize() {
    this.camera.resize();
    this.renderer.resize();
}
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
// Sizes class
constructor() {
    //...

    window.addEventListener("resize", () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Trigger all callbacks tied to 'resize' event
        this.trigger("resize");
    });
}


```

---

### `resolveNames(_names)`

Takes a string of event names, parses, cleans, and places them into an array of individual event names.

**Parameters:**

-   `_names` (`string`): Comma or space-separated list of event names.

**Returns:**

-   `Array<string>`: An array of cleaned event names.

**Example:**

```javascript
resolveNames("event1, event2/event3");
// Output: ["event1", "event2", "event3"]
```

---

### `resolveName(name)`

Splits an event name into its value and namespace.

**Parameters:**

-   `name` (`string`): The event name to resolve.

**Returns:**

-   `Object`: An object containing `original`, `value`, and `namespace` properties.

**Example:**

```javascript
resolveName("click.ui");
// Output: { original: "click.ui", value: "click", namespace: "ui" }

resolveName("hover");
// Output: { original: "hover", value: "hover", namespace: "base" }
```

---

## Example Usage

```javascript
const emitter = new EventEmitter();

function onClick() {
    console.log("Click event triggered");
}

emitter.on("click.ui", onClick);
emitter.on("hover", () => console.log("Hover event triggered"));

// After the code above is executed, this.callbacks will look like:
{
    ui: { click: [onClick] },
    base: { hover: [/* hover callback */] }
}
```

## Notes

-   Events can be namespaced using a `.` (dot) notation (e.g., `player.outOfBounds`).
-   Namespaces help to organize and manage events more efficiently.
-   Ensure to clean up listeners with `off` to avoid memory leaks.
