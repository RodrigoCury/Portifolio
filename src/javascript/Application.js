// Utils
import Animations from './Utils/Animations'
import Raycasting from './Utils/Raycasting'
import Sizes from './Utils/Sizes'
import Time from './Utils/Time'


// Three
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

// Debug
import * as dat from 'dat.gui'

// Root
import Resources from './Resources'
import Camera from './Camera'

// DOM
import DOM from './DOM/index'


// World
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
            this.debug.close()
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
            this.world.container,
            this.world.offContainer,
            this.world.whoAmIContainer,
            this.world.whatIDoContainer,
            this.world.aboutMeContainer,
            this.world.lights.container
        )

    }

    setDOMElements() {
        this.DOM = new DOM({
            debug: this.debug,
            $canvas: this.$canvas,
            time: this.time,
            world: this.world,
            camera: this.camera,
            sizes: this.sizes,
            resources: this.resources,
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
        })
    }


}