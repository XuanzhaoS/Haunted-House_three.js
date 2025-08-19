import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addCircleToScene(group, world) {
  console.log("=== Adding circle to the scene ===");
  const gltfLoader = new GLTFLoader();

  gltfLoader.load(
    "/carnivalLand/circle.glb",
    (gltf) => {
      console.log("Circle loaded successfully!");
      console.log("Circle GLTF:", gltf);
      console.log("Circle scene children:", gltf.scene.children.length);

      const circle = gltf.scene;

      // 设置位置 - circus和ticketBooth之间的空处
      // circus位置：(4, 0, 4)，ticketBooth位置：(-6, 0, 8)
      // 中间位置大约在：(-1, 0, 6)
      circle.position.set(-1, 0, 6);

      // 设置旋转
      circle.rotation.x = 0;
      circle.rotation.y = 0; // 不旋转，保持原始朝向
      circle.rotation.z = 0;

      // 设置缩放
      circle.scale.set(1.0, 1.0, 1.0);

      // 遍历模型，设置材质和阴影
      let meshCount = 0;
      circle.traverse((child) => {
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
      console.log(`Total circle meshes: ${meshCount}`);

      // 添加到场景
      group.add(circle);
      console.log("Circle added to group");
      console.log("Group children count after adding:", group.children.length);
      console.log("Circle final position:", circle.position);
      console.log("Circle final scale:", circle.scale);
      console.log("Circle final rotation:", circle.rotation);

      // 添加物理碰撞体（如果需要）
      const circleShape = new CANNON.Cylinder(1, 1, 0.1, 8);
      const circleBody = new CANNON.Body({
        mass: 0,
        shape: circleShape,
        position: new CANNON.Vec3(-1, 0.05, 6),
      });

      world.addBody(circleBody);
      console.log("Circle physics body added");

    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Loading circle: ${percent.toFixed(1)}%`);
    },
    (error) => {
      console.error("Error loading circle:", error);
      console.error("Error details:", error.message);
      
      // 如果加载失败，创建备用圆形
      console.log("Creating fallback circle...");
      createFallbackCircle(group, world);
    }
  );
}

function createFallbackCircle(group, world) {
  console.log("Creating fallback circle");

  // 创建简单的圆形几何体
  const circleGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 8);
  const circleMaterial = new THREE.MeshStandardMaterial({
    color: 0x4ecdc4, // 青色
    roughness: 0.8,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6
  });

  const circle = new THREE.Mesh(circleGeometry, circleMaterial);
  circle.position.set(-1, 0.05, 6);
  circle.rotation.x = -Math.PI / 2; // 水平放置
  circle.castShadow = true;
  circle.receiveShadow = true;

  group.add(circle);

  // 添加物理碰撞体
  const circleShape = new CANNON.Cylinder(1, 1, 0.1, 8);
  const circleBody = new CANNON.Body({
    mass: 0,
    shape: circleShape,
    position: new CANNON.Vec3(-1, 0.05, 6),
  });

  world.addBody(circleBody);

  console.log("Fallback circle created at position (-1, 0, 6)");
}
