import * as THREE from "three";

export function addCircleToScene(group, world) {
  const opts = {
    innerRadius: 1.3,   
    outerRadius: 1.7,               
    particleCount: 8000,              
    color: 0x36e0d4,                  
    gapStart: THREE.MathUtils.degToRad(320), 
    gapSize: THREE.MathUtils.degToRad(50),   
    size: 0.07                         
  };

  const ring = createGlowingParticleRing(opts);
  ring.position.set(-1, 0.02, 6);
  group.add(ring);

  return { ring };
}

function createGlowingParticleRing(opts) {
  const tex = makeDiscTexture();
  const material = new THREE.PointsMaterial({
    color: opts.color,
    size: opts.size,
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.95,
    sizeAttenuation: true
  });

  const positions = [];
  const start = opts.gapStart ?? 0;
  const end = start + (opts.gapSize ?? Math.PI / 8);

  const N = opts.particleCount ?? 6000;
  for (let i = 0; i < N; i++) {
    let angle = Math.random() * Math.PI * 2;

    if (angle > start && angle < end) {
      i--;
      continue;
    }

    const r = THREE.MathUtils.lerp(opts.innerRadius, opts.outerRadius, Math.random());
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    positions.push(x, 0, z); 
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  return new THREE.Points(geometry, material);
}

function makeDiscTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.6)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}