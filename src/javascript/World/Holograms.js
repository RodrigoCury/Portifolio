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
        this.container = _options.container

        // Debug

        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Holograms")
        }

        this.setupGeometries()
        this.setupLightCone()
        this.setupContactTexts()
    }


    setupGeometries() {
        this.geometries.holograms.forEach(({geometry, titleGeometry, subtitleGeometry, levelGeometry }) => {
            const title = new Mesh(
                titleGeometry,
                this.materials.items.holoMaterial
            )
            const subtitle = new Mesh(
                subtitleGeometry,
                this.materials.items.holoMaterial
            )
            const level = new Mesh(
                levelGeometry,
                this.materials.items.holoMaterial
            )
            geometry.visible = false
            geometry.add(title, subtitle, level)

            this.container.add(geometry)
        })

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

        if (this.debug) {
            this.debugFolder.add(this.cone.position, 'x', -5, 6, 0.001).name(`X Cone`)
            this.debugFolder.add(this.cone.position, 'y', -5, 6, 0.001).name(`Y Cone`)
            this.debugFolder.add(this.cone.position, 'z', -5, 6, 0.001).name(`Z Cone`)
            this.debugFolder.add(this.cone.rotation, 'x', -Math.PI, Math.PI, 0.01).name(`rot x Cone`)
            this.debugFolder.add(this.cone.rotation, 'y', -Math.PI, Math.PI, 0.01).name(`rot y Cone`)
            this.debugFolder.add(this.cone.rotation, 'z', -Math.PI, Math.PI, 0.01).name(`rot z Cone`)
        }

        this.contactCone = new Mesh(
            new ConeBufferGeometry(1, 1, 16, 1, true,),
            this.materials.items.logoHoloBeam
        )


        if (this.debug) {
            this.debugFolder.add(this.contactCone.position, 'x', -15, 16, 0.001).name(`X ContactCone`)
            this.debugFolder.add(this.contactCone.position, 'y', -5, 5, 0.001).name(`Y ContactCone`)
            this.debugFolder.add(this.contactCone.position, 'z', -15, 16, 0.001).name(`Z ContactCone`)
            this.debugFolder.add(this.contactCone.rotation, 'x', -Math.PI, Math.PI, 0.01).name(`rot x ContactCone`)
            this.debugFolder.add(this.contactCone.rotation, 'y', -Math.PI, Math.PI, 0.01).name(`rot y ContactCone`)
            this.debugFolder.add(this.contactCone.rotation, 'z', -Math.PI, Math.PI, 0.01).name(`rot z ContactCone`)
        }
    }

    setupContactTexts() {
        this.contactHologram = new Mesh(this.geometries.contactText, this.materials.items.logoHoloMaterial)
    }
}