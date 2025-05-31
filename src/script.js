import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import * as CANNON from 'cannon-es'
import { addGhostsToScene, updateGhosts } from './scene/ghosts'
import { addGraveyardToScene } from "./scene/graveyard";
import { addHouseToScene } from "./scene/hauntedHouse";
import { addEnvironmentToScene } from "./scene/environment";
import { addLightsToScene } from "./lights/lighting";
import { addParticlesToScene } from "./scene/particles";
import { addWelcomTextToScene, updateWelcomeText } from "./ui/welcomeText";
import { bgm } from "./scene/bgm";
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
addGhostsToScene(scene)
addGraveyardToScene(scene)
addHouseToScene(scene)
addEnvironmentToScene(scene)
addLightsToScene(scene, gui)
addParticlesToScene(scene)
addWelcomTextToScene(scene)

const defaultMaterial = new CANNON.Material('default')

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 40;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262827");

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Sound
 */
const audio = new Audio('sounds/classiGhostSound.mp3')
audio.loop = true 

let audioStarted = false

window.addEventListener('wheel', () => {
  if (!audioStarted) {
    audio.play()
    audioStarted = true
  }
})

/*4
 *4Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update ghosts
  updateGhosts(elapsedTime)

  // Update text
  updateWelcomeText(elapsedTime)

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
