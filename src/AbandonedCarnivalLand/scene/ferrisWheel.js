import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addFerrisWheelToScene(group, world) {
  const gltfLoader = new GLTFLoader();

  console.log("Loading 3D ferris wheel model...");

  gltfLoader.load(
    "/carnivalLand/ferrisWheel.glb", 
    (gltf) => {
      console.log("3D Ferris wheel loaded successfully!");

      const ferrisWheel = gltf.scene;

      // set location
      ferrisWheel.position.set(6, 0, -4); 

      ferrisWheel.rotation.x = 0; 
      ferrisWheel.rotation.y = -Math.PI / 4; 
      ferrisWheel.rotation.z = 0; 

      // size
      ferrisWheel.scale.set(0.15, 0.15, 0.15);

      ferrisWheel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            child.material.roughness = 0.8;
            child.material.metalness = 0.3;
          }
        }
      });

      group.add(ferrisWheel);

      // physic 
      const ferrisWheelShape = new CANNON.Cylinder(4, 4, 0.15, 16);
      const ferrisWheelBody = new CANNON.Body({
        mass: 0,
        shape: ferrisWheelShape,
        position: new CANNON.Vec3(6, 0, -4), 
      });
      ferrisWheelBody.quaternion.setFromEuler(0, 0, Math.PI / 2);
      world.addBody(ferrisWheelBody);

      console.log("3D Ferris wheel added to scene with physics");
    },

    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
    },

    (error) => {
      console.error("Error loading 3D ferris wheel:", error);
      console.error("Error details:", error.message);

      createFallbackFerrisWheel(group, world);
    }
  );
}

// backup simple ferrisWheel
function createFallbackFerrisWheel(group, world) {

  const ferrisWheel = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.15, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );

  ferrisWheel.position.set(6, 0, -4); 
  ferrisWheel.rotation.x = Math.PI / 2;
  ferrisWheel.castShadow = true;
  ferrisWheel.receiveShadow = true;

  const ferrisWheelShape = new CANNON.Cylinder(4, 4, 0.15, 16);
  const ferrisWheelBody = new CANNON.Body({
    mass: 0,
    shape: ferrisWheelShape,
    position: new CANNON.Vec3(6, 0, -4),
  });
  ferrisWheelBody.quaternion.setFromEuler(0, 0, Math.PI / 2);
  world.addBody(ferrisWheelBody);

  group.add(ferrisWheel);
}
