import gsap from 'gsap'
import { Vector2, Vector3 } from 'three'

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
        this.ease.slow = "slow (0.7, 0.1, false)"
        this.ease.power4 = "power4.in"
        this.ease.power3 = "power3.in"
        this.ease.power3Out = "power3.out"
        this.ease.elastic = "elastic.out(1,0.3)"
        this.ease.circ = "circ.in"
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
        this.animateCamera()
        this.animateScrollDownDiv()
        this.resources.on('ready', () => {

            this.homeAnimation()
            this.animateLights()
            this.setAnimationsProps()
        })
    }

    setControls() {
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
            },
        }
    }

    animateScrollDownDiv(){
        const down = () => {
            gsap.to('.scroll-down', 
                {
                    top: 29,
                    duration: 1,
                    ease: this.ease.power3Out,
                    onComplete : () => up()
                }
            )
        }
        
        const up = () => {
            gsap.to('.scroll-down', 
                {
                    top: 2,
                    duration: 1,
                    ease: this.ease.power3Out,
                    onComplete : () => down()
                }
            )
        }

        down()
    }

    setAnimationsProps() {
        this.animationsProps = []

        this.DOM.firstPositions.forEach(el => {
            // Automatically increment MaxIndex
            this.MAX_INDEX++

            // Push to 
            this.animationsProps.push([
                el.element, Math.PI / 4, this.ease.slow, el.position.y, el.position.y, 1.5,
            ])
        })

        this.world.container.children.forEach(child => {
            // Automatically increment MaxIndex
            this.MAX_INDEX++

            // Push to 

            this.animationsProps.push([
                undefined, Math.PI / 4, this.ease.slow, child.position.y, child.position.y, 1.5,
            ])
        })

        this.DOM.secondPositions.forEach(el => {
            // Automatically increment MaxIndex
            this.MAX_INDEX++

            // Push to 
            this.animationsProps.push([
                el.element, Math.PI / 4, this.ease.slow, el.position.y, el.position.y, 1.5,
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

            self.moveMouseFlag = false
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

        this.DOM.openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              let modal = this.DOM.modals.find(item => item.name === btn.id)
              modal.element.classList.toggle('hide')
              this.DOM.projects.classList.toggle('hide')
            })
        })

        this.DOM.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.DOM.projects.classList.toggle('hide')
                btn.parentElement.parentElement.classList.toggle('hide')
            })
        })
    }

    homeAnimation() {
        // this.homePosition = new Vector3(0, 2, 0)

        this.time.on('tick', () => {
            [
                ...this.DOM.firstPositions,
                ...this.DOM.secondPositions,
                ...this.DOM.modals,
            ].forEach(el => {
                let projected = el.position.clone()
                projected.project(this.camera.instance)

                const translateX = `${projected.x * this.sizes.width * 0.5}px`
                const translateY = `${-projected.y * this.sizes.height * 0.5}px`
                el.element.style.transform = `translate(0, ${translateY})`
            })
        })
    }

    animateLights() {
        this.time.on('tick', () => {
            this.world.lights.items.spotLight.target.position.x = Math.cos(this.time.elapsed * 0.00105) * 2.5
            this.world.lights.items.spotLight.target.position.y = Math.sin(this.time.elapsed * 0.00035) * 2.5
        })
    }

    animateCamera(){
        this.mouse = new Vector2()

        this.containersToMove = [
            this.world.shipwreckContainer,
            this.world.projectsContainer,
            this.world.whoAmIContainer,
            this.world.whatIDoContainer,
            this.world.aboutMeContainer,
        ]

        this.time.on('tick', () => {
            this.camera.instance.position.x= Math.sin(this.camera.rotationAngle + this.mouse.x) * this.camera.distance,
            this.camera.instance.position.z= Math.cos(this.camera.rotationAngle + this.mouse.x) * this.camera.distance,
            this.camera.instance.lookAt(this.camera.target)

            this.containersToMove.forEach(container => {
                container.rotation.x = this.mouse.y
                container.rotation.z = -this.mouse.y
            })
        })
        
        window.onmousemove = event => {
            gsap.to(this.mouse, {
                x: ((event.clientX / this.sizes.width)-0.5) * 0.125,
                y: -((event.clientY / this.sizes.height)-0.5) * 0.25,
                duration: 0.5,
                ease: this.ease.linear,
            })
        }
    }
}