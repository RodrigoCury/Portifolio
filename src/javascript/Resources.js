import Loader from './Utils/Loader'
import EventEmitter from './Utils/EventEmitter'
/**
 * Load Resources here
 *      jpgs, png, glbs, gltfs
 */

// CubeMap
import nx from '../textures/nebulaEnvMap/nx.jpg'
import ny from '../textures/nebulaEnvMap/ny.jpg'
import nz from '../textures/nebulaEnvMap/nz.jpg'
import px from '../textures/nebulaEnvMap/px.jpg'
import py from '../textures/nebulaEnvMap/py.jpg'
import pz from '../textures/nebulaEnvMap/pz.jpg'

// Textures
import starAlphaMap from '../textures/alphamap/starsAlphaMap.png'

/**
 * FaceType Fonts
 */
const mateSC = '/static/fonts/mateSC.json'

/**
 * 3D Models
 */

// Logos

// import biopyLogo from '../models/logos/biopyLogo.glb'
// import djangoLogo from '../models/logos/djangoLogo.glb'
// import css from '../models/logos/css.glb'
// import html from '../models/logos/html.glb'
// import expressLogo from "../models/logos/Express.glb";
// import threeLogo from "../models/logos/threeLogo.glb";

import pyLogo from '../models/logos/pyLogo.glb'
import reactLogo from '../models/logos/React.glb'
import javaLogo from '../models/logos/Java.glb'
import awsLogo from '../models/logos/aws-logo.glb'
import dockerLogo from '../models/logos/docker.glb'
import ktLogo from '../models/logos/Kt-logo.glb'
import psqlLogo from '../models/logos/psql.glb'
import springLogo from '../models/logos/Spring.glb'
import jsLogo from '../models/logos/jsLogo.glb'
import linkedInLogo from '../models/logos/LInLogo.glb'
import githubLogo from '../models/logos/githubLogo.glb'
import eMailLogo from '../models/logos/eMailLogo.glb'

// ISS
import iss from '../models/iss/iss.glb'

// Hubble
import hubble from '../models/Hubble/hubble-min2.glb'

// Rescue Pod
import pod from '../models/pod/pod-min.glb'

// Astronaut
import astronaut from '../models/astronaut/astronautMatOnly-min.glb'
import astronautRigged from '../models/astronaut/astronaut-standing.glb'

// Ambient Assets
import notebook from '../models/ambientAssets/notebook.glb'
// import microscope from '../models/ambientAssets/microscope.glb'
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

      { name: 'mateSC', source: mateSC, type: 'font' },

      // Logos
      { name: 'awsLogo', source: awsLogo },
      { name: 'dockerLogo', source: dockerLogo },
      { name: 'ktLogo', source: ktLogo },
      { name: 'psqlLogo', source: psqlLogo },
      { name: 'reactLogo', source: reactLogo },
      { name: 'javaLogo', source: javaLogo },
      { name: 'springLogo', source: springLogo },
      { name: 'pyLogo', source: pyLogo },
      { name: 'jsLogo', source: jsLogo },
      { name: 'linkedInLogo', source: linkedInLogo },
      { name: 'githubLogo', source: githubLogo },
      { name: 'eMailLogo', source: eMailLogo },

      // 3D Models
      { name: 'iss', source: iss },
      { name: 'hubble', source: hubble },
      { name: 'astronaut', source: astronaut },
      { name: 'astronautRigged', source: astronautRigged },
      { name: 'notebook', source: notebook },
      { name: 'books', source: books },
      { name: 'headphone', source: headphone },
      { name: 'camera', source: camera },
      { name: 'shipwreck', source: shipwreck },
      { name: 'pod', source: pod },
    ])

    this.trigger('startLoad')
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
