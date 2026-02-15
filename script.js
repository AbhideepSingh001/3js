/* ----------------------------------------------------
   🌍 3D Earth Background + BIHAR Pin + Cinematic Intro
   - Three.js + OrbitControls + GUI
   - Pin click → show info card in UI
---------------------------------------------------- */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { initGUI } from "./gui/index.js"; // tumhara lil-gui setup

/* -----------------------------
   BASIC SETUP
----------------------------- */

// Canvas jisme render hoga
const canvas = document.querySelector(".webgl");

// Scene (3D world)
const scene = new THREE.Scene();

// Texture loader (images load karne ke liye)
const textureLoader = new THREE.TextureLoader();

/* -----------------------------
   🌌 GALAXY BACKGROUND
----------------------------- */

const starsTexture = textureLoader.load("/textures/stars.jpg");

const galaxyGeometry = new THREE.SphereGeometry(50, 64, 64);
const galaxyMaterial = new THREE.MeshBasicMaterial({
  map: starsTexture,
  side: THREE.BackSide // andar ki side render karo
});

const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

/* -----------------------------
   🌍 EARTH + TEXTURES
----------------------------- */

const earthDayTex = textureLoader.load("/textures/earth_daymap.jpg");
const earthNormalTex = textureLoader.load("/textures/earth_normalmap.jpg");
const earthSpecularTex = textureLoader.load("/textures/earth_specularmap.jpg");

const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthDayTex,
  normalMap: earthNormalTex,
  specularMap: earthSpecularTex,
  shininess: 20
});

const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

/* -----------------------------
   ☁ CLOUD LAYER
----------------------------- */

const cloudTexture = textureLoader.load("/textures/earth_clouds.png");

const cloudMaterial = new THREE.MeshLambertMaterial({
  map: cloudTexture,
  transparent: true,
  opacity: 0.45,
  depthWrite: false
});

const cloudGeometry = new THREE.SphereGeometry(1.53, 64, 64);
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

/* -----------------------------
   💡 LIGHTS
----------------------------- */

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(5, 2, 3);
scene.add(sunlight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

/* -----------------------------
   🎥 CAMERA
----------------------------- */

const camera = new THREE.PerspectiveCamera(
  75, // FOV
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1,
  100
);
scene.add(camera);

// Cinematic intro ke liye start + end positions
const defaultCameraPos = new THREE.Vector3(0, 0, 4); // final normal position
const introStartPos = new THREE.Vector3(0.4, 0.4, 7); // dur se start
const focusPos = new THREE.Vector3(0.7, 0.5, 3.2); // Bihar ke pass

// Pehle camera ko start pos par rakho
camera.position.copy(introStartPos);

/* -----------------------------
   🖥 RENDERER
----------------------------- */
// skdhfiushhd
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 1);

/* -----------------------------
   🌀 ORBIT CONTROLS
----------------------------- */

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0, 0, 0); // Earth center

/* -----------------------------
   🎛 GUI PARAMETERS
----------------------------- */

const guiParams = initGUI({
  cloudMaterial,
  sunlight
});

/* -----------------------------
   📍 BIHAR PIN (Blue Glow)
----------------------------- */
/*
  Tumne coordinates diye:
  Latitude: 28.10° N
  Longitude: 93.19° E
  Earth math ke hisaab se East longitude = negative
*/

const BIHAR_LAT_DEG = 28.1;
const BIHAR_LON_DEG = -93.19; // East = negative in this mapping

// Pin texture (blue glow pin.png)
const pinTexture = textureLoader.load("/textures/pin.png");
const pinMaterial = new THREE.SpriteMaterial({
  map: pinTexture,
  transparent: true
});
const biharPin = new THREE.Sprite(pinMaterial);
biharPin.scale.set(0.2, 0.2, 0.2);

// Lat/Lon ko 3D sphere coordinates me convert karna
const radius = 1.52; // Earth surface se thoda upar
const phi = (90 - BIHAR_LAT_DEG) * (Math.PI / 180);
const theta = BIHAR_LON_DEG * (Math.PI / 180);

biharPin.position.set(
  radius * Math.sin(phi) * Math.cos(theta),
  radius * Math.cos(phi),
  radius * Math.sin(phi) * Math.sin(theta)
);

// Earth ke saath attach
earth.add(biharPin);

/* -----------------------------
   🔍 RAYCASTER (hover + click)
----------------------------- */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Mouse move par 2D screen coords store karte rehna hai
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

/* -----------------------------
   🎬 CINEMATIC INTRO + RETURN
----------------------------- */

// Intro active flag
let introActive = true;
let introFrame = 0;
const INTRO_TOTAL_FRAMES = 360; // ≈ 6 seconds

// Earth rotation reference
const defaultEarthRotY = 0;
const targetEarthRotY = -theta; // Bihar ko camera ke samne lane ke liye

function cinematicIntro() {
  if (!introActive) return;

  introFrame++;
  const t = introFrame / INTRO_TOTAL_FRAMES; // 0 → 1

  if (t < 0.5) {
    // Phase 1 → Zoom towards Bihar + Earth rotate Bihar side
    const t1 = t * 2; // 0 → 1
    camera.position.lerpVectors(introStartPos, focusPos, t1);

    const rotY = THREE.MathUtils.lerp(defaultEarthRotY, targetEarthRotY, t1);
    earth.rotation.y = rotY;
    clouds.rotation.y = rotY;
  } else {
    // Phase 2 → Wapas default position par
    const t2 = (t - 0.5) * 2; // 0 → 1
    camera.position.lerpVectors(focusPos, defaultCameraPos, t2);

    const rotY = THREE.MathUtils.lerp(targetEarthRotY, defaultEarthRotY, t2);
    earth.rotation.y = rotY;
    clouds.rotation.y = rotY;
  }

  // Intro complete
  if (t >= 1) {
    introActive = false;
    camera.position.copy(defaultCameraPos);
    earth.rotation.y = defaultEarthRotY;
    clouds.rotation.y = defaultEarthRotY;
  }
}

// Jaise hi user mouse se drag kare → intro turant band
controls.addEventListener("start", () => {
  introActive = false;
});

/* -----------------------------
   📌 INFO CARD POPUP HANDLING
----------------------------- */

const infoCard = document.getElementById("info-card");
const closeCard = document.getElementById("close-card");

// Pin par click detect
window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(biharPin, true);

  if (intersects.length > 0) {
    infoCard.classList.add("show");
  }
});

// Close button
closeCard.addEventListener("click", () => {
  infoCard.classList.remove("show");
});

/* -----------------------------
   🔁 MAIN ANIMATION LOOP
----------------------------- */

function tick() {
  // 1) Intro play kare ya normal rotation chale
  if (introActive) {
    cinematicIntro();
  } else {
    if (guiParams.autoRotate) {
      earth.rotation.y += guiParams.earthRotationSpeed;
      clouds.rotation.y += guiParams.cloudsRotationSpeed;
    }
  }

  // 2) Pin hover effect (bada chhota)
  raycaster.setFromCamera(mouse, camera);
  const hoverHit = raycaster.intersectObject(biharPin, true);

  if (hoverHit.length > 0) {
    biharPin.scale.set(0.27, 0.27, 0.27);
  } else {
    biharPin.scale.set(0.2, 0.2, 0.2);
  }

  // 3) Galaxy parallax movement (cursor ki direction ke hisaab se)
  galaxy.rotation.y += controls.getAzimuthalAngle() * 0.0025;
  galaxy.rotation.x = controls.getPolarAngle() * 0.0018;

  // 4) Controls update + render
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}

tick();

/* -----------------------------
   📱 RESIZE HANDLER
----------------------------- */

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});
