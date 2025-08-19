import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addSmallBoothToScene(group, world) {
  console.log("=== Adding small booth to the scene ===");
  const gltfLoader = new GLTFLoader();

  gltfLoader.load(
    "/carnivalLand/smallBooth.glb",
    (gltf) => {
      console.log("Small booth loaded successfully!");
      console.log("Small booth GLTF:", gltf);
      console.log("Small booth scene children:", gltf.scene.children.length);

      const smallBooth = gltf.scene;

      smallBooth.position.set(6, 0, 7.5); 

      smallBooth.rotation.x = 0;
      smallBooth.rotation.y = Math.PI / 1.3;
      smallBooth.rotation.z = 0;

      smallBooth.scale.set(0.6, 0.6, 0.6);

      let meshCount = 0;
      smallBooth.traverse((child) => {
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
      console.log(`Total small booth meshes: ${meshCount}`);

      group.add(smallBooth);
      console.log("Small booth added to group");
      console.log("Group children count after adding:", group.children.length);
      console.log("Small booth final position:", smallBooth.position);
      console.log("Small booth final scale:", smallBooth.scale);
      console.log("Small booth final rotation:", smallBooth.rotation);

      const boothShape = new CANNON.Box(new CANNON.Vec3(1, 1.5, 1));
      const boothBody = new CANNON.Body({
        mass: 0,
        shape: boothShape,
        position: new CANNON.Vec3(6, 1.5, 6),
      });

      world.addBody(boothBody);
      console.log("Small booth physics body added");
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Loading small booth: ${percent.toFixed(1)}%`);
    },
    (error) => {
      console.error("Error loading small booth:", error);
      console.error("Error details:", error.message);

      console.log("Creating fallback small booth...");
      createFallbackSmallBooth(group, world);
    }
  );
}

