import Experience from "../Experience";
import Box from "./Box";
import Particles from "./Particles";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        // Debug
        this.debug = this.experience.debug;

        if (this.debug) {
            this.setDebugFolders();
        }

        // Setup
        this.box = new Box();

        // this.resources.on("ready", () => {
        // if (this.worldDebugOptions.particles) {
        // this.particles = new Particles();
        // }
        // });
    }

    setDebugFolders() {
        this.debugWorldFolder = this.debug.gui.addFolder("World");

        this.worldDebugOptions = {
            box: true,
            particles: false
        };

        this.debugWorldFolder
            .add(this.worldDebugOptions, "particles")
            .onChange((isEnabled) => {
                if (isEnabled) {
                    this.particles = new Particles();
                } else if (this.particles) {
                    this.particles.destroy();
                    this.particles = null;
                }
            });
    }
}
