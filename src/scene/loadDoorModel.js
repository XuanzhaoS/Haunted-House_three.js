import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export const loadDoorModel = (scene, onLoaded) => {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load(
    '/door/door_wood/door.gltf',
    (gltf) => {
      const door = gltf.scene
      door.position.set(5, 0, 0); 
      door.scale.set(0.5, 0.5, 0.5)

      scene.add(door)

      const mixer = new THREE.AnimationMixer(door)
      const animations = gltf.animations

      if (onLoaded) {
        onLoaded(door, mixer, animations)
      }
    },
    undefined,
    (error) => {
      console.error('Error loading door model:', error)
    }
  )
}