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
        this.spheresPositions = {
            home: new THREE.Matrix4(),
            about: new THREE.Matrix4(),
            projects: new THREE.Matrix4(),
            tech: new THREE.Matrix4(),
            contact: new THREE.Matrix4(),
        }
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = true

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
            this.axes = new THREE.AxesHelper(2)
            this.container.add(this.axes)
            this.debugFolder.add(this.axes, 'visible').name("AxesHelper")
        }
    }

    setLights() {
        this.lights = new Lights({
            debug: this.debug
        })

        // this.container.add(this.lights.items.hemisphericalLight)
    }

    setMaterials() {
        this.materials = new Materials({
            resources: this._resources,
            debug: this.debug
        })
    }

    setResources() {
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

            const dnaStrand = new THREE.Object3D()
            dnaStrand.add(cylindersMesh, spheresMesh)
            dnaStrand.position.x = 3.3

            this.time.on("tick", () => {
                dnaStrand.rotation.y = this.time.elapsed * 0.0002
                spheresMesh.getMatrixAt(73, this.spheresPositions.home)
                spheresMesh.getMatrixAt(67, this.spheresPositions.about)
                spheresMesh.getMatrixAt(50, this.spheresPositions.tech)
                spheresMesh.getMatrixAt(44, this.spheresPositions.projects)
                spheresMesh.getMatrixAt(203, this.spheresPositions.contact)
            })
            this.container.add(dnaStrand)
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


