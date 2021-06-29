import EventEmitter from './EventEmitter'
import { CubeTextureLoader, FontLoader, TextureLoader } from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export default class Resources extends EventEmitter {

    /**
     * Constructor
     */
    constructor() {
        super()

        this.setLoaders()

        this.toLoad = 0
        this.loaded = 0
        this.items = {}
    }

    /**
     * Setting Up Loaders
     */
    setLoaders() {

        this.loaders = []

        // Font
        this.loaders.push({
            name: "FontLoader",
            extentions: [],
            action: _resource => {
                const fontLoader = new FontLoader()
                fontLoader.load(_resource.source,
                    _data => {
                        this.fileLoadEnd(_resource, _data)
                    })
            }
        })

        // Cube Texture
        this.loaders.push({
            name: 'CubeTexture',
            extentions: [],
            action: _resource => {
                const cubeTextureLoader = new CubeTextureLoader()
                cubeTextureLoader.load(_resource.source,
                    _data => {
                        this.fileLoadEnd(_resource, _data)
                    })

            }
        })

        // Textures 
        this.loaders.push({
            name: 'texture',
            extentions: ['jpg', 'png'],
            action: _resource => {

                const textureLoader = new TextureLoader()
                textureLoader.load(_resource.source,
                    _data => {
                        this.fileLoadEnd(_resource, _data)
                    })

            }
        })

        // Images
        this.loaders.push({
            name: 'images',
            extentions: [],
            action: (_resource) => {
                const image = new Image()

                image.addEventListener('load', () => {
                    this.fileLoadEnd(_resource, image)
                })

                image.addEventListener('error', () => {
                    this.fileLoadEnd(_resource, image)
                })

                image.src = _resource.source
            }
        })

        // Draco Loader
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/static/draco/')
        dracoLoader.setDecoderConfig({ type: 'js' })

        this.loaders.push({
            name: 'Draco',
            extentions: ['drc'],
            action: _resource => {
                dracoLoader.load(_resource.source, _data => {
                    this.fileLoadEnd(_resource, _data)

                    DRACOLoader.releaseDecoderModule()
                })
            }
        })

        // GLTF Loader

        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        this.loaders.push({
            name: 'GLTF',
            extentions: ['glb', 'gltf'],
            action: _resource => {
                gltfLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })


    }

    load(_resources = []) {
        for (const _resource of _resources) {
            this.toLoad++
            if (_resource.type === 'cubeTexture') {
                const loader = this.loaders.find(_loader => _loader.name === 'CubeTexture')
                if (loader) {
                    loader.action(_resource)
                } else {
                    console.warn(`Can't find loader for ${_resource}`)
                }
            } else if (_resource.type === 'image') {
                const loader = this.loaders.find(_loader => _loader.name === 'images')
                if (loader) {
                    loader.action(_resource)
                } else {
                    console.warn(`Can't find loader for ${_resource}`)
                }
            } else if (_resource.type == 'font') {
                const loader = this.loaders.find(_loader => _loader.name === 'FontLoader')
                if (loader) {
                    loader.action(_resource)
                } else {
                    console.warn(`Can't find loader for ${_resource}`)
                }
            } else {
                const extentionMatch = _resource.source.match(/\.([a-z]+)$/)

                if (typeof extentionMatch[1] !== 'undefined') {

                    const extension = extentionMatch[1]

                    const loader = this.loaders.find(_loader => {
                        return _loader.extentions.find(_extention => _extention === extension)
                    })

                    if (loader) {
                        loader.action(_resource)
                    } else {
                        console.warn(`Can't find loader for ${extension}`)
                    }

                } else {
                    console.warn(`Can't find extension for ${_resource}`)
                }
            }

        }
    }

    fileLoadEnd(_resource, _data) {
        this.loaded++
        this.items[_resource.name] = _data

        this.trigger('fileEnd', [_resource, _data])

        if (this.loaded === this.toLoad) {
            this.trigger('end')
        }
    }
}


