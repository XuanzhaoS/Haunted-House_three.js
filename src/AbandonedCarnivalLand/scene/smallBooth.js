import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addSmallBoothToScene(group, world) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load(
    "/carnivalLand/smallBooth.glb",
    (gltf) => {

      const smallBooth = gltf.scene;

      smallBooth.position.set(6, 0, 7.5); 

      smallBooth.rotation.x = 0;
      smallBooth.rotation.y = Math.PI / 1.3;
      smallBooth.rotation.z = 0;

      smallBooth.scale.set(0.6, 0.6, 0.6);

      let meshCount = 0;
      smallBooth.traverse((child) => {

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

      group.add(smallBooth);

      const boothShape = new CANNON.Box(new CANNON.Vec3(1, 1.5, 1));
      const boothBody = new CANNON.Body({
        mass: 0,
        shape: boothShape,
        position: new CANNON.Vec3(6, 1.5, 6),
      });

      world.addBody(boothBody);
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
    },
    (error) => {
      console.error("Error loading small booth:", error);
    }
  );
}

