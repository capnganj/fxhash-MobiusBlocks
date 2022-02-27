//CAPNGANJ Hash Smoke fxhash generative token
//February, 2022

//imports
import { HashSmokeFeatures } from './hashSmokerFeatures';


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

// this code writes the values to the DOM as an example
const container = document.createElement("div")
container.innerText = `
  random hash: ${fxhash}\n
  some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]\n
`
document.body.prepend(container)
