import Time from './Utils/Time'
import Sizes from './Utils/Sizes'
import Resources from './Resources'

import * as THREE from 'three'
import * as dat from 'dat.gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import Camera from './Camera'
import World from './World/index'

export default class Application {
    /**
     * Constructor
     */
    constructor(_options) {
        // Options
        this.$canvas = _options.$canvas

        // Setup
        this.time = new Time()
        this.sizes = new Sizes()
        this.resources = new Resources()

        this.setConfig()
        this.setDebug()
        this.setRenderer()
        this.setCamera()
        this.setPasses()
        this.setWorld()
    }

    /**
     * Configuration Setup
     */
    setConfig() {
        this.config = {}
        this.config.debug = window.location.hash = '#debug'
        this.config.touch = false

        window.addEventListener('touchstart', () => {
            // TODO
        })
    }

    /**
     * Setup Debug
     */

    setDebug() {
        if (this.config.debug) {
            this.debug = new dat.GUI({ width: this.sizes.width / 3 })
        }
    }

    /**
     * Renderer setup
     */

    setRenderer() {

        // Scene
        this.scene = new THREE.Scene()

        // Renderer 
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.$canvas,
            alpha: true,
        })

        // Clear Color
        this.renderer.setClearColor("#000000", 1)

        // Pixel Ratio Max 2
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Size
        this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)

        // Physically correct lights (Light get more dim when more far away M.R.)
        this.renderer.physicallyCorrectLights = true

        // Auto Clear
        this.renderer.autoClear = false

        // Resize Event
        this.sizes.on('resize', () => this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height))

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

        // this.passes.horizontalBlurPass = new ShaderPass(BlurPass)
        // this.passes.horizontalBlurPass.strength = this.config.touch ? 0 : 1
        // this.passes.horizontalBlurPass.material.uniforms.uResolution.value = new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height)
        // this.passes.horizontalBlurPass.material.uniforms.uStrength.value = new THREE.Vector2(this.passes.horizontalBlurPass.strength, 0)

        // Debug
        if (this.debug) {
            // const folder = this.passes.debugFolder.addFolder('blur')
            // folder.open()

            // folder.add(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, 'x').step(0.001).min(0).max(10)
        }

        // Add Passes
        this.passes.composer.addPass(this.passes.renderPass)
        // this.passes.composer.addPass(this.passes.horizontalBlurPass)

        // Time Tick
        this.time.on('tick', () => {
            // this.passes.horizontalBlurPass.enabled = this.passes.horizontalBlurPass.material.uniforms.uStrength.value.x > 0

            /**
             *  Renderer
             */

            this.passes.composer.render()
            // this.renderer.domElement.style.background = 'black'
            // this.renderer.render(this.scene, this.camera.instance)
        })


        // Resize event
        this.sizes.on('resize', () => {
            this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
            this.passes.composer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
            // this.passes.horizontalBlurPass.material.uniforms.uResolution.value.x = this.sizes.viewport.width
            // this.passes.horizontalBlurPass.material.uniforms.uResolution.value.y = this.sizes.viewport.height
        })
    }

    setWorld() {

    }
}