import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Experience from "./Experience";

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.cursor = this.experience.cursor;

        // Parallax effect
        this.parallax = {
            enabled: false
        };

        this.setInstance();
        this.setControls();

        // Debug
        this.debug = this.experience.debug;

        if (this.debug.active) {
            this.setParallaxDebugOptions();
        }

        // window.addEventListener("mousemove", (event) => {
        //     this.cursor.setX(event.clientX / this.sizes.width - 0.5);
        //     this.cursor.setY(event.clientY / this.sizes.height - 0.5);
        // });
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            75, // fov
            this.sizes.width / this.sizes.height, // aspect
            0.1, // near
            100 // far
        );

        this.instance.position.z = 3;

        this.scene.add(this.instance);
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);

        this.controls.enableDamping = true;
    }

    setMousemoveListener() {
        this.unsubscribeMousemove = window.addEventListener(
            "mousemove",
            (event) => {
                console.log("mousemove listener added!");
                this.cursor.setX(event.clientX / this.sizes.width - 0.5);
                this.cursor.setY(event.clientY / this.sizes.height - 0.5);
            }
        );
    }

    removeMousemoveListener() {
        if (this.unsubscribeMousemove) {
            this.unsubscribeMousemove();
        }
    }

    setParallaxDebugOptions() {
        this.debugParallaxFolder = this.debug.gui.addFolder("Parallax");

        this.debugParallaxFolder
            .add(this.parallax, "enabled")
            .onChange((value) => {
                if (value) {
                    this.controls.reset();
                    this.controls.enabled = false;

                    this.setMousemoveListener();
                } else {
                    this.controls.enabled = true;

                    this.removeMousemoveListener();
                }
            });
    }

    animateParallax() {
        const parallaxX = this.cursor.x;
        const parallaxY = this.cursor.y;

        this.instance.position.x = parallaxX;
        this.instance.position.y = -parallaxY;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        if (!this.parallax.enabled) {
            this.controls.update();
        } else {
            this.animateParallax();
        }
    }
}
