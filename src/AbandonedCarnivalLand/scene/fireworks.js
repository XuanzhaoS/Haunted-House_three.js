import * as THREE from "three";

// vertex shader - handle particle position and animation
const vertexShader = `
  attribute float size;
  attribute float alpha;
  attribute float life;
  attribute vec3 velocity;
  
  varying float vAlpha;
  varying float vLife;
  
  uniform float time;
  uniform float explosionTime;
  uniform float isActive;
  
  void main() {
    vAlpha = alpha;
    vLife = life;
    
    // calculate particle position
    vec3 pos = position;
    
    // only show explosion effect when active
    if (isActive > 0.5 && explosionTime > 0.0) {
      float t = mod(time - explosionTime, 3.0); // 3 seconds loop
      float speed = 2.0;
      pos += velocity * t * speed;
      
      // gravity effect
      pos.y -= 0.5 * t * t;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // particle size decreases with distance
    gl_PointSize = size * (300.0 / -mvPosition.z);
  }
`;

// fragment shader - handle particle color and glow
const fragmentShader = `
  varying float vAlpha;
  varying float vLife;
  
  uniform float time;
  uniform float explosionTime;
  uniform float isActive;
  
  void main() {
    // only show particles when active
    if (isActive < 0.5) {
      discard; // completely hide particles
      return;
    }
    
    // particle life
    float life = vLife;
    float t = mod(time - explosionTime, 3.0);
    
    // color gradient: from white to colorful to fade
    vec3 color;
    if (t < 0.5) {
      // early stage: white to colorful
      color = mix(vec3(1.0), vec3(1.0, 0.3, 0.1), t * 2.0);
    } else if (t < 1.5) {
      // mid-range: colorful
      color = vec3(1.0, 0.3, 0.1);
    } else {
      // fade out
      color = mix(vec3(1.0, 0.3, 0.1), vec3(0.0), (t - 1.5) * 2.0);
    }
    
    // glow effect
    float glow = 1.0 - smoothstep(0.0, 1.0, t / 3.0);
    color *= glow;
    
    gl_FragColor = vec4(color, vAlpha * glow);
  }
`;

export class FireworksSystem {
  constructor() {
    this.particles = [];
    this.explosionTimes = [];
    this.lastExplosion = 0;
    this.explosionInterval = 2.0; // every 2 seconds
    this.isActive = false; // control if fireworks are active
    this.activationTime = 0; // activation time

    this.setupParticles();
  }

  setupParticles() {
    const particleCount = 1300;
    const geometry = new THREE.BufferGeometry();

    // particle attributes
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const lives = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // random position 
      positions[i * 3] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      // random size
      sizes[i] = Math.random() * 0.2 + 0.05;

      // random alpha
      alphas[i] = Math.random() * 0.8 + 0.2;

      // random life
      lives[i] = Math.random();

      // random velocity direction (spherical spread)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = Math.random() * 2 + 1;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed;
      velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }

    // set geometry attributes
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("life", new THREE.BufferAttribute(lives, 1));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    // create shader material
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        explosionTime: { value: 0 },
        isActive: { value: 0.0 }, // 0.0 = inactive, 1.0 = active
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // create particle system
    this.particleSystem = new THREE.Points(geometry, this.material);
  }

  addToScene(scene) {
    scene.add(this.particleSystem);
  }

  // activate fireworks system
  activate(time) {
    this.isActive = true;
    this.activationTime = time;
    this.lastExplosion = time; // start first explosion immediately
    this.material.uniforms.isActive.value = 1.0;
  }

  // deactivate fireworks system
  deactivate() {
    this.isActive = false;
    this.material.uniforms.isActive.value = 0.0;
  }

  update(time) {
    if (!this.particleSystem || !this.isActive) return;

    // update shader uniforms
    this.material.uniforms.time.value = time;

    // trigger new explosion
    if (time - this.lastExplosion > this.explosionInterval) {
      this.triggerExplosion(time);
      this.lastExplosion = time;
    }

    // update explosion time
    this.material.uniforms.explosionTime.value = this.lastExplosion;
  }

  triggerExplosion(time) {
    // random explosion position
    const x = (Math.random() - 0.5) * 20;
    const y = Math.random() * 10 + 5;
    const z = (Math.random() - 0.5) * 20;

    this.particleSystem.position.set(x, y, z);
  }
}
