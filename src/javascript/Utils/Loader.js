import EventEmitter from './EventEmitter'

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

        // Images 
        this.loaders.push({
            extentions: ['jpg', 'png'],
            action: _resource => {

                // New Image instance 
                const image = new Image()

                // Let Class know that the loading process has finished
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
        dracoLoader.setDecoderPath('/draco/')
        dracoLoader.setDecoderConfig({ type: 'js' })

        this.loaders.push({
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

    fileLoadEnd(_resource, _data) {
        this.loaded++
        this.items[_resource.name] = _data

        this.trigger('fileEnd', [_resource, _data])

        if (this.loaded === this.toLoad) {
            this.trigger('end')
        }
    }
}
