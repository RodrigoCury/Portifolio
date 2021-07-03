import { Color, ShaderMaterial, PointsMaterial, MeshPhongMaterial, UniformsUtils } from 'three'
import holoVertex from '../../shaders/holoLetters/vertex.glsl'
import holoFragment from '../../shaders/holoLetters/fragment.glsl'
import beamVertex from '../../shaders/holoBeam/vertex.glsl'
import beamFragment from '../../shaders/holoBeam/fragment.glsl'
import { FresnelShader } from 'three/examples/jsm/shaders/FresnelShader.js';



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

        this.setHolo()
        this.setPointMaterial()
        this.setPhongMaterial()
        this.setPodDoorMaterial()
        this.setContactLogoMaterial()
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

    setPointMaterial() {
        this.items.pointMaterial = new PointsMaterial({
            color: '#aaaaaa',
            size: 2,
        })
    }

    setPhongMaterial(){
        const shader = FresnelShader
        const uniforms = UniformsUtils.clone(shader.uniforms)
        uniforms['tCube'].value = this.resources.items.envMap
        this.items.phongMaterial = new ShaderMaterial( { 
            uniforms: uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
        });
    }

    setPodDoorMaterial() {
        this.debugObject.dooruColor = "#020000",
        this.debugObject.dooruRimColor = "#780707",
        this.debugObject.timeValue = 1000,

        
        this.items.doorMaterial = new ShaderMaterial({
            uniforms: {
                uTime: { value: this.time.elapsed },
                uColor: { value: new Color('#020000') },
                uGlitchSpeed: { value: 0 },
                uGlitchIntensity: { value: 0 },
                uBarSpeed: { value: 1 },
                uBarDistance: { value: 3500},
                uAlpha: { value: 0.57 },
                uFlickerSpeed: { value: 0.7 },
                uRimColor: { value: new Color("#780707") },
                uRimPower: { value: 5 },
                uGlowDistance: { value: .3 },
                uGlowSpeed: { value: .1 },
            },

            vertexShader: holoVertex,

            fragmentShader: holoFragment,

            transparent: true,

            side: 1,
        })

        if (this.debug) {
            this.doorHoloFolder = this.debug.addFolder("Door Holo")
            // this.holoFolder.open()
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uGlitchSpeed, 'value', 0, 3, 0.01).name("GlitchSpeed")
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uGlitchIntensity, 'value', 0, 3, 0.01).name("GlitchIntensity")
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uBarDistance, 'value', 10, 6000, 1).name("BarDistance")
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uBarSpeed, 'value', 0, 3, 0.01).name("BarSpeed")
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uAlpha, 'value', 0, 1, 0.001).name("Alpha")
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uFlickerSpeed, 'value', 0, 30, 0.00001).name("FlickerSpeed")
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uRimPower, 'value', 0, 5, 0.1).name("RimPower")
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uGlowDistance, 'value', 0, 5, 0.1).name("GlowDistance")
            this.doorHoloFolder.add(this.items.doorMaterial.uniforms.uGlowSpeed, 'value', 0, 5, 0.1).name("GlowSpeed")

            this.doorHoloFolder.add(this.debugObject, 'timeValue')

            // Colors
            this.doorHoloFolder
                .addColor(this.debugObject, 'dooruColor')
                .onChange(() => this.items.doorMaterial.uniforms.uColor.value = new Color(this.debugObject.dooruColor))

            this.doorHoloFolder
                .addColor(this.debugObject, 'dooruRimColor')
                .onChange(() => this.items.doorMaterial.uniforms.uRimColor.value = new Color(this.debugObject.dooruRimColor))
        }

        this.time.on("tick", () => {
            this.items.doorMaterial.uniforms.uTime.value = this.time.elapsed / 1000
        })
    }

    setContactLogoMaterial() {
        this.debugObject.logouColor = "#0000ff",
        this.debugObject.logouRimColor = "#009b52",
        
        this.items.logoHoloMaterial = new ShaderMaterial({
            uniforms: {
                uTime: { value: this.time.elapsed },
                uColor: { value: new Color('#0000ff') },
                uGlitchSpeed: { value: 0.22 },
                uGlitchIntensity: { value: 0.01 },
                uBarSpeed: { value: 0.6 },
                uBarDistance: { value: 1350 },
                uAlpha: { value: 0.55 },
                uFlickerSpeed: { value: 1},
                uRimColor: { value: new Color("#009b52") },
                uRimPower: { value: 2.4 },
                uGlowDistance: { value: 0.5 },
                uGlowSpeed: { value: 0.8 },
            },

            vertexShader: holoVertex,

            fragmentShader: holoFragment,

            transparent: true,

            side: 1,
        })

        if (this.debug) {
            this.contactLogoFolder = this.debug.addFolder("Contact Logo Holos")
            // this.holoFolder.open()
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uGlitchSpeed, 'value', 0, 3, 0.01).name("GlitchSpeed")
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uGlitchIntensity, 'value', 0, 3, 0.01).name("GlitchIntensity")
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uBarDistance, 'value', 10, 6000, 1).name("BarDistance")
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uBarSpeed, 'value', 0, 5, 0.0001).name("BarSpeed")
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uAlpha, 'value', 0, 2, 0.001).name("Alpha")
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uFlickerSpeed, 'value', 0, 30, 0.00001).name("FlickerSpeed")
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uRimPower, 'value', 0, 5, 0.1).name("RimPower")
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uGlowDistance, 'value', 0, 5, 0.1).name("GlowDistance")
            this.contactLogoFolder.add(this.items.logoHoloMaterial.uniforms.uGlowSpeed, 'value', 0, 5, 0.1).name("GlowSpeed")

            // Colors
            this.contactLogoFolder
                .addColor(this.debugObject, 'logouColor')
                .onChange(() => this.items.logoHoloMaterial.uniforms.uColor.value = new Color(this.debugObject.logouColor))

            this.contactLogoFolder
                .addColor(this.debugObject, 'logouRimColor')
                .onChange(() => this.items.logoHoloMaterial.uniforms.uRimColor.value = new Color(this.debugObject.logouRimColor))
        }

        this.time.on("tick", () => {
            this.items.logoHoloMaterial.uniforms.uTime.value = this.time.elapsed / 1000
        })
    }
}