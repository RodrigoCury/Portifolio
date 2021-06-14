import { Object3D, TextBufferGeometry, Mesh } from "three"

export default class Texts {
    /**
     * Constructor
     */

    constructor(_options) {
        console.log(_options);
        // Options
        this.resources = _options.resources
        this.materials = _options.materials
        this.debug = _options.debug

        this.holograms = []

        this.homeText = {}

        if (this.resources.beenTriggered("ready")) {
            this.setHologramGeometries()
            this.setupHomeTextGeometries()
        } else {
            this.resources.on("ready", () => {
                this.setHologramGeometries()
                this.setupHomeTextGeometries()
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

    setupHomeTextGeometries() {
        this.homeProperties = {
            font: this.resources.items.caveat,
            size: 0.5,
            height: 0.1,
            curveSegments: 6,
            bevelEnabled: false,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelOffset: 0.01,
            bevelSegments: 4
        }

        const nameGeometry = new TextBufferGeometry('Rodrigo Cury', this.homeProperties)
        nameGeometry.computeBoundingBox()
        nameGeometry.translate(
            -(nameGeometry.boundingBox.max.x - this.homeProperties.bevelSize) * .5,
            -(nameGeometry.boundingBox.max.y - this.homeProperties.bevelSize) * .5,
            -(nameGeometry.boundingBox.max.z - this.homeProperties.bevelThickness) * .5,
        )
        nameGeometry.name = 'Rodrigo Cury'

        this.homeProperties.font = this.resources.items.mateSC

        const devGeometry = new TextBufferGeometry('Dev', this.homeProperties)

        const fullStackGeometry = new TextBufferGeometry('FullStack', this.homeProperties)

        const biotechnologyGeometry = new TextBufferGeometry('Biotechnologist', this.homeProperties)

        this.homeText.name = new Mesh(nameGeometry, this.materials.items.pointMaterial)
        console.log("2");
        this.homeText.dev = new Mesh(devGeometry, this.materials.items.blackPearl)
        this.homeText.fullStack = new Mesh(fullStackGeometry, this.materials.items.blackPearl)
        this.homeText.biotechnology = new Mesh(biotechnologyGeometry, this.materials.items.blackPearl)

    }
}