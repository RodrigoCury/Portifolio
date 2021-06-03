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

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("DOM Elements")
        }

        // Setup
        this.body = document.querySelector('body')

        this.positions = {
            tech: new THREE.Vector3(0, 0.57, 0)
        }

        this.colors = {
            title: "#ffffff",
            subTitle: "#a0a0a0",
        }
        this.setPositions()
        this.setHomePage()
    }

    setPositions() {
        this.time.on("tick", () => {
            this.positions.tech.x = this.world.positions.dnaMeshPosition.x + Math.sin(this.time.elapsed * 0.0002 - Math.PI * 0.225) * 0.5
            this.positions.tech.z = this.world.positions.dnaMeshPosition.z + Math.cos(this.time.elapsed * 0.0002 - Math.PI * 0.225) * 0.5
        })
    }

    setHomePage() {
        // TittleDiv
        this.mainDIV = document.createElement('div')
        this.mainDIV.className = 'intro'
        this.body.appendChild(this.mainDIV)

        // Title
        this.title = document.createElement('h1')
        this.title.className = 'name'
        this.title.style.color = this.colors.title
        this.title.innerHTML = "Rodrigo Cury"

        this.subTitle = document.createElement('p')
        this.subTitle.className = 'subtitle'
        this.subTitle.style.color = this.colors.subTitle
        this.subTitle.innerHTML = `Desenvolvedor FullStack & Biotecnologista`


        if (this.debug) {
            this.debugFolder.addColor(this.colors, 'title').onChange(() => {
                this.title.style.color = this.colors.title
            })
            this.debugFolder.addColor(this.colors, 'subTitle').onChange(() => {
                this.subTitle.style.color = this.colors.subTitle
            })
        }

        this.mainDIV.appendChild(this.title)
        this.mainDIV.appendChild(this.subTitle)

    }

    setMenu() {
        this.techDIV = document.createElement("div")
        this.techDIV.className = 'menu-btn'
    }
}
