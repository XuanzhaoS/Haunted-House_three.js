import * as THREE from "three";
import { addClownHat } from "./clownHat.js";

export function addPropsToScene(group, world) {
  const props = {};
  addClownHat(group, world, {
    position: new THREE.Vector3(2, 0.2, 7.8),
    rotationY: Math.PI / 3,
    targetSize: 1,
  });
  return props;
}
