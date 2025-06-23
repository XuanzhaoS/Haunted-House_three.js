import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

export const loadSkullModel = (scene, world, objectsToUpdate, environmentMapTexture, position, material) => {
    gltfLoader.load('/skull/skull1.glb', (gltf) => {
        const skull = gltf.scene
        skull.scale.set(0.5, 0.5, 0.5)
        skull.position.copy(position)
        skull.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true
                child.material.envMap = environmentMapTexture
            }
        })

        scene.add(skull)

        // physics body
        const shape = new CANNON.Sphere(0.25)
        const body = new CANNON.Body({
            mass: 1,
            shape,
            position: new CANNON.Vec3(position.x, position.y, position.z),
            material
        })
        world.addBody(body)

        objectsToUpdate.push({
            mesh: skull,
            body: body
        })
    })
}