import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
    constructor() {
        super();

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;

        /**
         * this.delta is how much time was spent since the previous frame
         *
         * It is set to 16 by default (closest to how many milliseconds
         * there are between two frames at 60fps)
         */
        this.delta = 16;

        window.requestAnimationFrame(() => this.tick());
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        // Trigger all callbacks tied to 'tick' event
        this.trigger("tick");

        window.requestAnimationFrame(() => this.tick());
    }
}
