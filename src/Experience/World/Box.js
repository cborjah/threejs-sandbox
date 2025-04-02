import * as THREE from "three";

import Experience from "../Experience";

export default class Box {
    constructor(position) {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.dimensions = [1, 1, 1];
        this.position = position || [0, 0, 0];

        // Setup
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
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
}
