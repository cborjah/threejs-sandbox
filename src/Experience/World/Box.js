import * as THREE from "three";

import Experience from "../Experience";

export default class Box {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // Setup
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({ color: "red" });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }
}
