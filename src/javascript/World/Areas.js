import * as THREE from 'three'

// Manages areas for the raycaster to intercept
export default class Areas {
    /**
     * Constructor
     */

    constructor(_options) {
    }

    static addArea() {
        const newArea = new THREE.Object3D()

        newArea.addToArea = (width, height, object, name) => {
            const plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(width, height),
                new THREE.MeshBasicMaterial()
            )

            plane.name = name
            plane.visible = false
            plane.position.copy(object.position)

            newArea.add(plane)
        }

        return newArea
    }
}