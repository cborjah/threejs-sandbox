import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
    constructor() {
        super();

        // NOTE: Assumes the experience ALWAYS fills the viewport, else this is not correct
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        window.addEventListener("resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            // Trigger all callbacks tied to 'resize' event
            this.trigger("resize");
        });
    }
}
