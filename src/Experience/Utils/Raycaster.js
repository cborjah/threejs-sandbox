import * as THREE from "three";

import Experience from "../Experience";
import RAPIER from "@dimforge/rapier3d";

export default class Raycaster {
    // TODO: Convert variables to PRIVATE
    //       Add _ to private methods
    //       Add JSDoc comments

    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.world = this.experience.world;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.camera = this.experience.camera;

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2(); // Mouse pointer's x and y coordinates
        this.currentIntersect = null; // First intersection made by ray
        this.jointHandle = null; // Impulse joint
        this.isDragging = false;
        this.dragPlane = new THREE.Plane();
        this.offset = new THREE.Vector3();
        this.intersection = new THREE.Vector3();

        window.addEventListener("mousemove", this.handleMouseMove.bind(this));
        window.addEventListener("mousedown", this.handleClick.bind(this));
        window.addEventListener("mouseup", this.handleMouseUp.bind(this));

        this.time.on("tick", this.checkRaycaster.bind(this));
    }

    handleMouseMove(event) {
        this.pointer.x = (event.clientX / this.sizes.width) * 2 - 1;
        this.pointer.y = -(event.clientY / this.sizes.height) * 2 + 1;

        if (
            this.isDragging &&
            this.raycaster.ray.intersectPlane(this.dragPlane, this.intersection)
        ) {
            this.currentIntersect.object.position.copy(
                // this.currentIntersect.object.userData.rigidBody.position.copy(
                this.intersection.sub(this.offset)
            );
        }
    }

    handleMouseUp() {
        this.isDragging = false;

        if (this.jointHandle) {
            this.removeJoint();
        }
    }

    removeJoint() {
        this.world.rapier.removeImpulseJoint(this.jointHandle, true);
        this.jointHandle = null;
    }

    handleClick(event) {
        if (this.currentIntersect && this.world.grabberBody) {
            const point = this.currentIntersect.point;
            const rigidBody = this.currentIntersect.object.userData.rigidBody;

            this.isDragging = true;

            // Create plane from face normal and point
            this.dragPlane.setFromNormalAndCoplanarPoint(
                this.camera.instance.getWorldDirection(this.dragPlane.normal),
                this.currentIntersect.point
            );

            const rigidBodyPosition = new THREE.Vector3().copy(
                rigidBody.translation()
            );

            this.offset
                .copy(this.currentIntersect.point)
                .sub(rigidBodyPosition);

            /* this.world.grabberBody.setNextKinematicTranslation(
                new RAPIER.Vector3(point.x, point.y, point.z)
            );

            const grabberBodyPosition = new THREE.Vector3().copy(
                this.world.grabberBody.translation()
            );
            const rigidBodyPosition = new THREE.Vector3().copy(
                rigidBody.translation()
            );
            const direction = rigidBodyPosition.sub(point);

            const jointParams = RAPIER.JointData.spherical(
                new RAPIER.Vector3(0, 0, 0),
                direction
            );

            this.jointHandle = this.world.rapier.createImpulseJoint(
                jointParams,
                this.world.grabberBody,
                rigidBody,
                true
            );

            console.log("Added impluse joint!", this.jointHandle); */
        }
    }

    checkRaycaster() {
        this.raycaster.setFromCamera(this.pointer, this.camera.instance);

        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length) {
            this.currentIntersect = intersects[0];
        } else {
            this.currentIntersect = null;
        }
    }
}
