import Loader from './Utils/Loader'
import EventEmitter from './Utils/EventEmitter'
import { Texture } from 'three'

/** 
 * Load Resources here
 *      jpgs, png, glbs, gltfs
 */

// CubeMap
import nx from '../textures/nebulaEnvMap/nx.png'
import ny from '../textures/nebulaEnvMap/ny.png'
import nz from '../textures/nebulaEnvMap/nz.png'
import px from '../textures/nebulaEnvMap/px.png'
import py from '../textures/nebulaEnvMap/py.png'
import pz from '../textures/nebulaEnvMap/pz.png'

// Textures

/**
 * Fonts
 */
const shareTechMonoRegular = '/fonts/shareTechMonoRegular.json'
const mateSC = '/fonts/mateSC.json'
const caveat = '/fonts/caveat.json'


/**
 * 3D Models
 */

// Logos
import pyLogo from '../models/logos/pyLogo.glb'
import biopyLogo from '../models/logos/biopyLogo.glb'
import css from '../models/logos/css.glb'
import html from '../models/logos/html.glb'
import djangoLogo from '../models/logos/djangoLogo.glb'
import jsLogo from '../models/logos/jsLogo.glb'
import threeLogo from '../models/logos/threeLogo.glb'

// ISS
import iss from '../models/iss/iss.gltf'

// Astronaut
import astronaut from '../models/astronaut/astronautMatOnly.glb'


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

            // EnvMaps
            { name: 'envMap', source: [px, nx, py, ny, pz, nz], type: 'cubeTexture' },

            // Textures

            // Fonts

            { name: 'shareTechMonoRegular', source: shareTechMonoRegular, type: "font" },
            { name: 'mateSC', source: mateSC, type: "font" },
            { name: 'caveat', source: caveat, type: "font" },

            // Logos
            { name: 'pyLogo', source: pyLogo },
            { name: 'biopyLogo', source: biopyLogo },
            { name: 'css', source: css },
            { name: 'html', source: html },
            { name: 'djangoLogo', source: djangoLogo },
            { name: 'jsLogo', source: jsLogo },
            { name: 'threeLogo', source: threeLogo },

            // 3D Models
            { name: 'iss', source: iss },
            { name: 'astronaut', source: astronaut },
        ])

        // Setup Triggers and put loaded resoucers on items Object
        this.loader.on('fileEnd', (_resource, _data) => {

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