import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export const loadDoorModel = (scene, onLoaded, world) => {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load(
    '../door/door_wood/door.gltf',
    (gltf) => {
      const door = gltf.scene
      door.position.set(5, 0, 0); 
      door.scale.set(0.75, 0.55, 0.8)

      scene.add(door)

      const mixer = new THREE.AnimationMixer(door)
      const animations = gltf.animations

      // Add physics
      if (world) {
        const doorShape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.05))
        const doorBody = new CANNON.Body({
          shape: doorShape,
          type: CANNON.Body.STATIC,
          position: new CANNON.Vec3(5, 1, 0)
        })
        world.addBody(doorBody)
      }

      if (onLoaded) {
        onLoaded(door, mixer, animations)
      }
    }
  )
}