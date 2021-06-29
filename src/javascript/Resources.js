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
import starAlphaMap from '../textures/alphamap/starsAlphaMap.png'

/**
 * Fonts
 */
const mateSC = '/static/fonts/mateSC.json'


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
import iss from '../models/iss/iss.glb'


// Astronaut
import astronaut from '../models/astronaut/astronautMatOnly.glb'

// Ambient Assets
import notebook from '../models/ambientAssets/notebook.glb'
import microscope from '../models/ambientAssets/microscope.glb'
import books from '../models/ambientAssets/books.glb'
import headphone from '../models/ambientAssets/headphone.glb'
import camera from '../models/ambientAssets/camera.glb'

// Shipwreck
import shipwreck from '../models/shipwreck/shipwreck.glb'

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
            { name: 'starAlphaMap', source: starAlphaMap, type: 'texture' },
            

            // Images

            // Fonts

            { name: 'mateSC', source: mateSC, type: "font" },

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
            { name: 'notebook', source: notebook },
            { name: 'microscope', source:microscope },
            { name: 'books', source:books },
            { name: 'headphone', source:headphone },
            { name: 'camera', source:camera },
            { name: 'shipwreck', source:shipwreck },
        ])

        this.trigger("startLoad")
        this.isLoading = true

        // Setup Triggers and put loaded resoucers on items Object
        this.loader.on('fileEnd', (_resource, _data) => {

            this.items[_resource.name] = _data

            // Trigger progress
            this.trigger('progress', [this.loader.loaded / this.loader.toLoad])

        })

        this.loader.on('end', () => {
            // Trigger Ready
            this.isLoading = false
            this.trigger('ready')
        })

    }
}