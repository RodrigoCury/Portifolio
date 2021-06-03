export default class DOM {
    /**
     * Constructor
     */
    constructor(_options) {
        // Options
        this.debug = _options.debug
        this.$canvas = _options.$canvas

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("DOM Elements")
        }

        // Setup
        this.body = document.querySelector('body')

        this.items = {}

        this.setHomePage()

    }

    setHomePage() {
        // TittleDiv
        const mainDIV = document.createElement('div')
        mainDIV.className = 'intro'
        mainDIV.style.position = 'fixed'
        mainDIV.style.height = '10vh'
        mainDIV.style.width = '100vw'
        mainDIV.style.top = '45vh'
        mainDIV.style.left = '10vw'
        this.body.appendChild(mainDIV)

        // Title
        const title = document.createElement('h1')
        title.className = 'name'
        title.style.fontFamily = 'Caveat'
        title.style.fontSize = '10vh'
        title.style.color = '#a70e0e'
        title.innerHTML = "Rodrigo Cury"
        mainDIV.appendChild(title)

        const subtitle = document.createElement('p')
        subtitle.className = 'subtitle'
        title.style.fontFamily = ''
    }
}
