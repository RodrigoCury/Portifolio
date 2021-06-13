import { Color, MeshBasicMaterial, MeshStandardMaterial, ShaderMaterial, Vector3 } from 'three'
import holoVertex from '../../shaders/holoLetters/vertex.glsl'
import holoFragment from '../../shaders/holoLetters/fragment.glsl'
import beamVertex from '../../shaders/holoBeam/vertex.glsl'
import beamFragment from '../../shaders/holoBeam/fragment.glsl'


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
        if (this.debug) {
            this.debugObject = {
                uColor: "#1B4294",
                uRimColor: '#0E278D'
            }
        }

        this.items.holoMaterial = new ShaderMaterial({
            uniforms: {
                uTime: { value: this.time.elapsed },
                uColor: { value: new Color('#1B4294') },
                uGlitchSpeed: { value: 0.22 },
                uGlitchIntensity: { value: 0.1 },
                uBarSpeed: { value: 0.001 },
                uBarDistance: { value: 45 },
                uAlpha: { value: 0.5 },
                uFlickerSpeed: { value: 0.62 },
                uRimColor: { value: new Color("#0E278D") },
                uRimPower: { value: 0.3 },
                uGlowDistance: { value: 0.5 },
                uGlowSpeed: { value: .001 },
            },

            vertexShader: holoVertex,

            fragmentShader: holoFragment,

            transparent: true,

            side: 1,

            // wireframe: true,
        })
        this.items.beamMaterial = new ShaderMaterial({
            uniforms: {
                uTime: { value: this.time.elapsed },
                uColor: { value: new Color('#1B4294') },
                uGlitchSpeed: { value: 0.22 },
                uGlitchIntensity: { value: 0.1 },
                uBarSpeed: { value: 0.001 },
                uBarDistance: { value: 45 },
                uAlpha: { value: 0.5 },
                uFlickerSpeed: { value: 0.62 },
                uRimColor: { value: new Color("#0E278D") },
                uRimPower: { value: 0.3 },
                uGlowDistance: { value: 0.5 },
                uGlowSpeed: { value: .001 },
            },

            vertexShader: beamVertex,

            fragmentShader: beamFragment,

            transparent: true,
        })

        this.time.on("tick", () => {
            this.items.holoMaterial.uniforms.uTime.value = this.time.elapsed
            this.items.beamMaterial.uniforms.uTime.value = this.time.elapsed
        })
        if (this.debug) {
            this.holoFolder = this.debug.addFolder("Hologram")
            // this.holoFolder.open()
            this.holoFolder.add(this.items.holoMaterial.uniforms.uGlitchSpeed, 'value', 0, 3, 0.01).name("GlitchSpeed")
            this.holoFolder.add(this.items.holoMaterial.uniforms.uGlitchIntensity, 'value', 0, 3, 0.01).name("GlitchIntensity")
            this.holoFolder.add(this.items.holoMaterial.uniforms.uBarDistance, 'value', 10, 60, 1).name("BarDistance")
            this.holoFolder.add(this.items.holoMaterial.uniforms.uBarSpeed, 'value', 0, 0.005, 0.0001).name("BarSpeed")
            this.holoFolder.add(this.items.holoMaterial.uniforms.uAlpha, 'value', 0, 1, 0.001).name("Alpha")
            this.holoFolder.add(this.items.holoMaterial.uniforms.uFlickerSpeed, 'value', 0, 30, 0.00001).name("FlickerSpeed")
            this.holoFolder.add(this.items.holoMaterial.uniforms.uRimPower, 'value', 0, 5, 0.1).name("RimPower")
            this.holoFolder.add(this.items.holoMaterial.uniforms.uGlowDistance, 'value', 0, 5, 0.1).name("GlowDistance")
            this.holoFolder.add(this.items.holoMaterial.uniforms.uGlowSpeed, 'value', 0, 5, 0.1).name("GlowSpeed")

            // Colors
            this.holoFolder
                .addColor(this.debugObject, 'uColor')
                .onChange(() => this.items.holoMaterial.uniforms.uColor.value = new Color(this.debugObject.uColor))

            this.holoFolder
                .addColor(this.debugObject, 'uRimColor')
                .onChange(() => this.items.holoMaterial.uniforms.uRimColor.value = new Color(this.debugObject.uRimColor))
        }
    }
}