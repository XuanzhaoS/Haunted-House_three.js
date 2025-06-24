import * as THREE from "three";

export class SimpleLand {
  constructor() {
    this.group = new THREE.Group();

    // 创建一个简单的地面
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        color: 0x88cc88,
        side: THREE.DoubleSide,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);
  }

  addToScene(scene) {
    scene.add(this.group);
  }

  update(elapsedTime, deltaTime) {
    // 目前不需要动画
  }
}
