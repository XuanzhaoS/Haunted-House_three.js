import * as THREE from 'three'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let welcomeText = null;

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
      welcomeText.position.set(2, 6, 28);
      scene.add(welcomeText);
    });
}

export function updateWelcomeText(elapsedTime){
    if (welcomeText) {
        welcomeText.position.x = Math.sin(elapsedTime * 2) * 1.8;
        welcomeText.position.y = 2 + Math.cos(elapsedTime * 2) * 1.2;
      }
}