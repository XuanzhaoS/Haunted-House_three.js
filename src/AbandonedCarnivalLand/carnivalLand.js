import * as THREE from "three";
import { addEnvironmentToGroup } from "./scene/environment";
import { addCarouselToScene } from "./scene/carousel";
import { addFerrisWheelToScene } from "./scene/ferrisWheel";
import { addCarnivalLightingToGroup } from "./lights/lighting";
import { CarnivalGame } from "./game/carnivalGame";

export class CarnivalLand {
  constructor(world, renderer) {
    this.group = new THREE.Group();
    this.objects = {};
    this.game = new CarnivalGame();

    // environment and floor
    addEnvironmentToGroup(this.group, world, renderer);

    // lighting
    this.objects.lighting = addCarnivalLightingToGroup(this.group);

    // carousel
    this.objects.carouselInfo = addCarouselToScene(this.group, world);

    // ferris wheel
    this.objects.ferrisWheelInfo = addFerrisWheelToScene(this.group, world);

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

  update(elapsedTime, deltaTime) {
    // update ferris wheel rotation
    if (this.objects.ferrisWheelInfo && this.objects.ferrisWheelInfo.mixer) {
      this.objects.ferrisWheelInfo.mixer.update(deltaTime);
    }

    // update game
    this.game.update(elapsedTime);
  }
}
