import Box from "./Box";
import Particles from "./Particles";

export default class World {
    constructor() {
        // Setup
        this.box = new Box();
        this.particles = new Particles();
    }
}
