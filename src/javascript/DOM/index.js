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

        this.colors = {
            title: "#ffffff",
            subTitle: "#a0a0a0",
            p: "#6952AB"
        }

        this.font = [

        ]

        this.getDOMElements()
        this.setLoadingPage()
        this.setDom3dPosition()
        this.setupModals()
        this.setupCarousels()
    }

    getDOMElements() {
        this.loadingPage = document.querySelector('.loading-container')
        this.loadBar = document.querySelector('.load-bar')
        this.loadTexts = document.querySelector('.load-texts')
        this.exitLoadBtn = document.querySelector('.exit-load-btn')
        this.whiteout = document.querySelector('.loading-whiteout')


        this.homeDiv = document.querySelector('.homepage')
        this.whoami = [...document.querySelectorAll('.whoami-container')]
        this.projects = document.querySelector('.projects-container')
        this.modal = [...document.querySelectorAll(".modal-bg")]
        
        if(this.debug){
            this.text = [...document.querySelectorAll(".modal-ul-title")]
            this.debugFolder.addColor(this.colors, 'p').onChange(() => {
                this.text.forEach(child => {
                    child.style.color = this.colors.p
                })
            })
            this.text.forEach(child => {
                this.debugFolder.add(child.style , 'font-family', {
                    mateSC : 'Mate SC',
                    Caveat : "Caveat",
                    mSerrat : "Montserrat"
                })
            })
        }
    }

    setLoadingPage(){

        const textList = [
            "Configuração de Humor do TARS ajustada",
            "Calculando Rotas",
            "42 Rotas possíveis",
            "Menor rota contém apenas 14 Parsecs",
            "Analisando o HyperDrive",
            "Don't Panic",
            "Iniciando o Gerador de Improbabilidade Infinita",
            "Escolhendo a Música certa para a viagem",
            "'So Far Away' parece ser a melhor escolha",
            "Inicializando o Motor",
            "Finalizando Configurações",
        ]

        //Setting Up Animations

        this.sounds.play('loadAmbientSounds')

        const onReady = () => {
            this.loadTexts.innerHTML = 'Pronto para Decolar'
            this.loadBar.classList.add('hide')
            this.exitLoadBtn.classList.remove('hide')
        }

        if (this.resources.isLoading){
            this.sounds.play('loadingBar')
        }else{
            this.resources.on('startLoad', () => {
            })
        }

 
        this.resources.on('progress', progress => {
            this.loadTexts.innerHTML = textList[Math.floor(progress * 10)]
            this.loadBar.style.width = `${progress * 60}%`
        })

        this.resources.on('ready', () => {
            gsap.to(this.loadBar.style, {
                opacity: 0,
                duration: 0.5,
                ease: 'circ.out',
                onComplete: onReady
            })
            
            
        })

        this.exitLoadBtn.onclick = () => this.exitBtnClick()
    }

    setDom3dPosition() {
        this.firstPositions = [
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
            }

        ]

        this.secondPositions = [
            {
                name: 'projects',
                element: this.projects,
                position: new Vector3(0, -35, 0)
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

    setupModals(){
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

    setupCarousels(){
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
            if (self[position] > slides.length - 1){
                self[position] = 0
            } else if(self[position] < 0){
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

    async exitBtnClick(){
        this.sounds.play('btnBeep')
        this.exitLoadBtn.classList.add('hide')
        this.loadTexts.style.opacity=0
        gsap.to(this.loadTexts.style, {
            onStart: () => {
                this.sounds.play('liftoff')
                this.loadTexts.innerHTML = "Decolando"
                this.loadTexts.classList.add('load-texts-bigger')
            },
            opacity: 1,
            duration: 1,
            ease: 'circ.in',
            onComplete: () => this.startWarnings()
        })
    }

    async startWarnings() {
        setTimeout(() => {
            this.loadTexts.innerHTML = 'Descompressão detectada'
            this.loadTexts.classList.add('text-warning')
            this.sounds.play('alarmBeep')
            this.sounds.stop('loadingBar', 150)
            this.sounds.play('lowDescend')
            this.sounds.play('gasLeak')
        }, 1500)
        setTimeout(() => this.finishWarnings(), 3500)
    }

    async finishWarnings() {
        this.sounds.stop('alarmBeep', 1000)
        this.sounds.play('decompress')
        setTimeout(() => {
            this.sounds.play('whiteout')
            this.sounds.stop('decompress', 2500)
            this.sounds.stop('loadAmbientSounds', 1000)
            this.whiteout.style.zIndex = 1000
            gsap.to(this.whiteout.style, {
                opacity: 1,
                duration: 2,
                ease: 'power1.in',
                onComplete: () => this.exitLoadPage()
            })
        }, 300)
    }

    async exitLoadPage() {
        this.loadingPage.classList.add('hide'),
        setTimeout(() => {
            gsap.to(this.whiteout.style, {
                opacity: 0,
                duration: 1.5,
                ease: 'power1.out',
                onComplete: () => this.startScrolling()
            })
        }, 500)
    }

    startScrolling() {
        this.whiteout.classList.add('hide')
        this.sounds.play('theJourney')
    }

}
