export default class DOM {
    /**
     * Constructor
     */
    constructor(_options) {
        // Options
        this.debug = _options.debug
        this.$canvas = _options.$canvas
        this.time = _options.time
        this.world = _options.world
        this.camera = _options.camera
        this.sizes = _options.sizes
        this.resources = _options.resources

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("DOM Elements")
        }

        // Setup
        this.body = document.querySelector('body')

        this.colors = {
            title: "#ffffff",
            subTitle: "#a0a0a0",
            p: "#ffffff"
        }

        this.getDOMElements()
    }

    getDOMElements() {
        this.menuList = document.querySelector('.menu-list')
        this.menuBtns = [...this.menuList.children]
        this.homeDiv = document.querySelector('.home')
        this.content = document.querySelector('.content')
        console.log(this.menuBtns);
    }

}
