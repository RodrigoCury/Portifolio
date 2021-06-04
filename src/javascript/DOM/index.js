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
            tech: new THREE.Vector3(0, 0.57, 0),
            about: new THREE.Vector3()
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
            this.positions.tech.x = this.world.positions.dnaMeshPosition.x + Math.sin(this.time.elapsed * 0.0002 - Math.PI * 0.225) * 0.5
            this.positions.tech.z = this.world.positions.dnaMeshPosition.z + Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.225) * 0.5
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
                element: document.querySelector('.tech'),
                position: this.positions.tech
            }
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
