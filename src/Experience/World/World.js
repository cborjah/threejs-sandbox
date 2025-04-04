import * as THREE from "three";
import Experience from "../Experience";
import Box from "./Box";
import Particles from "./Particles";
import Ground from "./Ground";
import Sphere from "./Sphere";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.rapier = null;

        // Load physics engine
        this.loadRapier();

        // Debug
        this.debug = this.experience.debug;

        if (this.debug.active) {
            this.setDebugFolders();
        }

        // Setup
        // this.box = new Box();
    }

    setDebugFolders() {
        this.debugWorldFolder = this.debug.gui.addFolder("World");

        this.worldDebugOptions = {
            box: true,
            particles: false
        };

        this.debugWorldFolder
            .add(this.worldDebugOptions, "particles")
            .onChange((isEnabled) => {
                if (isEnabled & this.resources.isLoaded) {
                    this.particles = new Particles();
                } else if (this.particles) {
                    this.particles.destroy();
                    this.particles = null;
                }
            });
    }

    initializeObjects() {
        /* this.box = new Box({
            dimensions: [1, 1, 1],
            position: [0, 1, 0],
            physics: true
        }); */

        this.sphere = new Sphere({
            radius: 0.5,
            position: [0, 1, 0],
            physics: true
        });

        this.ground = new Ground({
            dimensions: [100, 1, 100],
            position: [0, -1, 0],
            physics: true
        });
    }

    async loadRapier() {
        const RAPIER = await import("@dimforge/rapier3d");

        const gravity = {
            x: 0.0,
            y: -9.81,
            z: 0.0
        };

        this.rapier = new RAPIER.World(gravity);

        this.initializeObjects();
    }

    step() {
        if (this.rapier) {
            this.rapier.step();

            this.box?.animate();
            this.sphere?.animate();

        }
    }
}
