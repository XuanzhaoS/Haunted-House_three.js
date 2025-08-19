import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addCircusToScene(group, world) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load(
    "/carnivalLand/circusTent.glb",
    (gltf) => {
      const circusTent = gltf.scene;

      circusTent.position.set(4.5, 0, 3);

      circusTent.rotation.x = 0;
      circusTent.rotation.y = Math.PI / 2;
      circusTent.rotation.z = 0;
      circusTent.scale.set(0.35, 0.4, 0.35);

      let meshCount = 0;
      circusTent.traverse((child) => {
        if (child.isMesh) {
          meshCount++;

          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            child.material.roughness = 0.8;
            child.material.metalness = 0.1;
          }
        }
      });

      group.add(circusTent);

      const tentShape = new CANNON.Cylinder(2, 2, 3, 8);
      const tentBody = new CANNON.Body({
        mass: 0,
        shape: tentShape,
        position: new CANNON.Vec3(4, 1.5, 4),
      });

      world.addBody(tentBody);
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
    },
    (error) => {
      console.error("Error loading circus tent:", error);
    }
  );
}

function createFallbackCircusTent(group, world) {
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
}
