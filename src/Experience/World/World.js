import * as THREE from "three";
import Experience from "../Experience";
import Box from "./Box";
import Particles from "./Particles";
import Ground from "./Ground";
import Sphere from "./Sphere";

/**
 * When is an object considered clicked and held?
 *
 * Using a raycaster attached to the mouse, a ray can
 * be casted upon mouse click.
 *
 *  TODO: Where do I add the click event to the window?
 *       In Experience or Time?
 *       Should the Raycaster be its own class?
 *
 *  NOTE: Build out feature first, then refactor once you have
 *        it working.
 *
 * If an object is intersected:
 *  - add a fixed joint at the point of intersection (Rapier.js)
 *  - add the object to an 'intersects' array
 *
 *  If an object has been clicked, listen for the mouseup
 *  event. This event handler will remove replace
 *  the 'intersects' variable with an EMPTY array.
 *
 *  Remove joint.
 */

export default class World {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.intersectableObjects = [];

        this.rapier = null;
        this.grabberBody = null;

        // Load physics engine
        this.loadRapier();

        // Debug
        this.debug = this.experience.debug;

        if (this.debug.active) {
            this.setDebugFolders();
        }
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

        this.intersectableObjects.push(this.sphere);
        console.log(this.sphere);

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
        this.grabberBody = this.rapier.createRigidBody(
            RAPIER.RigidBodyDesc.kinematicPositionBased()
        );

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
