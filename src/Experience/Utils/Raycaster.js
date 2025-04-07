import * as THREE from "three";

import Experience from "../Experience";
import RAPIER from "@dimforge/rapier3d";

export default class Raycaster {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.world = this.experience.world;
        this.sizes = this.experience.sizes;
        this.time = this.experience.time;
        this.camera = this.experience.camera;

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.currentIntersect = null;
        this.jointHandle = null;

        window.addEventListener("mousemove", this._handleMouseMove.bind(this));
        window.addEventListener("click", this._handleClick.bind(this));

        this.time.on("tick", this._checkRaycaster.bind(this));
    }

    _handleMouseMove(event) {
        this.pointer.x = (event.clientX / this.sizes.width) * 2 - 1;
        this.pointer.y = -(event.clientY / this.sizes.height) * 2 + 1;
    }

    _handleClick(event) {
        if (this.currentIntersect && this.world.grabberBody) {
            const point = this.currentIntersect.point;
            const rigidBody = this.currentIntersect.object.userData.rigidBody;

            this.world.grabberBody.setNextKinematicTranslation(
                new RAPIER.Vector3(point.x, point.y, point.z)
            );

            const grabberBodyPosition = new THREE.Vector3().copy(
                this.world.grabberBody.translation()
            );
            const rigidBodyPosition = new THREE.Vector3().copy(
                rigidBody.translation()
            );
            const direction = rigidBodyPosition.sub(point);
            /* const direction = new RAPIER.Vector3(
                rigidBodyPosition.x - point.x,
                rigidBodyPosition.y - point.y,
                rigidBodyPosition.z - point.z
            ); */

            // NOTE: Fixed joint doesn't work...
            // const jointParams = RAPIER.JointData.fixed(

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

            console.log("Added impluse joint!", this.jointHandle);
        }
    }

    _checkRaycaster() {
        this.raycaster.setFromCamera(this.pointer, this.camera.instance);

        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length) {
            this.currentIntersect = intersects[0];
        } else {
            this.currentIntersect = null;
        }
    }
}
