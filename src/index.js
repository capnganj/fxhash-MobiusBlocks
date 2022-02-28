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
  "B": feet.b.tag
};


//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
console.log("fxhash features", window.$fxhashFeatures);


//2) generate random data for the 3d scene or 2d drawing ONCE before drawing


//3) Initialize three.js scene and start the render loop
//all data driving geometry and materials and whatever else should be generated in step 2
let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 3, 3, 3 );

// controls
let controls = new OrbitControls( camera, renderer.domElement );

const geometry = new ParametricGeometry( ParametricGeometries.mobius3d, 100, 100);
const material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

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
