import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";
import { addLightsToScene } from "./HauntedHouseLand/lights/lighting.js";
import { HauntedHouseLand } from "./HauntedHouseLand/hauntedHouseLand.js";
import { bgm } from "./HauntedHouseLand/scene/bgm.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import gsap from "gsap";
import { CarnivalLand } from "./AbandonedCarnivalLand/environment.js";

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
camera.position.set(0, 5, 15);
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

// Lights
addLightsToScene(scene, gui);

// HauntedHouseLand
const hauntedHouseLand = new HauntedHouseLand(world);
const carnivalLand = new CarnivalLand();

// Current land
let currentLand = hauntedHouseLand;
currentLand.addToScene(scene);

// land
hauntedHouseLand.group.position.set(0, 0, 0);
hauntedHouseLand.group.rotation.y = 0;

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

// land switch function
function switchToCarnivalLand() {
  scene.remove(currentLand.group);
  currentLand = carnivalLand;
  currentLand.addToScene(scene);
}

window.switchToCarnivalLand = switchToCarnivalLand;

const clock = new THREE.Clock();
function tick() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = clock.getDelta();
  currentLand.update(elapsedTime, deltaTime);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();
