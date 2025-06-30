import * as THREE from "three";
import {
  ghost1,
  ghost1Mesh,
  ghost2,
  ghost2Mesh,
  ghost3,
  ghost3Mesh,
} from "../scene/ghosts.js";
import { createSmokeEffect } from "./coffeeSmoke.js";

const ghosts = [
  { light: ghost1, mesh: ghost1Mesh, isCaught: false },
  { light: ghost2, mesh: ghost2Mesh, isCaught: false },
  { light: ghost3, mesh: ghost3Mesh, isCaught: false },
];

export function setupGhostGame(camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener("click", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
      ghosts.filter((g) => !g.isCaught).map((g) => g.mesh)
    );
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      const ghost = ghosts.find((g) => g.mesh === mesh);
      if (ghost && !ghost.isCaught) {
        ghost.isCaught = true;
        ghost.mesh.visible = false;
        ghost.light.visible = false;
        ghost.light.intensity = 0;

        // create smoke effect
        createSmokeEffect(ghost.mesh.parent, ghost.mesh.position);
        console.log("Caught a ghost！", mesh);
      }
      if (ghosts.every((g) => g.isCaught)) {
        document.getElementById("successMsg").style.display = "block";

        // auto disappear after 3 seconds
        setTimeout(() => {
          document.getElementById("successMsg").style.display = "none";
        }, 3000);
      }
    }
  });
}
