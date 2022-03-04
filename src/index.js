//CAPNGANJ Stoner Sculptures fxhash generative token
//February, 2022

//imports
import { StonerSculpturesFeatures } from './StonerSculpturesFeatures';

import * as THREE from 'three';
import { ParametricGeometry } from './ParametricGeometry';
import { ParametricGeometries } from './ParametricGeometries';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

//1) - generate fxhash features - global driving parameters
//new featuresClass
let feet = new StonerSculpturesFeatures();
window.$fxhashData = feet;

// FX Features
window.$fxhashFeatures = {
  "Palette" : feet.color.name,
  "Size" : feet.major.tag,
  "Thickness" : feet.a.tag,
  "Height": feet.b.tag,
  "Shuffle": feet.shuffle.tag,
  "Box Size": feet.boxSize.tag,
  "Density": feet.density.tag
};


//from fxhash webpack boilerplate
// these are the variables you can use as inputs to your algorithms
//console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()
//console.log("fxhash features", window.$fxhashFeatures);


//2) Initialize three.js scene and start the render loop
//all data driving geometry and materials and whatever else should be generated in step 2

//scene & camera
let scene = new THREE.Scene();

let renderer = new THREE.WebGLRenderer( { 
  antialias: true,
  alpha: true 
} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set( 3.5, 3.5, 3.5 );

//lights
const p1 = new THREE.PointLight( 0xcccccc, 1);
p1.position.set( 5, 5, 5);
scene.add(p1);
const p2 = new THREE.PointLight( 0xcccccc, 1);
p2.position.set( -5, -3, -5);
scene.add(p2);
const hem = new THREE.HemisphereLight( 0xcccccc, 0xdedede, 0.666);
scene.add(hem);
//const amb = new THREE.AmbientLight(0xdedede, 1);
//scene.add(amb);

// controls
let controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping=true;
controls.dampingFactor = 0.2;
controls.autoRotate= true;
controls.maxDistance = 9;
controls.minDistance = 1;
//parametric geometry provides points for boxes
const geometry = new ParametricGeometry( ParametricGeometries.mobius3d,feet.density.value2, feet.density.value1 );
geometry.rotateY(0.25);
geometry.computeBoundingBox();

//placeholder material for testing
//const material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});

//array of mesh phong materials
let materials = [];
let colors = [];
for (let i = 0; i < 1; i+=0.01) {
  const d3RgbColor = feet.interpolateFn(i);
  colors.push(d3RgbColor);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(d3RgbColor.r/255, d3RgbColor.g/255, d3RgbColor.b/255),
    roughness: 0
  });
  materials.push(mat);
}
//console.log(materials);

//box geometry to hang on points
const boxer = new THREE.BoxGeometry(feet.boxSize.value, feet.boxSize.value, feet.boxSize.value);

const matt = new THREE.MeshStandardMaterial({roughness: 0});

//instanced mesh is used for drawing in the sketch -- way faster!
const iMesh = new THREE.InstancedMesh(boxer, matt, geometry.attributes.position.length/3);
scene.add(iMesh);

//this scene is used for export
const exportScene = new THREE.Scene();

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
  //this is the material/color index
  let mi = Math.round(k)
  if(mi > materials.length-1){
    mi = materials.length-1;
  }
  if(mi < 0 ){
    mi = 0;
  }

  //instead of making a new mesh, set the color and matrix of the ith meshInstance

  const obj = new THREE.Mesh( boxer, materials[mi]);
  obj.position.x =  geometry.attributes.position.array[i];
  obj.position.y =  geometry.attributes.position.array[i+1];
  obj.position.z =  geometry.attributes.position.array[i+2];

  obj.rotation.x = geometry.attributes.position.array[i] * feet.rotation.value;
  obj.rotation.y = geometry.attributes.position.array[i+1] * feet.rotation.value;
  obj.rotation.z = geometry.attributes.position.array[i+2] * feet.rotation.value;
  exportScene.add(obj);

  const matrix = new THREE.Matrix4();
  matrix.makeRotationFromEuler(obj.rotation);
  matrix.setPosition(obj.position);
 

  iMesh.setColorAt(i/3, new THREE.Color(colors[mi].r/255, colors[mi].g/255, colors[mi].b/255));
  iMesh.setMatrixAt(i/3, matrix);
}
iMesh.instanceMatrix.needsUpdate = true;

//set the background colors 
let bod = document.body;
const rot = feet.map(fxrand(),0,1,-30,30).toString();
const start = Math.round(feet.map(fxrand(),0,1,30,40));
const stop = Math.round(feet.map(fxrand(),0,1,60,70));
bod.style.backgroundImage = 'linear-gradient(' + rot + 'deg,' + feet.invertColor(colors[start]) + ',' + feet.invertColor(colors[stop]) + ')' 

//set up resize listener and let it rip!
window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'keyup', downloadGlb, false);
animate();

//download glb stuff
function downloadGlb(event){
  const key = event.which;
  if(key == 71){
    // Instantiate a exporter
    const exporter = new GLTFExporter();

    // Parse the input and generate the glTF output
    exporter.parse(
      exportScene,
      // called when the gltf has been generated
      function ( gltf ) {

        //console.log( gltf );
        //downloadJSON( gltf );
        saveArrayBuffer(gltf, fxhash.toString()+'.glb');

      },
      // called when there is an error in the generation
      function ( error ) {

        console.log( 'An error happened' );

      },
      { binary: true}
    );
  }

}

const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

			function save( blob, filename ) {

				link.href = URL.createObjectURL( blob );
				link.download = filename;
				link.click();

				// URL.revokeObjectURL( url ); breaks Firefox...

			}
			function saveArrayBuffer( buffer, filename ) {

				save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

			}

// threejs animation stuff
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
