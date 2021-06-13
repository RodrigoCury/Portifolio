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

        // Debug

        if (this.debug) {
            this.debugFolder = this.debug.addFolder("Holograms")
        }


        // Setup
        this.holograms = []


        this.texts = [
            'Javascript',
            'Python',
            'Biopython',
            'Django',
            'Three.js',
            'HTML',
            'CSS',
        ]
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
        this.properties = {
            font: this.resources.items.mateSC,
            size: 0.5,
            height: 0.1,
            curveSegments: 8,
            bevelEnabled: true,
            bevelThickness: 0.005,
            bevelSize: 0.005,
            bevelOffset: 0.005,
            bevelSegments: 4
        }
        this.texts.forEach(text => {
            const geometry = new TextBufferGeometry(text, this.properties)
            geometry.computeBoundingBox()
            geometry.translate(
                -(geometry.boundingBox.max.x - this.properties.bevelSize) * .5,
                -(geometry.boundingBox.max.y - this.properties.bevelSize) * .5,
                -(geometry.boundingBox.max.z - this.properties.bevelThickness) * .5,
            )

            const mesh = new Mesh(
                geometry,
                this.materials.items.holoMaterial
            )
            mesh.name = text
            mesh.visible = false
            mesh.position.set(-2, 0, 4)
            mesh.rotation.y = Math.PI / 2
            this.container.add(mesh)

            if (false) {
                this.debugFolder.add(mesh.position, 'x', -5, 5, 0.01).name(`${text} X`)
                this.debugFolder.add(mesh.position, 'y', -5, 5, 0.01).name(`${text} Y`)
                this.debugFolder.add(mesh.position, 'z', -5, 5, 0.01).name(`${text} Z`)
                this.debugFolder.add(mesh.rotation, 'y', -Math.PI, Math.PI, 0.01).name(`${text} rot`)
            }

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