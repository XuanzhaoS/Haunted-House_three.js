import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";
import { addLightsToScene } from "./HauntedHouseLand/lights/lighting.js";
import { bgm } from "./HauntedHouseLand/scene/bgm.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import gsap from "gsap";
import { HauntedHouseLand } from "./HauntedHouseLand/hauntedHouseLand.js";
import { CarnivalLand } from "./AbandonedCarnivalLand/environment.js";
import { addParticlesToScene } from "./particles.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Camera
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 15, 60);
camera.lookAt(0, 0, 0);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.1;

// skySphere
let skySphere;
const loader = new THREE.TextureLoader();
loader.load("/env/NightSkyHDRI001_1K-HDR.exr", function (texture) {
  const geometry = new THREE.SphereGeometry(100, 64, 64);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  skySphere = new THREE.Mesh(geometry, material);
  scene.add(skySphere);
});

// Lights
addLightsToScene(scene, gui);

// lands
const hauntedHouseLand = new HauntedHouseLand(world);
hauntedHouseLand.group.name = "hauntedHouse";

const carnivalLand = new CarnivalLand();
carnivalLand.group.name = "carnival";

hauntedHouseLand.addToScene(scene);
carnivalLand.addToScene(scene);

// galaxy particles
const starField = addParticlesToScene(scene);

// lands position
hauntedHouseLand.group.position.set(-20, 0, 0);
hauntedHouseLand.group.rotation.y = 0;
carnivalLand.group.position.set(20, 0, 0);
carnivalLand.group.rotation.y = 0;

// OrbitControls 
controls.minDistance = 10;
controls.maxDistance = 60;

// Raycaster to focus on land
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    [hauntedHouseLand.group, carnivalLand.group],
    true
  );
  if (intersects.length > 0) {
    let targetGroup = intersects[0].object;
    while (targetGroup.parent && !targetGroup.name) {
      targetGroup = targetGroup.parent;
    }
    if (targetGroup.name) {
      focusOnLand(targetGroup);
    }
  }
});
function focusOnLand(landGroup) {
  const target = new THREE.Vector3();
  landGroup.getWorldPosition(target);
  gsap.to(camera.position, {
    x: target.x,
    y: target.y + 5,
    z: target.z + 15,
    duration: 1.5,
    onUpdate: () => {
      camera.lookAt(target.x, target.y, target.z);
    },
  });
}

// Resize handler
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

document.addEventListener(
  "click",
  () => {
    bgm("/sounds/classiGhostSound.mp3");
  },
  { once: true }
);

const exrLoader = new EXRLoader();
exrLoader.load("/env/NightSkyHDRI001_1K-HDR.exr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// target position
const targetPosition = new THREE.Vector3(0, 5, 50);
const duration = 2;

// use tween.js or gsap animation
gsap.to(camera.position, {
  x: targetPosition.x,
  y: targetPosition.y,
  z: targetPosition.z,
  duration: duration,
  onUpdate: () => {
    camera.lookAt(0, 3, 0);
  },
});

const clock = new THREE.Clock();

function tick() {
  if (skySphere) {
    skySphere.position.copy(camera.position);
    skySphere.rotation.y += 0.0001;
  }
  hauntedHouseLand.update(clock.getElapsedTime(), clock.getDelta());
  carnivalLand.update(clock.getElapsedTime(), clock.getDelta());
  controls.update();
  if (starField) {
    const t = performance.now() * 0.001;
    starField.material.opacity = 0.2 + 0.8 * Math.abs(Math.sin(t * 2));
    starField.rotation.y += 0.0001;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
