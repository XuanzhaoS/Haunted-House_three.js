import * as THREE from "three";

export function addCarnivalLightingToGroup(group) {
  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  group.add(ambientLight);

  // Directional light for shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  group.add(directionalLight);

  // Point light for carousel
  const carouselLight = new THREE.PointLight(0xffcc00, 1, 10);
  carouselLight.position.set(0, 2, 0);
  carouselLight.castShadow = true;
  group.add(carouselLight);

  return {
    ambientLight,
    directionalLight,
    carouselLight,
  };
}
