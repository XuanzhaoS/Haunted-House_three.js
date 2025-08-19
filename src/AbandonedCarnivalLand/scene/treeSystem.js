import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addTreesToScene(group, world) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load(
    "/carnivalLand/tree.glb",
    (gltf) => {
      const tree = gltf.scene;
      tree.position.set(-17.8, 0, -2);

      tree.rotation.x = 0;
      tree.rotation.y = Math.PI / -2;
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

      const treeShape = new CANNON.Cylinder(0.3, 0.3, 1.5, 8);
      const treeBody = new CANNON.Body({
        mass: 0,
        shape: treeShape,
        position: new CANNON.Vec3(3.8, 0.75, -6),
      });

      world.addBody(treeBody);
    },
    (progress) => {
      if (progress.total > 0) {
        const percent = (progress.loaded / progress.total) * 100;        
      }
    },
    (error) => {
      createFallbackTree(group, world);
    }
  );

  addBush1(group, gltfLoader);
}

function addBush1(group, gltfLoader) {
  const bush1Positions = [

    { x: -7, z: -6, rotation: 0, scale: 0.0004 },
    { x: 6, z: -7, rotation: Math.PI / 3, scale: 0.0003 },
    { x: 7, z: 5, rotation: Math.PI / 6, scale: 0.0005 },
    { x: -5, z: 7, rotation: Math.PI / 4, scale: 0.0004 },

    { x: 2, z: -4, rotation: -Math.PI / 6, scale: 0.0003 },
    { x: -3, z: 3, rotation: Math.PI / 2, scale: 0.0005 },
    { x: 4, z: 1, rotation: -Math.PI / 4, scale: 0.0004 },
    { x: -1, z: -2, rotation: Math.PI / 3, scale: 0.0003 },
    { x: 0, z: 5, rotation: -Math.PI / 2, scale: 0.0004 },
    { x: 5, z: -3, rotation: Math.PI / 6, scale: 0.0005 },

    { x: -6, z: -1, rotation: Math.PI / 5, scale: 0.0003 },
    { x: 3, z: 6, rotation: -Math.PI / 3, scale: 0.0004 },
    { x: -2, z: -5, rotation: Math.PI / 4, scale: 0.0005 },
    { x: 6, z: 3, rotation: -Math.PI / 6, scale: 0.0003 },
    { x: -4, z: 4, rotation: Math.PI / 2, scale: 0.0004 },
    { x: 1, z: -6, rotation: -Math.PI / 4, scale: 0.0005 },
  ];

  bush1Positions.forEach((pos, index) => {
    gltfLoader.load(
      "/carnivalLand/bush1.glb",
      (gltf) => {
        const bush = gltf.scene;

        bush.position.set(pos.x, 0, pos.z);

        bush.rotation.x = 0;
        bush.rotation.y = pos.rotation;
        bush.rotation.z = 0;

        bush.scale.set(pos.scale, pos.scale * 1.5, pos.scale);

        bush.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              child.material.roughness = 0.8;
              child.material.metalness = 0.0;
            }
          }
        });

        group.add(bush);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
      },
      (error) => {
        console.error(`Error loading bush1 ${index + 1}:`, error);
      }
    );
  });

  addBush2(group, gltfLoader);
}

function addBush2(group, gltfLoader) {
  const bushPositions = [
    { x: 4, z: -8, rotation: 0, scale: 0.006 },
    { x: -4, z: -8, rotation: Math.PI / 3, scale: 0.005 },
    { x: 8, z: -4, rotation: Math.PI / 6, scale: 0.007 },
    { x: 8, z: 4, rotation: Math.PI / 4, scale: 0.006 },
    { x: 4, z: 8, rotation: Math.PI / 2, scale: 0.005 },

    { x: 2, z: -3, rotation: Math.PI / 5, scale: 0.006 },
    { x: -2, z: 3, rotation: -Math.PI / 4, scale: 0.005 },
    { x: 0, z: 0, rotation: Math.PI / 2, scale: 0.006 },
    { x: 6, z: 2, rotation: Math.PI / 3, scale: 0.005 },
  ];

  bushPositions.forEach((pos, index) => {
    gltfLoader.load(
      "/carnivalLand/bush2.glb",
      (gltf) => {
        const bush = gltf.scene;

        bush.position.set(pos.x, 0, pos.z);

        bush.rotation.x = 0;
        bush.rotation.y = pos.rotation;
        bush.rotation.z = 0;

        bush.scale.set(pos.scale, pos.scale, pos.scale);

        bush.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              child.material.roughness = 0.8;
              child.material.metalness = 0.0;
            }
          }
        });

        group.add(bush);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
      },
      (error) => {
        console.error(`Error loading bush2 ${index + 1}:`, error);
      }
    );
  });
}

function createFallbackTree(group, world) {

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
}
