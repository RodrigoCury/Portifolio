import Loader from './Utils/Loader'
import EventEmitter from './Utils/EventEmitter'

/** 
 * Load Resources here
 *      jpgs, png, glbs, gltfs
 */

import DNASource from '../models/DNA.gltf'

/**
 * Resources Class
 */

export default class Resources extends EventEmitter {
    /**
     * Constructor
     */

    constructor() {
        super()

        this.loader = new Loader()
        this.items = {}

        // Setup all loads
        this.loader.load([
            { name: 'DNA Strand', source: DNASource }
        ])

        // Setup Triggers and put loaded resoucers on items Object
        this.loader.on('fileEnd', (_resource, _data) => {
            // Texture
            if (_resource.type === 'texture') {
                const texture = new THREE.Texture(_data)
                this.items[`${_resource.name}Texture`] = texture
            }


            this.items[_resource.name] = _data

            // Trigger progress
            this.trigger('progress', [this.loader.loaded / this.loader.toLoad])

        })

        this.loader.on('end', () => {
            // Trigger Ready
            this.trigger('ready')
        })
    }
}