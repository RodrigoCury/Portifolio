import gsap from 'gsap'

export default class Animations {
    /**
     * Constructot
     */

    constructor(_options) {
        // Options
        this.camera = _options.camera
        this.DOM = _options.DOM
        this.resources = _options.resources
        this.time = _options.time
        this.world = _options.world
        this.debug = _options.debug

        // Animation Eases
        this.ease = {}
        this.ease.power4 = "power4.inOut"
        this.ease.power3 = "power3.inOut"
        this.ease.elastic = "elastic.out(1,0.3)"
        this.ease.circ = "circ.inOut"

        this.duration = {}
        this.duration.fast = 0.5
        this.duration.slow = 2
        this.duration.normal = 1

        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Animations")
            this.debugFolder.add(this.duration, 'fast', 0, 3, 0.01).name("Camera Fast")
            this.debugFolder.add(this.duration, 'slow', 0, 3, 0.01).name("Camera Slow")
            this.debugFolder.add(this.duration, 'normal', 0, 3, 0.01).name("Camera Normal")
        }

        // Setup
        this.resources.on("ready", () => {
            this.setControls()
            this.setEventListeners()
        })
    }
    setControls() {
        this.selectedBtn = (element) => {
            this.DOM.buttons.forEach(btn => {
                btn.element.classList.remove('selected')
            })
            element.classList.add('selected')
        }

        this.animations = {
            home: (element) => {
                const y = 0
                gsap.to(this.camera, {
                    rotationAngle: -Math.PI,
                    duration: this.duration.normal,
                    ease: this.ease.power4
                })
                gsap.to(this.camera.instance.position, {
                    y,
                    duration: this.duration.normal,
                    ease: this.ease.power4
                })
                gsap.to(this.camera.target, {
                    y,
                    duration: this.duration.normal,
                    ease: this.ease.power3
                })
                this.DOM.buttons.forEach(btn => {
                    gsap.to(btn.position, {
                        y,
                        duration: this.duration.slow,
                        ease: this.ease.power3
                    })
                })
                this.selectedBtn(element)
            },
            tech: (element) => {
                const y = -3.5
                gsap.to(this.camera, {
                    rotationAngle: 0,
                    duration: this.duration.normal,
                    ease: this.ease.power3
                })
                gsap.to(this.camera.instance.position, {
                    y,
                    duration: this.duration.normal,
                    ease: this.ease.power3
                })
                gsap.to(this.camera.target, {
                    y,
                    duration: this.duration.normal,
                    ease: this.ease.power3
                })
                this.selectedBtn(element)
                this.DOM.buttons.forEach(btn => {
                    gsap.to(btn.position, {
                        y: btn.position.y + y,
                        duration: this.duration.slow,
                        ease: this.ease.power3
                    })
                })
            }
        }
    }

    setEventListeners() {
        this.DOM.buttons[0].element.addEventListener('click', () => {
            this.animations.home(this.DOM.buttons[0].element)
        })
        this.DOM.buttons[1].element.addEventListener('click', () => {
            this.animations.tech(this.DOM.buttons[1].element)
        })
    }
}