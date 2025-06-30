import * as THREE from "three";

export const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
export const ghost1Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 6, 6),
  new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    opacity: 0,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending, 
  })
);
ghost1Mesh.position.copy(ghost1.position);

export const ghost2 = new THREE.PointLight("#ffffff", 2, 3);
export const ghost2Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 6, 6),
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 0,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })
);
ghost2Mesh.position.copy(ghost2.position);

export const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
export const ghost3Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 6, 6),
  new THREE.MeshBasicMaterial({
    color: 0xffff00,
    opacity: 0,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })
);
ghost3Mesh.position.copy(ghost3.position);

/**
 * Shadows
 */
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

ghost1.position.set(4, 2, 0);
ghost2.position.set(-4, 2, 0);
ghost3.position.set(0, 2, 4);

ghost1Mesh.position.copy(ghost1.position);
ghost2Mesh.position.copy(ghost2.position);
ghost3Mesh.position.copy(ghost3.position);

export function addGhostsToScene(scene) {
  scene.add(ghost1, ghost1Mesh, ghost2, ghost2Mesh, ghost3, ghost3Mesh);
}

export function updateGhosts(elapsedTime) {
  const ghost1Angle = elapsedTime * 0.35;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(ghost1Angle) * 2;

  const ghost2Angle = -elapsedTime * 0.2;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.35;
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.4));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.2));
  ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);
}
