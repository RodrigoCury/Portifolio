import { Object3D, TextBufferGeometry, Mesh } from "three"

export default class Texts {
    /**
     * Constructor
     */

    constructor(_options) {
        // Options
        this.resources = _options.resources
        this.materials = _options.materials
        this.debug = _options.debug

        this.holograms = []

        this.homeText = {}

        if (this.resources.beenTriggered("ready")) {
            this.setHologramGeometries()
        } else {
            this.resources.on("ready", () => {
                this.setHologramGeometries()
            })
        }
    }

    setHologramGeometries() {
        const texts = [
            'Javascript',
            'Python',
            'Biopython',
            'Django',
            'Three.js',
            'HTML',
            'CSS',
        ]
        this.holoProperties = {
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

        texts.forEach(text => {
            const geometry = new TextBufferGeometry(text, this.holoProperties)
            geometry.computeBoundingBox()
            geometry.translate(
                -(geometry.boundingBox.max.x - this.holoProperties.bevelSize) * .5,
                -(geometry.boundingBox.max.y - this.holoProperties.bevelSize) * .5,
                -(geometry.boundingBox.max.z - this.holoProperties.bevelThickness) * .5,
            )
            geometry.name = text


            this.holograms.push(geometry)

        })
    }
}