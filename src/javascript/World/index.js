import * as THREE from 'three'

export default class {
    constructor(_options) {
        // Options
        this.config = _options.config
        this.debug = _options.debug
        this.resources = _options.resources
        this.time = _options.time
        this.sizes = _options.sizes
        this.camera = _options.camera
        this.renderer = _options.renderer
        this.passes = _options.passes

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("World")
            // this.debugFolder.open()
        }

        // Setup
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        // this.setAxes()
        // this.setSounds()
        // this.setControls()
        // this.setFloor()
        // this.setStartingScreen()
    }

    start() {
        window.setTimeout(function () {
            this.camera.pan.enable()
        }, 2000)
    }
}