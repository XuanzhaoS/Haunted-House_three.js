import * as THREE from "three";
import * as CANNON from "cannon-es";

export function addCarouselToScene(group, world) {
  // Carousel
  const carousel = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 0.3, 32),
    new THREE.MeshStandardMaterial({ color: 0xffcc00 })
  );
  carousel.position.set(0, 0.15, 0);
  carousel.castShadow = true;
  carousel.receiveShadow = true;

  // Physics for carousel
  const carouselShape = new CANNON.Cylinder(2, 2, 0.3, 32);
  const carouselBody = new CANNON.Body({
    mass: 0,
    shape: carouselShape,
    position: new CANNON.Vec3(0, 0.15, 0),
  });
  world.addBody(carouselBody);

  group.add(carousel);

  return {
    carousel,
    carouselBody,
  };
}
