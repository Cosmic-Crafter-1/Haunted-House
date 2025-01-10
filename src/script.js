import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import Stats from 'stats.js';

// Initialize stats
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

/**
 * Base
 */
// Debug
const gui = new GUI()

// AxesHelper
// const axesHelper = new THREE.AxesHelper(3);
// scene.add(axesHelper);


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Alpha
// Don't write static because it's implicit for vite.
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')

const floorColorTexture = textureLoader.load('./floor/forest_leaves_03_1k/forest_leaves_03_diff_1k.webp')
const floorARMTexture = textureLoader.load('./floor/forest_leaves_03_1k/forest_leaves_03_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./floor/forest_leaves_03_1k/forest_leaves_03_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./floor/forest_leaves_03_1k/forest_leaves_03_disp_1k.webp')

// const floorColorTexture = textureLoader.load('./floor/snow_02_1k/snow_02_diff_1k.jpg')
// const floorARMTexture = textureLoader.load('./floor/snow_02_1k/snow_02_arm_1k.jpg')
// const floorNormalTexture = textureLoader.load('./floor/snow_02_1k/snow_02_nor_gl_1k.jpg')
// const floorDisplacementTexture = textureLoader.load('./floor/snow_02_1k/snow_02_disp_1k.jpg')


// Only for color texture, it's encoded in SRGB, so you need to inform Three-chan to use it properly.
floorColorTexture.colorSpace = THREE.SRGBColorSpace

// This is really cool !!
// Make sure to read this.

// This makes it so that your big texture is made small and then repeated many times. 
// Bcz with just one big texture, it's not that detailed, but if you repeat it many times while reduing size significantly, it would seem that it's volume has significantly bumped up.
// See 1:19:00 in Bruno's video for the same, would make sense instantly.
floorColorTexture.repeat.set(3, 3);
floorARMTexture.repeat.set(3, 3);
floorNormalTexture.repeat.set(3, 3);
floorDisplacementTexture.repeat.set(3, 3);


floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping


floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping


// Wall
const wallColorTexture = textureLoader.load('./wall/herringbone_pavement_03_1k/herringbone_pavement_03_diff_1k.webp')
const wallARMTexture = textureLoader.load('./wall/herringbone_pavement_03_1k/herringbone_pavement_03_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./wall/herringbone_pavement_03_1k/herringbone_pavement_03_nor_gl_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// wallColorTexture.repeat.set(3, 3)
// wallARMTexture.repeat.set(3, 3)
// wallNormalTexture.repeat.set(3, 3)

// wallColorTexture.wrapS = THREE.RepeatWrapping
// wallARMTexture.wrapS = THREE.RepeatWrapping
// wallNormalTexture.wrapS = THREE.RepeatWrapping

// wallColorTexture.wrapT = THREE.RepeatWrapping
// wallARMTexture.wrapT = THREE.RepeatWrapping
// wallNormalTexture.wrapT = THREE.RepeatWrapping

// Roof
const roofColorTexture = textureLoader.load('./roof/clay_roof_tiles_02_1k/clay_roof_tiles_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./roof/clay_roof_tiles_02_1k/clay_roof_tiles_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./roof/clay_roof_tiles_02_1k/clay_roof_tiles_02_nor_gl_1k.webp')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

// Repeat 5 times horizontally, 1 times vertically
roofColorTexture.repeat.set(5, 1)
roofARMTexture.repeat.set(5, 1)
roofNormalTexture.repeat.set(5, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// roofColorTexture.wrapT = THREE.RepeatWrapping
// roofARMTexture.wrapT = THREE.RepeatWrapping
// roofNormalTexture.wrapT = THREE.RepeatWrapping

// Bush
const bushColorTexture = textureLoader.load('./bush/leafy_grass_1k/leafy_grass_diff_1k.webp')
const bushARMTexture = textureLoader.load('./bush/leafy_grass_1k/leafy_grass_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./bush/leafy_grass_1k/leafy_grass_nor_gl_1k.webp')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

// bushColorTexture.repeat.set(3, 1);
// bushARMTexture.repeat.set(3, 1);
// bushNormalTexture.repeat.set(3, 1);

// bushColorTexture.wrapS = THREE.RepeatWrapping
// bushARMTexture.wrapS = THREE.RepeatWrapping
// bushNormalTexture.wrapS = THREE.RepeatWrapping

// bushColorTexture.wrapT = THREE.RepeatWrapping
// bushARMTexture.wrapT = THREE.RepeatWrapping
// bushNormalTexture.wrapT = THREE.RepeatWrapping



// Grave
const graveColorTexture = textureLoader.load('./grave/patterned_cobblestone_1k/patterned_cobblestone_diff_1k.webp')
const graveARMTexture = textureLoader.load('./grave/patterned_cobblestone_1k/patterned_cobblestone_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./grave/patterned_cobblestone_1k/patterned_cobblestone_nor_gl_1k.webp')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

// graveColorTexture.repeat.set(0.3, 0.4);
// graveARMTexture.repeat.set(0.3, 0.4);
// graveNormalTexture.repeat.set(0.3, 0.4);


// Door
const doorColorTexture = textureLoader.load('./door/color.webp')
const doorAlphaTexture = textureLoader.load('./door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('./door/height.webp')
const doorNormalTexture = textureLoader.load('./door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace


/**
 * House
 */

// You can accesss these properties using floor.material
// The height and width segments are initially 1,1 and we made it 100,100
// This is because the displacement map will actually make the vertices go up and down, and because is only 1 vertex on each corner (4 sides of square = 4 corners / vertices). 
// So making it to 100, will create like 100 * 100 mini-squares inside the big square and then the displacement map can use each vertex properly.

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 30, 30),
    new THREE.MeshStandardMaterial({
        // wireframe: true,
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        // Check the 2 via lil-gui
        displacementScale: 0.25,
        displacementBias: -0.15
    })
)

floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// floor.material.wireframe = true

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')


// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        // wireframe: true,
        color: '#ffcc00',
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
    })
)
walls.position.y += 1.25
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        // wireframe: true,
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.position.y = 2.5 + 0.75
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door 
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100), // Geometry definition
    new THREE.MeshStandardMaterial({
        alphaMap: doorAlphaTexture,
        transparent: true,
        map: doorColorTexture,
        aoMap: doorAmbientOcclusionTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: 0.04
    })
)

door.position.y = 1
door.position.z = 1.9 + 0.01

house.add(door)


// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: '#8fff8f',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)


house.add(bush1, bush2, bush3, bush4)

// Graves

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
})

for (let i = 0; i < 30; i++) {

    const angle = Math.random() * Math.PI * 2
    // Values btw 3-7
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z

    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    graves.add(grave)
}


/**
 * Lights
 */


// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door Light
const doorLight = new THREE.PointLight('gold', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#a3a3c2', 30);
const ghost2 = new THREE.PointLight('red', 30);
const ghost3 = new THREE.PointLight('#00ffcc', 20);

scene.add(ghost1, ghost2, ghost3)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -1
camera.position.y = 6
camera.position.z = 16
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and receive

/**
 * 
    When you set castShadow = true on a light, you're essentially saying:

    This light should be considered for shadow calculations
    Calculate shadow maps from this light's perspective
    For any object this light hits:

    If the object has castShadow = true, use it to create shadows
    If the object has receiveShadow = true, show shadows on it
*/

directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true

roof.castShadow = true
floor.receiveShadow = true

console.log(graves)

// Lotta things inside graves, so use .children to access all the graves
for (let grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
 */

const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)


/**
 * Fog
 */

scene.fog = new THREE.FogExp2("#04343f", 0.1)



/**
 * Animate
 */
const timer = new Timer()

const tick = () => {

    // Start measuring
    stats.begin();

    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghost
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle) * 1.34 * Math.sin(ghost1Angle) * 2.45

    const ghost2Angle = - elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle) * 1.34 * Math.sin(ghost2Angle) * 2.45

    ghost3.position.x = - Math.cos(ghost1Angle) * 8
    ghost3.position.z = - Math.cos(ghost1Angle) * 8
    ghost3.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle) * 1.34 * Math.sin(ghost2Angle) * 2.45


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // End measuring
    stats.end();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()