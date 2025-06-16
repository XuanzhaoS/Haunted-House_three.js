import * as THREE from 'three'
import { addBushesToScene } from "./bushes";
import { loadDoorModel } from './loadDoorModel';

export function addHouseToScene(scene) {

    // Group
    const house = new THREE.Group();

    // Texture
    // const textureLoader = new THREE.TextureLoader();

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
    roof.position.y = 3;
    roof.rotation.y = Math.PI / 4;
    house.add(roof);

    // Door
    let doorMixer = null;

    loadDoorModel(house, (door, mixer, animations) => {
        door.position.set(0, 0, 2.02);
        const action = mixer.clipAction(animations[0])
        action.play()
        doorMixer = mixer;
    });

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

    return {
        house,
        get doorMixer() {
            return doorMixer;
        }
    }
}