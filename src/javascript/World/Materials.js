import * as THREE from 'three'

export default class Materials {
    /**
     * Constructor
     */

    constructor(_options) {
        // Options
        this.resources = _options.resources
        this.debug = _options.debug

        // Debug 
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Materials")
            // this.debugFolder.open()
        }

        // Setup
        this.items = {}

        this.setBases()
        this.setMatcaps()
    }

    setBases() {
        this.items.dnaMaterial = new THREE.MeshStandardMaterial({
            color: "#723663",
            wireframe: false,
            metalness: 1.0,
            roughness: 0.1,
        })

        if (this.debug) {
            this.debugFolder.add(this.items.dnaMaterial, 'metalness', 0, 1, 0.001).name("Standard Metalness")
            this.debugFolder.add(this.items.dnaMaterial, 'roughness', 0, 1, 0.001).name("Standard Roughness")
        }
    }

    setMatcaps() {
        this.items.dnaMatcap = new THREE.MeshMatcapMaterial({
            color: "#FFF"
        })
        this.resources.on('ready', () => {
            this.items.dnaMatcap.matcap = this.resources.items.toonBMatcapTexture
        })

        this.items.normal = new THREE.MeshLambertMaterial({
            color: '#fff'
        })
    }
}