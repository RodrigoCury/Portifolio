import gsap from 'gsap'
import { Vector3 } from 'three'

export default class Animations {
    /**
     * Constructot
     */

    constructor(_options) {
        // Options
        this.camera = _options.camera
        this.DOM = _options.DOM
        this.resources = _options.resources
        this.sizes = _options.sizes
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

        this.IDX = 0
        this.MAX_INDEX = 2



        // Setup
        this.setControls()
        this.setEventListeners()
        this.resources.on('ready', () => {

            this.homeAnimation()
            this.animateLights()
        })
    }

    setControls() {
        this.selectedBtn = (self, element) => {
            self.DOM.menuBtns.forEach(btn => {
                btn.classList.remove('selected')
            })
            element.classList.add('selected')
        }

        this.animations = {
            moveCamera: (self, element, rotationAngle, ease, camY, targetY, duration) => {
                gsap.to(this.camera, {
                    rotationAngle: rotationAngle,
                    duration: duration,
                    ease: ease
                })
                gsap.to(this.camera.instance.position, {
                    y: camY,
                    duration: duration,
                    ease: ease
                })
                gsap.to(this.camera.target, {
                    y: targetY,
                    duration: duration,
                    ease: ease
                })
                this.selectedBtn(self, element)
            },
        }

        this.menuProperties = [
            [-1.627, this.ease.power4, 2, 2, 2],
            [0.636, this.ease.circ, -3, -4, 2],
            [-1.267, this.ease.power3, -10, -10, 2],
        ]
    }

    setEventListeners() {
        // self for eventListener Scope Problems
        const self = this

        async function _btnClick(event) {
            console.log(event.target);
            self.IDX = parseInt(event.target.id)
            console.log(self.IDX);

            self.animations.moveCamera(self, self.DOM.menuBtns[self.IDX], ...self.menuProperties[self.IDX])

            self.DOM.menuBtns.forEach(b => {
                // remove BUTTONS event listener so the animations does not overlap
                b.removeEventListener('click', _btnClick, true)
                // set timeout so it returns after animation is over
                setTimeout(() => {
                    b.addEventListener('click', _btnClick, true)
                }, 2000);

            })
        }

        // add Event Listener for Mouse Wheel // Async for Timeout
        async function _wheel(event) {

            /**
             * Make Sure menu index is between constraints
             */

            if (event.deltaY < 0) {
                if (self.IDX !== 0) {
                    self.IDX--
                } else {
                    // return if it is off constraints so it does not remove event listener
                    return
                }

            } else {
                if (self.IDX !== self.MAX_INDEX) {
                    self.IDX++
                } else {
                    // return if it is off constraints so it does not remove event listener
                    return
                }
            }

            // Animate using self

            self.animations.moveCamera(self, self.DOM.menuBtns[self.IDX], ...self.menuProperties[self.IDX])


            // remove window event listener so the animations does not overlap
            window.removeEventListener('wheel', _wheel, true)

            // set timeout so it returns after animation is over
            setTimeout(() => {
                window.addEventListener('wheel', _wheel, true)
            }, 2000);
        }

        window.addEventListener('wheel', _wheel, true)

        this.DOM.menuBtns.forEach(btn => btn.addEventListener('click', _btnClick, true))

    }

    homeAnimation() {
        this.homePosition = new Vector3(0, 2, 0)

        this.time.on('tick', () => {
            let homeProjected = this.homePosition.clone()
            homeProjected.project(this.camera.instance)

            const translateX = `${homeProjected.x * this.sizes.width * 0.5}px`
            const translateY = `${-homeProjected.y * this.sizes.height * 0.5}px`
            this.DOM.homeDiv.style.transform = `translate(calc(${translateX}), calc(${translateY}))`
            this.DOM.content.style.transform = `translate(calc(${translateX}), calc(${translateY}))`

        })
    }

    animateLights() {
        this.time.on('tick', () => {
            this.world.lights.items.spotLight.target.position.x = Math.cos(this.time.elapsed * 0.00105) * 2.5
            this.world.lights.items.spotLight.target.position.y = Math.sin(this.time.elapsed * 0.00035) * 2.5
        })
    }
}