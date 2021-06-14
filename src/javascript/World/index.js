import * as THREE from 'three'
import Lights from './Lights'
import Materials from './Materials'
import Areas from './Areas'
import Holograms from './Holograms'
import { AxesHelper, PlaneBufferGeometry } from 'three'
import Texts from './Text'

export default class {
    constructor(_options) {
        // Options
        this.config = _options.config
        this.debug = _options.debug
        this.resources = _options.resources
        this.time = _options.time
        this.sizes = _options.sizes
        this.camera = _options.camera
        this.renderer = _options.renderer
        this.passes = _options.passes



        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("World")
            // this.debugFolder.open()
        }

        // Setup
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = true

        this.setLights()

        this.setMaterials()
        this.setAxes()
        this.setResources()

    }

    setAxes() {
        // Debug
        if (this.debug) {
            this.axes = new THREE.AxesHelper(1)
            this.container.add(this.axes)
            this.debugFolder.add(this.axes, 'visible')
        }
    }

    setLights() {
        this.lights = new Lights({
            debug: this.debug
        })

        this.container.add(this.lights.container)
    }

    setMaterials() {
        this.materials = new Materials({
            resources: this.resources,
            debug: this.debug,
            time: this.time,
        })
    }

    setResources() {
        this.resources.on('ready', () => {
            this.setTextGeometries()
            this.setupHomePage()
            this.setupLogos()
            this.setupISS()
            this.setupHolograms()
            this.setupProjects()
        })
    }

    setTextGeometries() {
        this.text = new Texts({
            resources: this.resources,
            debug: this.debug,
            materials: this.materials,
        })
    }

    setupHomePage() {
        // this.homeContainer = new THREE.Object3D()
        // this.homeContainer.rotation.y = Math.PI

        // this.homeBackground = new THREE.Object3D()
        // this.text.homeText.dev.position.y = 1
        // this.text.homeText.biotechnology.position.y = -1
        // this.homeBackground.add(
        //     this.text.homeText.dev,
        //     this.text.homeText.fullStack,
        //     this.text.homeText.biotechnology,
        // )
        // this.homeContainer.add(this.text.homeText.name, this.homeBackground)
        // this.container.add(this.homeContainer)
    }

    setupLogos() {
        //Set Logo Container
        this.logoContainer = new THREE.Object3D()
        this.logoContainer.position.z = -3.25
        this.logoContainer.position.x = -3.25
        this.logoContainer.position.y = -3.5
        this.logoContainer.rotation.y = Math.PI * 0.25

        if (this.debug) {
            this.debugFolder.add(this.logoContainer.position, "z", -10, 10, 0.01).name("logoC Z")
            this.debugFolder.add(this.logoContainer.position, "y", -10, 10, 0.01).name("logoC Y")
            this.debugFolder.add(this.logoContainer.position, "x", -10, 10, 0.01).name("logoC X")
            this.debugFolder.add(this.logoContainer.rotation, "y", -Math.PI, Math.PI, 0.01).name("logoC Rot")
        }

        // Set Raycaster Areas
        this.logosArea = Areas.addArea()
        /**
         * TOP
         */

        // Set Python Logo
        this.resources.items.pyLogo.scene.position.set(-1, 2, 0)
        this.resources.items.pyLogo.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.pyLogo.scene, 'Python')

        // Set Javascript Logo
        this.resources.items.jsLogo.scene.position.set(1, 2, 0)
        this.resources.items.jsLogo.scene.rotation.x = Math.PI / 2
        this.resources.items.jsLogo.scene.scale.set(0.9, 0.9, 0.9)
        this.logosArea.addToArea(2, 2, this.resources.items.jsLogo.scene, 'Javascript')

        /**
         * Middle
         */

        // Django Logo
        this.resources.items.djangoLogo.scene.position.set(-2, 0, 0)
        this.resources.items.djangoLogo.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.djangoLogo.scene, 'Django')

        // Set BioPython Logo
        this.resources.items.biopyLogo.scene.position.set(0, 0, 0)
        this.resources.items.biopyLogo.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.biopyLogo.scene, 'Biopython')

        // Set THREE.js Logo
        this.resources.items.threeLogo.scene.position.set(2, 0, 0)
        this.resources.items.threeLogo.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.threeLogo.scene, 'Three.js')

        /**
         * Bottom
         */

        // Set HTML Logo
        this.resources.items.html.scene.position.set(-1, -2, 0)
        this.resources.items.html.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.html.scene, 'HTML')

        // Set CSS Logo
        this.resources.items.css.scene.position.set(1, -2, 0)
        this.resources.items.css.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.css.scene, 'CSS')



        /**
         *  Add Logos to Logo Container
         */

        this.logoContainer.add(
            this.resources.items.pyLogo.scene,
            this.resources.items.biopyLogo.scene,
            this.resources.items.css.scene,
            this.resources.items.html.scene,
            this.resources.items.jsLogo.scene,
            this.resources.items.threeLogo.scene,
            this.resources.items.djangoLogo.scene,
            this.logosArea

        )
        this.container.add(this.logoContainer)

    }

    setupISS() {
        this.resources.items.iss.scene.scale.set(0.3, 0.3, 0.3)
        this.resources.items.iss.scene.rotation.z = -Math.PI / 2
        this.resources.items.iss.scene.position.set(0, -1, 4)
        this.logoContainer.add(this.resources.items.iss.scene)

        this.lights.items.spotLight.position.copy(this.resources.items.iss.scene.position)
        this.lights.items.spotLight.target.position.copy(this.logoContainer.position)

        this.logoContainer.add(
            this.lights.items.spotLight,
            this.lights.items.spotLight.target,
        )

        this.time.on('tick', () => {
            this.lights.items.spotLight.target.position.x = Math.cos(this.time.elapsed * 0.0007) * 6
            this.lights.items.spotLight.target.position.y = 2.5 + Math.sin(this.time.elapsed * 0.0005) * 5

        })

    }

    setupHolograms() {
        this.holograms = new Holograms({
            debug: this.debug,
            materials: this.materials,
            resources: this.resources,
            geometries: this.text,
        })
        this.logoContainer.add(this.holograms.container, this.holograms.cone)
    }

    setupProjects() {
        this.projectsContainer = new THREE.Object3D()
        this.projectsContainer.position.set(7.5, -11, -1.25)

        this.resources.items.astronaut.scene.rotation.y = -2.3
        this.resources.items.astronaut.scene.position.set(1.8, -1.79, 6.8)



        // Add to containers
        this.projectsContainer.add(this.resources.items.astronaut.scene)
        this.container.add(this.projectsContainer)



        /**
         * Debug
         */
        if (this.debug) {
            //Debug Object
            this.debugObject = {
                astronautScale: 0.1,
            }

            // Container
            this.projectsFolder = this.debug.addFolder("Projects")
            this.projectsFolder.add(this.projectsContainer.position, 'x', -15, 15, 0.01).name("Container X")
            this.projectsFolder.add(this.projectsContainer.position, 'y', -15, 15, 0.01).name("Container Y")
            this.projectsFolder.add(this.projectsContainer.position, 'z', -15, 15, 0.01).name("Container Z")

            // Astronaut
            this.projectsFolder.add(this.resources.items.astronaut.scene.position, 'x', -15, 15, 0.01).name("Anaut X")
            this.projectsFolder.add(this.resources.items.astronaut.scene.position, 'y', -15, 15, 0.01).name("Anaut Y")
            this.projectsFolder.add(this.resources.items.astronaut.scene.position, 'z', -15, 15, 0.01).name("Anaut Z")
            this.projectsFolder.add(this.resources.items.astronaut.scene.rotation, 'y', -Math.PI, Math.PI, 0.01).name("Anaut Rot")
            this.projectsFolder.add(this.debugObject, 'astronautScale').name("Anaut Scale")
                .onChange(() => {
                    this.resources.items.astronaut.scene.scale.set(
                        this.debugObject.astronautScale,
                        this.debugObject.astronautScale,
                        this.debugObject.astronautScale,
                    )
                })
        }
    }
}