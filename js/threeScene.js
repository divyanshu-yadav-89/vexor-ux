/**
 * VexorUX — 3D WebGL Quantum Gyro Core Engine
 * Powered by Three.js (r128)
 */
(() => {
  const canvas = document.getElementById("heroCanvas");
  const heroStage = document.getElementById("heroStage");
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Quantum Gyro Stage Hierarchy
  const stageGroup = new THREE.Group();
  scene.add(stageGroup);
  stageGroup.position.set(0, 0, 0);

  // Center Crystal Polyhedron
  const gemGeo = new THREE.IcosahedronGeometry(1.25, 1);
  const gemMat = new THREE.MeshPhysicalMaterial({
    color: 0x111628,
    emissive: 0x8b7cff,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.95
  });
  const gemMesh = new THREE.Mesh(gemGeo, gemMat);
  stageGroup.add(gemMesh);

  // Inner Pulsing Core Lattice
  const innerCoreGeo = new THREE.OctahedronGeometry(0.85, 2);
  const innerCoreMat = new THREE.MeshBasicMaterial({
    color: 0x6ee7f9,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
  stageGroup.add(innerCore);

  // Dual Gimbal Orbital Gyro Rings
  const ringGroup1 = new THREE.Group();
  const ringGroup2 = new THREE.Group();
  stageGroup.add(ringGroup1);
  stageGroup.add(ringGroup2);

  const ringMat1 = new THREE.MeshStandardMaterial({
    color: 0x8b7cff,
    roughness: 0.2,
    metalness: 0.9,
    emissive: 0x8b7cff,
    emissiveIntensity: 0.35
  });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.022, 16, 120), ringMat1);
  ringGroup1.add(ring1);

  const ringMat2 = new THREE.MeshStandardMaterial({
    color: 0x6ee7f9,
    roughness: 0.2,
    metalness: 0.9,
    emissive: 0x6ee7f9,
    emissiveIntensity: 0.4
  });
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.018, 16, 120), ringMat2);
  ringGroup2.add(ring2);

  // Satellite Beacons
  const beaconGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const beacon1 = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  beacon1.position.set(1.75, 0, 0);
  ringGroup1.add(beacon1);

  const beacon2 = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: 0x6ee7f9 }));
  beacon2.position.set(0, 2.05, 0);
  ringGroup2.add(beacon2);

  // Ambient Particle Constellation (550 Points)
  const pCount = 550;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(pCount * 3);
  const pColors = new Float32Array(pCount * 3);

  const cViolet = new THREE.Color(0x8b7cff);
  const cCyan = new THREE.Color(0x6ee7f9);

  for (let i = 0; i < pCount; i++) {
    const rad = 2.2 + Math.random() * 1.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    pPositions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
    pPositions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
    pPositions[i * 3 + 2] = rad * Math.cos(phi);

    const mixColor = Math.random() > 0.45 ? cViolet : cCyan;
    pColors[i * 3] = mixColor.r;
    pColors[i * 3 + 1] = mixColor.g;
    pColors[i * 3 + 2] = mixColor.b;
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

  const pMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const particles = new THREE.Points(pGeo, pMat);
  stageGroup.add(particles);

  // Dynamic Studio Lights
  const lightViolet = new THREE.PointLight(0x8b7cff, 4.0, 14);
  lightViolet.position.set(3.5, 2.5, 4);
  scene.add(lightViolet);

  const lightCyan = new THREE.PointLight(0x6ee7f9, 3.2, 14);
  lightCyan.position.set(-3.5, -2, 3);
  scene.add(lightCyan);

  const lightEmerald = new THREE.PointLight(0x5ee6a8, 1.5, 10);
  lightEmerald.position.set(0, 3.5, -2);
  scene.add(lightEmerald);

  scene.add(new THREE.AmbientLight(0x0a0e1a, 1.0));

  // Centered Tilt & Inertia Drag
  let tiltTargetX = 0, tiltTargetY = 0;
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  let dragMomentumX = 0, dragMomentumY = 0;

  function onMove(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    tiltTargetX = ((clientX - r.left) / r.width - 0.5) * 0.7;
    tiltTargetY = ((clientY - r.top) / r.height - 0.5) * 0.5;
  }

  canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) {
      onMove(e.clientX, e.clientY);
    } else {
      dragMomentumY = (e.clientX - prevMouseX) * 0.005;
      dragMomentumX = (e.clientY - prevMouseY) * 0.005;
      stageGroup.rotation.y += dragMomentumY;
      stageGroup.rotation.x += dragMomentumX;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener("mouseup", () => { isDragging = false; });

  canvas.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function handleResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w < 600 ? 7.2 : 6.0;
      camera.updateProjectionMatrix();
    }
  }
  window.addEventListener("resize", handleResize);
  handleResize();

  // GPU Render Pause When Off-Screen
  let isInView = true;
  if (heroStage) {
    const stageObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { isInView = e.isIntersecting; });
    }, { threshold: 0.05 });
    stageObserver.observe(heroStage);
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isInView) return;

    handleResize();
    const elapsed = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      if (!isDragging) {
        dragMomentumX *= 0.94;
        dragMomentumY *= 0.94;
        stageGroup.rotation.y += dragMomentumY + 0.0035;
        stageGroup.rotation.x += dragMomentumX + (tiltTargetY * 0.4 - stageGroup.rotation.x) * 0.03;
      }

      const pulse = 1.0 + Math.sin(elapsed * 2.0) * 0.06;
      innerCore.scale.set(pulse, pulse, pulse);
      innerCore.rotation.y -= 0.01;
      innerCore.rotation.z += 0.008;

      ringGroup1.rotation.x = elapsed * 0.45;
      ringGroup1.rotation.y = elapsed * 0.3;
      
      ringGroup2.rotation.y = -elapsed * 0.4;
      ringGroup2.rotation.z = elapsed * 0.25;

      particles.rotation.y = -elapsed * 0.04;

      lightViolet.position.x = Math.sin(elapsed * 0.8) * 3.8;
      lightViolet.position.z = Math.cos(elapsed * 0.8) * 3.8;
      lightCyan.position.x = -Math.sin(elapsed * 0.6) * 3.8;
      lightCyan.position.y = Math.cos(elapsed * 0.6) * 2.8;
    }

    renderer.render(scene, camera);
  }

  animate();
})();
