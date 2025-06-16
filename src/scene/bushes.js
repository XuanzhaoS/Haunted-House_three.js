import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export function addBushesToScene(house, world) {
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

    const bushes = [
        { scale: 0.5, pos: [1.2, 0.2, 2.3] },
        { scale: 0.25, pos: [1.8, 0.1, 2.1] },
        { scale: 0.4, pos: [-1.5, 0.1, 2.2] },
        { scale: 0.17, pos: [-1.85, 0.05, 2.1] }
    ]

    bushes.forEach(({ scale, pos }) => {
        const bush = new THREE.Mesh(bushGeometry, bushMaterial)
        bush.scale.set(scale, scale, scale)
        bush.position.set(...pos)
        bush.castShadow = true
        house.add(bush)

        // Add physics body
        const radius = 1 * scale
        const shape = new CANNON.Sphere(radius)
        const body = new CANNON.Body({
            mass: 0, 
            shape,
            position: new CANNON.Vec3(...pos)
        })
        world.addBody(body)
    })
}