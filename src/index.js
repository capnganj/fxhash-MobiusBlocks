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

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
camera.position.z = 10;

const scene = new THREE.Scene();

const geometry = new ParametricGeometry( ParametricGeometries.mobius3d, 100, 100 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// animation

function animation( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}
