import * as THREE from "three";

export function addParticlesToScene(scene) {
  const starCount = 5000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const arms = 4; 
  const spin = 1.5; 
  for (let i = 0; i < starCount; i++) {
    const radius = Math.random() * 10 + 10;
    const theta = Math.acos(2 * Math.random() - 1); // [0, PI]
    const phi = Math.random() * 2 * Math.PI; // [0, 2PI]

    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(theta) * Math.sin(phi);

    starPositions[i * 3] = x;
    starPositions[i * 3 + 1] = y;
    starPositions[i * 3 + 2] = z;

    const colorInside = new THREE.Color(0xffcc88);
    const colorOutside = new THREE.Color(0x3366ff);
    const color = colorInside.clone().lerp(colorOutside, radius / 20);
    starColors[i * 3] = color.r;
    starColors[i * 3 + 1] = color.g;
    starColors[i * 3 + 2] = color.b;
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );

  starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  starMaterial.map = new THREE.TextureLoader().load("/particles/1.png");
  starMaterial.alphaTest = 0.001;

  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);
}
