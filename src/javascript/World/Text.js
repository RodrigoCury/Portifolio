import { Object3D, TextBufferGeometry } from "three"

export default class Texts {
    /**
     * Constructor
     */

    constructor(_options) {
        // Options
        this.resources = _options.resources
        this.debug = _options.debug

        this.holograms = []

        this.homeText = {}

        if (this.resources.beenTriggered("ready")) {
            this.setHologramGeometries()
            // this.setHomeTextGeometries()
        } else {
            this.resources.on("ready", () => {
                this.setHologramGeometries()
                // this.setHomeTextGeometries()
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

        texts.forEach(text => {
            const geometry = new TextBufferGeometry(text, this.properties)
            geometry.computeBoundingBox()
            geometry.translate(
                -(geometry.boundingBox.max.x - this.properties.bevelSize) * .5,
                -(geometry.boundingBox.max.y - this.properties.bevelSize) * .5,
                -(geometry.boundingBox.max.z - this.properties.bevelThickness) * .5,
            )
            geometry.name = text


            this.holograms.push(geometry)

        })
    }
}