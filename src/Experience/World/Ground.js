import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d";
import Experience from "../Experience";

export default class Ground {
    constructor({ dimensions, position, physics = false } = {}) {
        if (!dimensions) {
            throw new Error("Unable to create Ground, missing dimensions...");
        }

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.world = this.experience.world;

        this.dimensions = dimensions;
        this.position = position ?? [0, 0, 0];
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
        this.material = new THREE.MeshBasicMaterial({ color: "black" });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(...this.position);

        this.scene.add(this.mesh);
    }

    setRigidBody() {
        this.rigidBody = this.world.rapier.createRigidBody(
            RAPIER.RigidBodyDesc.fixed().setTranslation(...this.position)
        );
    }

    setCollider() {
        this.collider = RAPIER.ColliderDesc.cuboid(50, 0.5, 50);
        this.world.rapier.createCollider(this.collider, this.rigidBody);
    }
}
