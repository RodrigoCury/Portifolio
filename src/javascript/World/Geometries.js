import { TorusGeometry } from "three"

export default class Geometries {
    /**
     * Constructor
     */

    constructor(_options) {
        // Options
        this.debug = _options.debug

        // Debug 
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Geometries")
            // this.debugFolder.open()
        }

        // Setup
        this.items = {}

        this.setTorus()
    }

    setTorus(){
        this.items.torus = new TorusGeometry(
            .12,
            .01,
            8,
            64
        )
    }
}