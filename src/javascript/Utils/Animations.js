import gsap from 'gsap'
import { Vector2, Vector3, Mesh, MeshStandardMaterial } from 'three'

export default class Animations {

    /**
     * Constructot
     */

    constructor(_options) {
        // Options
        this.camera = _options.camera
        this.DOM = _options.DOM
        this.resources = _options.resources
        this.sizes = _options.sizes
        this.time = _options.time
        this.world = _options.world
        this.debug = _options.debug
        this.sounds = _options.sounds
        this.config = _options.config



        this.IDX = 0
        this.MAX_INDEX = -1

        // Setup
        this.setEases()
        this.setHelperFunctions()
        this.animateCamera()
        this.setScrollAnimations()
        this.setLoadingPage()
    }

    setEases() {
        // Animation Eases
        this.ease = {
            linear: 'none',
            slow: "slow (0.7, 0.1, false)",
            power2In: "power2.in",
            power2Out: "power2.out",
            power2InOut: "power2.inOut",
            power3: "power3.in",
            power3Out: "power3.out",
            power3InOut: "power3.inout",
            power4: "power4.in",
            power4Out: "power4.out",
            power4InOut: "power4.inOut",
            circ: "circ.in",
            circInOut: "circ.inOut",
            bounceIn: 'bounce.in',
            bounceOut: 'bounce.out',
            bounceInOut: 'bounce.inOut',
            backOut: (n1) => `back.out(${n1})`,
            elastic: (n1, n2) => `elastic.out(${n1}, ${n2})`,
        }
    }

    setLoadingPage() {

        this._traverse = () => {
            this.world.astronautContainer.parent.traverse(child => {
                if (child instanceof Mesh &&
                    child.material instanceof MeshStandardMaterial) {
                    child.material.envMapIntensity = 2.5
                    child.material.needsUpdate = true
                }
            })
        }

        this.onReady = () => {
            this.DOM.loadTexts.innerHTML = 'Pronto para Decolar'
            this.DOM.loadBar.classList.add('hide')
            this.DOM.exitLoadBtn.classList.remove('hide')
        }

        this.exitBtnClick = () => {
            if (this.config.isMobile) {
                if (document.requestFullscreen) {
                    document.requestFullscreen();
                } else if (document.webkitRequestFullscreen) {
                    document.webkitRequestFullscreen();
                } else if (document.mozRequestFullScreen) {
                    document.mozRequestFullScreen();
                } else if (document.msRequestFullscreen) {
                    document.msRequestFullscreen();
                } else if (document.webkitEnterFullscreen) {
                    document.webkitEnterFullscreen();
                }
            }

            this.DOM.welcomePage.classList.remove('hide')
            this.DOM.homeDiv.classList.remove('hide')
            this.DOM.whoamiContainer.classList.remove('hide')
            this.DOM.techDiv.classList.remove('hide')
            this.DOM.projects.classList.remove('hide')
            this.DOM.madeWith.classList.remove('hide')
            this.DOM.contact.classList.remove('hide')

            this.sounds.play('btnBeep')
            this.DOM.exitLoadBtn.classList.add('hide')
            this.DOM.exitLoadBtn.disabled = true
            this.DOM.loadTexts.style.opacity = 0
            gsap.to(this.DOM.loadTexts.style, {
                onStart: () => {
                    this.sounds.play('liftoff')
                    this.DOM.loadTexts.innerHTML = "Decolando"
                    this.DOM.loadTexts.classList.add('load-texts-bigger')
                },
                opacity: 1,
                duration: 1,
                ease: 'circ.in',
                onComplete: () => this.startWarnings()
            })
        }

        this.startWarnings = async () => {
            setTimeout(() => {
                this.DOM.imgWarning.classList.remove('hide')
                this.DOM.loadTexts.innerHTML = 'Descompressão detectada'
                this.DOM.loadTexts.classList.add('text-warning')
                this.sounds.play('alarmBeep')
                this.sounds.stop('loadingBar', 150)
                this.sounds.play('lowDescend')
                this.sounds.play('gasLeak')
                gsap.to('.exp-div', {
                    backgroundColor: '#a500055c',
                    duration: .5,
                    ease: this.ease.linear,
                })
                gsap.to('.exp-p', {
                    color: '#ff9393',
                    duration: .5,
                    ease: this.ease.linear,
                })
                gsap.to(this.DOM.imgWarning, {
                    opacity: 1,
                    duration: .5,
                    ease: this.ease.linear,
                })
                gsap.fromTo(this.DOM.loadTexts, {
                    opacity: 0,
                }, {
                    opacity: 1,
                    duration: .5,
                    ease: this.ease.linear,
                    yoyo: true,
                    repeat: 12,

                })
            }, 1500)
            setTimeout(() => this.finishWarnings(), 1500 + (.25 * 7 * 1000))
        }

        this.finishWarnings = () => {
            this.sounds.stop('alarmBeep', 1000)
            this.sounds.play('decompress')
            this.sounds.play('whiteout')
            this.sounds.stop('decompress', 2500)
            this.sounds.stop('loadAmbientSounds', 1000)
            this.DOM.whiteout.style.zIndex = 1000
            console.log
            gsap.to(this.DOM.whiteout, {
                opacity: 1,
                duration: 2.5,
                ease: 'power1.in',
                onComplete: () => {
                    gsap.to('.poem-wrapper', {
                        opacity: 1,
                        duration: 2.5,
                        ease: this.ease.circ,
                    })
                    this.DOM.loadingPage.classList.add('hide')
                    this.sounds.play('theJourney')
                }
            })
        }

        this.exitLoadPage = async () => {
            this._traverse()
            this.DOM.enterSiteBtn.disabled = true
            gsap.to('.poem-wrapper', {
                opacity: 0,
                duration: .5,
                ease: this.ease.circ,
                onComplete: () => {
                    gsap.to(this.DOM.whiteout.style, {
                        opacity: 0,
                        duration: 1.5,
                        ease: 'power1.out',
                        onComplete: () => this.startScrolling()
                    })
                }
            })

            this.animateProjections()
            this.animateLights()
            this.setAnimationsProps()
            this.setControls()
            this.setEventListeners()

            if (this.config.touch || this.config.isMobile) {
                [this.DOM.mouseMove, ...this.DOM.scrollDown].forEach(el => el.classList.add('hide'))
            } else {
                this.DOM.touchScroll.classList.add('hide')
                this.DOM.touchClick.classList.add('hide')
            }
        }

        this.startScrolling = async () => {
            this.DOM.whiteout.classList.add('hide')
            gsap.to('.welcome-container', {
                opacity: 1,
                duration: .5,
                ease: this.ease.circInOut,
                onComplete: () => {
                    this.animateScrollDownDiv()
                    setTimeout(() => {
                        gsap.to('.welcome-container', {
                            opacity: 0,
                            duration: 2,
                            ease: this.ease.circInOut
                        })
                    }, 4000)
                }
            })

        }

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

        if (this.resources.isLoading) {
            this.sounds.play('loadingBar')
        } else {
            this.resources.on('startLoad', () => {
                this.sounds.play('loadingBar')
            })
        }


        this.resources.on('progress', progress => {
            this.DOM.loadTexts.innerHTML = textList[Math.floor(progress * 10)]
            this.DOM.loadBar.style.width = `${progress * 100}%`
        })

        this.resources.on('ready', () => {
            gsap.to(this.DOM.loadBar.style, {
                opacity: 0,
                duration: 0.5,
                ease: 'circ.out',
                onComplete: () => this.onReady()
            })
        })

        this.DOM.exitLoadBtn.onclick = () => this.exitBtnClick()
        this.DOM.enterSiteBtn.onclick = () => this.exitLoadPage()
    }


    setControls() {
        this.animations = {
            moveCamera: (_props) => {
                // Rotate Camera
                gsap.to(this.camera, {
                    rotationAngle: this.camera.rotationAngle + _props.rotation,
                    duration: _props.duration,
                    ease: _props.ease,
                    onStart: _props.onStart,
                    onComplete: _props.onComplete,
                })

                // Move Camera
                gsap.to(this.camera.instance.position, {
                    y: _props.position.y,
                    duration: _props.duration,
                    ease: _props.ease,
                })

                // Move Camera Target
                gsap.to(this.camera.target, {
                    y: _props.position.y,
                    duration: _props.duration,
                    ease: _props.ease,
                })

                this.config.screenIsOn = _props.name
            },
        }
    }

    setAnimationsProps() {
        this.animationsProps = [
            {
                name: 'welcomeDiv',
                element: this.DOM.welcomePage,
                position: new Vector3(0, 6, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 1.5,
                onStart: this.scrollAnimations.welcomeDivStart,
            },
            {
                name: 'homeDiv',
                element: this.DOM.homeDiv,
                position: new Vector3(0, 2, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 1.5,
                onStart: this.scrollAnimations.homeDivStart,
            },
            {
                name: 'whoami',
                element: this.DOM.whoami[0],
                position: new Vector3(0, -2, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 1.5,
                onStart: this.scrollAnimations.whoamiStart,
            },
            {
                name: 'whatido',
                element: this.DOM.whoami[1],
                position: new Vector3(0, -6, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 1.5,
                onStart: this.scrollAnimations.whatidoStart,
            },
            {
                name: 'aboutme',
                element: this.DOM.whoami[2],
                position: new Vector3(0, -10, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 1.5,
                onStart: this.scrollAnimations.aboutMeStart,
            },
            {
                name: 'technologies',
                element: this.DOM.techDiv,
                position: new Vector3(0, -20, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 1.5,
                visitedFlag: false, // To not show animation when revisiting
                onStart: this.scrollAnimations.technologiesStart,
                onComplete: this.scrollAnimations.technologiesComplete,
            },
            {
                name: 'projects',
                element: this.DOM.projects,
                position: new Vector3(0, -35, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 3,
                onComplete: this.scrollAnimations.projectsComplete,
            },
            {
                name: 'madeWith',
                element: this.DOM.madeWith,
                position: new Vector3(0, -45, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 1.5,
                onStart: this.scrollAnimations.madeWithStart,
            },
            {
                name: 'contact',
                element: this.DOM.contact,
                position: new Vector3(0, -57, 0),
                rotation: Math.PI / 4,
                ease: this.ease.slow,
                duration: 1.5,
                visitedFlag: false,
                onStart: this.scrollAnimations.contactStart,
                onComplete: this.scrollAnimations.contactComplete,
            },
        ]

        this.MAX_INDEX = this.animationsProps.length - 1

    }

    setEventListeners() {
        // // self for eventListener Scope Problems
        const self = this

        // IDX Controllers Functions
        this.idxController = {}
        this.idxController.isInConstraints = (dir) => {
            if (['ArrowUp', 'w', 'i'].includes(dir)) { dir = -1 }
            if (['ArrowDown', 's', 'k'].includes(dir)) { dir = 1 }

            if ((dir < 0 && self.IDX <= 0) || (dir > 0 && self.IDX >= self.MAX_INDEX)) {
                return false
            }
            return true
        }
        this.idxController.ArrowUp = () => {
            this.IDX--
            this.animationsProps[this.IDX].rotation = -Math.abs(this.animationsProps[this.IDX].rotation)
            this.direction = 'up'
        }
        this.idxController.ArrowDown = () => {
            this.IDX++
            this.animationsProps[this.IDX].rotation = Math.abs(this.animationsProps[this.IDX].rotation)
            this.direction = 'down'
        }
        this.idxController.w = this.idxController.ArrowUp
        this.idxController.s = this.idxController.ArrowDown
        this.idxController.i = this.idxController.ArrowUp
        this.idxController.k = this.idxController.ArrowDown

        // Wheel Event Function // Async for timeout
        async function _wheel(event) {

            /**
             * Make Sure menu index is between constraints
             */

            if (!self.idxController.isInConstraints(event.deltaY === 0 ? event.deltaX : event.deltaY)) return;

            if ((event.deltaY > 0 || event.deltaX > 0)) {
                self.idxController.ArrowDown()
            } else if ((event.deltaY < 0 || event.deltaX < 0)) (
                self.idxController.ArrowUp()
            )

            self.animations.moveCamera(self.animationsProps[self.IDX])

            // remove window event listener so animations won't overlap
            window.removeEventListener('wheel', _wheel, true)
            window.removeEventListener('keydown', _arrowKeysListener, true)
            window.removeEventListener('touchStart', _touchStart, true)
            window.removeEventListener('touchmove', _touchMove, true)

            // set timeout so it returns after animation is over
            setTimeout(() => {
                window.addEventListener('wheel', _wheel, true)
                window.addEventListener('keydown', _arrowKeysListener, true)
                window.addEventListener('touchStart', _touchStart, true)
                window.addEventListener('touchmove', _touchMove, true)
            },
                self.animationsProps[self.IDX].duration * 1000
            ) // Seconds for Timeout
        }

        async function _arrowKeysListener(event) {

            //  Returns if key has no function or offConstraints
            if (!self.idxController[event.key]) return
            if (!self.idxController.isInConstraints(event.key)) return

            self.idxController[event.key]()

            self.animations.moveCamera(self.animationsProps[self.IDX])

            // remove window event listener so animations won't overlap
            window.removeEventListener('wheel', _wheel, true)
            window.removeEventListener('keydown', _arrowKeysListener, true)
            window.removeEventListener('touchStart', _touchStart, true)
            window.removeEventListener('touchmove', _touchMove, true)

            // set timeout so it returns after animation is over
            setTimeout(() => {
                window.addEventListener('wheel', _wheel, true)
                window.addEventListener('keydown', _arrowKeysListener, true)
                window.addEventListener('touchStart', _touchStart, true)
                window.addEventListener('touchmove', _touchMove, true)
            },
                self.animationsProps[self.IDX].duration * 1000
            ) // Seconds for Timeout
        }

        function _touchStart(event) {
            if (event.touches.length === 1) {
                self.touchStartY = event.touches[0].clientY
            }
        }

        async function _touchMove(event) {
            if (event.touches.length === 1) {
                self.touchDeltaY = event.touches[0].clientY - self.touchStartY

                if (Math.abs(self.touchDeltaY) > 40) {

                    if (!self.idxController.isInConstraints(-self.touchDeltaY)) return;

                    if (self.touchDeltaY > 0) {
                        self.idxController.ArrowUp()
                    }

                    else if (self.touchDeltaY < 0) {
                        self.idxController.ArrowDown()
                    }

                    self.animations.moveCamera(self.animationsProps[self.IDX])

                    // remove window event listener so animations won't overlap
                    window.removeEventListener('wheel', _wheel, true)
                    window.removeEventListener('keydown', _arrowKeysListener, true)
                    window.removeEventListener('touchStart', _touchStart, true)
                    window.removeEventListener('touchmove', _touchMove, true)

                    // set timeout so it returns after animation is over
                    setTimeout(() => {
                        window.addEventListener('wheel', _wheel, true)
                        window.addEventListener('keydown', _arrowKeysListener, true)
                        window.addEventListener('touchStart', _touchStart, true)
                        window.addEventListener('touchmove', _touchMove, true)
                    },
                        self.animationsProps[self.IDX].duration * 1000
                    ) // Seconds for Timeout
                }
            }
        }

        window.addEventListener('wheel', _wheel, true)
        window.addEventListener('keydown', _arrowKeysListener, true)
        window.addEventListener('touchstart', _touchStart, true)
        window.addEventListener('touchmove', _touchMove, true)

        this.DOM.openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                let modal = this.DOM.modals.find(item => item.name === btn.id)
                modal.element.classList.toggle('hide')
                this.DOM.projects.classList.toggle('hide')
            })
        })

        this.DOM.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.DOM.projects.classList.toggle('hide')
                btn.parentElement.parentElement.classList.toggle('hide')
            })
        })
    }

    animateProjections() {
        this.time.on('tick', () => {
            [
                ...this.DOM.firstPositions,
                ...this.DOM.modals,
            ].forEach(el => {
                let projected = el.position.clone()
                projected.project(this.camera.instance)

                const translateY = `${-projected.y * this.sizes.height * 0.5}px`
                el.element.style.transform = `translate(0, ${translateY})`
            })
        })
    }

    animateLights() {
        this.time.on('tick', () => {
            if (!this.world.lights.items.spotLight.target.intersected) {
                this.world.lights.items.spotLight.target.position.x = Math.cos(this.time.elapsed * 0.00105) * 2.5
                this.world.lights.items.spotLight.target.position.y = Math.sin(this.time.elapsed * 0.00035) * 2.5
            }
        })
    }

    animateCamera() {
        this.mouse = new Vector2()

        this.containersToMove = [
            this.world.shipwreckContainer,
            this.world.projectsContainer,
            this.world.whoAmIContainer,
            this.world.whatIDoContainer,
            this.world.aboutMeContainer,
        ]

        this.time.on('tick', () => {
            this.camera.instance.position.x = Math.sin(this.camera.rotationAngle + this.mouse.x) * this.camera.distance,
                this.camera.instance.position.z = Math.cos(this.camera.rotationAngle + this.mouse.x) * this.camera.distance,
                this.camera.instance.lookAt(this.camera.target)

            this.containersToMove.forEach(container => {
                container.rotation.x = this.mouse.y
                container.rotation.z = -this.mouse.y
            })
        })

        window.onmousemove = event => {
            gsap.to(this.mouse, {
                x: ((event.clientX / this.sizes.width) - 0.5) * 0.125,
                y: -((event.clientY / this.sizes.height) - 0.5) * 0.05,
                duration: 0.5,
                ease: this.ease.linear,
            })
        }
    }

    animateScrollDownDiv() {
        if (this.config.touch || this.config.isMobile) {

            gsap.to('.touched-scroll', {
                opacity: 1,
                duration: .5,
                onComplete: () => {
                    gsap.fromTo(['.touched-scroll', '.inner-touch-scroll'], {
                        bottom: 0
                    }, {
                        bottom: 63,
                        duration: 1,
                        ease: this.ease.power3InOut,
                        repeat: 7,
                        yoyo: true,
                        yoyoEase: this.ease.power3InOut,
                        repeatDelay: 0.4,
                        onRepeat: () => {
                            gsap.fromTo('.touched-scroll', {
                                opacity: 0,
                            }, {
                                opacity: 1,
                                duration: 0.25
                            })
                        },
                    })
                }
            })
        } else {

            gsap.fromTo('.scroll-down', {
                top: 2
            }, {
                top: 29,
                duration: 1,
                ease: this.ease.power3InOut,
                yoyo: true,
                yoyoEase: this.ease.power3InOut,
                repeat: 7
            })

            gsap.fromTo('.arrows-wrapper', {
                backgroundColor: 'rgba(255,255,255,1)',
                borderColor: 'rgba(255,255,255,.5)',
            }, {
                backgroundColor: 'rgba(255,255,255,.5)',
                borderColor: 'rgba(255,255,255,1)',
                duration: 1,
                ease: this.ease.power3InOut,
                yoyo: true,
                repeat: 7
            })

        }
    }


    async radioWavesAnimation() {
        //  y=	-0.38125x
        const x = this.isDesktop() ? 3 / -0.38125 : 3 / -0.38125
        const y = this.isDesktop() ? 3 : -9
        const duration = 5
        const scale = 4.5
        const animate = (wave) => {
            gsap.to(wave.position, {
                y,
                x,
                duration,
                ease: this.ease.power2in,
                onComplete: () => {
                    wave.position.set(
                        this.isDesktop() ? 3.2 : 0.94,
                        this.isDesktop() ? -1.22 : 0.94,
                        this.isDesktop() ? 0 : 0.94)
                    animate(wave);
                }
            })
            gsap.to(wave.scale, {
                x: scale,
                y: scale,
                duration,
                ease: this.ease.power2in,
                onComplete: () => {
                    wave.scale.set(1, 1, 1)
                }
            })

        }
        this.world.radioWaves.forEach((wave, i, array) => {
            (function (w, idx, arr) {
                setTimeout(() => animate(w), 0 + (duration / (arr.length - 1) * (idx + 1) * 1000));
            })(wave, i, array);
        })
    }

    setScrollAnimations() {
        this.scrollAnimations = {}

        this.scrollAnimations.welcomeDivStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: this.isDesktop() ? -2.01 : 3.316,
                y: this.isDesktop() ? 3.866 : 4.961,
                z: this.isDesktop() ? 3.557 : 6.412,
                duration: this.animationsProps[0].duration * 2,
                ease: this.ease.power2Out,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: this.isDesktop() ? 0.842 : -0.383,
                y: this.isDesktop() ? -3.142 : 3.142,
                z: this.isDesktop() ? 0 : 0,
                duration: this.animationsProps[0].duration * 2,
                ease: this.ease.backOut(1),
            })

            if (!this.isDesktop()) {
                gsap.to(this.world.astronautContainer.scale, {
                    x: .25,
                    y: .25,
                    z: .25,
                    duration: this.animationsProps[0].duration * 2,
                    ease: this.ease.power2Out,
                })
            }
        }

        this.scrollAnimations.homeDivStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: this.isDesktop() ? 0 : 0.002,
                y: this.isDesktop() ? .5 : -0.468,
                z: this.isDesktop() ? -2.925 : - 0.616,
                duration: this.animationsProps[1].duration * 2,
                ease: this.ease.power2InOut,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: this.isDesktop() ? 0 : -0.383,
                y: this.isDesktop() ? -0.859 : -0.706,
                z: this.isDesktop() ? 0 : -0.03,
                duration: this.animationsProps[1].duration * 2.3,
                ease: this.ease.backOut(4),
            })
            if (!this.isDesktop()) {
                gsap.to(this.world.astronautContainer.scale, {
                    x: .5,
                    y: .5,
                    z: .5,
                    duration: this.animationsProps[0].duration * 2,
                    ease: this.ease.power2Out,
                })
            }
        }

        this.scrollAnimations.whoamiStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: this.isDesktop() ? 3.606 : -0.679,
                y: this.isDesktop() ? -0.468 : -1.729,
                z: this.isDesktop() ? 1.033 : -1.725,
                duration: this.animationsProps[2].duration * 2,
                ease: this.ease.power2InOut,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: this.isDesktop() ? -0.303 : 0.834,
                y: this.isDesktop() ? -2.136 : -0.225,
                z: this.isDesktop() ? 0 : -0.129,
                duration: this.animationsProps[2].duration * 2.2,
                ease: this.ease.backOut(.3),
            })
        }

        this.scrollAnimations.whatidoStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: this.isDesktop() ? -2.829 : -0.556,
                y: this.isDesktop() ? -3.3 : -3.614,
                z: this.isDesktop() ? -0.296 : -2.258,
                duration: this.animationsProps[3].duration * 2,
                ease: this.ease.power2InOut,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: this.isDesktop() ? 0.484 : 0,
                y: this.isDesktop() ? 1.516 : 0.463,
                z: this.isDesktop() ? 2.252 : Math.PI,
                duration: this.animationsProps[3].duration * 2,
                ease: this.ease.backOut(.15),
            })
        }

        this.scrollAnimations.aboutMeStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: this.isDesktop() ? 1.239 : -0.901,
                y: this.isDesktop() ? -13.2 : -13.48,
                z: this.isDesktop() ? -2.198 : -0.576,
                duration: this.animationsProps[4].duration * 3,
                ease: this.ease.power2Out,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: this.isDesktop() ? -0.656 : 0,
                y: this.isDesktop() ? -0.722 : 0.829,
                z: this.isDesktop() ? 0 : 0.068,
                duration: this.animationsProps[4].duration * 4,
                ease: this.ease.backOut(1),
            })
        }

        this.scrollAnimations.technologiesStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: this.isDesktop() ? -9.228 : -7.606,
                z: this.isDesktop() ? -7.139 : 1.114,
                duration: this.animationsProps[5].duration * 3,
                ease: this.ease.power2Out,
            })
            gsap.to(this.world.astronautContainer.position, {
                y: this.isDesktop() ? -22.22 : -23.803,
                duration: this.animationsProps[5].duration * 4.5,
                ease: this.ease.power2Out,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: 0,
                y: this.isDesktop() ? 0.215 : 2.022,
                z: 0,
                duration: this.animationsProps[5].duration * 4,
                ease: this.ease.elastic(1, 0.6),
            })

        }

        this.scrollAnimations.technologiesComplete = () => {

            // Check if has been visited
            if (this.animationsProps[5].visitedFlag) {
                return
            }

            this.animationsProps[5].visitedFlag = true

            // Remove hide to hover Move Opacity
            gsap.to(this.DOM.mouseMove.parentNode, {
                opacity: 1,
                duration: 1,
            })
            if (this.config.touch || this.config.isMobile) {

                let loops = 3

                let touchAnimation = async () => {
                    gsap.to(['.touched-click', '.inner-touch-click'], {
                        top: 30,
                        duration: 1,
                        ease: this.ease.power3InOut,
                        onComplete: () => {
                            gsap.fromTo('.touched-click', {
                                opacity: 0,
                            }, {
                                opacity: 1,
                                duration: 0.25,
                                onComplete: () => setTimeout(() => {
                                    gsap.to(['.touched-click', '.inner-touch-click'], {
                                        top: 0,
                                        duration: .01,
                                        onComplete: () => {
                                            if (loops > 0) {
                                                touchAnimation()
                                                loops--
                                            } else {
                                                gsap.to(this.DOM.mouseMove.parentNode, {
                                                    opacity: 0,
                                                    duration: 1,
                                                })
                                            }
                                        }
                                    })
                                }, 500)
                            })
                        },
                    })
                }

                touchAnimation()

            } else {
                gsap.fromTo(this.DOM.mouseMove, {
                    left: this.percentToPixelWidth(this.DOM.mouseMove, 75),
                }, {
                    left: this.percentToPixelWidth(this.DOM.mouseMove, 25),
                    duration: 1,
                    ease: this.ease.power3InOut,
                    yoyoEase: this.ease.power3InOut,
                    yoyo: true,
                    repeat: 4,
                    onComplete: () => {
                        // Hides the Hover
                        gsap.to(this.DOM.mouseMove.parentNode, {
                            opacity: 0,
                            duration: 2,
                        })
                    }
                })
            }
        }

        this.scrollAnimations.projectsComplete = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: -9.228,
                y: -41.278,
                z: -7.139,
                duration: this.animationsProps[6].duration * .1,
                ease: this.ease.power4Out,
            })
            gsap.to(this.world.astronautContainer.scale, {
                x: this.isDesktop() ? 1 : .5,
                y: this.isDesktop() ? 1 : .5,
                z: this.isDesktop() ? 1 : .5,
                duration: this.animationsProps[6].duration * .1,
                ease: this.ease.power2Out,
            })
        }

        this.scrollAnimations.madeWithStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: this.isDesktop() ? -3.6 : -1.135,
                z: this.isDesktop() ? 0 : -0.608,
                duration: this.animationsProps[7].duration * 2.5,
                ease: this.ease.backOut(1),
                onComplete: () => this.radioWavesAnimation(),
            })
            gsap.to(this.world.astronautContainer.position, {
                y: this.isDesktop() ? -46 : -43.829,
                duration: this.animationsProps[7].duration * 2.5,
                ease: this.direction === 'up' ? this.ease.elastic(1, 1) : this.power2In,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: this.isDesktop() ? 1.244 : 2.973,
                y: this.isDesktop() ? 0.432 : -0.113,
                z: this.isDesktop() ? -1.565 : -2.045,
                duration: this.animationsProps[7].duration * 1.5,
                ease: this.ease.backOut(1),
            })
            gsap.to(this.world.astronautContainer.scale, {
                x: this.isDesktop() ? 0.25 : 0.125,
                y: this.isDesktop() ? 0.25 : 0.125,
                z: this.isDesktop() ? 0.25 : 0.125,
                duration: this.animationsProps[7].duration * 2.5,
                ease: this.direction === 'up' ? this.ease.elastic(1, 1) : this.power2In,
            })
        }

        this.scrollAnimations.contactStart = () => {

            const showHolograms = () => {
                gsap.to(this.world.materials.items.logoHoloMaterial.uniforms.uAlpha, {
                    value: 0.55,
                    duration: 2.5,
                    ease: this.ease.bounceInOut
                })
                gsap.to(this.world.materials.items.logoHoloBeam.uniforms.uAlpha, {
                    value: 0.55,
                    duration: 2.5,
                    ease: this.ease.bounceInOut
                })
            }

            const movePod = () => {
                gsap.to(this.resources.items.pod.scene.position, {
                    x: -3.34,
                    y: 3.77,
                    z: -10,
                    duration: 2,
                    ease: this.ease.power2Out,
                })
                gsap.to(this.resources.items.pod.scene.rotation, {
                    x: -0.2,
                    y: 2.43,
                    z: 0.66,
                    duration: 4,
                    ease: this.ease.backOut(3),
                    onComplete: showHolograms
                })
            }

            gsap.to(this.world.astronautContainer.position, {
                x: 2.209,
                y: -55,
                z: 8.768,
                duration: this.animationsProps[8].duration * 2,
                ease: this.ease.power2InOut,
                onComplete: movePod
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: 0,
                y: 1.502,
                z: 0,
                duration: this.animationsProps[8].duration * 2,
                ease: this.ease.backOut(3),
            })
            gsap.to(this.world.astronautContainer.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: this.animationsProps[8].duration * 2,
                ease: this.ease.power2InOut,
            })
        }

        this.scrollAnimations.contactComplete = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: this.isDesktop() ? 2.209 : 5.287,
                y: -57.49,
                z: 8.768,
                duration: this.animationsProps[6].duration,
                ease: this.ease.power2Out,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: 0,
                y: 1.502,
                z: 0,
                duration: this.animationsProps[6].duration,
                ease: this.ease.backOut(2),
            })
            gsap.to(this.world.astronautContainer.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: this.animationsProps[6].duration,
                ease: this.ease.power2Out,
            })
        }
    }
    setHelperFunctions() {


        this.percentToPixelWidth = (_elem, _perc) => {
            return (_elem.parentNode.offsetWidth / 100) * parseFloat(_perc);
        }
        this.percentToPixelHeight = (_elem, _perc) => {
            return (_elem.parentNode.offsetHeight / 100) * parseFloat(_perc);
        }
        this.isDesktop = () => this.sizes.userType === 'desktop'

    }

}