import * as THREE from "three";
// import * as CANNON from "cannon-es";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { addHouseToScene } from "./scene/hauntedHouse";
import { addGraveyardToScene } from "./scene/graveyard";
import {
  updateGhosts,
  ghost1,
  ghost1Mesh,
  ghost2,
  ghost2Mesh,
  ghost3,
  ghost3Mesh,
} from "./scene/ghosts";
import { addBushesToScene } from "./scene/bushes";
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
    this.group.add(ghost1, ghost1Mesh, ghost2, ghost2Mesh, ghost3, ghost3Mesh);

    // bushes
    addBushesToScene(this.group, world);

    // welcome text
    // addWelcomTextToScene(this.group);

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
    ghost1Mesh.position.copy(ghost1.position);
    ghost2Mesh.position.copy(ghost2.position);
    ghost3Mesh.position.copy(ghost3.position);

    // update welcome text
    // updateWelcomeText(elapsedTime);

    // update door animation
    if (this.objects.houseInfo.doorMixer) {
      this.objects.houseInfo.doorMixer.update(deltaTime);
    }
  }
}
