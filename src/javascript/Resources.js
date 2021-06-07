import Loader from './Utils/Loader'
import EventEmitter from './Utils/EventEmitter'
import { Texture } from 'three'
/**
 * Load Matrices
 */

import DNAStrand from '../models/matrices/dnaMatrices.json'

/** 
 * Load Resources here
 *      jpgs, png, glbs, gltfs
 */
import nx from '../textures/nebulaEnvMap/nx.png'
import ny from '../textures/nebulaEnvMap/ny.png'
import nz from '../textures/nebulaEnvMap/nz.png'
import px from '../textures/nebulaEnvMap/px.png'
import py from '../textures/nebulaEnvMap/py.png'
import pz from '../textures/nebulaEnvMap/pz.png'

// Logos
import pyLogo from '../models/logos/pyLogo.glb'
import biopyLogo from '../models/logos/biopyLogo.glb'
import css from '../models/logos/css.glb'
import html from '../models/logos/html.glb'
import djangoLogo from '../models/logos/djangoLogo.glb'
import jsLogo from '../models/logos/jsLogo.glb'
import threeLogo from '../models/logos/threeLogo.glb'

// ISS
import iss from '../models/iss/iss.glb'

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

        // setup instancedMesh Matrices
        this.setUpMatrices()

        // Setup all loads
        this.loader.load([

            // EnvMaps
            { name: 'envMap', source: [px, nx, py, ny, pz, nz] },

            // Logos
            { name: 'pyLogo', source: pyLogo },
            { name: 'biopyLogo', source: biopyLogo },
            { name: 'css', source: css },
            { name: 'html', source: html },
            { name: 'djangoLogo', source: djangoLogo },
            { name: 'jsLogo', source: jsLogo },
            { name: 'threeLogo', source: threeLogo },

            // 3D Models
            { name: 'iss', source: iss }
        ])

        // Setup Triggers and put loaded resoucers on items Object
        this.loader.on('fileEnd', (_resource, _data) => {
            // Texture
            if (_resource.type === 'texture') {
                const texture = new Texture(_data)
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

    setUpMatrices() {
        this.items.matrices = {}
        this.items.matrices.DNAStrandMatrices = DNAStrand
    }
}