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
import { addCircleToScene } from "./scene/circle.js";

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

    // update game
    this.game.update(elapsedTime);
  }
}
