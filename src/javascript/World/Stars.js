import * as THREE from 'three'
import { PointsMaterial } from 'three'

export default class Stars{

    constructor(_options){
        this.debug = _options.debug
        this.resources = _options.resources
        this.time = _options.time
        this.container = _options.container

        if(this.debug){
            this.debugFolder = this.debug.addFolder("Stars")
        }

        // Setup
        this.count = 500
        this.vertices = new Float32Array(this.count * 3)


        for (let i = 0; i < this.count; i++){
            let angle = Math.random() * Math.PI * 2 // Random Angle
            let radius = 5 + Math.random() * 20     // Distance from center between 5 and 25

            let i3 = i*3
            this.vertices[i3] = Math.cos(angle) * radius
            this.vertices[i3 + 1] = THREE.MathUtils.randFloat(-60, 10) // Rando height from 10 to -60
            this.vertices[i3 + 2] = Math.sin(angle) * radius
            
        }
        
        this.bufferGeometry = new THREE.BufferGeometry()
        this.bufferGeometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3))


        this.pointMaterial = new THREE.PointsMaterial({
            size: 0.2,
            sizeAttenuation: true,
            alphaMap: this.resources.items.starAlphaMap,
            transparent: true,
            alphaTest: 0.01,
            depthTest: true,
            blending: THREE.AdditiveBlending,
        })
    
        this.starsMesh = new THREE.Points(this.bufferGeometry, this.pointMaterial)

        this.container.add(this.starsMesh)
    }
}