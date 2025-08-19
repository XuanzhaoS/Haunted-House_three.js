import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function addClownHat(group, world, opts = {}) {
  const loader = new GLTFLoader();

  const {
    position = new THREE.Vector3(-12, 0.02, 7.8),
    rotationY = Math.PI / 3,
    targetSize = 2,
  } = opts;

  return new Promise((resolve, reject) => {
    loader.load(
      "/carnivalLand/clownHat.glb",
      (gltf) => {
        const hat = gltf.scene;

        // size
        const box = new THREE.Box3().setFromObject(hat);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const s = targetSize / maxDim;
        hat.scale.setScalar(s);

        hat.position.copy(position);
        hat.rotation.y = rotationY;

        hat.traverse((c) => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });

        hat.userData.isProp = true;
        hat.userData.type = "clownHat";

        group.add(hat);

        // Physics body
        const r = targetSize * 0.25;
        const body = new CANNON.Body({
          mass: 0,
          shape: new CANNON.Sphere(r),
          position: new CANNON.Vec3(
            hat.position.x,
            hat.position.y + r,
            hat.position.z
          ),
        });
        world.addBody(body);

        hat.userData.body = body;

        // Promise resolve
        resolve(hat);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}
