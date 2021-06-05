import * as THREE from 'three'
import gsap from 'gsap'

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
        this.FAR = 20
        this.topFOV = this.FOV * this.sizes.viewport.width / this.sizes.viewport.height

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Camera")
        }
        this.setZoom()
        this.setAngle()
        this.setInstance()
        this.setControls()
    }

    setZoom() {
        this.distance = 5
    }

    setAngle() {
        // Set Up
        this.target = new THREE.Vector3(0, 0, 0)
        this.rotationAngle = -Math.PI



        // Debug
        if (this.debug) {
            this.debugFolder.add(this, 'rotationAngle', -Math.PI, Math.PI, 0.001)
            this.debugFolder.add(this, 'distance', 0, 10, 0.001)
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
        this.instance.lookAt(new THREE.Vector3(0, 0, 0))

        this.container.add(this.instance)

        // Resize event
        this.sizes.on('resize', () => {
            this.topFOV = this.FOV * this.sizes.viewport.width / this.sizes.viewport.height
            this.instance.aspect = this.sizes.viewport.width / this.sizes.viewport.height
            this.instance.updateProjectionMatrix()
        })

        this.time.on('tick', () => {
            this.instance.position.x = Math.sin(this.rotationAngle) * this.distance
            this.instance.position.z = Math.cos(this.rotationAngle) * this.distance
            this.instance.lookAt(this.target)
        })
    }

    setControls() {
        this.ease = "back.inOut(2.5)"
        this.movementFunction = {
            ArrowRight: () => {
                gsap.to(this, {
                    rotationAngle: this.rotationAngle + Math.PI * 0.125,
                    duration: 1,
                    ease: this.ease,
                })
            }
            ,
            ArrowLeft: () => gsap.to(this, {
                rotationAngle: this.rotationAngle - Math.PI * 0.125,
                duration: 1,
                ease: this.ease,
            }),
            ArrowUp: () => {
                gsap.to(this.instance.position, {
                    y: this.instance.position.y + 1.5,
                    duration: 1,
                    ease: this.ease,
                })
                gsap.to(this.target, {
                    y: this.target.y + 1.5,
                    duration: 1,
                    ease: this.ease,
                })
            },
            ArrowDown: () => {
                gsap.to(this.instance.position, {
                    y: this.instance.position.y - 1.5,
                    duration: 1,
                    ease: this.ease,
                })
                gsap.to(this.target, {
                    y: this.target.y - 1.5,
                    duration: 1,
                    ease: this.ease,
                })

            },
        }
        window.addEventListener('keydown', event => {
            if (Object.keys(this.movementFunction).includes(event.key)) {
                this.movementFunction[event.key]()
            }
        })
    }
}