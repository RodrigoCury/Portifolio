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

        this.setDirectionalLights()
        this.setAmbientlight()
    }

    setDirectionalLights() {
        // Red Nebula Light
        this.items.redDirectionalLight = new THREE.DirectionalLight(
            this.colors.redNebula,
            1
        )
        this.items.redDirectionalLight.position.set(1, 0, -8)

        // Blue Nebula Light
        this.items.blueDirectionalLight = new THREE.DirectionalLight(
            this.colors.blueNebula,
            1
        )
        this.items.blueDirectionalLight.position.set(0, -6, 8)

        if (this.debug) {
            this.debugFolder.add(this.items.redDirectionalLight.position, 'x', -10, 10, 0.01).name('Red nebula X')
            this.debugFolder.add(this.items.redDirectionalLight.position, 'y', -10, 10, 0.01).name('Red nebula Y')
            this.debugFolder.add(this.items.redDirectionalLight.position, 'z', -10, 10, 0.01).name('Red nebula Z')
            this.debugFolder.add(this.items.redDirectionalLight, 'intensity', 0, 6, 0.01).name('Red nebula Intensity')
            this.debugFolder.add(this.items.blueDirectionalLight.position, 'x', -10, 10, 0.01).name('Blue nebula X')
            this.debugFolder.add(this.items.blueDirectionalLight.position, 'y', -10, 10, 0.01).name('Blue nebula Y')
            this.debugFolder.add(this.items.blueDirectionalLight.position, 'z', -10, 10, 0.01).name('Blue nebula Z')
            this.debugFolder.add(this.items.blueDirectionalLight, 'intensity', 0, 6, 0.01).name('Blue nebula Intensity')
            this.debugFolder.addColor(this.colors, 'redNebula').onChange(() => {
                this.items.redDirectionalLight.color = new THREE.Color(this.colors.redNebula)
            })

            this.items.redDirectionalLightHelper = new THREE.DirectionalLightHelper(this.items.redDirectionalLight, 2)
            this.items.blueDirectionalLightHelper = new THREE.DirectionalLightHelper(this.items.blueDirectionalLight, 2)
            this.container.add(this.items.blueDirectionalLightHelper, this.items.redDirectionalLightHelper)
        }

        this.container.add(
            this.items.redDirectionalLight,
            this.items.blueDirectionalLight,
        )
    }

    setAmbientlight() {
        this.items.ambientlight = new THREE.AmbientLight(this.colors.white, 0.2)
        if (this.debug) {
            this.debugFolder.add(this.items.ambientlight, 'intensity', 0, 5, 0.001).name("Ambient intensity")
        }
        this.container.add(this.items.ambientlight)
    }
}