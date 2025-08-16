import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addEnvironmentToGroup(group, world, renderer) {
  const textureLoader = new THREE.TextureLoader();

  const grassColorTexture = textureLoader.load("/grass/color.jpg");
  const grassAmbientOcclusionTexture = textureLoader.load(
    "/grass/ambientOcclusion.jpg"
  );
  const grassNormalTexture = textureLoader.load("/grass/normal.jpg");
  const grassRoughnessTexture = textureLoader.load("/grass/roughness.jpg");

  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);

  grassColorTexture.wrapS = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  grassNormalTexture.wrapS = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

  grassColorTexture.wrapT = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  grassNormalTexture.wrapT = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

  // floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      map: grassColorTexture,
      transparent: true,
      aoMap: grassAmbientOcclusionTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
      roughness: 1.0, 
      metalness: 0.1, 
    })
  );

  floor.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
  );

  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  // physic floor
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    material: new CANNON.Material({
      friction: 0.8, 
      restitution: 0.1,
    }),
  });
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(floorBody);

  group.add(floor);

  addStreetLamps(group);
}

// street lamp
function addStreetLamps(group) {
  console.log("=== Adding street lamps ===");

  const gltfLoader = new GLTFLoader();

  // location
  const lampPositions = [
    { x: -9, z: -9, rotation: 0 }, 
    { x: 9, z: -9, rotation: Math.PI / 2 }, 
    { x: -9, z: 9, rotation: -Math.PI / 2 }, 
    { x: 9, z: 9, rotation: Math.PI },
  ];

  lampPositions.forEach((pos, index) => {
    console.log(
      `Loading street lamp ${index + 1} from: /carnivalLand/streetLamp.glb`
    );

    gltfLoader.load(
      "/carnivalLand/streetLamp.glb",
      (gltf) => {
        console.log(`✅ Street lamp ${index + 1} loaded successfully!`);

        const streetLamp = gltf.scene;

        // location
        streetLamp.position.set(pos.x, -1, pos.z);

        streetLamp.rotation.y = pos.rotation;

        streetLamp.scale.set(0.8, 0.8, 0.8);

        streetLamp.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              createRustyMaterial(child.material, index);
            }
          }
        });

        group.add(streetLamp);
      },
      
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
      },
     
      (error) => {
        console.error(`Error loading street lamp ${index + 1}:`, error);
        console.error("Error details:", error.message);
      }
    );
  });
}

// 创建破旧的材质效果
function createRustyMaterial(material, lampIndex) {
  // 保存原始材质属性
  const originalColor = material.color
    ? material.color.clone()
    : new THREE.Color(0x888888);

  // 创建破旧效果
  if (material.isMeshStandardMaterial) {
    // 增加粗糙度，模拟磨损
    material.roughness = 0.9;

    // 降低金属度，模拟生锈
    material.metalness = 0.1;

    // 添加生锈颜色变化
    const rustColors = [
      0x8b4513, // 棕色生锈
      0xa0522d, // 深棕色生锈
      0xcd853f, // 浅棕色生锈
      0xd2691e, // 橙棕色生锈
    ];

    // 每个路灯使用不同的生锈颜色
    const rustColor = rustColors[lampIndex % rustColors.length];

    // 混合原始颜色和生锈颜色
    material.color = new THREE.Color().lerpColors(
      originalColor,
      new THREE.Color(rustColor),
      0.6
    );

    // 添加一些随机变化
    material.color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);

    // 创建噪波纹理来模拟表面不平整
    const noiseTexture = createNoiseTexture();
    material.normalMap = noiseTexture;
    material.normalScale.set(0.1, 0.1);

    // 调整环境光遮蔽
    material.aoIntensity = 1.5;

    // 添加一些透明度变化
    material.transparent = true;
    material.opacity = 0.9 + Math.random() * 0.1;
  } else if (material.isMeshBasicMaterial) {
    // 如果是基础材质，转换为标准材质
    const newMaterial = new THREE.MeshStandardMaterial({
      color: material.color,
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });

    // 替换材质
    material = newMaterial;
  }
}

// 创建噪波纹理
function createNoiseTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;

  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(64, 64);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = Math.random() * 255;
    imageData.data[i] = noise; // R
    imageData.data[i + 1] = noise; // G
    imageData.data[i + 2] = noise; // B
    imageData.data[i + 3] = 255; // A
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  return texture;
}
