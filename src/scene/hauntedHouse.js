import * as THREE from 'three'
import { addBushesToScene } from "./bushes";

export function addHouseToScene(scene) {

    // Group
    const house = new THREE.Group();

    // Texture
    const textureLoader = new THREE.TextureLoader();

    const doorColorTexture = textureLoader.load("/door/color.jpg");
    const doorAlphaTexture = textureLoader.load("/door/alpha.jpg");
    const doorAmbientOcclusionTexture = textureLoader.load(
    "/ambientOcclusion/door/color.jpg"
    );
    const doorHeightTexture = textureLoader.load("/door/height.jpg");
    const doorNormalTexture = textureLoader.load("/door/normal.jpg");
    const doorMetalnessTexture = textureLoader.load("/door/metalness.jpg");
    const doorRoughnessTexture = textureLoader.load("/door/roughness.jpg");

    const bricksColorTexture = textureLoader.load("/brick/color.jpg");
    const bricksAmbientOcclusionTexture = textureLoader.load(
    "/brick/ambientOcclusion.jpg"
    );
    const bricksNoralTexture = textureLoader.load("/brick/normal.jpg");
    const bricksRoughnessTexture = textureLoader.load("/brick/roughness.jpg");

    // Walls
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2.5, 4),
        new THREE.MeshStandardMaterial({ color: "#ac8e82" })
    );
    walls.position.y = 1.25;
    house.add(walls);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.5, 1, 4),
        new THREE.MeshStandardMaterial({ color: "#b35f45" })
    );
    roof.position.y = 2.5 + 0.5;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    // Door
    const door = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
        new THREE.MeshStandardMaterial({
            map: doorColorTexture,
            transparent: true,
            alphaMap: doorAlphaTexture,
            aoMap: doorAmbientOcclusionTexture,
            displacementMap: doorHeightTexture,
            displacementScale: 0.1,
            normalMap: doorNormalTexture,
            metalnessMap: doorMetalnessTexture,
            roughness: doorRoughnessTexture,
        })
    );

    door.geometry.setAttribute(
        "uv2",
        new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
    );

    door.position.y = 1;
    door.position.z = 2 + 0.01;
    house.add(door);

    // Door light
    const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
    doorLight.position.set(0, 2.2, 2.7);
    house.add(doorLight);

    // Shadow
    walls.castShadow = true;
    doorLight.castShadow = true;
    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;

    addBushesToScene(house)

    scene.add(house);
}