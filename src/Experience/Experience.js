import * as THREE from "three";

import Camera from "./Camera";
import Renderer from "./Renderer";
import Time from "./Utils/Time";
import Sizes from "./Utils/Sizes";
import Cursor from "./Utils/Cursor";
import Debug from "./Utils/Debug";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "../sources";

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
        this.cursor = new Cursor();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources); // NOTE: Must be initiated immediately after scene is initiated
        this.camera = new Camera();
        this.renderer = new Renderer();
        // this.world = new World(); // Default world
        this.world = new FPWorld();


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

        // Update physics world
        this.world.step();
    }

    destroy() {
        this.sizes.off("resize");
        this.time.off("tick");

        // Traverse entire scene
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();

                for (const key in child.material) {
                    const value = child.material[key];

                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                }
            }
        });

        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if (this.debug.active) {
            this.debug.ui.destroy();
        }
    }
}
