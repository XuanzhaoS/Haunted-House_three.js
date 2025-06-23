import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export function addGraveyardToScene(scene, world) {

    const graves = new THREE.Group();

    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

    for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 6;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        const grave = new THREE.Mesh(graveGeometry, graveMaterial);
        grave.position.set(x, 0.4, z);
        grave.rotation.y = (Math.random() - 0.5) * 0.4;
        grave.rotation.z = (Math.random() - 0.5) * 0.4;
        grave.castShadow = true;
        graves.add(grave);

        // Add physics
        const shape = new CANNON.Box(new CANNON.Vec3(0.3, 0.4, 0.1)) 
        const body = new CANNON.Body({
            mass: 0,
            shape: shape,
            position: new CANNON.Vec3(x, 0.4, z)
        })
        world.addBody(body)
    }

    scene.add(graves);
}