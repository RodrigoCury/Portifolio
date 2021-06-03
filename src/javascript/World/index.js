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

        this.positions = {
            dnaMeshPosition: new THREE.Vector3(3.3, 0, 0)
        }

        this.setLights()
        this.setMaterials()
        this.setAxes()
        this.setResources()
        // this.setSounds()
        // this.setControls()
        // this.setFloor()
        // this.setStartingScreen()

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
            this.axes2 = new THREE.AxesHelper(1)
            this.axes2.rotation.y = Math.PI * 1.5
            this.axes2.rotation.x = Math.PI
            this.container.add(this.axes, this.axes2)
            this.debugFolder.add(this.axes, 'visible').name("AxesHelper").onChange(() => {
                if (this.axes2) {
                    this.axes2 = false
                } else {
                    this.axes2 = true
                }
            })
        }
    }

    setLights() {
        this.lights = new Lights({
            debug: this.debug
        })

        this.container.add(this.lights.items.hemisphericalLight)
    }

    setMaterials() {
        this.materials = new Materials({
            resources: this._resources,
            debug: this.debug
        })
    }

    setResources() {
        this.setDNA()
    }
    setDNA() {
        this.resources.on('ready', () => {

            const strandSphereGeometry = new THREE.SphereBufferGeometry(0.05, 8, 8)
            const cylinderGeometry = new THREE.CylinderBufferGeometry(0.0125, 0.0125, 0.8, 8, 1, false)

            const spheresMesh = new THREE.InstancedMesh(
                strandSphereGeometry,
                this.materials.items.dnaMaterial,
                240)
            spheresMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

            const cylindersMesh = new THREE.InstancedMesh(
                cylinderGeometry,
                this.materials.items.dnaMaterial,
                120)

            cylindersMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

            const matrix = new THREE.Matrix4()

            this.resources.items.matrices.DNAStrandMatrices.sphereMatrices.forEach((m, idx) => {
                matrix.elements = m
                spheresMesh.setMatrixAt(idx, matrix)
            })

            this.resources.items.matrices.DNAStrandMatrices.cylindersMatrices.forEach((m, idx) => {
                matrix.elements = m
                cylindersMesh.setMatrixAt(idx, matrix)
            })

            this.dnaStrand = new THREE.Object3D()
            this.dnaStrand.add(cylindersMesh, spheresMesh)
            this.dnaStrand.position.copy(this.positions.dnaMeshPosition)

            this.time.on("tick", () => {
                this.dnaStrand.rotation.y = this.time.elapsed * 0.0002
            })
            this.container.add(this.dnaStrand)

            // Debug
            if (this.debug) {
                this.debugFolder.add(this.dnaStrand.position, 'x', -4, 4, 0.01).name("dnaX")
                this.debugFolder.add(this.dnaStrand.position, 'y', -4, 4, 0.01).name("dnaY")
                this.debugFolder.add(this.dnaStrand.position, 'z', -4, 4, 0.01).name("dnaZ")
            }
        })

    }
}

// // Tip 22
// const instances = 50
// const geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5)

// const material = new THREE.MeshNormalMaterial()

// const mesh = new THREE.InstancedMesh(geometry, material, instances)
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
// scene.add(mesh)

// for (let i = 0; i < instances; i++) {

//     const position = new THREE.Vector3(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//     )

//     const quaternion = new THREE.Quaternion()
//     quaternion.setFromEuler(new THREE.Euler(
//         (Math.random() - 0.5) * Math.PI * 2,
//         (Math.random() - 0.5) * Math.PI * 2,
//         0
//     ))

//     const matrix = new THREE.Matrix4()
//     matrix.makeRotationFromQuaternion(quaternion)
//     matrix.setPosition(position)
//     mesh.setMatrixAt(i, matrix)
// }


