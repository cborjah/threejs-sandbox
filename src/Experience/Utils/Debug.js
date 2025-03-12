import GUI from "lil-gui";

export default class Debug {
    constructor() {
        /**
         * User can enable the debug console by appending
         * '#debug' to the end of the URL.
         */
        this.active = window.location.hash === "#debug";

        if (this.active) {
            const gui = new GUI();
        }
    }
}
