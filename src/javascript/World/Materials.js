import { MeshBasicMaterial, MeshStandardMaterial, ShaderMaterial, Vector3 } from 'three'
import holoVertex from '../../shaders/holo/vertex.glsl'
import holoFragment from '../../shaders/holo/fragment.glsl'


export default class Materials {
    /**
     * Constructor
     */

    constructor(_options) {
        // Options
        this.resources = _options.resources
        this.debug = _options.debug
        this.time = _options.time

        // Debug 
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Materials")
            // this.debugFolder.open()
        }

        // Setup
        this.items = {}

        this.setBases()
        this.setHolo()
    }

    setBases() {
        this.items.dnaMaterial = new MeshStandardMaterial({
            color: "#723663",
            wireframe: false,
            metalness: 1.0,
            roughness: 0.1,
        })

        if (this.debug) {
            this.debugFolder.add(this.items.dnaMaterial, 'metalness', 0, 1, 0.001).name("Standard Metalness")
            this.debugFolder.add(this.items.dnaMaterial, 'roughness', 0, 1, 0.001).name("Standard Roughness")
        }
        this.items.basic = new MeshBasicMaterial({
            color: '#f00'
        })

    }

    setHolo() {
        this.items.holoMaterial = new ShaderMaterial({
            uniforms: {
                uTime: { value: this.time.elapsed },
                uColor: new Vector3(0.16, 0.57, 0.96)
            },

            vertexShader: holoVertex,

            fragmentShader: holoFragment,

            transparent: true
        })
    }
}