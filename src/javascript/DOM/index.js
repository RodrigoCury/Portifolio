import * as THREE from "three"

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

        this.positions = {
            home: new THREE.Vector3(0, 1.2, 0),
            tech: new THREE.Vector3(0, 0.47, 0),
            projects: new THREE.Vector3(0, -0.135, 0),
            whoami: new THREE.Vector3(0, -0.75, 0),
            contact: new THREE.Vector3(0, -1.35, 0),
        }


        this.colors = {
            title: "#ffffff",
            subTitle: "#a0a0a0",
            p: "#ffffff"
        }

        this.resources.on('ready', () => {
            this.setPositions()
            this.setHomePage()
            this.setMenu()
        })
    }

    setPositions() {
        this.time.on("tick", () => {
            // Home
            this.positions.home.x = this.world.dnaObject.position.x //+ Math.sin(this.time.elapsed * 0.0002 - Math.PI * 0.85) * 0.5
            this.positions.home.z = this.world.dnaObject.position.z //+ Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.85) * 0.5
            // this.positions.home.y += this.camera.instance.position.y

            // Technologies
            this.positions.tech.x = this.world.dnaObject.position.x //+ Math.sin(this.time.elapsed * 0.0002 - Math.PI * 1.325) * 0.5
            this.positions.tech.z = this.world.dnaObject.position.z //+ Math.cos(this.time.elapsed * 0.0002 - Math.PI * 1.325) * 0.5
            this.positions.tech.z = this.world.dnaObject.position.z //+ Math.cos(this.time.elapsed * 0.0002 - Math.PI * 1.325) * 0.5

            // Projects
            this.positions.projects.x = this.world.dnaObject.position.x //- Math.sin(this.time.elapsed * 0.0002 - Math.PI * 0.6) * 0.5
            this.positions.projects.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.6) * 0.5
            this.positions.projects.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.6) * 0.5

            // WhoAmI
            this.positions.whoami.x = this.world.dnaObject.position.x //- Math.sin(this.time.elapsed * 0.0002 - Math.PI * 0.9) * 0.5
            this.positions.whoami.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.9) * 0.5
            this.positions.whoami.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.9) * 0.5

            // Contact
            this.positions.contact.x = this.world.dnaObject.position.x //- Math.sin(this.time.elapsed * 0.0002 - Math.PI * 1.3) * 0.5
            this.positions.contact.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 1.3) * 0.5
            this.positions.contact.z = this.world.dnaObject.position.z //- Math.cos(this.time.elapsed * 0.0002 - Math.PI * 1.3) * 0.5
        })
    }

    setHomePage() {
        // TittleDiv
        this.mainDIV = document.querySelector('.intro')

        // Title
        this.title = document.querySelector('.name')
        this.subTitle = document.querySelector('.subtitle')


        if (this.debug) {
            this.debugFolder.addColor(this.colors, 'title').onChange(() => {
                this.title.style.color = this.colors.title
            })
            this.debugFolder.addColor(this.colors, 'subTitle').onChange(() => {
                this.subTitle.style.color = this.colors.subTitle
            })
        }
    }

    setMenu() {
        this.buttons = [
            {
                element: document.querySelector('.home'),
                position: this.positions.home
            },
            {
                element: document.querySelector('.tech'),
                position: this.positions.tech
            },
            {
                element: document.querySelector('.projects'),
                position: this.positions.projects
            },
            {
                element: document.querySelector('.whoami'),
                position: this.positions.whoami
            },
            {
                element: document.querySelector('.contact'),
                position: this.positions.contact
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
}
