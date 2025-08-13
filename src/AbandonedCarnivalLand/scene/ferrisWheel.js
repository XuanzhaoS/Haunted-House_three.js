import * as THREE from "three";
import * as CANNON from "cannon-es";

export function addFerrisWheelToScene(group, world) {
  // Ferris wheel
  const ferrisWheel = new THREE.Mesh(
    new THREE.TorusGeometry(4, 0.15, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  ferrisWheel.position.set(8, 4, -5);
  ferrisWheel.rotation.x = Math.PI / 2;
  ferrisWheel.castShadow = true;
  ferrisWheel.receiveShadow = true;

  // Physics for ferris wheel
  const ferrisWheelShape = new CANNON.Cylinder(4, 4, 0.15, 16);
  const ferrisWheelBody = new CANNON.Body({
    mass: 0,
    shape: ferrisWheelShape,
    position: new CANNON.Vec3(8, 4, -5),
  });
  ferrisWheelBody.quaternion.setFromEuler(0, 0, Math.PI / 2);
  world.addBody(ferrisWheelBody);

  // Animation mixer for rotation
  const mixer = {
    update: (deltaTime) => {
      ferrisWheel.rotation.z += deltaTime * 0.2;
    },
  };

  group.add(ferrisWheel);

  return {
    ferrisWheel,
    ferrisWheelBody,
    mixer,
  };
}
