import * as THREE from "three"

export function addParticlesToScene(scene) {
    const starCount = 5000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
    const radius = 10 + Math.random() * 10;
    const theta = Math.random() * Math.PI;
    const phi = Math.random() * 2 * Math.PI;

    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(theta) * Math.sin(phi);

    starPositions[i * 3] = x;
    starPositions[i * 3 + 1] = y;
    starPositions[i * 3 + 2] = z;
    }

    starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    });

    starMaterial.map = new THREE.TextureLoader().load("/particles/1.png");
    starMaterial.alphaTest = 0.001;

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
}