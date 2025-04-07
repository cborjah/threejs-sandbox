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

        /* const floorMesh = new THREE.Mesh(
            new THREE.BoxGeometry(100, 1, 100),
            new THREE.MeshPhongMaterial()
        );
        floorMesh.receiveShadow = true;
        floorMesh.position.y = -1;
        this.scene.add(floorMesh);

        const floorBody = this.rapier.createRigidBody(
            RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0)
        );
        const floorShape = RAPIER.ColliderDesc.cuboid(50, 0.5, 50);
        this.rapier.createCollider(floorShape, floorBody); */

        // Ground
        // this.groundRigidBody = RAPIER.RigidBodyDesc.fixed();
        // this.groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
        // this.world.createCollider(this.groundColliderDesc);

        /*         this.cubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshNormalMaterial()
        );
        this.cubeMesh.castShadow = true;
        this.cubeMesh.position.y = 1;
        this.scene.add(this.cubeMesh);

        this.cubeBody = this.rapier.createRigidBody(
            RAPIER.RigidBodyDesc.dynamic()
                .setTranslation(0, 1, 0)
                .setCanSleep(false)
        );

        this.cubeShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
            .setMass(1)
            // .setTranslation(0, 1, 0)
            .setRestitution(1.1);
        this.rapier.createCollider(this.cubeShape, this.cubeBody); */

        // dynamicBodies.push([cubeMesh, cubeBody]);

        // const floorMesh = new THREE.Mesh(
        //     new THREE.BoxGeometry(100, 1, 100),
        //     new THREE.MeshPhongMaterial()
        // );
        // floorMesh.receiveShadow = true;
        // floorMesh.position.y = -1;
        // this.scene.add(floorMesh);
        // const floorBody = this.world.createRigidBody(
        //     RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0)
        // );
        // const floorShape = RAPIER.ColliderDesc.cuboid(50, 0.5, 50);
        // this.world.createCollider(floorShape, floorBody);
        //
        // this.ground = this.world.createRigidBody(this.groundRigidBody);
    }

    step() {
        if (this.rapier) {
            this.rapier.step();

            this.box?.animate();
            this.sphere?.animate();

            // this.cubeMesh.position.copy(this.cubeBody.translation());

            // let position = this.ground.translation();
            // console.log("rigid body position: ", position.x);
        }
    }
}
