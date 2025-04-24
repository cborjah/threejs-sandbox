import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

import Experience from "../Experience";
import Box from "./Box";
import Ground from "./Ground";

export default class FPWorld {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer;
        this.time = this.experience.time;

        this.controls = new PointerLockControls(
            this.camera,
            this.renderer.canvas
        );
        // this.scene.add(this.controls.object);

        document.addEventListener("click", () => {
            if (!this.controls.isLocked) {
                this.controls.lock();
            }
        });

        this._initializeObjects();
    }

    _initializeObjects() {
        this.box = new Box({
            dimensions: [1, 1, 1],
            position: [0, 1, 0],
            physics: false
        });

        /* this.sphere = new Sphere({
            radius: 0.5,
            position: [0, 1, -2],
            physics: false
        }); */

        this.ground = new Ground({
            dimensions: [100, 1, 100],
            position: [0, -1, 0],
            physics: false
        });
    }

    step() {
        // this.controls?.update(this.time.delta);
        this.controls?.update();
    }
}
