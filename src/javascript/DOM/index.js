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

        this.colors = {
            title: "#ffffff",
            subTitle: "#ffffff",
        }

    }

    setHomePage() {
        // TittleDiv
        this.mainDIV = document.createElement('div')
        this.mainDIV.className = 'intro'
        this.mainDIV.style.position = 'fixed'
        this.mainDIV.style.height = '10vh'
        this.mainDIV.style.width = '50vw'
        this.mainDIV.style.top = '45vh'
        this.mainDIV.style.left = '10vw'
        this.body.appendChild(this.mainDIV)

        // Title
        this.title = document.createElement('h1')
        this.title.className = 'name'
        this.title.style.fontFamily = 'Caveat'
        this.title.style.fontSize = '10vh'
        this.title.style.color = this.colors.title
        this.title.innerHTML = "Rodrigo Cury"

        this.subTitle = document.createElement('p')
        this.subTitle.className = 'subtitle'
        this.subTitle.style.fontFamily = 'Mate SC'
        this.subTitle.style.color = this.colors.subTitle
        this.subTitle.innerHTML = `Desenvolvedor FullStack & Biotecnologista`


        if (this.debug) {
            this.debugFolder.addColor(this.colors, 'title').onChange(() => {
                this.title.style.color = this.colors.title
            })
            this.debugFolder.addColor(this.colors, 'subTitle').onChange(() => {
                this.subTitle.style.color = this.colors.subTitle
            })
        }

        this.mainDIV.appendChild(this.title)
        this.mainDIV.appendChild(this.subTitle)
    }
}
