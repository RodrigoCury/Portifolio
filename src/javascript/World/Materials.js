import * as THREE from 'three'

export default class Materials {
    /**
     * Constructor
     */

    constructor(_options) {

        // Options
        this.resourses = _options.resources
        this.debug = _options.debug

        // Debug 
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Materials")
            // this.debugFolder.open()
        }

        // Setup
        this.items = {}

        this.setBases()
    }

    setBases() {
        this.items.dnaMaterial = new THREE.MeshStandardMaterial({
            color: "white",
            wireframe: false,
            metalness: 0.7,
            roughness: 0.4,
        })
    }
}