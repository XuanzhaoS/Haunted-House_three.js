import * as THREE from "three";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let welcomeText = null;
let camera = null;
let hauntedHouseLand = null;
let carnivalLand = null;
const offset = new THREE.Vector3(0, -0.5, -3);

// text disappear distance
const DISAPPEAR_DISTANCE = 25;
const FADE_DISTANCE = 35;

export function addWelcomTextToScene(
  scene,
  mainCamera,
  hauntedHouse,
  carnival
) {
  camera = mainCamera;
  hauntedHouseLand = hauntedHouse;
  carnivalLand = carnival;

  const ttfLoader = new TTFLoader();
  const fontLoader = new FontLoader();
  ttfLoader.load("/fonts/HobbyOfNight.ttf", (json) => {
    const font = fontLoader.parse(json);
    const textGeometry = new TextGeometry("Welcome on board !", {
      font: font,
      size: 0.3,
      depth: 0.005,
      curveSegments: 12,
      bevelEnabled: false,
    });

    textGeometry.center();

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xccccff,
      transparent: true,
      opacity: 0.95,
      emissive: 0xaaaaff,
      emissiveIntensity: 2,
    });

    welcomeText = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(welcomeText);
  });
}

export function updateWelcomeText(elapsedTime) {
  if (!welcomeText || !camera || !hauntedHouseLand || !carnivalLand) return;

  // get camera position
  const cameraPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraPosition);

  // calculate camera distance to two scene centers
  const hauntedHouseCenter = new THREE.Vector3();
  hauntedHouseLand.group.getWorldPosition(hauntedHouseCenter);

  const carnivalCenter = new THREE.Vector3();
  carnivalLand.group.getWorldPosition(carnivalCenter);

  const distanceToHauntedHouse = cameraPosition.distanceTo(hauntedHouseCenter);
  const distanceToCarnival = cameraPosition.distanceTo(carnivalCenter);

  // get the nearest distance
  const minDistance = Math.min(distanceToHauntedHouse, distanceToCarnival);

  // control welcomeText's visibility and opacity based on distance
  if (minDistance <= DISAPPEAR_DISTANCE) {
    // completely disappear
    welcomeText.visible = false;
  } else if (minDistance <= FADE_DISTANCE) {
    // start fading
    welcomeText.visible = true;
    const fadeRatio =
      (minDistance - DISAPPEAR_DISTANCE) / (FADE_DISTANCE - DISAPPEAR_DISTANCE);
    welcomeText.material.opacity = fadeRatio * 0.95;
  } else {
    // completely visible
    welcomeText.visible = true;
    welcomeText.material.opacity = 0.95;
  }

  // if welcomeText is invisible, return
  if (!welcomeText.visible) return;

  // Left-right oscillation (x), and up-down "spring clown" bounce (y)
  const moveX = Math.sin(elapsedTime) * 2;
  const bobY = Math.pow(Math.abs(Math.sin(elapsedTime * 2.5)), 1.5) * 1.2;

  // Calculate position in front of camera
  const camWorldPos = new THREE.Vector3();
  camera.getWorldPosition(camWorldPos);
  const camWorldQuat = new THREE.Quaternion();
  camera.getWorldQuaternion(camWorldQuat);
  const localOffset = offset.clone();
  localOffset.x += moveX;
  localOffset.y += bobY;
  const worldOffset = localOffset.applyQuaternion(camWorldQuat);
  welcomeText.position.copy(camWorldPos).add(worldOffset);
  // Always face the camera
  welcomeText.quaternion.copy(camWorldQuat);

  // flicker (only when completely visible)
  if (welcomeText.material.opacity > 0.8) {
    welcomeText.material.opacity =
      0.3 + 0.7 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.0));
    welcomeText.material.emissiveIntensity =
      0.5 + 1.5 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.5));
  }
}
