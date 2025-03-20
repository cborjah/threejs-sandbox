import * as THREE from "three";
import Experience from "../Experience";

export default class Particles {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Setup
        this.setGeometry();
        this.setMaterial();
        this.setPoints();
    }

    setGeometry() {
        // this.particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
        this.particlesGeometry = new THREE.BufferGeometry();

        const count = 5000;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10; // Values from -5 to 5
        }

        this.particlesGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
    }

    setMaterial() {
        this.particlesMaterial = new THREE.PointsMaterial();
        this.particlesMaterial.size = 0.02;
        this.particlesMaterial.sizeAttenuation = true;
        this.particlesMaterial.map = this.resources.items.particleTexture1;
    }
    setPoints() {
        this.particles = new THREE.Points(
            this.particlesGeometry,
            this.particlesMaterial
        );

        this.scene.add(this.particles);
    }
}
