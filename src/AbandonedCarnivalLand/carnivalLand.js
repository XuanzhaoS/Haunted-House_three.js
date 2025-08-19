import * as THREE from "three";
import * as CANNON from "cannon-es";
import { addEnvironmentToGroup } from "./scene/environment.js";
import { addFerrisWheelToScene } from "./scene/ferrisWheel.js";
import { addCarouselToScene } from "./scene/carousel.js";
import { addTicketBoothToScene } from "./scene/ticketBooth.js";
import { addTreesToScene } from "./scene/treeSystem.js";
import { addCarnivalLightingToGroup } from "./lights/lighting";
import { CarnivalGame } from "./game/carnivalGame";
import { FireworksSystem } from "./scene/fireworks";
import { addCircusToScene } from "./scene/circus.js";
import { addSmallBoothToScene } from "./scene/smallBooth.js";
import { addCircleToScene } from "./game/props/circle.js";
import { addPropsToScene } from "./game/props/index.js";

export class CarnivalLand {
  constructor(world, renderer) {
    this.group = new THREE.Group();
    this.objects = {};
    this.game = new CarnivalGame();
    this.world = world;

    // environment and floor
    addEnvironmentToGroup(this.group, world, renderer);

    // lighting
    this.objects.lighting = addCarnivalLightingToGroup(this.group);

    // carousel
    this.objects.carouselInfo = addCarouselToScene(this.group, world);

    // ferris wheel
    this.objects.ferrisWheelInfo = addFerrisWheelToScene(this.group, world);

    // ticket booth
    addTicketBoothToScene(this.group, world);

    // circus tent
    addCircusToScene(this.group, world);

    // small booth
    addSmallBoothToScene(this.group, world);

    // circle
    addCircleToScene(this.group, world);

    // props(game items)
    addPropsToScene(this.group, world).then((props) => {
      this.objects.hat = props.hat;
    });

    // Add eventListener
    this.hatSpeed = 0.1;
    this.keys = {};
    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // fireworks system
    this.fireworks = new FireworksSystem();
    this.fireworks.addToScene(this.group);

    // tree
    addTreesToScene(this.group, world);

    // start the game
    this.game.startGame();
  }

  addToScene(scene) {
    scene.add(this.group);
    // switch scene's background/environment/fog
    if (this.group.environmentMap)
      scene.environment = this.group.environmentMap;
    if (this.group.fogColor)
      scene.fog = new THREE.Fog(
        this.group.fogColor,
        this.group.fogNear,
        this.group.fogFar
      );
  }

  //  activate fireworks system
  activateFireworks(time) {
    if (this.fireworks) {
      this.fireworks.activate(time);
    }
  }

  // deactivate fireworks system
  deactivateFireworks() {
    if (this.fireworks) {
      this.fireworks.deactivate();
    }
  }

  update(elapsedTime, deltaTime) {
    // update ferris wheel rotation
    if (this.objects.ferrisWheelInfo && this.objects.ferrisWheelInfo.mixer) {
      this.objects.ferrisWheelInfo.mixer.update(deltaTime);
    }

    // update fireworks (only update when active)
    if (this.fireworks) {
      this.fireworks.update(elapsedTime);
    }

    // circusTent lightString flicker
    if (this.group.userData && this.group.userData.lightString) {
      const lightString = this.group.userData.lightString;
      lightString.traverse((child) => {
        if (child.isMesh && child.material && child.material.emissive) {
          child.material.emissiveIntensity = 0.3 + Math.random() * 0.7;
        }
      });
    }

    // hat physics
    if (this.objects.hat && this.objects.hat.userData.body) {
      const body = this.objects.hat.userData.body;
      body.position.set(
        this.objects.hat.position.x,
        this.objects.hat.position.y,
        this.objects.hat.position.z
      );
    }

    // update hat game
    if (this.objects.hat) {
      const hat = this.objects.hat;

      // keyboard moving
      if (this.keys["arrowup"] || this.keys["w"]) {
        hat.position.z -= this.hatSpeed;
      }
      if (this.keys["arrowdown"] || this.keys["s"]) {
        hat.position.z += this.hatSpeed;
      }
      if (this.keys["arrowleft"] || this.keys["a"]) {
        hat.position.x -= this.hatSpeed;
      }
      if (this.keys["arrowright"] || this.keys["d"]) {
        hat.position.x += this.hatSpeed;
      }

      // circle entrace check
      const circleCenter = new THREE.Vector3(-1, 0, 6); // circle.position
      const dx = hat.position.x - circleCenter.x;
      const dz = hat.position.z - circleCenter.z;
      const r = Math.sqrt(dx * dx + dz * dz);
      let angle = Math.atan2(dz, dx);
      if (angle < 0) angle += 2 * Math.PI;

      // circle gap
      const gapStart = THREE.MathUtils.degToRad(320);
      const gapEnd = THREE.MathUtils.degToRad(360);

      const inGap =
        angle >= gapStart && angle <= gapEnd && r >= 1.3 && r <= 1.7;

      if (!inGap && r >= 1.3 && r <= 1.7) {
        hat.position.x = circleCenter.x + Math.cos(angle) * 2;
        hat.position.z = circleCenter.z + Math.sin(angle) * 2;
      } else if (inGap) {
        if (!hat.userData.enteredGap) {
          hat.userData.enteredGap = true;
          const msg = document.getElementById("successMsg");
          if (msg) {
            msg.style.display = "block";
            setTimeout(() => {
              msg.style.display = "none";
            }, 2000);
          }
          console.log("Hat entered gap!");
        }
      }
    }

    // update game
    this.game.update(elapsedTime);
  }
}
