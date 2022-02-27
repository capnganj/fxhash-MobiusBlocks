//CAPNGANJ Stoner Sculptures fxhash generative token
//February, 2022

//imports
import { HashSmokeFeatures } from './hashSmokerFeatures';

import * as THREE from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


//new featuresClass
let feet = new HashSmokeFeatures();

//color drives palette
//depth drives number of recursive draw cloud layers
//cough drives initial circle radius size
//squint drives smallest circle radius size
//laugh drives how far the could spreads out from the center 

// FX Features
window.$fxhashFeatures = {
  "Depth" : feet.depth.tag,
  "Palette" : feet.color.name,
  "Cough" : feet.cough.tag,
  "Squint": feet.squint.tag,
  "Laugh" : feet.laugh.tag
};


//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 0, 10 );

// controls
let controls = new OrbitControls( camera, renderer.domElement );

const geometry = new ParametricGeometry( ParametricGeometries.klein, 100, 100 );
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
