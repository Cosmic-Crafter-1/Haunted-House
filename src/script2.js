import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import Stats from 'stats.js';

// Device detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// Initialize stats
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures with mobile optimization
 */
const textureLoader = new THREE.TextureLoader()
const loadTexture = (path) => {
    const texture = textureLoader.load(path)
    // Optimize texture settings
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
}

// Floor textures
const floorAlphaTexture = loadTexture('./floor/alpha.jpg')
const floorColorTexture = loadTexture('./floor/forest_leaves_03_1k/forest_leaves_03_diff_1k.webp')
const floorARMTexture = loadTexture('./floor/forest_leaves_03_1k/forest_leaves_03_arm_1k.webp')
const floorNormalTexture = loadTexture('./floor/forest_leaves_03_1k/forest_leaves_03_nor_gl_1k.webp')
const floorDisplacementTexture = loadTexture('./floor/forest_leaves_03_1k/forest_leaves_03_disp_1k.webp')

floorColorTexture.colorSpace = THREE.SRGBColorSpace
floorColorTexture.repeat.set(3, 3)
floorARMTexture.repeat.set(3, 3)
floorNormalTexture.repeat.set(3, 3)
floorDisplacementTexture.repeat.set(3, 3)

const setTextureWrapping = (texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
}

    ;[floorColorTexture, floorARMTexture, floorNormalTexture, floorDisplacementTexture].forEach(setTextureWrapping)

// Wall textures (same pattern for other textures)
const wallColorTexture = loadTexture('./wall/herringbone_pavement_03_1k/herringbone_pavement_03_diff_1k.webp')
const wallARMTexture = loadTexture('./wall/herringbone_pavement_03_1k/herringbone_pavement_03_arm_1k.webp')
const wallNormalTexture = loadTexture('./wall/herringbone_pavement_03_1k/herringbone_pavement_03_nor_gl_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Load other textures similarly...
// (Roof, Bush, Grave, Door textures would be loaded the same way)

/**
 * House
 */
// Floor with optimized geometry for mobile
const floorSegments = isMobile ? 10 : 30
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, floorSegments, floorSegments),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: isMobile ? 0.1 : 0.25,
        displacementBias: isMobile ? -0.05 : -0.15
    })
)

floor.rotation.x = -Math.PI * 0.5
floor.receiveShadow = true
scene.add(floor)

// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
    })
)
walls.position.y = 1.25
walls.castShadow = true
walls.receiveShadow = true
house.add(walls)

// Door with optimized geometry
const doorSegments = isMobile ? 20 : 100
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, doorSegments, doorSegments),
    new THREE.MeshStandardMaterial({
        transparent: true,
        // Add your door textures here
        displacementScale: isMobile ? 0.05 : 0.15,
    })
)
door.position.set(0, 1, 2)
house.add(door)

// Optimized number of graves for mobile
const graveCount = isMobile ? 15 : 30
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    // Add your grave textures here
})

for (let i = 0; i < graveCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, Math.random() * 0.4, z)
    grave.rotation.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
    )

    // Only let important graves cast shadows
    grave.castShadow = i % 3 === 0 // Every third grave casts shadows
    grave.receiveShadow = true

    graves.add(grave)
}

/**
 * Lights with optimization
 */
const ambientLight = new THREE.AmbientLight('#86cdff', isMobile ? 0.4 : 0.275)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#86cdff', isMobile ? 0.8 : 1)
directionalLight.position.set(3, 2, -8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = isMobile ? 128 : 256
directionalLight.shadow.mapSize.height = isMobile ? 128 : 256
directionalLight.shadow.camera.far = 15
scene.add(directionalLight)

// Optimized ghost lights
const createGhost = (color, intensity) => {
    const ghost = new THREE.PointLight(color, intensity, isMobile ? 7 : 15)
    ghost.castShadow = !isMobile // Disable shadow casting on mobile
    if (ghost.castShadow) {
        ghost.shadow.mapSize.width = 64
        ghost.shadow.mapSize.height = 64
        ghost.shadow.camera.far = 7
    }
    return ghost
}

const ghost1 = createGhost('#a3a3c2', isMobile ? 15 : 30)
const ghost2 = createGhost('red', isMobile ? 15 : 30)
const ghost3 = createGhost('#00ffcc', isMobile ? 10 : 20)

scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes with responsive handling
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-1, 6, 16)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer with optimization
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: "high-performance"
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap

/**
 * Fog with mobile optimization
 */
scene.fog = new THREE.FogExp2("#04343f", isMobile ? 0.05 : 0.1)

/**
 * Animation with performance monitoring
 */
const timer = new Timer()
let frameCount = 0
let lastTime = performance.now()
let fps = 60

const updateFPS = () => {
    frameCount++
    const currentTime = performance.now()
    const elapsed = currentTime - lastTime

    if (elapsed >= 1000) {
        fps = frameCount
        frameCount = 0
        lastTime = currentTime

        // Dynamic quality adjustment
        if (isMobile && fps < 30) {
            renderer.setPixelRatio(Math.max(renderer.getPixelRatio() - 0.1, 0.5))
        }
    }
}

const tick = () => {
    stats.begin()

    updateFPS()

    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghost animation with reduced complexity on mobile
    const ghost1Angle = elapsedTime * (isMobile ? 0.3 : 0.5)
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime) * 2

    const ghost2Angle = -elapsedTime * (isMobile ? 0.25 : 0.38)
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 1.5) * 2

    ghost3.position.x = Math.cos(ghost1Angle) * 8
    ghost3.position.z = Math.sin(ghost1Angle) * 8
    ghost3.position.y = Math.sin(elapsedTime) * 2.5

    controls.update()

    renderer.render(scene, camera)

    stats.end()

    window.requestAnimationFrame(tick)
}

tick()