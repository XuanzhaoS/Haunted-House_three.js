import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addCircusToScene(group, world) {
  console.log("=== Adding circus tent to the scene ===");
  const gltfLoader = new GLTFLoader();

  gltfLoader.load(
    "/carnivalLand/circusTent.glb",
    (gltf) => {
      console.log("Circus tent loaded successfully!");
      console.log("Circus tent GLTF:", gltf);
      console.log("Circus tent scene children:", gltf.scene.children.length);

      const circusTent = gltf.scene;

      circusTent.position.set(4.5, 0, 3);

      circusTent.rotation.x = 0;
      circusTent.rotation.y = Math.PI / 2; 
      circusTent.rotation.z = 0;
      circusTent.scale.set(0.03, 0.04, 0.03);

      let meshCount = 0;
      circusTent.traverse((child) => {
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
            child.material.roughness = 0.8;
            child.material.metalness = 0.1;
            console.log(`Mesh ${meshCount} material updated`);
          }
        }
      });
      console.log(`Total circus tent meshes: ${meshCount}`);

      group.add(circusTent);
      console.log("Circus tent added to group");
      console.log("Group children count after adding:", group.children.length);
      console.log("Circus tent final position:", circusTent.position);
      console.log("Circus tent final scale:", circusTent.scale);
      console.log("Circus tent final rotation:", circusTent.rotation);

      const tentShape = new CANNON.Cylinder(2, 2, 3, 8);
      const tentBody = new CANNON.Body({
        mass: 0,
        shape: tentShape,
        position: new CANNON.Vec3(4, 1.5, 4),
      });

      world.addBody(tentBody);
      console.log("Circus tent physics body added");
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Loading circus tent: ${percent.toFixed(1)}%`);
    },
    (error) => {
      console.error("Error loading circus tent:", error);
      console.error("Error details:", error.message);

      console.log("Creating fallback circus tent...");
      createFallbackCircusTent(group, world);
    }
  );
}

function createFallbackCircusTent(group, world) {
  console.log("Creating fallback circus tent");

  const tentGeometry = new THREE.ConeGeometry(3, 4, 8);
  const tentMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b6b, 
    roughness: 0.8,
    metalness: 0.1,
  });

  const tent = new THREE.Mesh(tentGeometry, tentMaterial);
  tent.position.set(4, 2, 4);
  tent.castShadow = true;
  tent.receiveShadow = true;

  group.add(tent);

  const tentShape = new CANNON.Cylinder(2, 2, 3, 8);
  const tentBody = new CANNON.Body({
    mass: 0,
    shape: tentShape,
    position: new CANNON.Vec3(4, 1.5, 4),
  });

  world.addBody(tentBody);

  console.log("Fallback circus tent created at position (4, 0, 4)");
}
