import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d";
import { DragControls } from "three/addons/controls/DragControls";

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

        window.addEventListener("mousedown", (event) => {
            _isDragging = true;

            _mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
            _mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

            _raycaster.setFromCamera(_mouse, this.camera);

            const intersects = _raycaster.intersectObjects(
                _intersectableObjects
            );

            if (intersects.length) {
                _currentIntersect = intersects[0];

                const point = _currentIntersect.point; // World coordinates of the point of intersection by the ray

                // const boundingBox = new THREE.Box3();
                const boundingBox = new THREE.Box3().setFromObject(
                    _currentIntersect.object
                );
                const targetCenter = new THREE.Vector3();
                boundingBox.getCenter(targetCenter);

                const targetBody = _currentIntersect.object.userData.rigidBody;

                // Move grabber body to mouse point
                /* _grabberBody.setNextKinematicTranslation(
                    new RAPIER.Vector3(point.x, point.y, point.z)
                ); */

                /* _grabberBody.setTranslation(
                    new RAPIER.Vector3(
                        targetCenter.x,
                        targetCenter.y,
                        targetCenter.z
                    )
                ); */

                /* _grabberBody.setTranslation(
                    new RAPIER.Vector3(point.x, point.y, point.z)
                ); */

                _grabberBody.setTranslation(
                    new RAPIER.Vector3(point.x, point.y, targetCenter.z)
                );

                /* _grabberBody.setNextKinematicTranslation(
                    new RAPIER.Vector3(
                        targetCenter.x,
                        targetCenter.y,
                        targetCenter.z
                    )
                ); */

                /* const rigidBodyPosition = new THREE.Vector3().copy(
                    targetBody.translation()
                ); */
                // const direction = rigidBodyPosition.sub(point);
                /*                 const sphericalJointParams = RAPIER.JointData.spherical(
                    new RAPIER.Vector3(0, 0, 0),
                    direction
                ); */

                /* const fixedJointParams = RAPIER.JointData.fixed(
                    { x: 0.0, y: 0.0, z: 0.0 },
                    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
                    { x: 0.0, y: 0.0, z: 0.0 },
                    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 }
                ); */

                /* const fixedJointParams = RAPIER.JointData.fixed(
                    // { x: 0.0, y: 0.0, z: 0.0 },
                    { x: point.x, y: point.y, z: targetCenter.z },
                    // { x: targetCenter.x, y: targetCenter.y, z: targetCenter.z },
                    // point,
                    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
                    // { x: 0.0, y: 0.0, z: 0.0 },
                    // point,
                    // { x: point.x, y: point.y, z: targetCenter.z },
                    { x: targetCenter.x, y: targetCenter.y, z: targetCenter.z },
                    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 }
                ); */

                // NOTE: Working fixedJointParams
                const fixedJointParams = RAPIER.JointData.fixed(
                    { x: targetCenter.x, y: targetCenter.y, z: targetCenter.z },
                    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 },
                    { x: point.x, y: point.y, z: targetCenter.z },
                    { w: 1.0, x: 0.0, y: 0.0, z: 0.0 }
                );

                _jointHandle = this.rapier.createImpulseJoint(
                    // sphericalJointParams,
                    // prismaticJointParams,
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
            _mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
            _mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

            if (_isDragging) {
                this._updateGrabberBody(event);
            }
        });
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

    _initializeDragControls() {
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
    }

    _initializeObjects() {
        /* this.box = new Box({
            dimensions: [1, 1, 1],
            position: [0, 1, 0],
            physics: true
        }); */

        this.sphere = new Sphere({
            radius: 0.5,
            // position: [0, 1, -2],
            position: [0, 0, 0],
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
            // RAPIER.RigidBodyDesc.kinematicVelocityBased()
        );

        this._initializeObjects();
    }

    _updateGrabberBody(event) {
        if (_isDragging && _jointHandle) {
            // if (_isDragging) {
            _raycaster.setFromCamera(_mouse, this.camera);

            const boundingBox = new THREE.Box3().setFromObject(
                _currentIntersect.object
            );
            const targetCenter = new THREE.Vector3();
            boundingBox.getCenter(targetCenter);

            // Define a plane at z = 0 (or based on mesh position)
            const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, -2), 0);
            // const planeZ = new THREE.Plane(targetCenter, 0);
            const intersectPoint = new THREE.Vector3();

            _raycaster.ray.intersectPlane(planeZ, intersectPoint);

            _grabberBody.setNextKinematicTranslation(
                new RAPIER.Vector3(
                    intersectPoint.x,
                    intersectPoint.y,
                    intersectPoint.z
                )
            );

            /* _grabberBody.setNextKinematicTranslation(
                new RAPIER.Vector3(_mouse.x, _mouse.y, intersectPoint.z)
            ); */
        }
    }

    step() {
        this._dragControls?.update();

        if (this.rapier) {
            this.rapier.step();
            // this._updateGrabberBody();

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
