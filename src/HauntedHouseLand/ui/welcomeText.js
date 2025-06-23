import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let welcomeText = null;
let lastChangeTime = 0;
let nextChangeDelay = 0.5;
let targetPos = new THREE.Vector3(0, 3, 30);

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

  if (elapsedTime - lastChangeTime > nextChangeDelay) {
    const x = (Math.random() - 0.5) * 8;
    const y = 2 + Math.random() * 4;
    const z = 20 + Math.random() * 20;
    targetPos.set(x, y, z);

    lastChangeTime = elapsedTime;
    nextChangeDelay = 1 + Math.random() * 0.5;
  }

  welcomeText.position.lerp(targetPos, 0.05);

  // flicker
  welcomeText.material.opacity =
    0.3 + 0.7 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.0));
  welcomeText.material.emissiveIntensity =
    0.5 + 1.5 * (0.5 + 0.5 * Math.sin(elapsedTime * 2.5));
}
