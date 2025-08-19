import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addTicketBoothToScene(group, world) {
  console.log("=== Adding ticket booth to the scene ===");
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/carnivalLand/ticketBooth.glb", (gltf) => {
    console.log("Ticket booth loaded successfully!");
    console.log("Ticket booth GLTF:", gltf);
    console.log("Ticket booth scene children:", gltf.scene.children.length);

    const ticketBooth = gltf.scene;

    ticketBooth.position.set(-6, 0, 8);

    ticketBooth.rotation.x = 0;
    ticketBooth.rotation.y = Math.PI / 4;
    ticketBooth.rotation.z = 0;

    ticketBooth.scale.set(20, 20, 20);

    console.log("=== Ticket booth model structure ===");
    let meshCount = 0;
    ticketBooth.traverse((child) => {
      console.log(
        "Child:",
        child.type,
        child.name,
        "Position:",
        child.position
      );

      if (child.isMesh) {
        meshCount++;
        console.log(`Mesh ${meshCount}:`, child.name);
        console.log("Mesh geometry:", child.geometry);
        console.log("Mesh material:", child.material);
        console.log("Mesh position:", child.position);
        console.log("Mesh scale:", child.scale);
        console.log("Mesh visible:", child.visible);

        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material.roughness = 0.7;
          child.material.metalness = 0.1;
          console.log(`Mesh ${meshCount} material updated`);
        }
      }
    });
    console.log(`Total ticket booth meshes: ${meshCount}`);

    group.add(ticketBooth);
    console.log("Ticket booth added to group");
    console.log("Group children count after adding:", group.children.length);
    console.log("Ticket booth final position:", ticketBooth.position);
    console.log("Ticket booth final scale:", ticketBooth.scale);
    console.log("Ticket booth final rotation:", ticketBooth.rotation);

    const boothShape = new CANNON.Box(new CANNON.Vec3(1, 1.5, 1));
    const boothBody = new CANNON.Body({
      mass: 0,
      shape: boothShape,
      position: new CANNON.Vec3(0, 1.5, 0),
    });

    world.addBody(boothBody);
    console.log("Ticket booth physics body added");
  });
}

function createFallbackTicketBooth(group, world) {
  console.log("Creating fallback ticket booth");

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

  console.log("Fallback ticket booth created at position (0, 0, 0)");
}
