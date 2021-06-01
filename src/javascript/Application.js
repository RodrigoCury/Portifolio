import Time from './Utils/Time'
import Sizes from './Utils/Sizes'
import Resources from './Resources'

import * as THREE from 'three'
import * as dat from 'dat.gui'

export default class Application {
    /**
     * Constructor
     */
    constructor(_options) {
        // Options
        this.$canvas = _options.$canvas

        // Setup
        this.time = new Time()
        this.sizes = new Sizes()
        this.resources = new Resources()

        this.setConfig()
        this.setDebug()
        this.setRenderer()
        this.setCamera()
        this.setPasses()
        this.setWorld()
        this.setTitle()
    }
}