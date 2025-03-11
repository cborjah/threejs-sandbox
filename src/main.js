import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/*********
 * Sizes *
 *********/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

/********
 * Base *
 ********/

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**********
 * Models *
 **********/

// Box
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

/**********
 * Camera *
 **********/

// Base Camera
const camera = new THREE.PerspectiveCamera(
    75, // fov
    sizes.width / sizes.height, // aspect
    0.1, // near
    100 // far
);

camera.position.z = 3;
scene.add(camera);

/************
 * Controls *
 ************/
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/************
 * Renderer *
 ************/
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Locks pixel ratio

/*************
 * Listeners *
 *************/
window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix(); // Required for changes to take effect

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Locks pixel ratio
});

/***********
 * Animate *
 ***********/
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;

    previousTime = elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    /**
     * requestAnimationFrame is to call the function provided on the next frame.
     * This will be called on each frame.
     *
     * * Need to adapt to the framerate or else the speed of the animations will
     * * differ based on the refresh rate of the device.
     */
    window.requestAnimationFrame(tick); // Call tick again on the next frame
};

tick();
