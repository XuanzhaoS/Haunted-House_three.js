import * as THREE from "three";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let welcomeText = null;
let camera = null;
const offset = new THREE.Vector3(0, -0.5, -3); 

export function addWelcomTextToScene(scene, mainCamera) {
  camera = mainCamera;
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
  if (!welcomeText || !camera) return;

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

  // flicker
  welcomeText.material.opacity =
    0.3 + 0.7 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.0));
  welcomeText.material.emissiveIntensity =
    0.5 + 1.5 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.5));
}