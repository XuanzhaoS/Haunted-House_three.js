import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addCarouselToScene(group, world) {
  const gltfLoader = new GLTFLoader();

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
    },

    (error) => {
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
  gltfLoader.load(
    "/carnivalLand/bench.glb",
    (gltf) => {
      const bench = gltf.scene;

      bench.scale.set(0.6, 0.6, 0.6);

      bench.position.set(-8, 0.3, -0.5);

      bench.rotation.x = 0;
      bench.rotation.y = Math.PI / 2 + Math.PI / 7.2;
      bench.rotation.z = 0;

      let meshCount = 0;
      bench.traverse((child) => {
        
        if (child.isMesh) {
          meshCount++;
          
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            child.material.transparent = false;
            child.material.opacity = 1.0;
            child.material.roughness = 0.8;
            child.material.metalness = 0.1;

          } else {
            console.warn(`Mesh ${meshCount} has no material!`);
          }
        }
      });

      group.add(bench);

      const bench2 = gltf.scene.clone();

      bench2.position.set(-8.3, 0.3, 1.3); // X轴-10（更左），Z轴-2（更前），Y轴保持一致(-8, 0.3, -0.5);

      bench2.rotation.x = 0;
      bench2.rotation.y = Math.PI / 2 + Math.PI / 7.2;
      bench2.rotation.z = 0;

      bench2.scale.set(0.6, 0.6, 0.6);

      bench2.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            child.material.transparent = false;
            child.material.opacity = 1.0;
            child.material.roughness = 0.8;
            child.material.metalness = 0.1;
          }
        }
      });

      group.add(bench2);
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
    },
    (error) => {
      createSimpleBench(group);
    }
  );
}

function createSimpleBench(group) {

  const benchGeometry = new THREE.BoxGeometry(2, 0.3, 0.8);
  const benchMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
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
