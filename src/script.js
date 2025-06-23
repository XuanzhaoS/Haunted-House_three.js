import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";
import { addLightsToScene } from "./HauntedHouseLand/lights/lighting.js";
import { HauntedHouseLand } from "./HauntedHouseLand/hauntedHouseLand.js";
import { bgm } from "./HauntedHouseLand/scene/bgm.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

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
camera.position.set(8, 6, 18);
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

// Environment (HDR, ground, fog, etc.)
// addEnvironmentToScene(scene, world);

// Lights
addLightsToScene(scene, gui);

// HauntedHouseLand
const hauntedHouseLand = new HauntedHouseLand(world, renderer);
hauntedHouseLand.addToScene(scene);

// Resize handler
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = clock.getDelta();

  // update hauntedHouseLand internal animation
  hauntedHouseLand.update(elapsedTime, deltaTime);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

document.addEventListener(
  "click",
  () => {
    bgm("/sounds/classiGhostSound.mp3");
  },
  { once: true }
);

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/env/rogland_clear_night.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});
