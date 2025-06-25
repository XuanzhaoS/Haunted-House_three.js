import * as THREE from "three";
// import * as CANNON from "cannon-es";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { addHouseToScene } from "./scene/hauntedHouse";
import { addGraveyardToScene } from "./scene/graveyard";
import { addGhostsToScene, updateGhosts } from "./scene/ghosts";
import { addBushesToScene } from "./scene/bushes";
import { addWelcomTextToScene, updateWelcomeText } from "./ui/welcomeText";
import { addEnvironmentToGroup } from "./scene/environment";

export class HauntedHouseLand {
  constructor(world, renderer) {
    this.group = new THREE.Group();
    this.objects = {};

    // environment and floor
    addEnvironmentToGroup(this.group, world, renderer);

    // house
    this.objects.houseInfo = addHouseToScene(this.group, world);

    // graveyard
    addGraveyardToScene(this.group, world);

    // ghosts
    addGhostsToScene(this.group);

    // bushes
    addBushesToScene(this.group, world);

    // welcome text
    addWelcomTextToScene(this.group);

    // bgm
    // bgm("/sounds/classiGhostSound.mp3");

    // this.group.position.set(0, 0, -30);
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
    // update ghosts
    updateGhosts(elapsedTime);
    // update welcome text
    updateWelcomeText(elapsedTime);
    // update door animation
    if (this.objects.houseInfo.doorMixer) {
      this.objects.houseInfo.doorMixer.update(deltaTime);
    }
  }
}
