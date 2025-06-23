import * as THREE from "three";
import * as CANNON from "cannon-es";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function addEnvironmentToGroup(group, world, renderer) {

  // Texture
  const textureLoader = new THREE.TextureLoader();

  const grassColorTexture = textureLoader.load("/grass/color.jpg");

  const grassAmbientOcclusionTexture = textureLoader.load(
    "/grass/ambientOcclusion.jpg"
  );
  const grassNormalTexture = textureLoader.load("/grass/normal.jpg");
  const grassRoughnessTexture = textureLoader.load("/grass/roughness.jpg");

  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);

  grassColorTexture.wrapS = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  grassNormalTexture.wrapS = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

  grassColorTexture.wrapT = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  grassNormalTexture.wrapT = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      map: grassColorTexture,
      transparent: true,
      aoMap: grassAmbientOcclusionTexture,
      normalMap: grassNormalTexture,
      roughness: grassRoughnessTexture,
    })
  );
  floor.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
  );
  floor.rotation.x = -Math.PI * 0.5;
  floor.rotation.y = 0;
  floor.receiveShadow = true;

  // fog
  group.fogColor = "#262837"; 
  group.fogNear = 1;
  group.fogFar = 15;

  // Physics floor
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
  });
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(floorBody);

  group.add(floor);
}
