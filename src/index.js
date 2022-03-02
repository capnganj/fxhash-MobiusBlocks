//CAPNGANJ Stoner Sculptures fxhash generative token
//February, 2022

//imports
import { StonerSculpturesFeatures } from './StonerSculpturesFeatures';

import * as THREE from 'three';
import { ParametricGeometry } from './ParametricGeometry';
import { ParametricGeometries } from './ParametricGeometries';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//1) - generate fxhash features - global driving parameters
//new featuresClass
let feet = new StonerSculpturesFeatures();
window.$fxhashData = feet;

//color drives palette
//depth drives number of recursive draw cloud layers
//cough drives initial circle radius size
//squint drives smallest circle radius size
//laugh drives how far the could spreads out from the center 

// FX Features
window.$fxhashFeatures = {
  "Palette" : feet.color.name,
  "Major" : feet.major.tag,
  "A" : feet.a.tag,
  "B": feet.b.tag,
  "Shuffle": feet.shuffle.tag
};


//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
console.log("fxhash features", window.$fxhashFeatures);


//2) generate random data for the 3d scene or 2d drawing ONCE before drawing


//3) Initialize three.js scene and start the render loop
//all data driving geometry and materials and whatever else should be generated in step 2

//scene & camera
let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set( 3, 3, 3 );

//lights
const light = new THREE.HemisphereLight( 0xfffff, 0x3b3b3b, 0.01 );
//scene.add( light );
const p1 = new THREE.PointLight( 0x3b3b3b, 0.01);
p1.position.set( 3, 3, 3);
scene.add(p1);
const p2 = new THREE.PointLight( 0x3b3b3b, 0.01);
p2.position.set( -3, -3, -3);
scene.add(p2);
const amb = new THREE.AmbientLight(0x3b3b3b, 0.01);
scene.add(amb);

// controls
let controls = new OrbitControls( camera, renderer.domElement );

//parametric geometry provides points for boxes
const geometry = new ParametricGeometry( ParametricGeometries.mobius3d,75, 75 );
geometry.rotateY(0.25);
geometry.computeBoundingBox();

//placeholder material for testing
const material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

//array of mesh phong materials
let materials = [];
for (let i = 0; i < 1; i+=0.01) {
  const d3RgbColor = feet.interpolateFn(i);
  const mat = new THREE.MeshLambertMaterial({
    color: new THREE.Color(d3RgbColor.r, d3RgbColor.g, d3RgbColor.b)
  });
  materials.push(mat);
}

//box geometry to hang on points
const boxer = new THREE.BoxGeometry(0.25, 0.25, 0.25);

//loop over geometry points and make boxes
for (let i = 0; i < geometry.attributes.position.array.length; i = i+3) {
  //pick a semi-random material

  //how much chatter / shuffle is there?
  const chatter = feet.map(fxrand(), 0, 1, 0, feet.shuffle.value);

  //map the current y position in the bounding box
  const k = feet.map(
    geometry.attributes.position.array[i+1] + chatter, 
    geometry.boundingBox.min.y, 
    geometry.boundingBox.max.y, 
    0, 
    99
  );
  let mi = Math.round(k)
  if(mi > materials.length-1){
    mi = materials.length-1;
  }
  if(mi < 0 ){
    mi = 0;
  }

  const obj = new THREE.Mesh( boxer, materials[mi]);
  obj.position.x =  geometry.attributes.position.array[i];
  obj.position.y =  geometry.attributes.position.array[i+1];
  obj.position.z =  geometry.attributes.position.array[i+2];

  obj.rotation.x = geometry.attributes.position.array[i];
  obj.rotation.y = geometry.attributes.position.array[i+1];
  obj.rotation.z = geometry.attributes.position.array[i+2];
  scene.add(obj);
}

//const mesh = new THREE.Mesh( geometry, material );
//scene.add( mesh );

window.addEventListener( 'resize', onWindowResize );
animate();
// animation

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();

}

function render() {

  renderer.render( scene, camera );

}
