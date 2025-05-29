import * as THREE from 'three'

export function addBushesToScene(scene) {
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(1.2, 0.2, 2.2);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.8, 0.1, 2.1);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-1.5, 0.1, 2.2);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.17, 0.17, 0.17);
    bush4.position.set(-1.8, 0.05, 2.4);

    // Shadow
    bush1.castShadow = true;
    bush2.castShadow = true;
    bush3.castShadow = true;
    bush4.castShadow = true;

    scene.add(bush1, bush2, bush3, bush4)
}