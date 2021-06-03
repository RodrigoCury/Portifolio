import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import { Power1 } from 'gsap/gsap-core'

export default class Camera {
    /**
     * Constructor
     */

    constructor(_options) {

        // Options
        this.time = _options.time
        this.sizes = _options.sizes
        this.renderer = _options.renderer
        this.debug = _options.debug
        this.config = _options.config

        // Setup
        this.FOV = 50
        this.NEAR = 0.1
        this.FAR = 10

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Camera")
        }

        this.setAngle()
        this.setInstance()
        this.setOrbitControls()
    }

    setAngle() {
        // Set Up
        this.position = new THREE.Vector3(0, 0, 5)
        this.target = new THREE.Vector3(0, 0, 0)

        // Debug
        if (this.debug) {
            this.debugFolder.add(this.position, 'x', -5, 5, 0.001)
            this.debugFolder.add(this.position, 'y', -5, 5, 0.001)
            this.debugFolder.add(this.position, 'z', -5, 5, 0.001)
        }
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            this.FOV,
            this.sizes.viewport.width / this.sizes.viewport.height,
            this.NEAR,
            this.FAR
        )

        this.instance.up.set(0, 1, 0)
        this.instance.position.copy(this.position)
        this.instance.lookAt(new THREE.Vector3(0, 0, 0))

        this.container.add(this.instance)

        // Resize event
        this.sizes.on('resize', () => {
            this.instance.aspect = this.sizes.viewport.width / this.sizes.viewport.height
            this.instance.updateProjectionMatrix()
        })


    }


    setOrbitControls() {
        // Setuo
        this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement)
        this.orbitControls.enabled = true
        this.orbitControls.enableKeys = false
        this.orbitControls.zoomSpeed = 0.5

        this.flag = true
        // Time tick
        this.time.on('tick', () => {
            if (this.orbitControls.enabled) {
                this.orbitControls.update()
                if (this.flag) {
                    this.instance.lookAt(new THREE.Vector3(3.3, 0, 0))
                    this.flag = false
                }
            } else {
                this.instance.position.copy(this.position)
                this.instance.lookAt(this.target)
            }
        })

        // Debug
        if (this.debug) {
            this.debugFolder.add(this.orbitControls, 'enabled').name("Enable OrbitControls")
        }
    }
}