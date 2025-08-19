import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addTicketBoothToScene(group, world) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/carnivalLand/ticketBooth.glb", (gltf) => {
    const ticketBooth = gltf.scene;

    ticketBooth.position.set(-6, 0, 8);

    ticketBooth.rotation.x = 0;
    ticketBooth.rotation.y = Math.PI / 4;
    ticketBooth.rotation.z = 0;

    ticketBooth.scale.set(20, 20, 20);

    let meshCount = 0;
    ticketBooth.traverse((child) => {

      if (child.isMesh) {
        meshCount++;
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material.roughness = 0.7;
          child.material.metalness = 0.1;
        }
      }
    });
  
    group.add(ticketBooth);

    const boothShape = new CANNON.Box(new CANNON.Vec3(1, 1.5, 1));
    const boothBody = new CANNON.Body({
      mass: 0,
      shape: boothShape,
      position: new CANNON.Vec3(0, 1.5, 0),
    });

    world.addBody(boothBody);
  });
}

function createFallbackTicketBooth(group, world) {
  
  const boothGeometry = new THREE.BoxGeometry(2, 3, 2);
  const boothMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.7,
    metalness: 0.1,
  });

  const booth = new THREE.Mesh(boothGeometry, boothMaterial);
  booth.position.set(0, 1.5, 0);
  booth.castShadow = true;
  booth.receiveShadow = true;

  group.add(booth);

  const boothShape = new CANNON.Box(new CANNON.Vec3(1, 1.5, 1));
  const boothBody = new CANNON.Body({
    mass: 0,
    shape: boothShape,
    position: new CANNON.Vec3(0, 1.5, 0),
  });

  world.addBody(boothBody);
}
