import * as THREE from 'three'
import Lights from './Lights'
import Materials from './Materials'
import Areas from './Areas'
import Holograms from './Holograms'
import Texts from './Text'
import Stars from './Stars'
import Geometries from './Geometries'

export default class {
    constructor(_options) {
        // Options
        this.config = _options.config
        this.debug = _options.debug
        this.resources = _options.resources
        this.time = _options.time
        this.sizes = _options.sizes
        this.camera = _options.camera
        this.renderer = _options.renderer
        this.passes = _options.passes



        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("World")
            // this.debugFolder.open()
        }

        // Setup
        this.container = new THREE.Object3D()
        this.shipwreckContainer = new THREE.Object3D()
        this.whoAmIContainer = new THREE.Object3D()
        this.whatIDoContainer = new THREE.Object3D()
        this.aboutMeContainer = new THREE.Object3D()
        this.logoContainer = new THREE.Object3D()
        this.projectsContainer = new THREE.Object3D()
        this.starsContainer = new THREE.Object3D()
        this.hubbleContainer = new THREE.Object3D()

        this.setLights()
        this.setGeometries()
        this.setResources()

    }

    setLights() {
        this.lights = new Lights({
            debug: this.debug
        })
    }

    setMaterials() {
        this.materials = new Materials({
            resources: this.resources,
            debug: this.debug,
            time: this.time,
        })
    }

    setGeometries(){
        this.geometries = new Geometries({
            debug: this.debug,
        })
    }

    setResources() {
        this.resources.on('ready', () => {
            this.setMaterials()
            this.setStars()
            this.setShipwreck()
            this.setWhoAmI()
            this.setWhatIDo()
            this.setAboutMe()
            this.setTextGeometries()
            this.setLogos()
            this.setISS()
            this.setProjects()
            this.setHubble()
        })
    }

    setStars() {
        this.stars = new Stars({
            debug: this.debug,
            resources: this.resources,
            time: this.time,
            container : this.starsContainer,
        })
    }

    setTextGeometries() {
        this.text = new Texts({
            resources: this.resources,
            debug: this.debug,
            materials: this.materials,
        })
    }

    setShipwreck(){
        this.resources.items.shipwreck.scene.position.set(0,0,0)
        this.resources.items.shipwreck.scene.scale.set(0.15,0.15,0.15)
        this.resources.items.shipwreck.scene.rotation.set(1.221,2.485,0.33)


        this.shipwreckContainer.position.set(0, 6, 0)
        this.shipwreckContainer.rotation.y = -2.4
        this.shipwreckContainer.add(this.resources.items.shipwreck.scene)
        
        if(this.debug){
            this.shipwreckContainer.add(new THREE.AxesHelper(2))
            this.shipwreckFolder = this.debug.addFolder("Shipwreck")
            this.shipwreckFolder.add(this.resources.items.shipwreck.scene.position, 'x', -10, 10, .001).name("shipwreck x")
            this.shipwreckFolder.add(this.resources.items.shipwreck.scene.position, 'y', -10, 10, .001).name("shipwreck y")
            this.shipwreckFolder.add(this.resources.items.shipwreck.scene.position, 'z', -10, 10, .001).name("shipwreck z")
            this.shipwreckFolder.add(this.resources.items.shipwreck.scene.rotation, 'x', -10, 10, .001).name("shipwreck rot x")
            this.shipwreckFolder.add(this.resources.items.shipwreck.scene.rotation, 'y', -10, 10, .001).name("shipwreck rot y")
            this.shipwreckFolder.add(this.resources.items.shipwreck.scene.rotation, 'z', -10, 10, .001).name("shipwreck rot z")
            this.shipwreckFolder.add(this.shipwreckContainer.position, 'x', -10, 10, .001).name("container x")
            this.shipwreckFolder.add(this.shipwreckContainer.position, 'y', -10, 10, .001).name("container y")
            this.shipwreckFolder.add(this.shipwreckContainer.position, 'z', -10, 10, .001).name("container z")
            this.shipwreckFolder.add(this.shipwreckContainer.rotation, 'x', -10, 10, .001).name("container rot x")
            this.shipwreckFolder.add(this.shipwreckContainer.rotation, 'y', -10, 10, .001).name("container rot y")
            this.shipwreckFolder.add(this.shipwreckContainer.rotation, 'z', -10, 10, .001).name("container rot z")
        }
    }

    setLogos() {
        // Container Position
        this.logoContainer.position.set(-5.75, -20, 3.75)

        // Container Rotation
        this.logoContainer.rotation.y = 2.42

        // Set Raycaster Areas
        this.logosArea = Areas.addArea()


        /**
         * Top Row
         */

        // Set Python Logo
        this.resources.items.pyLogo.scene.position.set(-1, 2, 0)
        this.resources.items.pyLogo.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.pyLogo.scene, 'Python')

        // Set Javascript Logo
        this.resources.items.jsLogo.scene.position.set(1, 2, 0)
        this.resources.items.jsLogo.scene.rotation.x = Math.PI / 2
        this.resources.items.jsLogo.scene.scale.set(0.9, 0.9, 0.9)
        this.logosArea.addToArea(2, 2, this.resources.items.jsLogo.scene, 'Javascript')

        /**
         * Middle Row
         */

        // Django Logo
        this.resources.items.djangoLogo.scene.position.set(-2, 0, 0)
        this.resources.items.djangoLogo.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.djangoLogo.scene, 'Django')

        // Set BioPython Logo
        this.resources.items.biopyLogo.scene.position.set(0, 0, 0)
        this.resources.items.biopyLogo.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.biopyLogo.scene, 'Biopython')

        // Set THREE.js Logo
        this.resources.items.threeLogo.scene.position.set(2, 0, 0)
        this.resources.items.threeLogo.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.threeLogo.scene, 'Three.js')

        /**
         * Bottom Row
         */

        // Set HTML Logo
        this.resources.items.html.scene.position.set(-1, -2, 0)
        this.resources.items.html.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.html.scene, 'HTML')

        // Set CSS Logo
        this.resources.items.css.scene.position.set(1, -2, 0)
        this.resources.items.css.scene.rotation.x = Math.PI / 2
        this.logosArea.addToArea(2, 2, this.resources.items.css.scene, 'CSS')



        /**
         *  Add Logos to Logo Container
         */

        this.logoContainer.add(
            this.resources.items.pyLogo.scene,
            this.resources.items.biopyLogo.scene,
            this.resources.items.css.scene,
            this.resources.items.html.scene,
            this.resources.items.jsLogo.scene,
            this.resources.items.threeLogo.scene,
            this.resources.items.djangoLogo.scene,
            this.logosArea

        )
        this.container.add(this.logoContainer)


        /**
         * Debug
         */

        if (this.debug) {
            this.debugFolder.add(this.logoContainer.position, "z", -30, 30, 0.01).name("logoC Z")
            this.debugFolder.add(this.logoContainer.position, "y", -30, 30, 0.01).name("logoC Y")
            this.debugFolder.add(this.logoContainer.position, "x", -30, 30, 0.01).name("logoC X")
            this.debugFolder.add(this.logoContainer.rotation, "y", -Math.PI, Math.PI, 0.01).name("logoC Rot")
        }
    }

    setISS() {
        // Scale 
        this.resources.items.iss.scene.scale.set(.6, .6, .6)

        // Rotation
        this.resources.items.iss.scene.rotation.set(0, Math.PI / 2, Math.PI / 2)

        // Position
        this.resources.items.iss.scene.position.set(6.437, -1.34, 5)

        // Position SpotLight
        this.lights.items.spotLight.position.set(6.437, -2.56, 3.95)

        // Add to Logo Container
        this.logoContainer.add(
            this.resources.items.iss.scene,
            this.lights.items.spotLight,
            this.lights.items.spotLight.target,
        )

        // Debug ISS
        if (this.debug) {
            this.iss = this.debug.addFolder('ISS')
            this.iss.add(this.resources.items.iss.scene.position, 'x', -10, 10, 0.001).name("ISS X")
            this.iss.add(this.resources.items.iss.scene.position, 'y', -10, 10, 0.001).name("ISS Y")
            this.iss.add(this.resources.items.iss.scene.position, 'z', -10, 10, 0.001).name("ISS Z")
            this.iss.add(this.resources.items.iss.scene.rotation, 'x', -Math.PI, Math.PI, 0.001).name("ISS rot X")
            this.iss.add(this.resources.items.iss.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name("ISS rot Y")
            this.iss.add(this.resources.items.iss.scene.rotation, 'z', -Math.PI, Math.PI, 0.001).name("ISS rot Z")
            this.iss.add(this.lights.items.spotLight.position, 'x', -10, 10, 0.001).name("Spotlight X")
            this.iss.add(this.lights.items.spotLight.position, 'y', -10, 10, 0.001).name("Spotlight Y")
            this.iss.add(this.lights.items.spotLight.position, 'z', -10, 10, 0.001).name("Spotlight Z")

            /**
             * SpotLight Helper 
             */

            // this.sLHelper = new THREE.SpotLightHelper(this.lights.items.spotLight)
            // this.sLHelper.matrix = this.lights.items.spotLight.matrix
            // this.logoContainer.add(this.sLHelper)
        }

        // Setup Holograms
        this.holograms = new Holograms({
            debug: this.debug,
            materials: this.materials,
            resources: this.resources,
            geometries: this.text,
        })

        this.logoContainer.add(this.holograms.container, this.holograms.cone)
    }


    setProjects() {
        // Container position
        this.projectsContainer.position.set(0, -35, 0)
        this.projectsContainer.rotation.y = 2.28
        
        // Atronaut Rotation
        this.resources.items.astronaut.scene.rotation.set(-.06, 1.53, 0.29)
        
        // Atronaut Position
        this.resources.items.astronaut.scene.position.set(-3.34,-0.29,0)
        this.resources.items.astronaut.scene.scale.set(0.44,0.44,0.44,)
        

        
        // Add to containers
        this.projectsContainer.add(this.resources.items.astronaut.scene)
        

        
        /**
         * Debug
         */
        if (this.debug) {
            // Axes helper
            this.projectsContainer.add(new THREE.AxesHelper(2))

            // Container
            this.projectsFolder = this.debug.addFolder("Projects")
            this.projectsFolder.add(this.projectsContainer.position, 'x', -30, 30, 0.01).name("Container X")
            this.projectsFolder.add(this.projectsContainer.position, 'y', -30, 30, 0.01).name("Container Y")
            this.projectsFolder.add(this.projectsContainer.position, 'z', -30, 30, 0.01).name("Container Z")
            this.projectsFolder.add(this.projectsContainer.rotation, 'y', -Math.PI, Math.PI, 0.01).name("Container Rot")

            // Astronaut
            this.projectsFolder.add(this.resources.items.astronaut.scene.position, 'x', -15, 15, 0.01).name("Anaut X")
            this.projectsFolder.add(this.resources.items.astronaut.scene.position, 'y', -15, 15, 0.01).name("Anaut Y")
            this.projectsFolder.add(this.resources.items.astronaut.scene.position, 'z', -15, 15, 0.01).name("Anaut Z")
            this.projectsFolder.add(this.resources.items.astronaut.scene.rotation, 'y', -Math.PI, Math.PI, 0.01).name("Anaut Rot Y")
            this.projectsFolder.add(this.resources.items.astronaut.scene.rotation, 'x', -Math.PI, Math.PI, 0.01).name("Anaut Rot X")
            this.projectsFolder.add(this.resources.items.astronaut.scene.rotation, 'z', -Math.PI, Math.PI, 0.01).name("Anaut Rot Z")

        }
    }

    setWhoAmI(){
        // Setup Container
        this.whoAmIContainer.position.set(0, -2, 0)
        this.whoAmIContainer.rotation.set(0, -0.84, 0)

        // Setup notebook 3D Model
        this.resources.items.notebook.scene.position.set(-2.46,0,0)
        this.resources.items.notebook.scene.rotation.set(0.284,-0.265,-0.387)
        
        // Debug
        if (this.debug){
            this.whoAmIContainer.add(new THREE.AxesHelper(2))

            this.whoAmIFolder = this.debug.addFolder("WhoAmI")
            
            this.whoAmIFolder.add(this.whoAmIContainer.position, 'x', -20, 20, 0.001).name('Container X')
            this.whoAmIFolder.add(this.whoAmIContainer.position, 'y', -20, 20, 0.001).name('Container Y')
            this.whoAmIFolder.add(this.whoAmIContainer.position, 'z', -20, 20, 0.001).name('Container Z')
            this.whoAmIFolder.add(this.whoAmIContainer.rotation, 'y', -Math.PI, Math.PI, 0.001).name('container rot y')
            this.whoAmIFolder.add(this.resources.items.notebook.scene.position, 'x', -20, 20, 0.001).name('Notebook x')
            this.whoAmIFolder.add(this.resources.items.notebook.scene.position, 'y', -20, 20, 0.001).name('Notebook y')
            this.whoAmIFolder.add(this.resources.items.notebook.scene.position, 'z', -20, 20, 0.001).name('Notebook z')
            this.whoAmIFolder.add(this.resources.items.notebook.scene.rotation, 'x', -Math.PI, Math.PI, 0.001).name('Notebook rot x')
            this.whoAmIFolder.add(this.resources.items.notebook.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('Notebook rot y')
            this.whoAmIFolder.add(this.resources.items.notebook.scene.rotation, 'z', -Math.PI, Math.PI, 0.001).name('Notebook rot z')
        }
        
        // Add to container
        this.whoAmIContainer.add(this.resources.items.notebook.scene)
        
    }
    
    setWhatIDo(){
        // Setup Container
        this.whatIDoContainer.position.set(0, -6, 0)
        this.whatIDoContainer.rotation.set(0, -0.06, 0)
    
        // Setup notebook 3D Model
        this.resources.items.microscope.scene.position.set(3.81, -1.27, -1.561)
        this.resources.items.microscope.scene.rotation.set(0,1.414,0)
        
        // Debug
        if (this.debug){
            this.whatIDoContainer.add(new THREE.AxesHelper(2))
    
            this.whatIDoFolder = this.debug.addFolder("whatIDo")
            
            this.whatIDoFolder.add(this.whatIDoContainer.position, 'x', -20, 20, 0.001).name('Container X')
            this.whatIDoFolder.add(this.whatIDoContainer.position, 'y', -20, 20, 0.001).name('Container Y')
            this.whatIDoFolder.add(this.whatIDoContainer.position, 'z', -20, 20, 0.001).name('Container Z')
            this.whatIDoFolder.add(this.whatIDoContainer.rotation, 'y', -Math.PI, Math.PI, 0.001).name('container rot y')
            this.whatIDoFolder.add(this.resources.items.microscope.scene.position, 'x', -20, 20, 0.001).name('microscope x')
            this.whatIDoFolder.add(this.resources.items.microscope.scene.position, 'y', -20, 20, 0.001).name('microscope y')
            this.whatIDoFolder.add(this.resources.items.microscope.scene.position, 'z', -20, 20, 0.001).name('microscope z')
            this.whatIDoFolder.add(this.resources.items.microscope.scene.rotation, 'x', -Math.PI, Math.PI, 0.001).name('microscope rot x')
            this.whatIDoFolder.add(this.resources.items.microscope.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('microscope rot y')
            this.whatIDoFolder.add(this.resources.items.microscope.scene.rotation, 'z', -Math.PI, Math.PI, 0.001).name('microscope rot z')
        }
        
        // Add to container
        this.whatIDoContainer.add(this.resources.items.microscope.scene)
        
        
    }
    
    setAboutMe(){
        // Setup Container
        this.aboutMeContainer.position.set(0, -10, 0)
        this.aboutMeContainer.rotation.set(0, 0.72, 0)
    
        // Setup notebook 3D Model
        this.resources.items.books.scene.position.set(-2.539,.806,0)
        this.resources.items.books.scene.rotation.set(-0.085,-1.549, 0)
        this.resources.items.books.scene.scale.set(0.28,0.28,0.28)

        // Headphone
        this.resources.items.headphone.scene.position.set(-0.3,-1.87,0)
        this.resources.items.headphone.scene.rotation.set(-.135, 0.757, -0.504)
        this.resources.items.headphone.scene.scale.set(2,2,2)
        
        // Camera
        this.resources.items.camera.scene.position.set(2.6, 0.423, 0)
        this.resources.items.camera.scene.rotation.set(0, -2.395, -0.085)
        
        // Debug
        if (this.debug){
            this.aboutMeContainer.add(new THREE.AxesHelper(2))
    
            this.aboutMeFolder = this.debug.addFolder("aboutMe")
            
            // Container
            this.aboutMeFolder.add(this.aboutMeContainer.position, 'x', -20, 20, 0.001).name('Container X')
            this.aboutMeFolder.add(this.aboutMeContainer.position, 'y', -20, 20, 0.001).name('Container Y')
            this.aboutMeFolder.add(this.aboutMeContainer.position, 'z', -20, 20, 0.001).name('Container Z')
            this.aboutMeFolder.add(this.aboutMeContainer.rotation, 'y', -Math.PI, Math.PI, 0.001).name('container rot y')
            
            // Books
            this.aboutMeFolder.add(this.resources.items.books.scene.position, 'x', -20, 20, 0.001).name('books x')
            this.aboutMeFolder.add(this.resources.items.books.scene.position, 'y', -20, 20, 0.001).name('books y')
            this.aboutMeFolder.add(this.resources.items.books.scene.position, 'z', -20, 20, 0.001).name('books z')
            this.aboutMeFolder.add(this.resources.items.books.scene.rotation, 'x', -Math.PI, Math.PI, 0.001).name('books rot x')
            this.aboutMeFolder.add(this.resources.items.books.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('books rot y')
            this.aboutMeFolder.add(this.resources.items.books.scene.rotation, 'z', -Math.PI, Math.PI, 0.001).name('books rot z')
            // Headphone
            this.aboutMeFolder.add(this.resources.items.headphone.scene.position, 'x', -20, 20, 0.001).name('headphone x')
            this.aboutMeFolder.add(this.resources.items.headphone.scene.position, 'y', -20, 20, 0.001).name('headphone y')
            this.aboutMeFolder.add(this.resources.items.headphone.scene.position, 'z', -20, 20, 0.001).name('headphone z')
            this.aboutMeFolder.add(this.resources.items.headphone.scene.rotation, 'x', -Math.PI, Math.PI, 0.001).name('headphone rot x')
            this.aboutMeFolder.add(this.resources.items.headphone.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('headphone rot y')
            this.aboutMeFolder.add(this.resources.items.headphone.scene.rotation, 'z', -Math.PI, Math.PI, 0.001).name('headphone rot z')

            // Camera
            this.aboutMeFolder.add(this.resources.items.camera.scene.position, 'x', -20, 20, 0.001).name('camera x')
            this.aboutMeFolder.add(this.resources.items.camera.scene.position, 'y', -20, 20, 0.001).name('camera y')
            this.aboutMeFolder.add(this.resources.items.camera.scene.position, 'z', -20, 20, 0.001).name('camera z')
            this.aboutMeFolder.add(this.resources.items.camera.scene.rotation, 'x', -Math.PI, Math.PI, 0.001).name('camera rot x')
            this.aboutMeFolder.add(this.resources.items.camera.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('camera rot y')
            this.aboutMeFolder.add(this.resources.items.camera.scene.rotation, 'z', -Math.PI, Math.PI, 0.001).name('camera rot z')
        }
        
        // Add to container
        this.aboutMeContainer.add(
            this.resources.items.books.scene,
            this.resources.items.headphone.scene,
            this.resources.items.camera.scene,
        )
    }

    setHubble(){
        // Position Container
        this.hubbleContainer.position.set(0,-45,0)
        this.hubbleContainer.rotation.set(0,3.075,0)
        
        // Positions Hubble
        this.resources.items.hubble.scene.position.set(3.2,-1.22,0)
        this.resources.items.hubble.scene.rotation.set(0,0,1.15)
        this.resources.items.hubble.scene.scale.set(0.2,0.2,0.2)

        // Setting Up Radio Waves
        this.radioWaves = []
        this.radioWavesCount = 9

        for (let i = 0; i < this.radioWavesCount; i++){
            let mesh = new THREE.Mesh(this.geometries.items.torus, this.materials.items.phongMaterial)

            // mesh.position.copy(this.resources.items.hubble.scene.position)
            mesh.rotation.set(-2.15, 2.06, 2 * Math.PI)
            this.radioWaves.push(mesh)
            this.hubbleContainer.add(mesh)
        }
        

        if (this.debug) {
            this.hubbleFolder = this.debug.addFolder("Hubble")
            // Hubble
            this.hubbleFolder.add(this.resources.items.hubble.scene.position, "x", -10, 10, 0.01).name("Hubble X")
            this.hubbleFolder.add(this.resources.items.hubble.scene.position, "y", -10, 10, 0.01).name("Hubble Y")
            this.hubbleFolder.add(this.resources.items.hubble.scene.position, "z", -10, 10, 0.01).name("Hubble Z")
            this.hubbleFolder.add(this.resources.items.hubble.scene.rotation, "x", -Math.PI, Math.PI, 0.01).name("Hubble Rot X")
            this.hubbleFolder.add(this.resources.items.hubble.scene.rotation, "y", -Math.PI, Math.PI, 0.01).name("Hubble Rot Y")
            this.hubbleFolder.add(this.resources.items.hubble.scene.rotation, "z", -Math.PI, Math.PI, 0.01).name("Hubble Rot Z")
            
            this.hubbleFolder.add(this.hubbleContainer.position, "x", -10, 10, 0.01).name("Container X")
            this.hubbleFolder.add(this.hubbleContainer.position, "z", -10, 10, 0.01).name("Container Z")
            this.hubbleFolder.add(this.hubbleContainer.rotation, "x", -Math.PI, Math.PI, 0.01).name("Container Rot X")
            this.hubbleFolder.add(this.hubbleContainer.rotation, "y", -Math.PI, Math.PI, 0.01).name("Container Rot Y")
            this.hubbleFolder.add(this.hubbleContainer.rotation, "z", -Math.PI, Math.PI, 0.01).name("Container Rot Z")
            
            this.hubbleFolder.add(this.radioWaves[0].rotation, "x", -Math.PI, Math.PI, 0.01).name("Waves Rot X").onChange(() => {
                this.radioWaves.forEach(wave => wave.rotation.x = this.radioWaves[0].rotation.x)
            })
            this.hubbleFolder.add(this.radioWaves[0].rotation, "y", -Math.PI, Math.PI, 0.01).name("Waves Rot Y").onChange(() => {
                this.radioWaves.forEach(wave => wave.rotation.y = this.radioWaves[0].rotation.y)
            })
            this.hubbleFolder.add(this.radioWaves[0].rotation, "z", -Math.PI, Math.PI, 0.01).name("Waves Rot Z").onChange(() => {
                this.radioWaves.forEach(wave => wave.rotation.z = this.radioWaves[0].rotation.z)
            })

            this.resources.items.hubble.scene.add(new THREE.AxesHelper(5))
        }

        this.hubbleContainer.add(this.resources.items.hubble.scene)
    }
}