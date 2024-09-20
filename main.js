import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  110,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({ antialias: true });

const controls = new OrbitControls(camera, renderer.domElement);
controls.dampingFactor = 0.25;
controls.enableDamping = true;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

let currentObject = null;
let cumulativeHeight = 0;

const plane = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const pl = new THREE.Mesh(plane, planeMaterial);
pl.rotation.x = (Math.PI / 180) * -90;
pl.receiveShadow = true;
scene.add(pl);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(3, 10, 10);
dirLight.castShadow = true;
scene.add(dirLight);

camera.position.set(0, 0, 5);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./3.jpg");

function createGeometry(newHeight) {
  let geometry, material, mesh
  if (newHeight >= 1 && newHeight <= 3) {
    geometry = new THREE.BoxGeometry(5, newHeight, 5);
    texture.repeat.set(1, 1);
    material = new THREE.MeshStandardMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, material);
    // cumulativeHeight += newHeight;
    // box.position.y = cumulativeHeight;
    // return box;
  } else if (newHeight >= 4 && newHeight <= 7) {
    geometry = new THREE.CylinderGeometry(2, 2, newHeight, 32);
    texture.repeat.set(1, 1);
    material = new THREE.MeshStandardMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, material);
    // cumulativeHeight += newHeight;
    // cylinder.position.y = cumulativeHeight;
    // return cylinder;
  } else if (newHeight >= 8 && newHeight <= 10) {
    geometry = new THREE.ConeGeometry(4, newHeight, 32);
    texture.repeat.set(1, 1);
    material = new THREE.MeshStandardMaterial({ map: texture });
    mesh = new THREE.Mesh(geometry, material);
    // cumulativeHeight += newHeight;
    // cone.position.y = cumulativeHeight;
    // return cone;
  } else {
    currentObject = null;
    return currentObject;
  }

  cumulativeHeight += newHeight;
  mesh.position.y = cumulativeHeight;
  mesh.castShadow = true;
  return mesh;
}

function updateObject(newHeight) {
  if (!isNaN(newHeight) && newHeight >= 1 && newHeight <= 10) {
    // scene.remove(scene.children.filter(obj => obj.type === "Mesh"))
    const newObject = createGeometry(newHeight);
    if(newObject){
      // scene.remove(currentObject)
      currentObject = newObject
      scene.add(currentObject);
    }
    renderer.render(scene, camera);
  }
}

const objectHeight = document.getElementById("cuboidHeight");
let previousHeight = objectHeight.value

objectHeight.addEventListener("input",() => {
  const newHeight = parseFloat(objectHeight.value);
  if(newHeight !== previousHeight){
    cumulativeHeight = 0;
    updateObject(newHeight);
    previousHeight = newHeight
  }
})

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // updateObject();
  renderer.render(scene, camera);
}
animate();
