import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
// import { all, bumpMap } from 'three/tsl'
// import { Texture } from 'three/webgpu'
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as CANNON from 'cannon-es'
import { addGhostsToScene, updateGhosts } from './scene/ghosts'
import { addGraveyardToScene } from "./scene/graveyard";
import { addHouseToScene } from "./scene/hauntedHouse";
import { addEnvironmentToScene } from "./scene/environment";
import { addLightsToScene } from "./lights/lighting";
import { addParticlesToScene } from "./scene/particles";
import { addWelcomTextToScene, updateWelcomeText } from "./ui/text";

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

/**
 * Skull drops
 */
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

// Skull
const skullBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(0.2),
    position: new CANNON.Vec3(2, 8, 2)
})
world.addBody(skullBody)

const skullGeometry = new THREE.SphereGeometry(0.2, 16, 16)
const skullMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

const fallingSkull = new THREE.Mesh(skullGeometry, skullMaterial)
fallingSkull.visible = false
scene.add(fallingSkull)

// Sound
skullBody.addEventListener('collide', (event) => {
    const impactStrength = event.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5) {
        skullSound.volume = Math.random()
        skullSound.currentTime = 0
        skullSound.play()
    }
})

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

/*4
 *4Animate
 */
const timer = new Timer();
let skullDropTriggered = false

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update ghosts
  updateGhosts(elapsedTime)

  // Update skull sound
  world.step(1 / 60)

  if (fallingSkull.visible) {
    world.step(1/60)
    fallingSkull.position.copy(skullBody.position)
  }

  // if (!skullDropTriggered && camera.position.distanceTo(ghost3.position) < 10) {
  //   skullDropTriggered = true
  //   fallingSkull.visible = true
  //   skullBody.position.set(2, 8, 2)
  //   skullBody.velocity.set(0, 0, 0)
  // }

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
