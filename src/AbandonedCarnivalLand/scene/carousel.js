import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addCarouselToScene(group, world) {
  const gltfLoader = new GLTFLoader();

  console.log("Loading 3D carousel model...");

  const tempMixer = {
    update: (deltaTime) => {},
  };

  const carouselInfo = {
    carousel: null,
    carouselBody: null,
    mixer: tempMixer,
  };

  gltfLoader.load(
    "/carnivalLand/carousel.glb",
    (gltf) => {
      console.log("3D Carousel loaded successfully!");

      const carousel = gltf.scene;

      carousel.position.set(-4, -0.5, -3);

      carousel.rotation.x = 0;
      carousel.rotation.y = 0;
      carousel.rotation.z = 0;

      carousel.scale.set(0.01, 0.01, 0.01);

      carousel.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            child.material.roughness = 0.8;
            child.material.metalness = 0.2;
          }
        }
      });

      group.add(carousel);

      const carouselShape = new CANNON.Cylinder(2, 2, 0.3, 32);
      const carouselBody = new CANNON.Body({
        mass: 0,
        shape: carouselShape,
        position: new CANNON.Vec3(-6, -0.5, -6),
      });
      world.addBody(carouselBody);

      addBench(group, gltfLoader);
    },

    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Loading carousel: ${percent.toFixed(1)}%`);
    },

    (error) => {
      console.error("Error loading 3D carousel:", error);
      console.error("Error details:", error.message);

      const fallbackInfo = createFallbackCarousel(group, world);

      carouselInfo.carousel = fallbackInfo.carousel;
      carouselInfo.carouselBody = fallbackInfo.carouselBody;
      carouselInfo.mixer = fallbackInfo.mixer;

      addBench(group, gltfLoader);
    }
  );

  return carouselInfo;
}

// Add bench
function addBench(group, gltfLoader) {
  console.log("Loading bench...");

  gltfLoader.load(
    "/carnivalLand/bench.glb",
    (gltf) => {
      const bench = gltf.scene;

      bench.scale.set(0.8, 0.8, 0.8);

      bench.position.set(-8, 0.5, -0.5);

      bench.rotation.x = 0;
      bench.rotation.y = Math.PI / 2 + Math.PI / 7.2;

      let meshCount = 0;
      bench.traverse((child) => {
        console.log("Bench child:", child.type, child.name);

        if (child.isMesh) {
          meshCount++;
          console.log(`Bench mesh ${meshCount}:`, child.name);
          console.log("Mesh geometry:", child.geometry);
          console.log("Mesh material:", child.material);

          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            child.material.transparent = false;
            child.material.opacity = 1.0;

            child.material.color = new THREE.Color(0xff0000);
            child.material.emissive = new THREE.Color(0x333333);

            child.material.roughness = 0.8;
            child.material.metalness = 0.1;

            console.log(
              `Mesh ${meshCount} material updated with forced red color`
            );
          } else {
            console.warn(`Mesh ${meshCount} has no material!`);
          }
        }
      });

      console.log(`Total bench meshes: ${meshCount}`);

      group.add(bench);
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Loading bench: ${percent.toFixed(1)}%`);
    },
    (error) => {
      console.error(" Error loading bench:", error);
      console.error("Error details:", error.message);

      console.log("Creating simple fallback bench...");
      createSimpleBench(group);
    }
  );
}

function createSimpleBench(group) {
  console.log("Creating simple fallback bench");

  const benchGeometry = new THREE.BoxGeometry(2, 0.3, 0.8);
  const benchMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513, // 棕色
    roughness: 0.8,
    metalness: 0.1,
  });

  const bench = new THREE.Mesh(benchGeometry, benchMaterial);
  bench.position.set(-6, -0.5, -2);
  bench.rotation.y = Math.PI / 2;
  bench.castShadow = true;
  bench.receiveShadow = true;

  group.add(bench);
}

function createFallbackCarousel(group, world) {
  console.log("Creating fallback carousel");

  const carousel = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 0.3, 32),
    new THREE.MeshStandardMaterial({ color: 0xffcc00 })
  );
  carousel.position.set(-6, -0.5, -6);
  carousel.castShadow = true;
  carousel.receiveShadow = true;

  const carouselShape = new CANNON.Cylinder(2, 2, 0.3, 32);
  const carouselBody = new CANNON.Body({
    mass: 0,
    shape: carouselShape,
    position: new CANNON.Vec3(-6, -0.5, -6),
  });
  world.addBody(carouselBody);

  const mixer = {
    update: (deltaTime) => {
      carousel.rotation.y += deltaTime * 0.3;
    },
  };

  group.add(carousel);

  return {
    carousel,
    carouselBody,
    mixer,
  };
}
