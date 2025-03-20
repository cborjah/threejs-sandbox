import Experience from "../Experience";
import Box from "./Box";
import Particles from "./Particles";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.resources = this.experience.resources;

        // Setup
        this.box = new Box();

        this.resources.on("ready", () => {
            this.particles = new Particles();
        });
    }
}
