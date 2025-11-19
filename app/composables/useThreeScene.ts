import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SCENE_CONFIG, LIGHT_CONFIG, CAMERA_CONFIG } from '~/constants/three'

export const useThreeScene = (canvas: Ref<HTMLCanvasElement | null>) => {
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let renderer: THREE.WebGLRenderer | null = null
  let controls: OrbitControls | null = null
  let gridHelper: THREE.GridHelper | null = null
  const clock = new THREE.Clock()

  const initScene = () => {
    if (!canvas.value) return

    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(SCENE_CONFIG.backgroundColor)

    // Camera
    camera = new THREE.PerspectiveCamera(
      CAMERA_CONFIG.fov,
      canvas.value.clientWidth / canvas.value.clientHeight,
      CAMERA_CONFIG.near,
      CAMERA_CONFIG.far
    )
    camera.position.set(...SCENE_CONFIG.cameraPosition)

    renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    })
    renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    setupLights()

    gridHelper = new THREE.GridHelper(SCENE_CONFIG.gridSize, SCENE_CONFIG.gridDivisions)
    scene.add(gridHelper)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = SCENE_CONFIG.autoRotate
    controls.autoRotateSpeed = SCENE_CONFIG.autoRotateSpeed
    controls.enableZoom = true
    controls.enablePan = true

    window.addEventListener('resize', handleResize)
  }

  const setupLights = () => {
    if (!scene) return
    
    const ambientLight = new THREE.AmbientLight(0xffffff, LIGHT_CONFIG.ambientIntensity)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, LIGHT_CONFIG.directionalIntensity)
    directionalLight.position.set(10, 10, 10)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, LIGHT_CONFIG.pointIntensity)
    pointLight.position.set(-10, 10, 5)
    scene.add(pointLight)
  }

  const handleResize = () => {
    if (!canvas.value || !camera || !renderer) return
    const width = canvas.value.clientWidth
    const height = canvas.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  const resetCamera = () => {
    if (!camera || !controls) return
    camera.position.set(...SCENE_CONFIG.cameraPosition)
    controls.target.set(0, 0, 0)
    controls.update()
  }

  const toggleGrid = (visible: boolean) => {
    if (gridHelper) {
      gridHelper.visible = visible
    }
  }

  const takeScreenshot = (): string => {
    if (!renderer || !scene || !camera) return ''
    renderer.render(scene, camera)
    return renderer.domElement.toDataURL('image/png')
  }

  const cleanup = () => {
    window.removeEventListener('resize', handleResize)
    if (renderer) {
      renderer.dispose()
    }
  }

  return {
    get scene() { return scene },
    get camera() { return camera },
    get renderer() { return renderer },
    get controls() { return controls },
    clock,
    initScene,
    resetCamera,
    toggleGrid,
    takeScreenshot,
    cleanup
  }
}
