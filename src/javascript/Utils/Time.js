import EventEmitter from './EventEmitter'
const Stats = require('stats.js')



export default class Time extends EventEmitter {
    /**
     * Constructor
     */
    constructor() {
        super()

        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        this.tick = this.tick.bind(this)
        this.tick()
        this.frames = 0
    }

    /**
     * Tick
     */
    tick() {
        this.stats.begin()
        this.frames++
        this.ticker = window.requestAnimationFrame(this.tick)

        const current = Date.now()

        this.delta = current - this.current
        this.elapsed = current - this.start
        this.current = current

        if (this.delta > 60) {
            this.delta = 60
        }

        this.trigger('tick')
        this.stats.end()
    }


    /**
     * Stop
     */
    stop() {
        window.cancelAnimationFrame(this.ticker)
    }
}