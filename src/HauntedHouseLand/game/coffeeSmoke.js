import * as THREE from "three";

export function createSmokeEffect(scene, position) {
  // create particle geometry
  const particleCount = 40;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const sizes = [];
  for (let i = 0; i < particleCount; i++) {
    // randomly distributed in a small sphere
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.random() * 0.8 + 0.2;
    positions.push(
      position.x + r * Math.sin(phi) * Math.cos(theta),
      position.y + r * Math.cos(phi),
      position.z + r * Math.sin(phi) * Math.sin(theta)
    );
    sizes.push(Math.random() * 0.2 + 0.1);
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  // material
  const texture = new THREE.TextureLoader().load("/particles/1.png");
  const material = new THREE.PointsMaterial({
    size: 0.2,
    map: texture,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xcccccc,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // animation: gradually fade out
  let elapsed = 0;
  function animateSmoke() {
    elapsed += 0.016;
    points.material.opacity = Math.max(0, 0.7 - elapsed * 0.5);
    points.position.y += 0.01; // slowly rise
    if (points.material.opacity > 0) {
      requestAnimationFrame(animateSmoke);
    } else {
      scene.remove(points);
      points.geometry.dispose();
      points.material.dispose();
    }
  }
  animateSmoke();
}
