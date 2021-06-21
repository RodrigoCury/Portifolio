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
        this.ease.back = "back.out(1.7)"

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
        this.MAX_INDEX = -1



        // Setup
        this.setControls()
        this.setEventListeners()
        this.resources.on('ready', () => {

            this.homeAnimation()
            this.animateLights()
            this.setAnimationsProps()
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
                // Rotate Camera
                gsap.to(this.camera, {
                    rotationAngle: this.camera.rotationAngle + rotationAngle,
                    duration,
                    ease
                })

                // Move Camera
                gsap.to(this.camera.instance.position, {
                    y: camY,
                    duration,
                    ease
                })

                // Move Camera Target
                gsap.to(this.camera.target, {
                    y: targetY,
                    duration,
                    ease
                })
                // this.selectedBtn(self, element)
            },
        }
    }

    setAnimationsProps() {
        this.animationsProps = []

        this.DOM.firstPositions.forEach(el => {
            // Automatically increment MaxIndex
            this.MAX_INDEX++

            // Push to 
            this.animationsProps.push([
                el.element, Math.PI / 4, this.ease.power3, el.position.y, el.position.y, 1.5,
            ])
        })

        this.world.container.children.forEach(child => {
            // Automatically increment MaxIndex
            this.MAX_INDEX++

            // Push to 

            this.animationsProps.push([
                undefined, Math.PI / 4, this.ease.power3, child.position.y, child.position.y, 1.5,
            ])
        })

        this.DOM.secondPositions.forEach(el => {
            // Automatically increment MaxIndex
            this.MAX_INDEX++

            // Push to 
            this.animationsProps.push([
                el.element, Math.PI / 4, this.ease.power3, el.position.y, el.position.y, 1,
            ])
        })
    }

    setEventListeners() {
        // // self for eventListener Scope Problems
        const self = this

        // Wheel Event Function // Async for timeout
        async function _wheel(event) {

            /**
             * Make Sure menu index is between constraints
             */

            if (event.deltaY < 0) {
                if (self.IDX !== 0) {
                    self.IDX--
                    self.animationsProps[self.IDX][1] = -Math.abs(self.animationsProps[self.IDX][1])
                } else {
                    // return if it is off constraints so it does not remove event listener
                    return
                }

            } else {
                if (self.IDX !== self.MAX_INDEX) {
                    self.IDX++
                    self.animationsProps[self.IDX][1] = Math.abs(self.animationsProps[self.IDX][1])
                } else {
                    // return if it is off constraints so it does not remove event listener
                    return
                }
            }

            self.animations.moveCamera(self, ...self.animationsProps[self.IDX])


            // remove window event listener so the animations does not overlap
            window.removeEventListener('wheel', _wheel, true)

            // set timeout so it returns after animation is over
            setTimeout(() => {
                window.addEventListener('wheel', _wheel, true)
            },
                self.animationsProps[self.IDX][5] * 1000) // Seconds for Timeout
        }

        window.addEventListener('wheel', _wheel, true)

        // this.DOM.menuBtns.forEach(btn => btn.addEventListener('click', _btnClick, true))

    }

    homeAnimation() {
        // this.homePosition = new Vector3(0, 2, 0)

        this.time.on('tick', () => {
            [...this.DOM.firstPositions,...this.DOM.secondPositions].forEach(el => {
                let projected = el.position.clone()
                projected.project(this.camera.instance)

                const translateX = `${projected.x * this.sizes.width * 0.5}px`
                const translateY = `${-projected.y * this.sizes.height * 0.5}px`
                el.element.style.transform = `translate(${translateX}, ${translateY})`
            })
        })
    }

    animateLights() {
        this.time.on('tick', () => {
            this.world.lights.items.spotLight.target.position.x = Math.cos(this.time.elapsed * 0.00105) * 2.5
            this.world.lights.items.spotLight.target.position.y = Math.sin(this.time.elapsed * 0.00035) * 2.5
        })
    }
}