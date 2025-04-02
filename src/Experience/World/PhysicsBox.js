import RAPIER from "@dimforge/rapier3d";
import Experience from "../Experience";
import Box from "./Box";

export default class PhysicsBox extends Box {
    constructor(position) {
        super(position);

        this.experience = new Experience();
        this.world = this.experience.world;

        // Setup
        this.setRigidBody();
        this.setCollider();
    }

    setRigidBody() {
        this.boxBody = this.world.rapier.createRigidBody(
            RAPIER.RigidBodyDesc.dynamic()
                // .setTranslation(...this.position)
                .setTranslation(0, 1, 0)
                .setCanSleep(false)
        );
    }

    setCollider() {
        this.boxCollider = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
            .setMass(1)
            .setRestitution(1.1);

        this.world.rapier.createCollider(this.boxCollider, this.boxBody);
    }

    animate() {
        this.mesh.position.copy(this.boxBody.translation());
    }
}
