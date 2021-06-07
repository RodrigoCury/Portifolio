import * as THREE from "three"
import gsap from 'gsap'
import { Vector3 } from "three"

export default class DOM {
    /**
     * Constructor
     */
    constructor(_options) {
        // Options
        this.debug = _options.debug
        this.$canvas = _options.$canvas
        this.time = _options.time
        this.world = _options.world
        this.camera = _options.camera
        this.sizes = _options.sizes
        this.resources = _options.resources

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("DOM Elements")
        }

        // Setup
        this.body = document.querySelector('body')





        this.colors = {
            title: "#ffffff",
            subTitle: "#a0a0a0",
            p: "#ffffff"
        }

        this.resources.on('ready', () => {
            this.menuPositions = {
                home: new THREE.Vector3(0, 1.1, 0),
                tech: new THREE.Vector3(0, 0.47, 0),
                projects: new THREE.Vector3(0, -0.135, 0),
                whoami: new THREE.Vector3(0, -0.75, 0),
                contact: new THREE.Vector3(0, -1.35, 0),
            }


            this.setPositions()
            this.setHomePage()
            this.setMenu()
            this.setAnimations()
        })
    }

    setPositions() {
        this.time.on("tick", () => {
            // Home
            this.menuPositions.home.x = this.world.dnaObject.position.x //+ Math.sin(this.time.elapsed * 0.0002 - Math.PI * 0.85) * 0.5
            this.menuPositions.home.z = this.world.dnaObject.position.z //+ Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.85) * 0.5

            // Technologies
            this.menuPositions.tech.x = this.world.dnaObject.position.x //+ Math.sin(this.time.elapsed * 0.0002 - Math.PI * 1.325) * 0.5
            this.menuPositions.tech.z = this.world.dnaObject.position.z //+ Math.cos(this.time.elapsed * 0.0002 - Math.PI * 1.325) * 0.5
            this.menuPositions.tech.z = this.world.dnaObject.position.z //+ Math.cos(this.time.elapsed * 0.0002 - Math.PI * 1.325) * 0.5

            // Projects
            this.menuPositions.projects.x = this.world.dnaObject.position.x //- Math.sin(this.time.elapsed * 0.0002 - Math.PI * 0.6) * 0.5
            this.menuPositions.projects.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.6) * 0.5
            this.menuPositions.projects.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.6) * 0.5

            // WhoAmI
            this.menuPositions.whoami.x = this.world.dnaObject.position.x //- Math.sin(this.time.elapsed * 0.0002 - Math.PI * 0.9) * 0.5
            this.menuPositions.whoami.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.9) * 0.5
            this.menuPositions.whoami.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.9) * 0.5

            // Contact
            this.menuPositions.contact.x = this.world.dnaObject.position.x //- Math.sin(this.time.elapsed * 0.0002 - Math.PI * 1.3) * 0.5
            this.menuPositions.contact.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 1.3) * 0.5
            this.menuPositions.contact.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 1.3) * 0.5
        })
    }

    setHomePage() {
        this.homeDivPosition = new Vector3(
            -this.camera.instance.position.distanceTo(
                new THREE.Vector3(0, 0, 0)) * Math.tan(this.camera.topFOV / 2 * 0.10 * Math.PI / 180
                ),
            0,
            0)
        this.homeDivProjection = this.homeDivPosition.clone()
        this.homeDivProjection.project(this.camera.instance)


        // TittleDiv
        this.mainDIV = document.querySelector('.intro')
        const translateY = `translateY(${(-this.homeDivProjection.y + .75) * this.sizes.height * 0.5}px) `
        const translateX = `translateX(${(this.homeDivProjection.x + 1) * this.sizes.width * 0.5}px)`
        this.mainDIV.style.transform = translateY + translateX
        this.mainDIV.style.height = `${this.sizes.height / 3}px`


        // Title
        this.title = document.querySelector('.name')
        this.title.style.fontSize = `${this.sizes.height / 7.5}px`

        this.subTitle = document.querySelector('.subtitle')
        this.subTitle.style.fontSize = `${this.sizes.height / 7.5 * 0.22}px`


        if (this.debug) {
            this.debugFolder.addColor(this.colors, 'title').onChange(() => {
                this.title.style.color = this.colors.title
            })
            this.debugFolder.addColor(this.colors, 'subTitle').onChange(() => {
                this.subTitle.style.color = this.colors.subTitle
            })
        }

        window.addEventListener('resize', event => {
            this.title.style.fontSize = `${this.sizes.height / 7.5}px`
            this.subTitle.style.fontSize = `${this.sizes.height / 7.5 * 0.22}px`
        })

        this.time.on("tick", () => {
            const translateY = `translateY(${(-this.homeDivProjection.y + .75) * this.sizes.height * 0.5}px) `
            const translateX = `translateX(${(this.homeDivProjection.x + 1) * this.sizes.width * 0.5}px)`
            this.mainDIV.style.transform = translateY + translateX
            this.homeDivProjection = this.homeDivPosition.clone()
            this.homeDivProjection.project(this.camera.instance)
        })
    }

    setMenu() {
        this.buttons = [
            {
                element: document.querySelector('.home'),
                position: this.menuPositions.home
            },
            {
                element: document.querySelector('.tech'),
                position: this.menuPositions.tech
            },
            {
                element: document.querySelector('.projects'),
                position: this.menuPositions.projects
            },
            {
                element: document.querySelector('.whoami'),
                position: this.menuPositions.whoami
            },
            {
                element: document.querySelector('.contact'),
                position: this.menuPositions.contact
            },
        ]

        this.counter = 0
        this.time.on('tick', () => {
            // if (this.counter % 600 == 0) {
            for (const button of this.buttons) {
                const techPosition = button.position.clone()
                techPosition.project(this.camera.instance)
                const translateY = `translateY(${(-techPosition.y + 1) * this.sizes.height * 0.5}px)`
                const translateX = `translateX(${(techPosition.x + 1) * this.sizes.width * 0.5}px)`
                button.element.style.transform = translateX + translateY
            }

            // }
            this.counter++

        })

    }

    setAnimations() {
        this.movementFunction = {
            ArrowLeft: () => {
                Object.values(this.menuPositions).forEach(position => {
                    gsap.to(position, {
                        y: position.y - 3.5
                    })
                })
            }
            ,
            ArrowRight: () => {
                Object.values(this.menuPositions).forEach(position => {
                    gsap.to(position, {
                        y: position.y + 3.5
                    })
                })
            },
        }
        window.addEventListener('keydown', event => {
            if (this.movementFunction[event.key]) {
                this.movementFunction[event.key]()
            }
        })
    }
}
