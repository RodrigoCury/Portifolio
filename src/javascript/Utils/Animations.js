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
            camera: (element, rotationAngle, ease, y, cameraDuration, buttonDuration) => {
                gsap.to(this.camera, {
                    rotationAngle: rotationAngle,
                    duration: cameraDuration,
                    ease: ease
                })
                gsap.to(this.camera.instance.position, {
                    y: y,
                    duration: cameraDuration,
                    ease: ease
                })
                gsap.to(this.camera.target, {
                    y: y,
                    duration: cameraDuration,
                    ease: ease
                })
                this.DOM.buttons.forEach(btn => {
                    gsap.to(btn.position, {
                        y: y + btn.offset,
                        duration: buttonDuration,
                        ease: this.ease.power3
                    })
                })
                this.selectedBtn(element)
            },
        }
    }

    setEventListeners() {
        this.menuIndex = 0
        this.DOM.buttons[0].element.addEventListener('click', () => {
            this.animations.camera(
                this.DOM.buttons[0].element,
                -Math.PI,
                this.ease.power3,
                0,
                this.duration.slow,
                this.duration.normal
            )

            this.menuIndex = 0
        })
        this.DOM.buttons[1].element.addEventListener('click', () => {
            this.animations.camera(
                this.DOM.buttons[1].element,
                -Math.PI * 1.5,
                this.ease.circ,
                -3.5,
                this.duration.slow,
                this.duration.normal,
            )

            this.menuIndex = 1
        })
        this.DOM.buttons[2].element.addEventListener("click", () => {
            this.animations.camera(
                this.DOM.buttons[2].element,
                -2 * Math.PI - 1.3,
                this.ease.power4,
                -10,
                this.duration.slow,
                this.duration.normal,
            )
        })
    }
}