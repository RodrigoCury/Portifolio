import { ConeBufferGeometry, Mesh, Object3D, TextBufferGeometry } from 'three'

export default class Holograms {
    /**
     * Constructor
     */

    constructor(_options) {
        // Options
        this.debug = _options.debug
        this.materials = _options.materials
        this.resources = _options.resources
        this.geometries = _options.geometries

        // Debug

        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Holograms")
        }

        this.container = new Object3D()

        if (this.resources.beenTriggered("ready")) {
            this.setupGeometries()
            this.setupLightCone()
        } else {
            this.resources.on("ready", () => {
                this.setupGeometries()
                this.setupLightCone()
            })
        }
    }

    setupGeometries() {
        this.geometries.holograms.forEach(geometry => {
            const mesh = new Mesh(
                geometry,
                this.materials.items.holoMaterial
            )
            mesh.name = geometry.name
            mesh.visible = false

            this.container.add(mesh)
        })

        this.container.rotation.y = -1.224
        this.container.position.set(0.266, -0.38, 6.795)

        if (this.debug) {
            this.debugFolder.add(this.container.position, 'x', -10, 10, 0.001).name("Holograms X")
            this.debugFolder.add(this.container.position, 'y', -10, 10, 0.001).name("Holograms Y")
            this.debugFolder.add(this.container.position, 'z', -10, 10, 0.001).name("Holograms Z")
            this.debugFolder.add(this.container.rotation, 'x', -Math.PI, Math.PI, 0.001).name("Holograms Rot X")
            this.debugFolder.add(this.container.rotation, 'y', -Math.PI, Math.PI, 0.001).name("Holograms Rot Y")
            this.debugFolder.add(this.container.rotation, 'z', -Math.PI, Math.PI, 0.001).name("Holograms Rot Z")
        }
    }

    setupLightCone() {
        this.cone = new Mesh(
            new ConeBufferGeometry(1, 1, 16, 1, true,),
            this.materials.items.beamMaterial
        )
        this.cone.visible = false
        this.cone.position.set(5.298, -1.584, 5.297)
        this.cone.rotation.set(-Math.PI, 0.1, -2.32)


        if (this.debug) {
            this.debugFolder.add(this.cone.position, 'x', -5, 6, 0.001).name(`X Cone`)
            this.debugFolder.add(this.cone.position, 'y', -5, 6, 0.001).name(`Y Cone`)
            this.debugFolder.add(this.cone.position, 'z', -5, 6, 0.001).name(`Z Cone`)
            this.debugFolder.add(this.cone.rotation, 'x', -Math.PI, Math.PI, 0.01).name(`rot x Cone`)
            this.debugFolder.add(this.cone.rotation, 'y', -Math.PI, Math.PI, 0.01).name(`rot y Cone`)
            this.debugFolder.add(this.cone.rotation, 'z', -Math.PI, Math.PI, 0.01).name(`rot z Cone`)
        }
    }
}