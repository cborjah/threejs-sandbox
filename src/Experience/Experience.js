import * as THREE from "three";

import Camera from "./Camera";
import Renderer from "./Renderer";
import Time from "./Utils/Time";
import Sizes from "./Utils/Sizes";
import Debug from "./Utils/Debug";

let instance = null;

export default class Experience {
    constructor(canvas) {
        if (instance) return instance;
        instance = this;

        // Global access
        window.experience = this;

        // Options
        this.canvas = canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();

        // Window 'resize' event
        this.sizes.on("resize", () => this.resize());

        // Time 'tick' event
        this.time.on("tick", () => this.update());
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        // Update camera controls (damping is ON)
        this.camera.update();
        this.renderer.update();
    }
}
