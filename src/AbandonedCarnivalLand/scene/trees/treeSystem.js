import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addTreesToScene(group, world) {
  console.log("=== Adding single tree to the scene ===");
  const gltfLoader = new GLTFLoader();

  console.log("Loading single tree from: /carnivalLand/tree.glb");

  gltfLoader.load(
    "/carnivalLand/tree.glb",
    (gltf) => {
      console.log("✅ Single tree loaded successfully!");
      console.log("Tree GLTF:", gltf);
      console.log("Tree scene children:", gltf.scene.children.length);

      const tree = gltf.scene;
      tree.position.set(3.8, 0, -6);

      tree.rotation.x = 0;
      tree.rotation.y = Math.PI / 4; 
      tree.rotation.z = 0;

      tree.scale.set(0.3, 0.3, 0.3);

      tree.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            child.material.roughness = 0.9;
            child.material.metalness = 0.0;
          }
        }
      });

      group.add(tree);
      console.log("Single tree added at position (0, 0, -2)");

      const treeShape = new CANNON.Cylinder(0.3, 0.3, 1.5, 8);
      const treeBody = new CANNON.Body({
        mass: 0,
        shape: treeShape,
        position: new CANNON.Vec3(0, 0.75, -2),
      });

      world.addBody(treeBody);
      console.log("Tree physics body added");
    },
    (progress) => {
      console.log("Tree loading progress:", progress);
      if (progress.total > 0) {
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Tree loading: ${percent.toFixed(1)}%`);
      }
    },
    (error) => {
      console.error("❌ Tree loading failed:", error);
      console.error("Error details:", error.message);

      console.log("Creating fallback tree due to loading failure...");
      createFallbackTree(group, world);
    }
  );
}

function createFallbackTree(group, world) {
  console.log("Creating fallback tree");

  const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.9,
    metalness: 0.0,
  });

  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(0, 0.75, -2); 
  trunk.castShadow = true;
  trunk.receiveShadow = true;

  const leavesGeometry = new THREE.SphereGeometry(0.8, 8, 6);
  const leavesMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22,
    roughness: 0.9,
    metalness: 0.0,
  });

  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.set(3, 1.8, -2);
  leaves.castShadow = true;
  leaves.receiveShadow = true;

  group.add(trunk);
  group.add(leaves);

  const treeShape = new CANNON.Cylinder(0.3, 0.3, 1.5, 8);
  const treeBody = new CANNON.Body({
    mass: 0,
    shape: treeShape,
    position: new CANNON.Vec3(0, 0.75, -2),
  });

  world.addBody(treeBody);

  console.log("Fallback tree created at position (0, 0, -2)");
}
