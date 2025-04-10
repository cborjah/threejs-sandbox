import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d";
// import { DragControls } from "three/addons/controls/DragControls";

import Experience from "../Experience";
// import Box from "./Box";
import Particles from "./Particles";
import Ground from "./Ground";
import Sphere from "./Sphere";

const _intersectableObjects = [];
const _draggableObjects = [];
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

let _grabberBody = null;
let _jointHandle = null;
let _currentIntersect = null;
let _isDragging = false;

export default class World {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer;
        this.sizes = this.experience.sizes;

        this.rapier = null;

        // Load physics engine
        this._loadRapier();

        // Controls
        // this._initializeDragControls();

        // Debug
        this.debug = this.experience.debug;
        this.rapierMesh = new THREE.LineSegments(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true })
        );
        this.rapierMesh.frustumCulled = false;
        this.scene.add(this.rapierMesh);

        if (this.debug.active) {
            this._setDebugFolders();
        }

        this._initializeEventHanlders();
    }

    _setDebugFolders() {
        this.debugWorldFolder = this.debug.gui.addFolder("World");

        const worldDebugOptions = {
            box: true,
            particles: false
        };

        this.debugWorldFolder
            .add(worldDebugOptions, "particles")
            .onChange((isEnabled) => {
                if (isEnabled & this.resources.isLoaded) {
                    this.particles = new Particles();
                } else if (this.particles) {
                    this.particles.destroy();
                    this.particles = null;
                }
            });
    }

    async _loadRapier() {
        const RAPIER = await import("@dimforge/rapier3d");
        const gravity = {
            x: 0.0,
            y: -9.81,
            z: 0.0
        };

        this.rapier = new RAPIER.World(gravity);

        _grabberBody = this.rapier.createRigidBody(
            RAPIER.RigidBodyDesc.kinematicPositionBased()
        );

        this._initializeObjects();
    }

    _initializeEventHanlders() {
        window.addEventListener("mousedown", (event) => {
            _isDragging = true;

            this._updateMousePosition();
            _raycaster.setFromCamera(_mouse, this.camera);

            const intersects = _raycaster.intersectObjects(
                _intersectableObjects
            );

            if (intersects.length) {
                _currentIntersect = intersects[0];

                const point = _currentIntersect.point; // World coordinates of the point of intersection by the ray
                const boundingBox = new THREE.Box3().setFromObject(
                    _currentIntersect.object
                );
                const targetCenter = new THREE.Vector3();
                boundingBox.getCenter(targetCenter);
                const targetBody = _currentIntersect.object.userData.rigidBody;

                // Move grabber body to intersected point on object
                _grabberBody.setTranslation(
                    new RAPIER.Vector3(point.x, point.y, targetCenter.z)
                );

                const fixedJointParams = RAPIER.JointData.fixed(
                    { x: targetCenter.x, y: targetCenter.y, z: targetCenter.z },
                    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
                    { x: point.x, y: point.y, z: targetCenter.z },
                    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 }
                );

                _jointHandle = this.rapier.createImpulseJoint(
                    fixedJointParams,
                    _grabberBody,
                    targetBody,
                    true
                );
            }
        });

        window.addEventListener("mouseup", (event) => {
            if (_jointHandle) {
                this.rapier.removeImpulseJoint(_jointHandle, true);
                _jointHandle = null;
            }
        });

        window.addEventListener("mousemove", (event) => {
            this._updateMousePosition();

            if (_isDragging) {
                this._updateGrabberBody(event);
            }
        });
    }

    // Three.js DragControls
    /* _initializeDragControls() {
        this._dragControls = new DragControls(
            _draggableObjects,
            this.camera,
            this.renderer.canvas
        );

        this._dragControls.addEventListener("dragstart", (event) => {
            const mesh = event.object;
            mesh.userData.rigidBody.setEnabled(false); // Disabling the rigidBody prevents the mesh from copying the rigidBody's position.
        });

        this._dragControls.addEventListener("dragend", (event) => {
            const mesh = event.object;
            const rigidBody = mesh.userData.rigidBody;

            rigidBody.setTranslation(mesh.position, true); // Snap physics body to mesh
            rigidBody.setEnabled(true); // Re-enable physics
        });
    } */

    _initializeObjects() {
        /* this.box = new Box({
            dimensions: [1, 1, 1],
            position: [0, 1, 0],
            physics: true
        }); */

        this.sphere = new Sphere({
            radius: 0.5,
            position: [0, 1, -2],
            physics: true
        });

        _intersectableObjects.push(this.sphere.mesh);
        _draggableObjects.push(this.sphere.mesh);

        this.ground = new Ground({
            dimensions: [100, 1, 100],
            position: [0, -1, 0],
            physics: true
        });
    }

    _updateMousePosition() {
        _mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
        _mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    }

    _updateGrabberBody(event) {
        if (_isDragging && _jointHandle) {
            _raycaster.setFromCamera(_mouse, this.camera);

            const boundingBox = new THREE.Box3().setFromObject(
                _currentIntersect.object
            );
            const targetCenter = new THREE.Vector3();
            boundingBox.getCenter(targetCenter);

            // The Z axis plane is used to limit the translation of the grabber body to the X and Y axes.
            const planeZ = new THREE.Plane(
                new THREE.Vector3(0, 0, 1),

                // NOTE: The signed distance is opposite to the distance from the center of the intersected object to the origin.
                -targetCenter.z // The signed distance from the origin to the plane. Set to the center of the draggable object.
            );

            // Helper for visualizing intersecting plane.
            // const planeHelper = new THREE.PlaneHelper(planeZ, 4, 0xffff00);
            // this.scene.add(planeHelper);

            const intersectPoint = new THREE.Vector3();

            _raycaster.ray.intersectPlane(planeZ, intersectPoint);

            _grabberBody.setNextKinematicTranslation(
                new RAPIER.Vector3(
                    intersectPoint.x,
                    intersectPoint.y,
                    intersectPoint.z
                )
            );
        }
    }

    step() {
        this._dragControls?.update();

        if (this.rapier) {
            this.rapier.step();

            // this.box?.animate();
            this.sphere?.animate();

            // TODO: Add this to the debug folder
            // Debug
            const { vertices, colors } = this.rapier.debugRender();
            this.rapierMesh.geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(vertices, 3)
            );
            this.rapierMesh.geometry.setAttribute(
                "color",
                new THREE.BufferAttribute(colors, 4)
            );
            this.rapierMesh.visible = true;
        }
    }
}
