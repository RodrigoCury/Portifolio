import * as THREE from 'three'
import { Matrix4 } from 'three'
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
        this.setPositions()
    }

    start() {
        window.setTimeout(function () {
            this.camera.pan.enable()
        }, 2000)
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
            debug: this.debug
        })
    }

    setResources() {
        this.setDNA()
    }
    setDNA() {
        this.resources.on('ready', () => {
            // DNA Object
            this.dnaStrand = {}

            // Materials
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

        })

    }
    setPositions() {
        this.resources.on('ready', () => {
            this.dnaStrandDistance = this.camera.instance.position.distanceTo(new THREE.Vector3(0, 0, 0)) * Math.tan(this.camera.topFOV / 2 * 0.70 * Math.PI / 180)
            this.dnaObject.position.x = this.dnaStrandDistance

            this.time.on('tick', () => {
                this.dnaObject.rotation.y = this.time.elapsed * 0.0002
                this.dnaObject.position.x = Math.sin(this.camera.rotationAngle - Math.PI / 2) * this.dnaStrandDistance
                this.dnaObject.position.z = Math.cos(this.camera.rotationAngle - Math.PI / 2) * this.dnaStrandDistance
            })
        })

        // Resize
        window.addEventListener('resize', () => {
            // Recalculate Dna distance to V(0,y,0)
            this.dnaStrandDistance = this.camera.instance.position.distanceTo(new THREE.Vector3(0, 0, 0)) * Math.tan(this.camera.topFOV / 2 * 0.70 * Math.PI / 180)
        })
    }
}