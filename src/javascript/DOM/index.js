import { Vector2, Vector3 } from 'three'

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
            p: "#6952AB"
        }

        this.font = [

        ]

        this.getDOMElements()
        this.setDom3dPosition()
        this.setupModals()
    }

    getDOMElements() {
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

}
