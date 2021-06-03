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
            name: "#a70e0e"
        }

        this.setHemisphericalLight()
    }

    setHemisphericalLight() {
        this.items.hemisphericalLight = new THREE.HemisphereLight(
            this.colors.white,
            this.colors.pink,
            5
        )

        // Debug
        if (this.debug) {
            this.debugFolder.add(this.items.hemisphericalLight, 'intensity', 0, 5, 0.001).name("Hemisphere Intensity")
            this.debugFolder
                .addColor(this.colors, 'white')
                .onChange(() => this.items.hemisphericalLight.color.set(this.colors.white))
            this.debugFolder
                .addColor(this.colors, 'pink')
                .onChange(() => this.items.hemisphericalLight.groundColor.set(this.colors.pink))
        }
    }
}