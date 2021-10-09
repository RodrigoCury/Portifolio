import { Object3D, TextBufferGeometry, Mesh } from "three";

export default class Texts {
  /**
   * Constructor
   */

  constructor(_options) {
    // Options
    this.resources = _options.resources;
    this.materials = _options.materials;
    this.debug = _options.debug;
    this.logosNames = _options.logosArray.map((logoObj) => logoObj[3]);

    this.holograms = [];

    this.homeText = {};

    if (this.resources.beenTriggered("ready")) {
      this.setHologramGeometries();
    } else {
      this.resources.on("ready", () => {
        this.setHologramGeometries();
      });
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
    };

    this.logosNames.forEach((text) => {
      const geometry = new TextBufferGeometry(text, this.holoProperties);
      geometry.computeBoundingBox();
      geometry.translate(
        -(geometry.boundingBox.max.x - this.holoProperties.bevelSize) * 0.5,
        -(geometry.boundingBox.max.y - this.holoProperties.bevelSize) * 0.5,
        -(geometry.boundingBox.max.z - this.holoProperties.bevelThickness) * 0.5
      );
      geometry.name = text;

      this.holograms.push(geometry);
    });

    let contactText = "Escolha um Destino";

    this.contactText = new TextBufferGeometry(contactText, this.holoProperties);
    this.contactText.computeBoundingBox();
    this.contactText.translate(
      -(this.contactText.boundingBox.max.x - this.holoProperties.bevelSize) *
        0.5,
      -(this.contactText.boundingBox.max.y - this.holoProperties.bevelSize) *
        0.5,
      -(
        this.contactText.boundingBox.max.z - this.holoProperties.bevelThickness
      ) * 0.5
    );
  }
}
