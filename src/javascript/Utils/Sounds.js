import { Howl, Howler } from 'howler'

import loadingAmbientSounds from '../../sounds/AmbientSounds3.mp3'
import loadingBar from '../../sounds/LoadingBar.mp3'
import whiteout from '../../sounds/WhiteOut.mp3'
import decompress from '../../sounds/decompress.mp3'
import gasLeak from '../../sounds/gasLeak.mp3'
import alarmBeep from '../../sounds/alarmBeep.mp3'
import btnBeep from '../../sounds/btnBeep.mp3'
import liftoff from '../../sounds/liftoff.mp3'
import lowDescend from '../../sounds/lowDescend.mp3'

export default class Sounds {
    constructor() {
        // Setup
        this.items = []

        this.setSettings()
        this.setMute()
        this.setMasterVolume()
    }

    setSettings(){
        this.settings = [
            {
                name: 'loadAmbientSounds',
                sounds: [loadingAmbientSounds],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: true,
            },
            {
                name:'loadingBar',
                sounds: [loadingBar],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: false,
            },
            {
                name: 'whiteout',
                sounds: [whiteout],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: false,
            },
            {
                name: 'decompress',
                sounds: [decompress],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: false,
            },
            {
                name: 'gasLeak',
                sounds: [gasLeak],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: false,
            },
            {
                name: 'alarmBeep',
                sounds: [alarmBeep],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: true,
            },
            {
                name: 'btnBeep',
                sounds: [btnBeep],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: false,
            },
            {
                name: 'liftoff',
                sounds: [liftoff],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: false,
            },
            {
                name: 'lowDescend',
                sounds: [lowDescend],
                minDelta: 100,
                velocityMin: 0,
                velocityMultiplier: 1,
                volumeMin: 1,
                volumeMax: 1,
                rateMin: 1,
                rateMax: 1,
                loop: false,
            },
        ]

        this.settings.forEach(_setting => this.add(_setting))
    }

    setMasterVolume(){
        // Set up
        this.masterVolume = 0.5
        Howler.volume(this.masterVolume)

        window.requestAnimationFrame(() => {
            Howler.volume(this.masterVolume)
        })

    }


    setMute(){
        // Set up
        this.muted = typeof this.debug !== 'undefined'
        Howler.mute(this.muted)

        // M Key
        window.addEventListener('keydown', (_event) => {
            if(_event.key === 'm') {
                this.muted = !this.muted
                Howler.mute(this.muted)
            }
        })

        // Tab focus / blur
        document.addEventListener('visibilitychange', () => {
            if(document.hidden) {
                Howler.mute(true)
            } else {
                Howler.mute(this.muted)
            }
        })

    }

    play(_name, _velocity){
        const item = this.items.find((_item) => _item.name === _name)
        const time = Date.now()
        const velocity = typeof _velocity === 'undefined' ? 0 : _velocity

        if(item && time > item.lastTime + item.minDelta && (item.velocityMin === 0 || velocity > item.velocityMin)) {
            // Find random sound
            const sound = item.sounds[Math.floor(Math.random() * item.sounds.length)]

            // Update volume
            let volume = Math.min(Math.max((velocity - item.velocityMin) * item.velocityMultiplier, item.volumeMin), item.volumeMax)
            volume = Math.pow(volume, 2)
            sound.volume(volume)

            // Update rate
            const rateAmplitude = item.rateMax - item.rateMin
            sound.rate(item.rateMin + Math.random() * rateAmplitude)

            // Play
            sound.play()

            // Save last play time
            item.lastTime = time
        }
    }

    add(_options) {
        const item = {
            name: _options.name,
            minDelta: _options.minDelta,
            velocityMin: _options.velocityMin,
            velocityMultiplier: _options.velocityMultiplier,
            volumeMin: _options.volumeMin,
            volumeMax: _options.volumeMax,
            rateMin: _options.rateMin,
            rateMax: _options.rateMax,
            lastTime: 0,
            sounds: [],
        }

        _options.sounds.forEach(sound => item.sounds.push(new Howl({src: [sound], loop: _options.loop,})))

        this.items.push(item)
    }

    stop(_name, _fade,){
        const item = this.items.find(_item => _item.name === _name)

        if(typeof _fade !== 'undefined'){
            item.sounds.forEach(_sound => _sound.fade(1.0, 0.0, _fade))
        } else {
            item.sounds.forEach(_sound => _sound.stop())
        }
    }
}