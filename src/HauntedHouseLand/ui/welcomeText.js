import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let welcomeText = null;
// let lastChangeTime = 0;
// let nextChangeDelay = 1;
let targetPos = new THREE.Vector3(0, 3, -6);

export function addWelcomTextToScene(scene) {
  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("It is coming", {
      font: font,
      size: 0.3,
      depth: 0.01,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    textGeometry.center();

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xccccff,
      transparent: true,
      opacity: 0.7,
      emissive: 0xaaaaff,
      emissiveIntensity: 1,
    });

    welcomeText = new THREE.Mesh(textGeometry, textMaterial);
    welcomeText.position.copy(targetPos);
    scene.add(welcomeText);
  });
}

export function updateWelcomeText(elapsedTime) {
  if (!welcomeText) return;

  // drift
  const x = Math.sin(elapsedTime * 0.5) * 4 + Math.sin(elapsedTime * 1.3) * 1.5;
  const y = 3 + Math.cos(elapsedTime * 0.7) * 2;
  const z = -10 + Math.cos(elapsedTime * 0.3) * 2;
  welcomeText.position.set(x, y, z);

  // flicker
  welcomeText.material.opacity =
    0.3 + 0.7 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.0));
  welcomeText.material.emissiveIntensity =
    0.5 + 1.5 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.5));
}
