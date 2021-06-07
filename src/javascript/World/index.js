import * as THREE from 'three'
import Lights from './Lights'
import Materials from './Materials'


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
            // this.axes = new THREE.AxesHelper(1)
            // this.container.add(this.axes)
            // this.debugFolder.add(this.axes, 'visible')
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
            debug: this.debug
        })
    }

    setResources() {
        this.resources.on('ready', () => {

            this.setDNA()
            this.setPositions()
            this.setupLogos()
            this.setupISS()
            this.container.traverse(child => {
                if (child instanceof THREE.Mesh &&
                    child.material instanceof THREE.MeshStandardMaterial) {
                    child.envMapIntensity = 3
                    console.log(child.envMapIntensity)
                }
            })
        })
    }

    setDNA() {
        // DNA Object
        this.dnaStrand = {}

        /**
         * SEPARATE MATERIALS
         */
        const strandSphereGeometry = new THREE.SphereBufferGeometry(0.05, 8, 8)
        const cylinderGeometry = new THREE.CylinderBufferGeometry(0.0125, 0.0125, 0.8, 8, 1, false)


        // Setting Up Instanced Meshes
        this.dnaStrand.spheresMesh = new THREE.InstancedMesh(
            strandSphereGeometry,
            this.materials.items.dnaMaterial,
            240)

        this.dnaStrand.cylindersMesh = new THREE.InstancedMesh(
            cylinderGeometry,
            this.materials.items.dnaMaterial,
            120)

        // Setting Usage for WebGL
        this.dnaStrand.spheresMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
        this.dnaStrand.cylindersMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

        // looping through all Spheres Mactrices to populate the scenes
        const matrix = new THREE.Matrix4()
        for (let m in this.resources.items.matrices.DNAStrandMatrices.sphereMatrices) {
            matrix.elements = this.resources.items.matrices.DNAStrandMatrices.sphereMatrices[m]
            this.dnaStrand.spheresMesh.setMatrixAt(m, matrix)
        }

        // looping through all Spheres Mactrices to populate the scenes
        for (let m in this.resources.items.matrices.DNAStrandMatrices.cylindersMatrices) {
            matrix.elements = this.resources.items.matrices.DNAStrandMatrices.cylindersMatrices[m]
            this.dnaStrand.cylindersMesh.setMatrixAt(m, matrix)
        }

        // Merge Both Cylyinders and Spheres on one OBJ
        this.dnaObject = new THREE.Object3D()
        this.dnaObject.add(this.dnaStrand.cylindersMesh, this.dnaStrand.spheresMesh)

        // Add to World Container
        this.container.add(this.dnaObject)
    }

    setupLogos() {
        this.logoContainer = new THREE.Object3D()
        this.logoContainer.position.z = -8
        this.logoContainer.position.x = 5
        this.logoContainer.position.y = -3.5
        this.logoContainer.rotation.y = -Math.PI * 0.25


        this.resources.items.pyLogo.scene.position.set(-1, 1.5, 3)
        this.resources.items.pyLogo.scene.rotation.x = Math.PI / 2
        this.resources.items.biopyLogo.scene.position.set(0, -1, 3)
        this.resources.items.biopyLogo.scene.rotation.x = Math.PI / 2
        this.resources.items.css.scene.position.set(1, -1.5, 3)
        this.resources.items.css.scene.rotation.x = Math.PI / 2
        this.resources.items.html.scene.position.set(-1, -3.7, 3)
        this.resources.items.html.scene.rotation.x = Math.PI / 2
        this.resources.items.jsLogo.scene.position.set(1, 1.5, 3)
        this.resources.items.jsLogo.scene.rotation.x = Math.PI / 2
        this.resources.items.jsLogo.scene.scale.set(0.9, 0.9, 0.9)
        this.resources.items.threeLogo.scene.position.set(3.5, 0, 3)
        this.resources.items.threeLogo.scene.rotation.x = Math.PI / 2
        this.resources.items.djangoLogo.scene.position.set(-3.6, 0, 3)
        this.resources.items.djangoLogo.scene.rotation.x = Math.PI / 2

        this.logoContainer.add(
            this.resources.items.pyLogo.scene,
            this.resources.items.biopyLogo.scene,
            this.resources.items.css.scene,
            this.resources.items.html.scene,
            this.resources.items.jsLogo.scene,
            this.resources.items.threeLogo.scene,
            this.resources.items.djangoLogo.scene,

        )
        this.container.add(this.logoContainer)

    }

    setupISS() {
        this.resources.items.iss.scene.scale.set(0.3, 0.3, 0.3)
        this.resources.items.iss.scene.rotation.z = -Math.PI / 2
        this.resources.items.iss.scene.position.set(0, -3, 7)
        this.logoContainer.add(this.resources.items.iss.scene)

        this.lights.items.spotLight.position.copy(this.resources.items.iss.scene.position)
        this.lights.items.spotLight.target.position.copy(this.logoContainer.position)

        this.logoContainer.add(
            this.lights.items.spotLight,
            this.lights.items.spotLight.target,
        )

        if (this.debug) {
            const spotLightHelper = new THREE.SpotLightHelper(this.lights.items.spotLight)
            spotLightHelper.matrixWorldNeedsUpdate = true
            // this.container.add(spotLightHelper)
        }

        this.time.on('tick', () => {
            this.lights.items.spotLight.target.position.x = Math.cos(this.time.elapsed * 0.0007) * 6
            this.lights.items.spotLight.target.position.y = 2.5 + Math.sin(this.time.elapsed * 0.0005) * 5
        })

    }



    setPositions() {
        this.dnaStrandDistance = this.camera.instance.position.distanceTo(new THREE.Vector3(0, 0, 0)) * Math.tan(this.camera.topFOV / 2 * 0.70 * Math.PI / 180)
        this.dnaObject.position.x = this.dnaStrandDistance

        this.time.on('tick', () => {
            this.dnaObject.rotation.y = this.time.elapsed * 0.0002
            this.dnaObject.position.x = Math.sin(this.camera.rotationAngle - Math.PI / 2) * this.dnaStrandDistance
            this.dnaObject.position.z = Math.cos(this.camera.rotationAngle - Math.PI / 2) * this.dnaStrandDistance
            this.dnaObject.position.y = this.camera.instance.position.y
        })

        // Resize
        window.addEventListener('resize', () => {
            // Recalculate Dna distance to V(0,y,0)
            this.dnaStrandDistance = this.camera.instance.position.distanceTo(new THREE.Vector3(0, 0, 0)) * Math.tan(this.camera.topFOV / 2 * 0.70 * Math.PI / 180)
        })
    }
}