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
            mesh.position.set(-2, 0, 4)
            mesh.rotation.y = Math.PI / 2

            this.container.add(mesh)
        })
    }

    setupLightCone() {
        this.cone = new Mesh(
            new ConeBufferGeometry(1, 1, 16, 1, true,),
            this.materials.items.beamMaterial
        )
        this.cone.visible = false
        this.cone.position.set(-1.4, -0.75, 4)
        this.cone.rotation.set(0, Math.PI, 2)


        if (this.debug) {
            this.debugFolder.add(this.cone.position, 'x', -5, 5, 0.01).name(`X`)
            this.debugFolder.add(this.cone.position, 'y', -5, 5, 0.01).name(`Y`)
            this.debugFolder.add(this.cone.position, 'z', -5, 5, 0.01).name(`Z`)
            this.debugFolder.add(this.cone.rotation, 'x', -Math.PI, Math.PI, 0.01).name(`rot x`)
            this.debugFolder.add(this.cone.rotation, 'y', -Math.PI, Math.PI, 0.01).name(`rot y`)
            this.debugFolder.add(this.cone.rotation, 'z', -Math.PI, Math.PI, 0.01).name(`rot z`)
        }
    }
}