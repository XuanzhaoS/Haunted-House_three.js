import * as THREE from "three";
import * as CANNON from "cannon-es";
import { addBushesToScene } from "./bushes";
import { loadDoorModel } from "./loadDoorModel";
import { createWalls } from "./walls";

export function addHouseToScene(scene, world) {
  // Group
  const house = new THREE.Group();

  // Texture
  const textureLoader = new THREE.TextureLoader();
  const wallTexture = textureLoader.load("/brick/bricks.jpg");

  // Create walls
  const walls = createWalls(house, world, wallTexture);

  // Floor
  const floorTexture = textureLoader.load("/floor/woodFloor.jpg");
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 4);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshStandardMaterial({ map: floorTexture })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.01;
  floor.receiveShadow = true;
  house.add(floor);

  // Roof
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: "#b35f45" })
  );
  roof.position.y = 3;
  roof.rotation.y = Math.PI / 4;
  house.add(roof);

  const roofShape = new CANNON.Box(new CANNON.Vec3(2, 0.5, 2));
  const roofBody = new CANNON.Body({
    shape: roofShape,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(0, 3, 0),
  });
  world.addBody(roofBody);

  // Door
  let doorMixer = null;
  let doorModel = null;

  loadDoorModel(
    house,
    (door, mixer, animations) => {
      door.position.set(0, 0, 2.02);
      doorModel = door;
      doorMixer = mixer;
    },
    world
  );

  // FakeDoor
  const fakeDoor = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.6, 0.05),
    new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false })
  );
  fakeDoor.position.set(0, 0.8, 2.02);
  house.add(fakeDoor);

  // Door light
  const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
  doorLight.position.set(0, 2.2, 2.7);
  house.add(doorLight);

  // Shadow
  Object.values(walls.meshes).forEach((wall) => {
    wall.castShadow = true;
  });
  doorLight.castShadow = true;
  doorLight.shadow.mapSize.width = 256;
  doorLight.shadow.mapSize.height = 256;
  doorLight.shadow.camera.far = 7;

  addBushesToScene(house, world);

  scene.add(house);

  return {
    house,
    doorModel,
    fakeDoor,
    doorLight,
    get doorMixer() {
      return doorMixer;
    },
  };
}
