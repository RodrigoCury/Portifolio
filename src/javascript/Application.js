// Utils
import Animations from './Utils/Animations'
import Raycasting from './Utils/Raycasting'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'


// Three
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass.js'

// Debug
import * as dat from 'dat.gui'

// Root
import Resources from './Resources'
import Camera from './Camera'

// DOM
import DOM from './DOM/index'

// World
import World from './World/index'
import Sounds from './Utils/Sounds'



export default class Application {
    /**
     * Constructor
     */
    constructor(_options) {
        // Options
        this.$canvas = _options.$canvas

        // Setup
        this.sizes = new Sizes()
        this.sounds = new Sounds()
        this.resources = new Resources()

        this.setConfig()
        this.setDebug()

        // Time
        this.time = new Time({
            debug: this.debug,
        })

        this.setRenderer()
        this.setCamera()
        this.setPasses()
        this.setWorld()
        this.setDOMElements()
        this.setAnimations()
        this.setRaycaster()
    }

    /**
     * Configuration Setup
     */
    setConfig() {
        this.config = {}
        this.config.debug = window.location.hash == '#debug'
        this.config.touch = false
        this.config.isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)
        this.config.screenIsOn = 'welcomeDiv'

        window.addEventListener('touchstart', () => {
            this.config.touch = true
        }, { once: true })
    }

    /**
     * Setup Debug
     */

    setDebug() {
        if (this.config.debug) {
            this.debug = new dat.GUI({ width: this.sizes.width / 3 })
            this.debug.close()
        } else {
            this.debug = undefined
        }
    }

    /**
     * Renderer setup
     */

    setRenderer() {

        // Scene
        this.scene = new THREE.Scene()
        this.resources.loader.on('end', () => {
            this.scene.background = this.resources.items.envMap
            this.scene.environment = this.resources.items.envMap

        })

        if (this.debug) {
            this.debugObject = {
                envMapIntensity: 3
            }

            this.traverse = () => {
                this.scene.traverse(child => {
                    if (child instanceof THREE.Mesh &&
                        child.material instanceof THREE.MeshStandardMaterial) {
                        child.material.envMapIntensity = this.debugObject.envMapIntensity
                        child.material.needsUpdate = true
                    }
                })
            }

            this.debug.add(this.debugObject, 'envMapIntensity').onChange(this.traverse)
            this.debug.add(this, 'traverse')
        }

        // Renderer 
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.$canvas,
            alpha: true,
            antialias: true,
        })

        this.backgroundProperties = {
            color: '#82D9E2'
        }

        // Clear Color
        this.renderer.setClearColor(this.backgroundProperties.color, 1)

        // Pixel Ratio Max 2
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Size
        this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)

        // Physically correct lights (Light get more dim when more far away M.R.)
        // this.renderer.physicallyCorrectLights = true

        // Auto Clear
        this.renderer.autoClear = false

        // Output Encoding
        // this.renderer.outputEncoding = THREE.sRGBEncoding

        // Tone Mapping
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping

        // Shadows
        // this.renderer.shadowMap.enabled = true

        // Resize Event
        this.sizes.on('resize', () => this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height))

        // Debug
        if (this.debug) {
            this.backgroundFolder = this.debug.addFolder("Background")
            this.backgroundFolder.addColor(this.backgroundProperties, 'color').onChange(() => {
                this.renderer.setClearColor(this.backgroundProperties.color, 1)
            })
        }

    }

    setCamera() {
        this.camera = new Camera({
            time: this.time,
            sizes: this.sizes,
            renderer: this.renderer,
            debug: this.debug,
            config: this.config,
        })

        this.scene.add(this.camera.container)

        this.time.on('tick', () => {
            // if (OBJECT OF INTEREST){
            //     this.camera.target.x = OBJECT.position.x
            //     this.camera.target.y = OBJECT.position.y
            // }
        })
    }

    setPasses() {
        this.passes = {}

        // Debug 
        if (this.debug) {
            this.passes.debugFolder = this.debug.addFolder('PostProcessing')
        }

        // Setup Composer
        this.passes.composer = new EffectComposer(this.renderer)

        // Setup Passes 
        this.passes.renderPass = new RenderPass(this.scene, this.camera.instance)

        this.passes.passesParams = {
            shiftAmount: 0.01,
            angle: Math.PI * 2,
            sampleLevel: 2,
            unbiased: true,
        }

        this.passes.rgbShiftPass = new ShaderPass(RGBShiftShader)
        this.passes.rgbShiftPass.material.uniforms.amount.value = this.passes.passesParams.shiftAmount
        this.passes.rgbShiftPass.material.uniforms.angle.value = this.passes.passesParams.angle
        this.passes.rgbShiftPass.enabled = true

        this.passes.fxaaShader = new ShaderPass(FXAAShader)
        this.passes.fxaaShader.enabled = true

        this.passes.ssaaShader = new SSAARenderPass(this.scene, this.camera.instance)
        this.passes.ssaaShader.enabled = false
        this.passes.ssaaShader.sampleLevel = this.passes.passesParams.sampleLevel
        this.passes.ssaaShader.unbiased = this.passes.passesParams.unbiased

        console.log(this.passes.ssaaShader);

        // Debug
        if (this.debug) {
            this.passes.debugFolder.add(this.passes.rgbShiftPass.material.uniforms.amount, 'value', 0, 0.01, 0.001).name("Shift Amount")
            this.passes.debugFolder.add(this.passes.rgbShiftPass.material.uniforms.angle, 'value', 0, Math.PI * 2, 0.1).name("Shift Angle")
            this.passes.debugFolder.add(this.passes.passesParams, 'unbiased').name("SSAA Unbiased").onChange(() => this.passes.ssaaShader.unbiased = this.passes.passesParams.unbiased)
            this.passes.debugFolder.add(this.passes.passesParams, 'sampleLevel').name("SSAA Unbiased").onChange(() => this.passes.ssaaShader.sampleLevel = this.passes.passesParams.sampleLevel)
        }

        // Add Passes
        this.passes.composer.addPass(this.passes.renderPass)
        this.passes.composer.addPass(this.passes.rgbShiftPass)
        this.passes.composer.addPass(this.passes.fxaaShader)
        this.passes.composer.addPass(this.passes.ssaaShader)


        // Time Tick
        this.time.on('tick', () => {

            /**
             *  Renderer
             */
            this.passes.composer.render()
        })


        // Resize event
        this.sizes.on('resize', () => {
            this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
            this.passes.composer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
            this.passes.rgbShiftPass.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
            this.passes.fxaaShader.uniforms.resolution.value.set(1 / this.sizes.viewport.width, 1 / this.sizes.viewport.height)
        })
    }

    setWorld() {
        this.world = new World({
            config: this.config,
            debug: this.debug,
            resources: this.resources,
            time: this.time,
            sizes: this.sizes,
            camera: this.camera,
            renderer: this.renderer,
            passes: this.passes
        })
        this.scene.add(
            this.world.lights.container,
            this.world.starsContainer,
            this.world.shipwreckContainer,
            this.world.astronautContainer,
            this.world.whoAmIContainer,
            this.world.whatIDoContainer,
            this.world.aboutMeContainer,
            this.world.logoContainer,
            this.world.projectsContainer,
            this.world.hubbleContainer,
            this.world.podContainer,
        )
    }

    setDOMElements() {
        this.DOM = new DOM({
            debug: this.debug,
            $canvas: this.$canvas,
            config: this.config,
            time: this.time,
            world: this.world,
            camera: this.camera,
            sizes: this.sizes,
            resources: this.resources,
            sounds: this.sounds,
            passes: this.passes
        })
    }

    setRaycaster() {
        this.raycasting = new Raycasting({
            camera: this.camera,
            resources: this.resources,
            time: this.time,
            world: this.world,
            DOM: this.DOM,
            debug: this.debug,
            config: this.config,
            passes: this.passes,
        })
    }

    setAnimations() {
        this.animations = new Animations({
            camera: this.camera,
            DOM: this.DOM,
            sizes: this.sizes,
            resources: this.resources,
            time: this.time,
            world: this.world,
            debug: this.debug,
            sounds: this.sounds,
            config: this.config,
            passes: this.passes,
        })
    }


}