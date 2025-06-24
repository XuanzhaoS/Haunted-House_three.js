import * as THREE from "three";

export class CarnivalLand {
  constructor() {
    this.group = new THREE.Group();

    // 1. floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({
        color: 0x4444aa,
        side: THREE.DoubleSide,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);

    // 2. carousel
    const carousel = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 0.3, 32),
      new THREE.MeshStandardMaterial({ color: 0xffcc00 })
    );
    carousel.position.set(0, 0.15, 0);
    this.group.add(carousel);

    // 3. ferris wheel
    const ferrisWheel = new THREE.Mesh(
      new THREE.TorusGeometry(4, 0.15, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    ferrisWheel.position.set(8, 4, -5);
    ferrisWheel.rotation.x = Math.PI / 2;
    this.group.add(ferrisWheel);
  }

  addToScene(scene) {
    scene.add(this.group);
  }

  update(elapsedTime, deltaTime) {
    // let ferris wheel slowly rotate
    const ferrisWheel = this.group.children.find(
      (obj) => obj.geometry && obj.geometry.type === "TorusGeometry"
    );
    if (ferrisWheel) {
      ferrisWheel.rotation.z += deltaTime * 0.2;
    }
  }
}
