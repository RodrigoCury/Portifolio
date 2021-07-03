import * as THREE from 'three'

export default class Lights {
    /**
     * Constructor
     */

    constructor(_options) {
        // Options
        this.debug = _options.debug

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Lights")
        }

        // Setup
        this.items = {}
        this.container = new THREE.Object3D()


        this.colors = {
            purple: "#A25D79",
            salmon: "#E57571",
            orange: "#FD9C4F",
            yellow: "#F9D460",
            white: "#F1F5DE",
            blue: "#82D9E2",
            pink: "#fc0067",
            name: "#a70e0e",
            redNebula: "#F45800",
            blueNebula: '#445BDB'
        }

        this.setAmbientlight()
        this.setDirectionalLight()
        this.setSpotLight()
    }

    setAmbientlight() {
        this.items.ambientlight = new THREE.AmbientLight(this.colors.white, .5)
        if (this.debug) {
            this.debugFolder.add(this.items.ambientlight, 'intensity', 0, 5, 0.001).name("Ambient intensity")
        }
        this.container.add(this.items.ambientlight)
    }

    setDirectionalLight() {
        this.items.directionalLight = new THREE.DirectionalLight(this.colors.white, 1)
        this.items.directionalLight.position.set(-3, 4, 3)

        if (this.debug) {
            this.debugFolder.add(this.items.directionalLight, 'intensity', 0, 5, 0.001).name("Ambient intensity")
        }

        this.container.add(this.items.directionalLight)
    }

    setSpotLight() {
        this.items.spotLight = new THREE.SpotLight(
            this.colors.white,
            2,
            13,
            Math.PI / 8,
            1,
            0
        )
    }
}