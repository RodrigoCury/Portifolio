import * as THREE from "three";
import Lights from "./Lights";
import Materials from "./Materials";
import Areas from "./Areas";
import Holograms from "./Holograms";
import Texts from "./Text";
import Stars from "./Stars";
import Geometries from "./Geometries";

export default class {
  constructor(_options) {
    // Options
    this.config = _options.config;
    this.debug = _options.debug;
    this.resources = _options.resources;
    this.time = _options.time;
    this.sizes = _options.sizes;
    this.camera = _options.camera;
    this.renderer = _options.renderer;
    this.passes = _options.passes;
    this.logosArray = [];

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder("World");
      // this.debugFolder.open()
    }

    // Setup
    this.astronautContainer = new THREE.Object3D();
    this.shipwreckContainer = new THREE.Object3D();
    this.whoAmIContainer = new THREE.Object3D();
    this.whatIDoContainer = new THREE.Object3D();
    this.aboutMeContainer = new THREE.Object3D();
    this.logoContainer = new THREE.Object3D();
    this.holoTextsContainer = new THREE.Object3D();
    this.projectsContainer = new THREE.Object3D();
    this.starsContainer = new THREE.Object3D();
    this.hubbleContainer = new THREE.Object3D();
    this.podContainer = new THREE.Object3D();

    this.setLights();
    this.setGeometries();
    this.setResources();
  }

  setLights() {
    this.lights = new Lights({
      debug: this.debug,
    });
  }

  setMaterials() {
    this.materials = new Materials({
      resources: this.resources,
      debug: this.debug,
      time: this.time,
    });
  }

  setGeometries() {
    this.geometries = new Geometries({
      debug: this.debug,
    });
  }

  setResources() {
    this.resources.on("ready", () => {
      this.setMaterials();
      this.setStars();
      this.setLogoArrays();
      this.setTextGeometries();
      this.setHolograms();
      this.setPositionObject();
      this.setPositions();
      this.setLogosRaycasting();
      this.setRescuePodMaterialsAndRaycasting();
      this.containerize();
      if (this.debug) {
        this.setDebug();
      }
      this.sizes.on("resize", () => {
        this.setPositions();
      });
    });
  }

  setStars() {
    this.stars = new Stars({
      debug: this.debug,
      resources: this.resources,
      time: this.time,
      container: this.starsContainer,
    });
  }

  setTextGeometries() {
    this.text = new Texts({
      resources: this.resources,
      debug: this.debug,
      materials: this.materials,
      logosArray: this.logosArray,
    });
  }

  setHolograms() {
    this.holograms = new Holograms({
      debug: this.debug,
      materials: this.materials,
      resources: this.resources,
      geometries: this.text,
      container: this.holoTextsContainer,
    });
  }

  containerize() {
    this.shipwreckContainer.add(this.posObj.shipwreck.objectd3D);

    this.astronautContainer.add(this.resources.items.astronautRigged.scene);

    this.whoAmIContainer.add(this.resources.items.notebook.scene);

    this.whatIDoContainer.add(this.resources.items.microscope.scene);

    this.aboutMeContainer.add(
      this.resources.items.books.scene,
      this.resources.items.headphone.scene,
      this.resources.items.camera.scene
    );

    this.logoContainer.add(
      this.resources.items.pyLogo.scene,
      this.resources.items.jsLogo.scene,
      this.resources.items.threeLogo.scene,
      this.resources.items.expressLogo.scene,
      this.resources.items.reactLogo.scene,
      this.resources.items.springLogo.scene,
      this.resources.items.javaLogo.scene,
      this.logosArea,
      this.resources.items.iss.scene,
      this.lights.items.spotLight,
      this.lights.items.spotLight.target,
      this.holoTextsContainer,
      this.holograms.cone
      // this.resources.items.biopyLogo.scene,
      // this.resources.items.css.scene,
      // this.resources.items.html.scene,
      // this.resources.items.djangoLogo.scene,
    );

    this.projectsContainer.add(this.resources.items.astronaut.scene);

    this.hubbleContainer.add(this.resources.items.hubble.scene);

    this.podContainer.add(
      this.resources.items.pod.scene,
      this.resources.items.eMailLogo.scene,
      this.resources.items.linkedInLogo.scene,
      this.resources.items.githubLogo.scene,
      this.contactArea,
      this.holograms.contactHologram,
      this.holograms.contactCone
    );
  }

  setLogoArrays() {
    this.logosArray = [
      [2, 2, this.resources.items.pyLogo.scene, "Python"],
      [2, 2, this.resources.items.jsLogo.scene, "Javascript"],
      [2, 2, this.resources.items.threeLogo.scene, "Three.js"],
      [2, 2, this.resources.items.javaLogo.scene, "Java 8+"],
      [2, 2, this.resources.items.springLogo.scene, "Spring"],
      [2, 2, this.resources.items.reactLogo.scene, "React.js"],
      [2, 2, this.resources.items.expressLogo.scene, "Express.js"],
      // [2, 2, this.resources.items.djangoLogo.scene, 'Django'],
      // [2, 2, this.resources.items.biopyLogo.scene, 'Biopython'],
      // [2, 2, this.resources.items.html.scene, 'HTML'],
      // [2, 2, this.resources.items.css.scene, 'CSS'],
    ];
  }

  setLogosRaycasting() {
    // Set Raycaster Area
    this.logosArea = Areas.addArea();

    this.logosArea.addList(this.logosArray);
  }

  setHubbleRadioWaves(screenSize) {
    // resets And remove Mesh for better memory management if resizing
    if (this.radioWaves !== undefined) {
      this.radioWaves.forEach((child) => {
        this.hubbleContainer.remove(
          this.hubbleContainer.getObjectByProperty("uuid", child.uuid)
        );
      });
    }

    // Setting Up Radio Waves
    this.radioWaves = [];
    this.radioWavesCount = 9;
    this.radioWavesContainer = new THREE.Object3D();

    for (let i = 0; i < this.radioWavesCount; i++) {
      const mesh = new THREE.Mesh(
        this.geometries.items.torus,
        this.materials.items.phongMaterial
      );

      // mesh.position.copy(this.resources.items.hubble.scene.position)
      if (screenSize === "mobile") {
        mesh.rotation.set(-0.73, 0.49, 0);
      } else if (screenSize === "desktop") {
        mesh.rotation.set(-2.15, 2.06, 2 * Math.PI);
      }
      mesh.position.copy(this.resources.items.hubble.scene.position);
      this.radioWaves.push(mesh);
      this.hubbleContainer.add(mesh);
    }
  }

  setRescuePodMaterialsAndRaycasting() {
    let door = this.resources.items.pod.scene.children.find(
      (child) => child.name === "Door"
    );
    door.material = this.materials.items.doorMaterial; // Change to HoloMaterial

    let list = [
      this.resources.items.githubLogo.scene,
      this.resources.items.linkedInLogo.scene,
      this.resources.items.eMailLogo.scene,
    ];
    list.forEach((item) => {
      item.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = this.materials.items.logoHoloMaterial; // Change to HoloMaterial
        }
      });
    });

    // Set Raycaster Areas
    this.contactArea = Areas.addArea();
    this.contactArea.addToArea(
      2,
      2,
      this.resources.items.githubLogo.scene,
      "gitHub"
    );
    this.contactArea.addToArea(
      2,
      2,
      this.resources.items.linkedInLogo.scene,
      "linkedIn"
    );
    this.contactArea.addToArea(
      2,
      2,
      this.resources.items.eMailLogo.scene,
      "eMail"
    );
  }

  setPositionObject() {
    this.posObj = {};
    this.posObj.shipwreckCont = {
      objectd3D: this.shipwreckContainer,
      desktop: {
        position: new THREE.Vector3(0, 6, 0),
        rotation: new THREE.Vector3(0, -2.4, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, 6, 0),
        rotation: new THREE.Vector3(0, -2.4, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.shipwreck = {
      objectd3D: this.resources.items.shipwreck.scene,
      desktop: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(1.221, 4.124, 0.33),
        scale: new THREE.Vector3(0.15, 0.15, 0.15),
      },
      mobile: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(1.221, 4.124, 0.33),
        scale: new THREE.Vector3(0.05, 0.05, 0.05),
      },
    };

    this.posObj.astronautCont = {
      objectd3D: this.astronautContainer,
      desktop: {
        position: new THREE.Vector3(-1, -4.5, -5.925),
        rotation: new THREE.Vector3(0, -0.859, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(-1, -4.5, -5.925),
        rotation: new THREE.Vector3(0, -0.859, 0),
        scale: new THREE.Vector3(0.5, 0.5, 0.5),
      },
    };

    this.posObj.astronaut = {
      objectd3D: this.resources.items.astronautRigged.scene,
      desktop: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(0.5, 0.5, 0.5),
      },
      mobile: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.logoCont = {
      objectd3D: this.logoContainer,
      desktop: {
        position: new THREE.Vector3(-5.75, -20, 3.75),
        rotation: new THREE.Vector3(0, 2.42, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(-2.06, -19.44, -0.14),
        rotation: new THREE.Vector3(0, 1.52, 0),
        scale: new THREE.Vector3(0.5, 0.5, 0.5),
      },
    };

    this.posObj.pyLogo = {
      objectd3D: this.resources.items.pyLogo.scene,
      desktop: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.jsLogo = {
      objectd3D: this.resources.items.jsLogo.scene,
      desktop: {
        position: new THREE.Vector3(2, 0, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(0.9, 0.9, 0.9),
      },
      mobile: {
        position: new THREE.Vector3(2, 0, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(0.9, 0.9, 0.9),
      },
    };

    this.posObj.javaLogo = {
      objectd3D: this.resources.items.javaLogo.scene,
      desktop: {
        position: new THREE.Vector3(-2, 0, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(-2, 0, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.springLogo = {
      objectd3D: this.resources.items.springLogo.scene,
      desktop: {
        position: new THREE.Vector3(-1, 2, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(-1, 2, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    // this.posObj.djangoLogo = {
    //     objectd3D: this.resources.items.djangoLogo.scene,
    //     desktop: {
    //         position: new THREE.Vector3(-2, 0, 0),
    //         rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    //         scale: new THREE.Vector3(1, 1, 1),
    //     },
    //     mobile: {
    //         position: new THREE.Vector3(-2, 0, 0),
    //         rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    //         scale: new THREE.Vector3(1, 1, 1),
    //     },
    // }

    // this.posObj.biopyLogo = {
    //     objectd3D: this.resources.items.biopyLogo.scene,
    //     desktop: {
    //         position: new THREE.Vector3(0, 0, 0),
    //         rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    //         scale: new THREE.Vector3(1, 1, 1),
    //     },
    //     mobile: {
    //         position: new THREE.Vector3(0, 0, 0),
    //         rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    //         scale: new THREE.Vector3(1, 1, 1),
    //     },
    // }

    this.posObj.threeLogo = {
      objectd3D: this.resources.items.threeLogo.scene,
      desktop: {
        position: new THREE.Vector3(1, -2, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(1, -2, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.reactLogo = {
      objectd3D: this.resources.items.reactLogo.scene,
      desktop: {
        position: new THREE.Vector3(-1, -2, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(-1, -2, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.expressLogo = {
      objectd3D: this.resources.items.expressLogo.scene,
      desktop: {
        position: new THREE.Vector3(1, 2, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(1, 2, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    // this.posObj.html = {
    //     objectd3D: this.resources.items.html.scene,
    //     desktop: {
    //         position: new THREE.Vector3(-1, -2, 0),
    //         rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    //         scale: new THREE.Vector3(1, 1, 1),
    //     },
    //     mobile: {
    //         position: new THREE.Vector3(-1, -2, 0),
    //         rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    //         scale: new THREE.Vector3(1, 1, 1),
    //     },
    // }

    // this.posObj.css = {
    //     objectd3D: this.resources.items.css.scene,
    //     desktop: {
    //         position: new THREE.Vector3(1, -2, 0),
    //         rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    //         scale: new THREE.Vector3(1, 1, 1),
    //     },
    //     mobile: {
    //         position: new THREE.Vector3(1, -2, 0),
    //         rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
    //         scale: new THREE.Vector3(1, 1, 1),
    //     },
    // }

    this.posObj.iss = {
      objectd3D: this.resources.items.iss.scene,
      desktop: {
        position: new THREE.Vector3(6.437, -1.34, 5),
        rotation: new THREE.Vector3(0, Math.PI / 2, Math.PI / 2),
        scale: new THREE.Vector3(0.6, 0.6, 0.6),
      },
      mobile: {
        position: new THREE.Vector3(2.123, -3.451, 3.95),
        rotation: new THREE.Vector3(0, 1.834, 1.571),
        scale: new THREE.Vector3(0.5, 0.5, 0.5),
      },
    };

    this.posObj.spotLight = {
      objectd3D: this.lights.items.spotLight,
      desktop: {
        position: new THREE.Vector3(6.437, -2.56, 3.95),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(6.437, -2.56, 3.95),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.holoText = {
      objectd3D: this.holoTextsContainer,
      desktop: {
        position: new THREE.Vector3(0.266, -1.7, 6.795),
        rotation: new THREE.Vector3(0, -Math.PI / 2, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -3.917, 5.256),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.holoCone = {
      objectd3D: this.holograms.cone,
      desktop: {
        position: new THREE.Vector3(5.298, -1.683, 5.297),
        rotation: new THREE.Vector3(0.26, -Math.PI, 0.16),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(1.547, -3.652, 4.363),
        rotation: new THREE.Vector3(0.6, -2.46, 0.39),
        scale: new THREE.Vector3(0.5, 0.5, 0.5),
      },
    };

    this.posObj.projectsCont = {
      objectd3D: this.projectsContainer,
      desktop: {
        position: new THREE.Vector3(0, -35, 0),
        rotation: new THREE.Vector3(0, 2.28, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -35, 0),
        rotation: new THREE.Vector3(0, 2.28, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.moonAstronaut = {
      objectd3D: this.resources.items.astronaut.scene,
      desktop: {
        position: new THREE.Vector3(-3.34, -0.29, 0),
        rotation: new THREE.Vector3(-0.06, 1.53, 0.29),
        scale: new THREE.Vector3(0.44, 0.44, 0.44),
      },
      mobile: {
        position: new THREE.Vector3(1.14, -2.28, 0),
        rotation: new THREE.Vector3(-0.57, -0.72, 0),
        scale: new THREE.Vector3(0.3, 0.3, 0.3),
      },
    };

    this.posObj.whoAmICont = {
      objectd3D: this.whoAmIContainer,
      desktop: {
        position: new THREE.Vector3(0, -2, 0),
        rotation: new THREE.Vector3(0, -0.84, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -2, 0),
        rotation: new THREE.Vector3(0, -0.84, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.notebook = {
      objectd3D: this.resources.items.notebook.scene,
      desktop: {
        position: new THREE.Vector3(-2.46, 0, 0),
        rotation: new THREE.Vector3(0.284, -0.265, -0.387),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0.699, -0.236, 0.025),
        rotation: new THREE.Vector3(0.548, -2.442, 0),
        scale: new THREE.Vector3(0.8, 0.8, 0.8),
      },
    };

    this.posObj.whatIDoCont = {
      objectd3D: this.whatIDoContainer,
      desktop: {
        position: new THREE.Vector3(0, -6, 0),
        rotation: new THREE.Vector3(0, -0.06, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -6, 0),
        rotation: new THREE.Vector3(0, -0.06, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.microscope = {
      objectd3D: this.resources.items.microscope.scene,
      desktop: {
        position: new THREE.Vector3(3.81, -1.27, -1.561),
        rotation: new THREE.Vector3(0, 1.414, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -1.619, 0),
        rotation: new THREE.Vector3(0, -2.246, 0),
        scale: new THREE.Vector3(0.4, 0.4, 0.4),
      },
    };

    this.posObj.aboutMeCont = {
      objectd3D: this.aboutMeContainer,
      desktop: {
        position: new THREE.Vector3(0, -10, 0),
        rotation: new THREE.Vector3(0, 0.72, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -10, 0),
        rotation: new THREE.Vector3(0, 0.72, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.books = {
      objectd3D: this.resources.items.books.scene,
      desktop: {
        position: new THREE.Vector3(-2.539, 0.806, 0),
        rotation: new THREE.Vector3(-0.085, -1.549, 0),
        scale: new THREE.Vector3(0.28, 0.28, 0.28),
      },
      mobile: {
        position: new THREE.Vector3(0, 1.01, 0),
        rotation: new THREE.Vector3(0, -1.714, -0.219),
        scale: new THREE.Vector3(0.15, 0.15, 0.15),
      },
    };

    this.posObj.headphone = {
      objectd3D: this.resources.items.headphone.scene,
      desktop: {
        position: new THREE.Vector3(-0.3, -1.87, 0),
        rotation: new THREE.Vector3(-0.135, 0.757, -0.504),
        scale: new THREE.Vector3(2, 2, 2),
      },
      mobile: {
        position: new THREE.Vector3(-0.641, -1.27, 0),
        rotation: new THREE.Vector3(-0.135, 0.757, -0.504),
        scale: new THREE.Vector3(1.5, 1.5, 1.5),
      },
    };

    this.posObj.camera = {
      objectd3D: this.resources.items.camera.scene,
      desktop: {
        position: new THREE.Vector3(2.6, 0.423, 0),
        rotation: new THREE.Vector3(0, -2.395, -0.085),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0.757, -1.219, 0),
        rotation: new THREE.Vector3(0, -2.22, 0.159),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.hubbleCont = {
      objectd3D: this.hubbleContainer,
      desktop: {
        position: new THREE.Vector3(0, -45, 0),
        rotation: new THREE.Vector3(0, 3.075, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -45, 0),
        rotation: new THREE.Vector3(0, 3.075, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.hubble = {
      objectd3D: this.resources.items.hubble.scene,
      desktop: {
        position: new THREE.Vector3(3.2, -1.22, 0),
        rotation: new THREE.Vector3(0, 0, 1.15),
        scale: new THREE.Vector3(0.2, 0.2, 0.2),
      },
      mobile: {
        position: new THREE.Vector3(0.94, 0.94, 0.94),
        rotation: new THREE.Vector3(0, 0.18, 2.41),
        scale: new THREE.Vector3(0.2, 0.2, 0.2),
      },
    };

    this.posObj.podCont = {
      objectd3D: this.podContainer,
      desktop: {
        position: new THREE.Vector3(0, -57, 0),
        rotation: new THREE.Vector3(0, -2.415, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -57, 0),
        rotation: new THREE.Vector3(0, -2.415, 0),
        scale: new THREE.Vector3(0.28, 0.28, 0.28),
      },
    };

    this.posObj.pod = {
      objectd3D: this.resources.items.pod.scene,
      desktop: {
        position: new THREE.Vector3(-15, 4.87, -2),
        rotation: new THREE.Vector3(-1.53, 3.14, 1.82),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(-15, 4.87, -2),
        rotation: new THREE.Vector3(-1.53, 3.14, 1.82),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.contactHologram = {
      objectd3D: this.holograms.contactHologram,
      desktop: {
        position: new THREE.Vector3(0, -0.78, -3.5),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -0.68, -3.5),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.contactCone = {
      objectd3D: this.holograms.contactCone,
      desktop: {
        position: new THREE.Vector3(-3.385, -0.5, -8.273),
        rotation: new THREE.Vector3(-0.55, 1.55, 0.07),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(-3.116, -0.215, -8.273),
        rotation: new THREE.Vector3(-0.55, 2.79, -0.93),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.eMailLogo = {
      objectd3D: this.resources.items.eMailLogo.scene,
      desktop: {
        position: new THREE.Vector3(-2.2, -2.25, -3.5),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -2.6, -3.5),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.linkedInLogo = {
      objectd3D: this.resources.items.linkedInLogo.scene,
      desktop: {
        position: new THREE.Vector3(0, -2.25, -3.5),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -5, -3.5),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };

    this.posObj.githubLogo = {
      objectd3D: this.resources.items.githubLogo.scene,
      desktop: {
        position: new THREE.Vector3(2.2, -2.25, -3.5),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
      mobile: {
        position: new THREE.Vector3(0, -7.4, -3.5),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      },
    };
  }

  setPositions() {
    if (this.sizes.userType === "desktop") {
      this.positions("desktop");
      this.setHubbleRadioWaves("desktop");
    } else if (this.sizes.userType === "mobile") {
      this.positions("mobile");
      this.setHubbleRadioWaves("mobile");
    }
  }

  positions(screenSize) {
    for (const info of Object.values(this.posObj)) {
      info.objectd3D.position.x = info[screenSize].position.x;
      info.objectd3D.position.y = info[screenSize].position.y;
      info.objectd3D.position.z = info[screenSize].position.z;
      info.objectd3D.rotation.x = info[screenSize].rotation.x;
      info.objectd3D.rotation.y = info[screenSize].rotation.y;
      info.objectd3D.rotation.z = info[screenSize].rotation.z;
      info.objectd3D.scale.x = info[screenSize].scale.x;
      info.objectd3D.scale.y = info[screenSize].scale.y;
      info.objectd3D.scale.z = info[screenSize].scale.z;
    }
  }

  setDebug() {
    /**
     * Shipwreck
     */
    this.shipwreckContainer.add(new THREE.AxesHelper(2));
    this.shipwreckFolder = this.debugFolder.addFolder("Shipwreck");
    this.shipwreckFolder
      .add(this.resources.items.shipwreck.scene.position, "x", -10, 10, 0.001)
      .name("shipwreck x");
    this.shipwreckFolder
      .add(this.resources.items.shipwreck.scene.position, "y", -10, 10, 0.001)
      .name("shipwreck y");
    this.shipwreckFolder
      .add(this.resources.items.shipwreck.scene.position, "z", -10, 10, 0.001)
      .name("shipwreck z");
    this.shipwreckFolder
      .add(this.resources.items.shipwreck.scene.rotation, "x", -10, 10, 0.001)
      .name("shipwreck rot x");
    this.shipwreckFolder
      .add(this.resources.items.shipwreck.scene.rotation, "y", -10, 10, 0.001)
      .name("shipwreck rot y");
    this.shipwreckFolder
      .add(this.resources.items.shipwreck.scene.rotation, "z", -10, 10, 0.001)
      .name("shipwreck rot z");
    this.shipwreckFolder
      .add(this.shipwreckContainer.position, "x", -10, 10, 0.001)
      .name("container x");
    this.shipwreckFolder
      .add(this.shipwreckContainer.position, "y", -10, 10, 0.001)
      .name("container y");
    this.shipwreckFolder
      .add(this.shipwreckContainer.position, "z", -10, 10, 0.001)
      .name("container z");
    this.shipwreckFolder
      .add(this.shipwreckContainer.rotation, "x", -10, 10, 0.001)
      .name("container rot x");
    this.shipwreckFolder
      .add(this.shipwreckContainer.rotation, "y", -10, 10, 0.001)
      .name("container rot y");
    this.shipwreckFolder
      .add(this.shipwreckContainer.rotation, "z", -10, 10, 0.001)
      .name("container rot z");
    this.shipwreckFolder
      .add(this.shipwreckContainer.scale, "z", 0, 1, 0.0001)
      .name("Scale")
      .onChange(() => {
        let scale = this.shipwreckContainer.scale.z;
        this.shipwreckContainer.scale.set(scale, scale, scale);
      });

    /**
     * Roaming Astronaut
     */

    // Debug Folder
    this.astronautFolder = this.debugFolder.addFolder("Roaming Astronaut");

    // Container Debug
    this.astronautFolder
      .add(this.astronautContainer.position, "x", -15, 15, 0.001)
      .name("container X");
    this.astronautFolder
      .add(this.astronautContainer.position, "y", -60, 10, 0.001)
      .name("container Y");
    this.astronautFolder
      .add(this.astronautContainer.position, "z", -15, 15, 0.001)
      .name("container Z");
    this.astronautFolder
      .add(this.astronautContainer.rotation, "x", -Math.PI, Math.PI, 0.001)
      .name("container rot X");
    this.astronautFolder
      .add(this.astronautContainer.rotation, "y", -Math.PI, Math.PI, 0.001)
      .name("container rot Y");
    this.astronautFolder
      .add(this.astronautContainer.rotation, "z", -Math.PI, Math.PI, 0.001)
      .name("container rot Z");

    // Astronaut Debug
    this.astronautFolder
      .add(
        this.resources.items.astronautRigged.scene.position,
        "x",
        -6,
        6,
        0.001
      )
      .name("Astronaut X");
    this.astronautFolder
      .add(
        this.resources.items.astronautRigged.scene.position,
        "y",
        -6,
        6,
        0.001
      )
      .name("Astronaut Y");
    this.astronautFolder
      .add(
        this.resources.items.astronautRigged.scene.position,
        "z",
        -6,
        6,
        0.001
      )
      .name("Astronaut Z");
    this.astronautFolder
      .add(
        this.resources.items.astronautRigged.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("Astronaut rot X");
    this.astronautFolder
      .add(
        this.resources.items.astronautRigged.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("Astronaut rot Y");
    this.astronautFolder
      .add(
        this.resources.items.astronautRigged.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("Astronaut rot Z");
    this.astronautFolder
      .add(this.resources.items.astronautRigged.scene.scale, "x", 0, 1, 0.025)
      .name("Astronaut scale X")
      .onChange(() => {
        let scale = this.resources.items.astronautRigged.scene.scale.x;
        this.resources.items.astronautRigged.scene.scale.set(
          scale,
          scale,
          scale
        );
      });

    this.astronautContainer.add(new THREE.AxesHelper(1.5));

    /**
     * Who Am I
     */

    this.whoAmIContainer.add(new THREE.AxesHelper(2));

    this.whoAmIFolder = this.debugFolder.addFolder("WhoAmI");

    this.whoAmIFolder
      .add(this.whoAmIContainer.position, "x", -20, 20, 0.001)
      .name("Container X");
    this.whoAmIFolder
      .add(this.whoAmIContainer.position, "y", -20, 20, 0.001)
      .name("Container Y");
    this.whoAmIFolder
      .add(this.whoAmIContainer.position, "z", -20, 20, 0.001)
      .name("Container Z");
    this.whoAmIFolder
      .add(this.whoAmIContainer.rotation, "y", -Math.PI, Math.PI, 0.001)
      .name("container rot y");
    this.whoAmIFolder
      .add(this.resources.items.notebook.scene.position, "x", -20, 20, 0.001)
      .name("Notebook x");
    this.whoAmIFolder
      .add(this.resources.items.notebook.scene.position, "y", -20, 20, 0.001)
      .name("Notebook y");
    this.whoAmIFolder
      .add(this.resources.items.notebook.scene.position, "z", -20, 20, 0.001)
      .name("Notebook z");
    this.whoAmIFolder
      .add(
        this.resources.items.notebook.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("Notebook rot x");
    this.whoAmIFolder
      .add(
        this.resources.items.notebook.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("Notebook rot y");
    this.whoAmIFolder
      .add(
        this.resources.items.notebook.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("Notebook rot z");

    /**
     * What I Do
     */

    this.whatIDoContainer.add(new THREE.AxesHelper(2));

    this.whatIDoFolder = this.debugFolder.addFolder("whatIDo");

    this.whatIDoFolder
      .add(this.whatIDoContainer.position, "x", -20, 20, 0.001)
      .name("Container X");
    this.whatIDoFolder
      .add(this.whatIDoContainer.position, "y", -20, 20, 0.001)
      .name("Container Y");
    this.whatIDoFolder
      .add(this.whatIDoContainer.position, "z", -20, 20, 0.001)
      .name("Container Z");
    this.whatIDoFolder
      .add(this.whatIDoContainer.rotation, "y", -Math.PI, Math.PI, 0.001)
      .name("container rot y");
    this.whatIDoFolder
      .add(this.resources.items.microscope.scene.position, "x", -20, 20, 0.001)
      .name("microscope x");
    this.whatIDoFolder
      .add(this.resources.items.microscope.scene.position, "y", -20, 20, 0.001)
      .name("microscope y");
    this.whatIDoFolder
      .add(this.resources.items.microscope.scene.position, "z", -20, 20, 0.001)
      .name("microscope z");
    this.whatIDoFolder
      .add(
        this.resources.items.microscope.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("microscope rot x");
    this.whatIDoFolder
      .add(
        this.resources.items.microscope.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("microscope rot y");
    this.whatIDoFolder
      .add(
        this.resources.items.microscope.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("microscope rot z");

    /**
     * About Me
     */

    this.aboutMeContainer.add(new THREE.AxesHelper(2));

    this.aboutMeFolder = this.debugFolder.addFolder("aboutMe");

    // Container
    this.aboutMeFolder
      .add(this.aboutMeContainer.position, "x", -20, 20, 0.001)
      .name("Container X");
    this.aboutMeFolder
      .add(this.aboutMeContainer.position, "y", -20, 20, 0.001)
      .name("Container Y");
    this.aboutMeFolder
      .add(this.aboutMeContainer.position, "z", -20, 20, 0.001)
      .name("Container Z");
    this.aboutMeFolder
      .add(this.aboutMeContainer.rotation, "y", -Math.PI, Math.PI, 0.001)
      .name("container rot y");

    // Books
    this.aboutMeFolder
      .add(this.resources.items.books.scene.position, "x", -20, 20, 0.001)
      .name("books x");
    this.aboutMeFolder
      .add(this.resources.items.books.scene.position, "y", -20, 20, 0.001)
      .name("books y");
    this.aboutMeFolder
      .add(this.resources.items.books.scene.position, "z", -20, 20, 0.001)
      .name("books z");
    this.aboutMeFolder
      .add(
        this.resources.items.books.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("books rot x");
    this.aboutMeFolder
      .add(
        this.resources.items.books.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("books rot y");
    this.aboutMeFolder
      .add(
        this.resources.items.books.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("books rot z");
    this.aboutMeFolder
      .add(
        this.resources.items.books.scene.scale,
        "z",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("books Scale")
      .onChange(() => {
        let s = this.resources.items.books.scene.scale.z;
        this.resources.items.books.scene.scale.set(s, s, s);
      });
    // Headphone
    this.aboutMeFolder
      .add(this.resources.items.headphone.scene.position, "x", -20, 20, 0.001)
      .name("headphone x");
    this.aboutMeFolder
      .add(this.resources.items.headphone.scene.position, "y", -20, 20, 0.001)
      .name("headphone y");
    this.aboutMeFolder
      .add(this.resources.items.headphone.scene.position, "z", -20, 20, 0.001)
      .name("headphone z");
    this.aboutMeFolder
      .add(
        this.resources.items.headphone.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("headphone rot x");
    this.aboutMeFolder
      .add(
        this.resources.items.headphone.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("headphone rot y");
    this.aboutMeFolder
      .add(
        this.resources.items.headphone.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("headphone rot z");

    // Camera
    this.aboutMeFolder
      .add(this.resources.items.camera.scene.position, "x", -20, 20, 0.001)
      .name("camera x");
    this.aboutMeFolder
      .add(this.resources.items.camera.scene.position, "y", -20, 20, 0.001)
      .name("camera y");
    this.aboutMeFolder
      .add(this.resources.items.camera.scene.position, "z", -20, 20, 0.001)
      .name("camera z");
    this.aboutMeFolder
      .add(
        this.resources.items.camera.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("camera rot x");
    this.aboutMeFolder
      .add(
        this.resources.items.camera.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("camera rot y");
    this.aboutMeFolder
      .add(
        this.resources.items.camera.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("camera rot z");

    /**
     * Logos
     */
    this.logoContainerFolder = this.debugFolder.addFolder("Logo Container");
    this.logoContainerFolder
      .add(this.logoContainer.position, "z", -30, 30, 0.01)
      .name("logoC Z");
    this.logoContainerFolder
      .add(this.logoContainer.position, "y", -30, 30, 0.01)
      .name("logoC Y");
    this.logoContainerFolder
      .add(this.logoContainer.position, "x", -30, 30, 0.01)
      .name("logoC X");
    this.logoContainerFolder
      .add(this.logoContainer.rotation, "y", -Math.PI, Math.PI, 0.01)
      .name("logoC Rot");

    this.issFolder = this.debugFolder.addFolder("ISS");
    this.issFolder
      .add(this.resources.items.iss.scene.position, "x", -10, 10, 0.001)
      .name("ISS X");
    this.issFolder
      .add(this.resources.items.iss.scene.position, "y", -10, 10, 0.001)
      .name("ISS Y");
    this.issFolder
      .add(this.resources.items.iss.scene.position, "z", -10, 10, 0.001)
      .name("ISS Z");
    this.issFolder
      .add(
        this.resources.items.iss.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("ISS rot X");
    this.issFolder
      .add(
        this.resources.items.iss.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("ISS rot Y");
    this.issFolder
      .add(
        this.resources.items.iss.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.001
      )
      .name("ISS rot Z");
    this.issFolder
      .add(this.lights.items.spotLight.position, "x", -10, 10, 0.001)
      .name("Spotlight X");
    this.issFolder
      .add(this.lights.items.spotLight.position, "y", -10, 10, 0.001)
      .name("Spotlight Y");
    this.issFolder
      .add(this.lights.items.spotLight.position, "z", -10, 10, 0.001)
      .name("Spotlight Z");

    // this.sLHelper = new THREE.SpotLightHelper(this.lights.items.spotLight)
    // this.sLHelper.matrix = this.lights.items.spotLight.matrix
    // this.logoContainer.add(this.sLHelper)

    /**
     * Projects
     */

    // Axes helper
    this.projectsContainer.add(new THREE.AxesHelper(2));

    // Container
    this.projectsFolder = this.debugFolder.addFolder("Projects");
    this.projectsFolder
      .add(this.projectsContainer.position, "x", -30, 30, 0.01)
      .name("Container X");
    this.projectsFolder
      .add(this.projectsContainer.position, "y", -30, 30, 0.01)
      .name("Container Y");
    this.projectsFolder
      .add(this.projectsContainer.position, "z", -30, 30, 0.01)
      .name("Container Z");
    this.projectsFolder
      .add(this.projectsContainer.rotation, "y", -Math.PI, Math.PI, 0.01)
      .name("Container Rot");

    // Astronaut
    this.projectsFolder
      .add(this.resources.items.astronaut.scene.position, "x", -15, 15, 0.01)
      .name("Anaut X");
    this.projectsFolder
      .add(this.resources.items.astronaut.scene.position, "y", -15, 15, 0.01)
      .name("Anaut Y");
    this.projectsFolder
      .add(this.resources.items.astronaut.scene.position, "z", -15, 15, 0.01)
      .name("Anaut Z");
    this.projectsFolder
      .add(
        this.resources.items.astronaut.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Anaut Rot Y");
    this.projectsFolder
      .add(
        this.resources.items.astronaut.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Anaut Rot X");
    this.projectsFolder
      .add(
        this.resources.items.astronaut.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Anaut Rot Z");

    /**
     * Hubble
     */

    this.hubbleFolder = this.debugFolder.addFolder("Hubble");
    // Hubble
    this.hubbleFolder
      .add(this.resources.items.hubble.scene.position, "x", -10, 10, 0.01)
      .name("Hubble X");
    this.hubbleFolder
      .add(this.resources.items.hubble.scene.position, "y", -10, 10, 0.01)
      .name("Hubble Y");
    this.hubbleFolder
      .add(this.resources.items.hubble.scene.position, "z", -10, 10, 0.01)
      .name("Hubble Z");
    this.hubbleFolder
      .add(
        this.resources.items.hubble.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Hubble Rot X");
    this.hubbleFolder
      .add(
        this.resources.items.hubble.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Hubble Rot Y");
    this.hubbleFolder
      .add(
        this.resources.items.hubble.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Hubble Rot Z");

    this.hubbleFolder
      .add(this.hubbleContainer.position, "x", -10, 10, 0.01)
      .name("Container X");
    this.hubbleFolder
      .add(this.hubbleContainer.position, "z", -10, 10, 0.01)
      .name("Container Z");
    this.hubbleFolder
      .add(this.hubbleContainer.rotation, "x", -Math.PI, Math.PI, 0.01)
      .name("Container Rot X");
    this.hubbleFolder
      .add(this.hubbleContainer.rotation, "y", -Math.PI, Math.PI, 0.01)
      .name("Container Rot Y");
    this.hubbleFolder
      .add(this.hubbleContainer.rotation, "z", -Math.PI, Math.PI, 0.01)
      .name("Container Rot Z");

    this.hubbleFolder
      .add(this.radioWaves[0].rotation, "x", -Math.PI, Math.PI, 0.01)
      .name("Waves Rot X")
      .onChange(() => {
        this.radioWaves.forEach(
          (wave) => (wave.rotation.x = this.radioWaves[0].rotation.x)
        );
      });
    this.hubbleFolder
      .add(this.radioWaves[0].rotation, "y", -Math.PI, Math.PI, 0.01)
      .name("Waves Rot Y")
      .onChange(() => {
        this.radioWaves.forEach(
          (wave) => (wave.rotation.y = this.radioWaves[0].rotation.y)
        );
      });
    this.hubbleFolder
      .add(this.radioWaves[0].rotation, "z", -Math.PI, Math.PI, 0.01)
      .name("Waves Rot Z")
      .onChange(() => {
        this.radioWaves.forEach(
          (wave) => (wave.rotation.z = this.radioWaves[0].rotation.z)
        );
      });

    this.resources.items.hubble.scene.add(new THREE.AxesHelper(5));
    this.hubbleContainer.add(new THREE.AxesHelper(2));

    /**
     * Rescue Pod
     */

    this.podFolder = this.debugFolder.addFolder("Rescue Pod");

    // Container Debug
    this.podFolder
      .add(this.podContainer.position, "x", -10, 10, 0.01)
      .name("Container X");
    this.podFolder
      .add(this.podContainer.position, "y", -10, 10, 0.01)
      .name("Container Y");
    this.podFolder
      .add(this.podContainer.position, "z", -10, 10, 0.01)
      .name("Container Z");
    this.podFolder
      .add(this.podContainer.rotation, "x", -Math.PI, Math.PI, 0.01)
      .name("Container Rot X");
    this.podFolder
      .add(this.podContainer.rotation, "y", -Math.PI, Math.PI, 0.01)
      .name("Container Rot Y");
    this.podFolder
      .add(this.podContainer.rotation, "z", -Math.PI, Math.PI, 0.01)
      .name("Container Rot Z");
    this.podFolder
      .add(this.podContainer.scale, "x", 0, 1, 0.01)
      .name("Container Scale")
      .onChange(() => {
        let scale = this.podContainer.scale.x;
        this.podContainer.scale.set(scale, scale, scale);
      });

    // Pod Debug
    this.podFolder
      .add(this.resources.items.pod.scene.position, "x", -10, 10, 0.01)
      .name("Pod X");
    this.podFolder
      .add(this.resources.items.pod.scene.position, "y", -10, 10, 0.01)
      .name("Pod Y");
    this.podFolder
      .add(this.resources.items.pod.scene.position, "z", -10, 10, 0.01)
      .name("Pod Z");
    this.podFolder
      .add(
        this.resources.items.pod.scene.rotation,
        "x",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Pod Rot X");
    this.podFolder
      .add(
        this.resources.items.pod.scene.rotation,
        "y",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Pod Rot Y");
    this.podFolder
      .add(
        this.resources.items.pod.scene.rotation,
        "z",
        -Math.PI,
        Math.PI,
        0.01
      )
      .name("Pod Rot Z");

    // Text

    this.podFolder
      .add(this.holograms.contactHologram.position, "x", -10, 10, 0.01)
      .name("text X");
    this.podFolder
      .add(this.holograms.contactHologram.position, "y", -10, 10, 0.01)
      .name("text Y");
    this.podFolder
      .add(this.holograms.contactHologram.position, "z", -10, 10, 0.01)
      .name("text Z");

    // Logos

    this.podFolder
      .add(this.resources.items.githubLogo.scene.position, "x", -10, 10, 0.01)
      .name("github X");
    this.podFolder
      .add(this.resources.items.githubLogo.scene.position, "y", -10, 10, 0.01)
      .name("github Y");
    this.podFolder
      .add(this.resources.items.githubLogo.scene.position, "z", -10, 10, 0.01)
      .name("github Z");

    this.podFolder
      .add(this.resources.items.linkedInLogo.scene.position, "x", -10, 10, 0.01)
      .name("linkedInLogo X");
    this.podFolder
      .add(this.resources.items.linkedInLogo.scene.position, "y", -10, 10, 0.01)
      .name("linkedInLogo Y");
    this.podFolder
      .add(this.resources.items.linkedInLogo.scene.position, "z", -10, 10, 0.01)
      .name("linkedInLogo Z");

    this.podFolder
      .add(this.resources.items.eMailLogo.scene.position, "x", -10, 10, 0.01)
      .name("eMailLogo X");
    this.podFolder
      .add(this.resources.items.eMailLogo.scene.position, "y", -10, 10, 0.01)
      .name("eMailLogo Y");
    this.podFolder
      .add(this.resources.items.eMailLogo.scene.position, "z", -10, 10, 0.01)
      .name("eMailLogo Z");

    this.podContainer.add(new THREE.AxesHelper());
  }
}
