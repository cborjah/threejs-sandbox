import Sizes from "./Utils/Sizes";

export default class Experience {
    constructor(canvas) {
        // Global access
        window.experience = this;

        // Options
        this.canvas = canvas;

        // Setup
        this.sizes = new Sizes();
        this.time = new Time();

        // Window 'resize' event
        this.sizes.on("resize", () => this.resize());

        // Time 'tick' event
        this.time.on("tick", () => this.update());
    }

    resize() {}

    update() {}
}
