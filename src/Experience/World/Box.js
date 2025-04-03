import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d";

import Experience from "../Experience";

export default class Box {
    constructor({ dimensions, position = [0, 0, 0], physics = false } = {}) {
        if (!dimensions) {
            throw new Error("Unable to create Box, missing dimensions...");
        }

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.world = this.experience.world;

        this.dimensions = dimensions;
        this.position = position;
        this.physics = physics;

        // Setup
        this.setGeometry();
        this.setMaterial();
        this.setMesh();

        if (this.physics) {
            this.setRigidBody();
            this.setCollider();
        }
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(...this.dimensions);
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({ color: "red" });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(...this.position);

        this.scene.add(this.mesh);
    }

    setRigidBody() {
        this.rigidBody = this.world.rapier.createRigidBody(
            RAPIER.RigidBodyDesc.dynamic()
                .setTranslation(...this.position)
                .setCanSleep(false)
        );
    }

    setCollider() {
        const colliderDimensions = this.dimensions.map((value) => value / 2);

        this.collider = RAPIER.ColliderDesc.cuboid(...colliderDimensions)
            .setMass(1)
            .setRestitution(1.1);

        this.world.rapier.createCollider(this.collider, this.rigidBody);
    }

    animate() {
        this.mesh.position.copy(this.rigidBody.translation());
    }
}
