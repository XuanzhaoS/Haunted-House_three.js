import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";
import { addGhostsToScene, updateGhosts } from "./scene/ghosts";
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

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

addGhostsToScene(scene);
addGraveyardToScene(scene, world);
addEnvironmentToScene(scene, world);
addLightsToScene(scene, gui);
addParticlesToScene(scene);
addWelcomTextToScene(scene);

const houseInfo = addHouseToScene(scene, world);
// let doorModel = houseInfo.doorModel;
let doorLight = houseInfo.doorLight;

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
const audio = new Audio("sounds/classiGhostSound.mp3");
audio.loop = true;

let audioStarted = false;

window.addEventListener("click", () => {
  if (!audioStarted) {
    audio.play();
    audioStarted = true;
  }

  // Check if clicked on fakeDoor
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(houseInfo.fakeDoor);

  if (intersects.length > 0) {
    if (houseInfo.doorModel && houseInfo.doorMixer) {
      const action = houseInfo.doorMixer.clipAction(
        houseInfo.doorModel.animations[0]
      );

      if (action.isRunning()) {
        action.paused = false;
        action.timeScale = -1;
        action.play();
      } else {
        action.paused = false;
        action.timeScale = 1;
        action.play();
      }
    }
  }
});

/**
 * Mouse
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Test
const radius = 0.3;

//
const sphereShape = new CANNON.Sphere(radius);
const sphereBody = new CANNON.Body({
  mass: 1,
  shape: sphereShape,
  position: new CANNON.Vec3(0, 5, 0),
});
world.addBody(sphereBody);

const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.castShadow = true;
scene.add(sphereMesh);

function animate() {
  requestAnimationFrame(animate);

  world.step(1 / 60);

  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  renderer.render(scene, camera);
}

animate();

/*
 *4Animate
 */

const timer = new Timer();
const clock = new THREE.Clock();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();
  const deltaTime = clock.getDelta();

  // Update door
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(houseInfo.fakeDoor);

  if (intersects.length > 0) {
    // Pointed to the door
    doorLight.intensity = 3; 
  } else {
    doorLight.intensity = 1;
  }

  // Update door animation
  if (houseInfo.doorMixer) {
    houseInfo.doorMixer.update(deltaTime);
  }

  // Update ghosts
  updateGhosts(elapsedTime);

  // Update text
  updateWelcomeText(elapsedTime);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
