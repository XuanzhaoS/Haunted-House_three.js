import * as THREE from "three";

export function addParticlesToScene(scene) {
  const starCount = 5000;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const minRadius = 10;
  const maxRadius = 20;
  for (let i = 0; i < starCount; i++) {
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const theta = Math.acos(2 * Math.random() - 1); 
    const phi = Math.random() * 2 * Math.PI; 

    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.cos(theta);
    const z = radius * Math.sin(theta) * Math.sin(phi);

    starPositions[i * 3] = x;
    starPositions[i * 3 + 1] = y;
    starPositions[i * 3 + 2] = z;

    const colorA = new THREE.Color(0xffcc88); 
    const colorB = new THREE.Color(0xffffff);
    const colorC = new THREE.Color(0x3366ff); 
    const t = (radius - minRadius) / (maxRadius - minRadius); // 归一化到0~1
    let color;
    if (t < 0.5) {
      color = colorA.clone().lerp(colorB, t * 2);
    } else {
      color = colorB.clone().lerp(colorC, (t - 0.5) * 2);
    }
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
  return starField;
}
