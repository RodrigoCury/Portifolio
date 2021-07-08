import gsap from 'gsap/gsap-core'
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
        this.config = _options.config

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

        this.mouseIsOn = undefined

        this.mouseClick = {
            eMail: () => { window.location.href = 'mailto:rodrigocury@ufu.br' },
            linkedIn: () => window.open('https://www.linkedin.com/in/rodrigo-cury-almeida-baptista-353bb31a5/', '_blank', 'noopener noreferrer'),
            gitHub: () => window.open('https://github.com/RodrigoCury', '_blank', 'noopener noreferrer'),
        }

        // Update Raycaster Position
        this.resources.on("ready", () => {
            this.currentTechName = undefined // Used For Smooth SpotLight Animation
            this.hasChangedFlag = false // Used For Smooth SpotLight Animation

            this.time.on("tick", () => {

                /**
                 * Raycast If is on the right Page
                 */

                // Only On tech pages
                if (this.config.screenIsOn == 'technologies') {
                    this.raycaster.setFromCamera(this.mouse, this.camera.instance)
                    const intersect = this.raycaster.intersectObject(this.world.logosArea, true)

                    this.world.holograms.container.children.forEach(child => {
                        if (typeof intersect[0] !== 'undefined' && child.name == intersect[0].object.name) {
                            child.visible = true

                            if (child.name !== this.currentTechName) {
                                this.currentTechName = child.name
                                this.hasChangedFlag = true
                            } else {
                                this.hasChangedFlag = false
                            }

                            this.world.holograms.cone.visible = true
                            this.world.lights.items.spotLight.target.intersected = true
                        } else {
                            child.visible = false
                        }

                        if (intersect.length === 0) {
                            this.world.lights.items.spotLight.target.intersected = false
                            this.world.holograms.cone.visible = false
                            this.world.lights.items.spotLight.angle = Math.PI / 8
                        }

                        if (this.hasChangedFlag && typeof intersect[0] !== 'undefined') {
                            gsap.to(this.world.lights.items.spotLight.target.position, {
                                x: intersect[0].object.position.x,
                                y: intersect[0].object.position.y,
                                z: intersect[0].object.position.z,
                                duration: 1,
                            })
                            gsap.to(this.world.lights.items.spotLight, {
                                angle: Math.PI / 12
                            })
                        }
                    })
                }

                // Only on contact Page
                if (this.config.screenIsOn === 'contact') {
                    this.raycaster.setFromCamera(this.mouse, this.camera.instance)
                    const intersect = this.raycaster.intersectObject(this.world.contactArea, true)

                    if (intersect.length > 0) {
                        this.mouseIsOn = intersect[0].object.name
                        this.DOM.contact.classList.add('contact-cursor')
                    } else {
                        this.DOM.contact.classList.remove('contact-cursor')
                        this.mouseIsOn = undefined
                    }
                }

            })
        })

        window.addEventListener('click', () => {
            if (this.mouseIsOn && this.config.screenIsOn === 'contact') {
                this.mouseClick[this.mouseIsOn]()
            }
        })

    }

}