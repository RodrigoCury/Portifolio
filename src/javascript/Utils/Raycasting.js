import { Raycaster, Vector2 } from 'three'

export default class Raycasting {
    /**
     * Constructor
     */

    constructor(_options) {
        // Options
        this.camera = _options.camera
        this.resources = _options.resources
        this.time = _options.time
        this.world = _options.world
        this.DOM = _options.DOM
        this.debug = _options.debug

        // Setup
        this.setMouse()
        this.setRaycast()
    }

    setMouse() {
        // Update Mouse Position
        this.mouse = new Vector2()

        window.addEventListener('mousemove', event => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
        }, false)
    }

    setRaycast() {
        // Setup Raycaster
        this.raycaster = new Raycaster()

        // Update Raycaster Position
        this.resources.on("ready", () => {
            this.time.on("tick", () => {
                this.raycaster.setFromCamera(this.mouse, this.camera.instance)
                const intersects = this.raycaster.intersectObjects(this.world.logosArea.children, true)
            })
        })
    }

}