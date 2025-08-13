import * as THREE from "three";
import * as CANNON from "cannon-es";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function addEnvironmentToGroup(group, world, renderer) {
  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({
      color: 0x4444aa,
      side: THREE.DoubleSide,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  // Physics floor
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
  });
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(floorBody);

  group.add(floor);
}
