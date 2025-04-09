import { DragControls } from "three/addons/controls/DragControls";

import Experience from "../Experience";
// import Box from "./Box";
import Particles from "./Particles";
import Ground from "./Ground";
import Sphere from "./Sphere";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer;

        this._draggableObjects = [];

        this.rapier = null;
        this.grabberBody = null;

        // Load physics engine
        this.loadRapier();

        // Initialize drag controls
        this._dragControls = new DragControls(
            this._draggableObjects,
            this.camera,
            this.renderer.canvas
        );

        this._dragControls.addEventListener("dragstart", (event) => {
            const mesh = event.object;
            mesh.userData.rigidBody.setEnabled(false); // Disable physics to prevent mesh from snapping back to the rigid body
        });

        this._dragControls.addEventListener("dragend", (event) => {
            const mesh = event.object;
            const rigidBody = mesh.userData.rigidBody;

            rigidBody.setTranslation(mesh.position, true); // Snap physics body to mesh
            rigidBody.setEnabled(true); // Re-enable physics
        });

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

        this._draggableObjects.push(this.sphere.mesh);

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
        this._dragControls.update();

        if (this.rapier) {
            this.rapier.step();

            // this.box?.animate();
            this.sphere?.animate();
        }
    }
}
