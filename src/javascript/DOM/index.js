import gsap from 'gsap/gsap-core'
import { Vector3 } from 'three'
import { Howl, Howler } from 'howler'

export default class DOM {
    /**
     * Constructor
     */
    constructor(_options) {
        // Options
        this.debug = _options.debug
        this.$canvas = _options.$canvas
        this.time = _options.time
        this.config = _options.config
        this.world = _options.world
        this.camera = _options.camera
        this.sizes = _options.sizes
        this.resources = _options.resources
        this.sounds = _options.sounds

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("DOM Elements")
        }

        // Setup
        this.body = document.querySelector('body')

        this.font = [

        ]

        this.getDOMElements()
        this.setDom3dPosition()
        this.setupModals()
        this.setupCarousels()
        this.setupMutebtns()
        this.setTouch()
    }

    getDOMElements() {
        // Home Page DOM Elements
        this.welcomePage = document.querySelector('.welcome-container')
        this.loadingPage = document.querySelector('.loading-container')
        this.imgWarning = document.querySelector('.warning-img-container')
        this.loadBar = document.querySelector('.load-bar')
        this.loadTexts = document.querySelector('.load-texts')
        this.exitLoadBtn = document.querySelector('.exit-load-btn')
        this.whiteout = document.querySelector('.loading-whiteout')
        this.enterSiteBtn = document.querySelector('.enter-site')

        // Major containers
        this.homeDiv = document.querySelector('.homepage')
        this.whoamiContainer = document.querySelector('.whoami')
        this.whoami = [...document.querySelectorAll('.whoami-container')]
        this.techDiv = document.querySelector('.technologies-container')
        this.projects = document.querySelector('.projects-container')
        this.modal = [...document.querySelectorAll(".modal-bg")]
        this.madeWith = document.querySelector('.made-with-container')
        this.contact = document.querySelector('.contact-container')

        // Btn
        this.mutebtn = document.querySelector('.mute-btn')
        this.unmutebtn = document.querySelector('.unmute-btn')

        // Elements to Animate
        this.scrollDown = [document.querySelector('.scroll-down-container'), document.querySelector('.arrows-container')]
        this.touchScroll = document.querySelector('.touch-scroll')
        this.mouseMove = document.querySelector('.mouse-move')
        this.touchClick = document.querySelector('.touch-click')

    }

    setTouch() {
        if (this.config.isTouch || this.config.isMobile) {
            let welcomeText = document.querySelector('.welcome-text')
            welcomeText.innerHTML = 'Arraste a tela para explorar'

            let techMouseText = document.querySelector('.tech-mouse-p')
            techMouseText.innerHTML = 'Toque nas Logos'
        }
    }

    setDom3dPosition() {
        this.firstPositions = [
            {
                name: 'welcomeDiv',
                element: this.welcomePage,
                position: new Vector3(0, 6, 0)
            },
            {
                name: 'homeDiv',
                element: this.homeDiv,
                position: new Vector3(0, 2, 0)
            },
            {
                name: 'whoami',
                element: this.whoami[0],
                position: new Vector3(0, -2, 0)
            },
            {
                name: 'whatido',
                element: this.whoami[1],
                position: new Vector3(0, -6, 0)
            },
            {
                name: 'aboutme',
                element: this.whoami[2],
                position: new Vector3(0, -10, 0)
            },
            {
                name: 'technologies',
                element: this.techDiv,
                position: new Vector3(0, -20, 0)

            },
            {
                name: 'projects',
                element: this.projects,
                position: new Vector3(0, -35, 0)
            },
            {
                name: 'madeWith',
                element: this.madeWith,
                position: new Vector3(0, -45, 0)
            },
            {
                name: 'contact',
                element: this.contact,
                position: new Vector3(0, -57, 0)
            },
        ]

        this.modals = [
            {
                name: 'coin-info',
                element: this.modal[0],
                position: new Vector3(0, -35, 0)
            },
            {
                name: 'bioinformatizado-info',
                element: this.modal[1],
                position: new Vector3(0, -35, 0)
            },
            {
                name: 'bioinfo-project-info',
                element: this.modal[2],
                position: new Vector3(0, -35, 0)
            },
        ]

    }

    setupModals() {
        this.openModalBtns = [
            document.getElementById('coin-info'),
            document.getElementById('bioinformatizado-info'),
            document.getElementById('bioinfo-project-info'),
        ]

        this.closeModalBtns = [
            document.getElementById('coin-quit'),
            document.getElementById('bioinformatizado-quit'),
            document.getElementById('bioinfo-project-quit'),
        ]
    }

    setupCarousels() {
        this.coinSlidePos = 0
        this.bioinformatizadoSlidePos = 0
        this.biInfoPSlidePos = 0

        // Carousel Buttons
        this.coinBack = document.querySelector("#coin-back")
        this.coinForward = document.querySelector("#coin-forward")

        this.bioinformatizadoBack = document.querySelector("#bioinformatizado-back")
        this.bioinformatizadoForward = document.querySelector("#bioinformatizado-forward")

        this.bioInfoPBack = document.querySelector("#bioinfop-back")
        this.bioInfoPForward = document.querySelector("#bioinfop-forward")

        // Carousel Slides
        this.coinSlides = [...document.getElementsByClassName("modal-img-coin")]
        this.bioinsformatizadoSlides = [...document.getElementsByClassName("modal-img-bioinformatizado")]
        this.bioIndoPSlides = [...document.getElementsByClassName("modal-img-bioinfop")]

        // Self For Event Scope problems
        const self = this

        // Slides Function
        this.slideShow = (position, slides, n) => {
            self[position] += n
            if (self[position] > slides.length - 1) {
                self[position] = 0
            } else if (self[position] < 0) {
                self[position] = slides.length - 1
            }
            console.log(self[position], slides, n);

            slides.forEach(i => i.classList.add('hide'))
            slides[self[position]].classList.remove('hide')
        }
        this.coinBack.onclick = () => this.slideShow('coinSlidePos', this.coinSlides, -1)
        this.coinForward.onclick = () => this.slideShow('coinSlidePos', this.coinSlides, 1)
        this.bioinformatizadoBack.onclick = () => this.slideShow('bioinformatizadoSlidePos', this.bioinsformatizadoSlides, -1)
        this.bioinformatizadoForward.onclick = () => this.slideShow('bioinformatizadoSlidePos', this.bioinsformatizadoSlides, 1)
        this.bioInfoPBack.onclick = () => this.slideShow('biInfoPSlidePos', this.bioIndoPSlides, -1)
        this.bioInfoPForward.onclick = () => this.slideShow('biInfoPSlidePos', this.bioIndoPSlides, 1)
    }

    setupMutebtns() {
        // M Key
        window.addEventListener('keydown', (_event) => {
            if (_event.key === 'm') {
                if (!this.sounds.muted) {
                    this.mutebtn.onclick()
                } else {
                    this.unmutebtn.onclick()
                }
            }
        })

        this.mutebtn.onclick = () => {
            this.sounds.mute()
            this.mutebtn.classList.toggle('hide')
            this.unmutebtn.classList.toggle('hide')
        }
        this.unmutebtn.onclick = () => {
            this.sounds.unmute()
            this.mutebtn.classList.toggle('hide')
            this.unmutebtn.classList.toggle('hide')
        }
    }

}