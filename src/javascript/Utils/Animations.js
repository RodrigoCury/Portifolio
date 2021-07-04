import gsap from 'gsap'
import { Vector2, Vector3 } from 'three'

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
        this.animateCamera()
        this.setScrollAnimations()
        this.animateScrollDownDiv()
        this.setLoadingPage()
    }

    setEases() {
        // Animation Eases
        this.ease = {
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

        this.onReady = () => {
            this.DOM.loadTexts.innerHTML = 'Pronto para Decolar'
            this.DOM.loadBar.classList.add('hide')
            this.DOM.exitLoadBtn.classList.remove('hide')
        }

        this.exitBtnClick = async () => {
            this.sounds.play('btnBeep')
            this.DOM.exitLoadBtn.classList.add('hide')
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
                this.DOM.loadTexts.innerHTML = 'Descompressão detectada'
                this.DOM.loadTexts.classList.add('text-warning')
                this.sounds.play('alarmBeep')
                this.sounds.stop('loadingBar', 150)
                this.sounds.play('lowDescend')
                this.sounds.play('gasLeak')
            }, 1500)
            setTimeout(() => this.finishWarnings(), 3500)
        }

        this.finishWarnings = async () => {
            this.sounds.stop('alarmBeep', 1000)
            this.sounds.play('decompress')
            setTimeout(() => {
                this.sounds.play('whiteout')
                this.sounds.stop('decompress', 2500)
                this.sounds.stop('loadAmbientSounds', 1000)
                this.DOM.whiteout.style.zIndex = 1000
                gsap.to(this.DOM.whiteout.style, {
                    opacity: 1,
                    duration: 2,
                    ease: 'power1.in',
                    onComplete: () => {
                        gsap.to('.poem-wrapper', {
                            opacity: 1,
                            duration: .5,
                            ease: this.ease.circ,
                        })
                        this.sounds.play('theJourney')
                    }
                })
            }, 300)
        }

        this.exitLoadPage = async () => {
            this.DOM.loadingPage.classList.add('hide'),
                this.DOM.enterSiteBtn.disabled = true
            setTimeout(() => {
                gsap.to(this.DOM.whiteout.style, {
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power1.out',
                    onComplete: () => this.startScrolling()
                })
            }, 500)
            this.homeAnimation()
            this.animateLights()
            this.setAnimationsProps()
        }

        this.startScrolling = async () => {
            this.DOM.whiteout.classList.add('hide')
            gsap.to('.welcome-container', {
                opacity: 1,
                duration: .5,
                ease: this.ease.circInOut,
                onComplete: () => setTimeout(() => {
                    gsap.to('.welcome-container', {
                        opacity: 0,
                        duration: 2,
                        ease: this.ease.circInOut
                    })
                }, 1500)
            })

            this.setControls()
            this.setEventListeners()
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
            })
        }


        this.resources.on('progress', progress => {
            this.DOM.loadTexts.innerHTML = textList[Math.floor(progress * 10)]
            this.DOM.loadBar.style.width = `${progress * 60}%`
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
        this.idxController.ArrowUp = (dir) => {
            this.IDX--
            this.animationsProps[this.IDX].rotation = -Math.abs(this.animationsProps[this.IDX].rotation)
            this.direction = 'up'
        }
        this.idxController.ArrowDown = (dir) => {
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

            // set timeout so it returns after animation is over
            setTimeout(() => {
                window.addEventListener('wheel', _wheel, true)
                window.addEventListener('keydown', _arrowKeysListener, true)
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

            // set timeout so it returns after animation is over
            setTimeout(() => {
                window.addEventListener('wheel', _wheel, true)
                window.addEventListener('keydown', _arrowKeysListener, true)
            },
                self.animationsProps[self.IDX].duration * 1000
            ) // Seconds for Timeout
        }

        window.addEventListener('wheel', _wheel, true)
        window.addEventListener('keydown', _arrowKeysListener, true)

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

    homeAnimation() {
        // this.homePosition = new Vector3(0, 2, 0)

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
            this.world.lights.items.spotLight.target.position.x = Math.cos(this.time.elapsed * 0.00105) * 2.5
            this.world.lights.items.spotLight.target.position.y = Math.sin(this.time.elapsed * 0.00035) * 2.5
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
        const down = () => {
            gsap.to('.scroll-down',
                {
                    top: 29,
                    duration: 1,
                    ease: this.ease.power3Out,
                    onComplete: () => up()
                }
            )
        }

        const up = () => {
            gsap.to('.scroll-down',
                {
                    top: 2,
                    duration: 1,
                    ease: this.ease.power3Out,
                    onComplete: () => down()
                }
            )
        }

        down()
    }


    async radioWavesAnimation() {
        //  y=	-0.38125x
        const x = 3 / -0.38125
        const y = 3
        const duration = 4
        const scale = 4.5
        const animate = (wave) => {
            gsap.to(wave.position, {
                y: y,
                x: x,
                duration: 5,
                ease: this.ease.power2in,
                onComplete: () => {
                    wave.position.set(3.2, -1.22, 0)
                    animate(wave);
                }
            })
            gsap.to(wave.scale, {
                x: scale,
                y: scale,
                duration: 5,
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
                x: -2.01,
                y: 3.866,
                z: 3.557,
                duration: this.animationsProps[0].duration * 2,
                ease: this.ease.power2InOut,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: 0.842,
                y: -3.142,
                z: 0,
                duration: this.animationsProps[0].duration * 2,
                ease: this.ease.backOut(3),
            })
        }

        this.scrollAnimations.homeDivStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: 0,
                y: .5,
                z: -2.925,
                duration: this.animationsProps[1].duration * 2,
                ease: this.ease.power2InOut,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: 0,
                y: -0.859,
                z: 0,
                duration: this.animationsProps[1].duration * 2,
                ease: this.ease.backOut(2),
            })
        }

        this.scrollAnimations.whoamiStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: 3.606,
                y: -0.468,
                z: 1.033,
                duration: this.animationsProps[2].duration * 2,
                ease: this.ease.power2InOut,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: -0.303,
                y: -2.136,
                z: 0,
                duration: this.animationsProps[2].duration * 2,
                ease: this.ease.backOut(1),
            })
        }

        this.scrollAnimations.whatidoStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: -2.829,
                y: -3.3,
                z: -0.296,
                duration: this.animationsProps[3].duration * 2,
                ease: this.ease.power2InOut,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: 0.484,
                y: 1.516,
                z: 2.252,
                duration: this.animationsProps[3].duration * 2,
                ease: this.ease.power2InOut,
            })
        }

        this.scrollAnimations.aboutMeStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: 1.239,
                y: -13.2,
                z: -2.198,
                duration: this.animationsProps[4].duration * 3,
                ease: this.ease.power2Out,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: -0.656,
                y: -0.722,
                z: 0,
                duration: this.animationsProps[4].duration * 4,
                ease: this.ease.backOut(1),
            })
        }

        this.scrollAnimations.technologiesStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: -9.228,
                z: -7.139,
                duration: this.animationsProps[5].duration * 3,
                ease: this.ease.power2Out,
            })
            gsap.to(this.world.astronautContainer.position, {
                y: -22.22,
                duration: this.animationsProps[5].duration * 4.5,
                ease: this.ease.power2Out,
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: 0,
                y: 0.215,
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

            // Remove Hint to hover Move Opacity
            gsap.to(this.DOM.mouseMove.parentNode, {
                opacity: 1,
                duration: 1,
            })

            // Set Numbers of loops that animation Repeat
            let loops = 3

            // Gsap integrated Yoyo doesn't look good so... Jenk way to do it
            let leftToRigth = () => {
                gsap.to(this.DOM.mouseMove, {
                    left: this.helperFunctions.percentToPixelWidth(this.DOM.mouseMove, 75),
                    duration: .5,
                    ease: this.ease.linear,
                    onComplete: () => {
                        // Check if it must stop
                        if (loops == 0) {
                            // Hides the DIV
                            gsap.to(this.DOM.mouseMove.parentNode, {
                                opacity: 0,
                                duration: 2,
                            })

                        } else {
                            // Keeps Recursion Going
                            loops--
                            rigthToLeft()
                        }
                    }
                })
            }

            let rigthToLeft = () => {
                gsap.to(this.DOM.mouseMove, {
                    left: this.helperFunctions.percentToPixelWidth(this.DOM.mouseMove, 25),
                    duration: .5,
                    ease: this.ease.linear,
                    onComplete: leftToRigth
                })
            }

            // Starts loops
            leftToRigth()
        }

        this.scrollAnimations.projectsComplete = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: -9.228,
                y: -41.278,
                z: -7.139,
                duration: this.animationsProps[6].duration,
                ease: this.ease.power4Out,
            })
            gsap.to(this.world.astronautContainer.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: this.animationsProps[6].duration * 2,
                ease: this.ease.power2Out,
            })
        }

        this.scrollAnimations.madeWithStart = () => {
            gsap.to(this.world.astronautContainer.position, {
                x: -3.6,
                z: 0,
                duration: this.animationsProps[7].duration * 2.5,
                ease: this.ease.backOut(1),
                onComplete: () => this.radioWavesAnimation(),
            })
            gsap.to(this.world.astronautContainer.position, {
                y: -46,
                duration: this.animationsProps[7].duration * 2.5,
                ease: this.direction === 'up' ? this.ease.elastic(1, 1) : this.power2In,
                onComplete: () => this.radioWavesAnimation()
            })
            gsap.to(this.world.astronautContainer.rotation, {
                x: 1.244,
                y: 0.432,
                z: -1.565,
                duration: this.animationsProps[7].duration * 1.5,
                ease: this.ease.backOut(1),
            })
            gsap.to(this.world.astronautContainer.scale, {
                x: 0.25,
                y: 0.25,
                z: 0.25,
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
                x: 2.209,
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

        this.helperFunctions = {

            percentToPixelWidth: (_elem, _perc) => {
                return (_elem.parentNode.offsetWidth / 100) * parseFloat(_perc);
            },
            percentToPixelHeight: (_elem, _perc) => {
                return (_elem.parentNode.offsetHeight / 100) * parseFloat(_perc);
            },
        }
    }
}