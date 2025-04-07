import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d";

import Experience from "../Experience";

export default class Sphere {
    constructor({
        radius,
        widthSegments,
        heightSegments,
        phiStart,
        thetaStart,
        position = [0, 0, 0],
        physics = false
    } = {}) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.world = this.experience.world;

        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.phiStart = phiStart;
        this.thetaStart = thetaStart;
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
        this.geometry = new THREE.SphereGeometry(
            this.radius,
            this.widthSegments,
            this.heightSegments,
            this.phiStart,
            this.thetaStart
        );
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
        this.mesh.userData.rigidBody = this.rigidBody;
    }

    setCollider() {
        this.collider = RAPIER.ColliderDesc.ball(this.radius)
            .setMass(1)
            .setRestitution(1.1);
        this.mesh.userData.collider = this.collider;

        this.world.rapier.createCollider(this.collider, this.rigidBody);
    }

    animate() {
        this.mesh.position.copy(this.rigidBody.translation());
    }
}
