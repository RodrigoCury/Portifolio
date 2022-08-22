import { Object3D, TextBufferGeometry } from 'three'

export default class Texts {
  /**
   * Constructor
   */
  constructor(_options) {
    // Options
    this.resources = _options.resources
    this.materials = _options.materials
    this.debug = _options.debug
    this.logosNames = _options.logosArray

    this.holograms = []

    this.homeText = {}

    if (this.resources.beenTriggered('ready')) {
      this.setHologramGeometries()
    } else {
      this.resources.on('ready', () => {
        this.setHologramGeometries()
        this.setupContactMeText()
      })
    }
  }

  setHologramGeometries() {
    this.holoProperties = {
      font: this.resources.items.mateSC,
      size: 0.5,
      height: 0.1,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelOffset: 0.005,
      bevelSegments: 4,
    }

    this.logosNames.forEach(({ title, level }) => {
      const geometry = new Object3D()
      geometry.name = title

      const levelText = '-'.repeat(level)

      const titleGeometry = this.createText(title)
      const levelGeometry = this.createTextGeometry(levelText)
      levelGeometry.translate(0, -0.5, 0)

      this.holograms.push({
        geometry,
        titleGeometry,
        levelGeometry,
      })
    })
  }

  setupContactMeText() {
    const contactText = 'Escolha um Destino'

    this.contactText = this.createTextGeometry(contactText)
  }

  createText(title) {
    const text = this.createTextGeometry(title)

    return text
  }

  createTextGeometry(textToRender) {
    const text = new TextBufferGeometry(textToRender, this.holoProperties)
    text.computeBoundingBox()
    text.translate(
      -(text.boundingBox.max.x - this.holoProperties.bevelSize) * 0.5,
      -(text.boundingBox.max.y - this.holoProperties.bevelSize) * 0.5,
      -(text.boundingBox.max.z - this.holoProperties.bevelThickness) * 0.5
    )

    return text
  }
}
