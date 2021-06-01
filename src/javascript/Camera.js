import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import { Power1 } from 'gsap/EasePack'

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
        this.FOV = 40
        this.NEAR = 0.1
        this.FAR = 40

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.target = new THREE.Vector3(0, 0, 0)
        this.targetEased = new THREE.Vector3(0, 0, 0)
        this.easing = 0.15

        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Camera")
        }

        this.setAngle()
        this.setInstance()
        this.setZoom()
        this.setPan()
        this.setOrbitControls()
    }

    setAngle() {
        // Set Up
        this.angle = {
            // Items
            items: {
                default: new THREE.Vector3(1, -1, 1),
                projects: new THREE.Vector3(0.5, -1.5, 1.5)
            },

            // Value
            value: new THREE.Vector3(),

            // Set Method
            set: _name => {

                const angle = this.angle.items[_name]

                if (typeof angle !== 'undefined') {

                    gsap.to(this.angle.value, {
                        x: angle.x,
                        y: angle.y,
                        z: angle.z,
                        ease: Power1.easeInOut
                    })
                }
            }
        }

        this.angle.value.copy(this.angle.items.default)

        // Debug
        if (this.debug) {
            this.debugFolder.add(this, 'easing', 0, 1, 0.0001).name("Easing")
            this.debugFolder.add(this.angle.value, 'x', -2, 2, 0.001).name("AngleX").listen()
            this.debugFolder.add(this.angle.value, 'y', -2, 2, 0.001).name("AngleY").listen()
            this.debugFolder.add(this.angle.value, 'z', -2, 2, 0.001).name("AngleZ").listen()
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
        this.instance.position.copy(this.angle.value)
        this.instance.lookAt(new THREE.Vector3(0, 0, 0))

        this.container.add(this.instance)

        // Resize event
        this.sizes.on('resize', () => {
            this.instance.aspect = this.sizes.viewport.width / this.sizes.viewport.height
            this.instance.updateProjectionMatrix()
        })

        // Time tick
        this.time.on('tick', () => {
            if (!this.OrbitControls.enabled) {
                // Move with Ease
                this.targetEased.x += (this.target.x - this.targetEased.x) * this.easing
                this.targetEased.y += (this.target.y - this.targetEased.y) * this.easing
                this.targetEased.z += (this.target.z - this.targetEased.z) * this.easing

                // Apply Zoom
                this.instance.position
                    .copy(this.targetEased)
                    .add(
                        this.angle.value
                            .clone()
                            .normalize()
                            .multiplyScalar(this.zoom.distance)
                    )

                // Apply new Direction
                this.instance.lookAt(this.targetEased)

                // Apply Pan
                this.instance.position.x += this.pan.value.x
                this.instance.position.y += this.pan.value.y
            }
        })
    }

    setZoom() {
        // Setup

        this.zoom = {
            easing: 0.1,
            minDistance: 14,
            amplitude: 15,
            value: 0.5,
            targetValue: this.zomm.value,
            distance: this.zoom.minDistance + this.zoom.amplitude * this.zoom.value
        }

        document.addEventListener('mousewheel', _event => {
            this.zomm.targetValue += _event.deltaY * 0.001
            this.zoom.targetValue = Math.min(Math.max(this.zoom.targetValue, 0), 1)
        }, { passive: true })

        // Touch
        this.zoom.touch = {
            startDistante: 0,
            startValue: 0,
        }

        this.renderer.domElement.addEventListener('touchstart', _event => {
            if (_event.touches.length === 2) {
                this.zoom.startDistante = Math.hypot(
                    _event.touches[0].clientX - _event.touches[1].clientX,
                    _event.touches[0].clientX - _event.touches[1].clientX
                )
                this.zoom.touch.startValue = this.zoom.targetValue
            }
        })

        this.renderer.domElement.addEventListener('touchmove', _event => {
            if (_event.touches.length === 2) {
                _event.preventDefault()

                const distance = Math.hypot(
                    _event.touches[0].clientX - _event.touches[1].clientX,
                    _event.touches[0].clientX - _event.touches[1].clientX
                )
                const ratio = distance / this.zoom.touch.startDistante

                this.zoom.targetValue = this.zoom.touch.startValue - (ratio - 1)
                this.zoom.targetValue = Math.min(Math.max(this.zoom.targetValue, 0), 1)
            }
        })

        // Time Tick
        this.time.on('tick', () => {
            this.zoom.value += (this.zoom.targetValue - this.zoom.value) * this.zoom.easing
            this.zoom.distance = this.zoom.minDistance + this.zoom.amplitude * this.zoom.value
        })
    }

    setPan() {
        this.pan = {
            // Setup configs
            enabled: false,
            active: false,
            easing: 0.1,
            start: { x: 0, y: 0, },
            value: { x: 0, y: 0 },
            targetValue: {
                x: this.pan.value.x,
                y: this.pan.value.y
            },

            // Limiter
            raycaster: new THREE.Raycaster(),
            mouse: new THREE.Vector2(),
            needsUpdate: false,
            hitMesh: new THREE.Mesh(
                new THREE.PlaneBufferGeometry(100, 100, 1, 1),
                new THREE.MeshBasicMaterial({ color: '#ffff00', wireframe: true, visible: false })
            ),

            // Methods
            reset: () => {
                this.pan.targetValue.x = 0
                this.pan.targetValue.y = 0
            },

            enable: () => {
                this.pan.enabled = true

                // Update Cursor
                this.renderer.domElement.classList.add('has-cursor-grab')
            },

            disable: () => {
                this.pan.enabled = false

                // Update Cursor
                this.renderer.domElement.classList.remove('has-cursor-grab')
            },

            down: (_x, _y) => {
                if (!this.pan.enabled) { return }

                // Update Cursor
                this.renderer.domElement.classList.add("has-cursor-grabbing")

                // Activate
                this.pan.active = true

                // Update Mouse Position
                this.pan.mouse.x = (_x / this.sizes.viewport.width) * 2 - 1
                this.pan.mouse.y = -(_y / this.sizes.viewport.height) * 2 + 1

                this.pan.raycaster.setFromCamera(this.pan.mouse, this.instance)

                const intersect = this.pan.raycaster.intersectObject(this.pan.hitMesh)

                if (intersect) {
                    this.pan.start.x = intersect.point.x
                    this.pan.start.y = intersect.point.y
                }
            },

            move: (_x, _y) => {
                if (!this.pan.enabled) { return }

                if (!this.pan.active) { return }

                // Update Mouse Position
                this.pan.mouse.x = (_x / this.sizes.viewport.width) * 2 - 1
                this.pan.mouse.y = -(_y / this.sizes.viewport.height) * 2 + 1

                // Call Update
                this.pan.needsUpdate = true
            },

            up: function () {
                // Deactivate Pan
                this.pan.active = false

                // Update Cursor
                this.renderer.domElement.classList.remove('has-cursor-grabbing')
            }
        }

        // Add hitMesh to container
        this.container.add(this.pan.hitMesh)

        /**
         * Events
         */

        // Mouse
        window.addEventListener('mousedown', _event => this.pan.down(_event.clientX, _event.clientY))
        window.addEventListener('mousemove', _event => this.pan.move(_event.clientX, _event.clientY))
        window.addEventListener('mouseup', _event => this.pan.up())

        // Touch
        this.renderer.domElement.addEventListener('touchstart', _event => {
            if (_event.touches.length === 1) {
                this.pan.down(_event.touches[0].clientX, _event.touches[0].clientY)
            }
        })

        this.renderer.domElement.addEventListener('touchmove', (_event) => {
            if (_event.touches.length === 1) {
                this.pan.move(_event.touches[0].clientX, _event.touches[0].clientY)
            }
        })

        this.renderer.domElement.addEventListener('touchend', () => this.pan.up())

        // Time Tick

        this.time.on('tick', () => {
            // Check if Pan is active and needs Update
            if (this.pan.active && this.pan.needsUpdate) {
                this.pan.raycaster.setFromCamera(this.pan.mouse, this.instance)

                const intersect = this.pan.raycaster.intersectObject(this.pan.hitMesh)

                if (intersect) {
                    this.pan.targetValue.x = - (intersect.point.x - this.pan.start.x)
                    this.pan.targetValue.y = - (intersect.point.z - this.pan.start.z)
                }

                // Doesn't need Update anymore
                this.pan.needsUpdate = false
            }

            // Update value and apply easing
            this.pan.value.x += (this.pan.targetValue.x - this.pan.value.x) * this.pan.easing
            this.pan.value.y += (this.pan.targetValue.y - this.pan.value.y) * this.pan.easing
        })
    }

    setOrbitControls() {
        // Setuo
        this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement)
        this.orbitControls.enabled = false
        this.orbitControls.enableKeys = false
        this.orbitControls.zoomSpeed = 0.5

        // Debug
        if (this.debug) {
            this.debugFolder.add(this.orbitControls, 'enabled').name("Enable OrbitControls")
        }
    }
}