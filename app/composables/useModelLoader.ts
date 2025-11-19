import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { ModelInfo } from '~/types/three'
import { MODEL_CONFIG } from '~/constants/three'

export const useModelLoader = (getScene: () => THREE.Scene | null) => {
  let currentModel: THREE.Group | null = null
  let mixer: THREE.AnimationMixer | null = null
  let currentAction: THREE.AnimationAction | null = null

  const modelInfo = ref<ModelInfo | null>(null)
  const animations = ref<any[]>([])
  const isPlaying = ref(false)

  const loadModel = async (url: string, fileSize?: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const scene = getScene()
      if (!scene) {
        reject(new Error('Scene não inicializada'))
        return
      }

      // Remove old model
      if (currentModel) {
        scene.remove(currentModel)
      }
      if (mixer) {
        mixer.stopAllAction()
        mixer = null
      }
      animations.value = []
      isPlaying.value = false

      const loader = new GLTFLoader()

      loader.load(
        url,
        (gltf) => {
          currentModel = gltf.scene

          if (gltf.animations && gltf.animations.length > 0) {
            animations.value = gltf.animations
            mixer = new THREE.AnimationMixer(currentModel!)
          }

          // Center and scale model
          const box = new THREE.Box3().setFromObject(currentModel!)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          
          currentModel!.position.x = -center.x
          currentModel!.position.z = -center.z
          currentModel!.position.y = -box.min.y  

          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = MODEL_CONFIG.defaultScale / maxDim
          currentModel!.scale.multiplyScalar(scale)

          scene.add(currentModel!)

          calculateModelInfo(gltf, size, scale, url, fileSize)

          resolve()
        },
        (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          console.log(`📊 Carregando... ${percent}%`)
        },
        (error) => {
          console.error('❌ Erro ao carregar modelo:', error)
          reject(error)
        }
      )
    })
  }

  const calculateModelInfo = (
    gltf: any,
    size: THREE.Vector3,
    scale: number,
    url: string,
    fileSize?: number
  ) => {
    let vertices = 0
    let faces = 0
    const materials = new Set()

    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.geometry) {
          const positions = child.geometry.attributes.position
          if (positions) vertices += positions.count
          if (child.geometry.index) faces += child.geometry.index.count / 3
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: any) => materials.add(mat.name || 'Material'))
          } else {
            materials.add(child.material.name || 'Material')
          }
        }
      }
    })

    const fileName = url.split('/').pop() || 'Desconhecido'

    modelInfo.value = {
      fileName,
      fileSize: fileSize ? formatFileSize(fileSize) : 'N/A',
      vertices: vertices.toLocaleString('pt-BR'),
      faces: Math.floor(faces).toLocaleString('pt-BR'),
      dimensions: `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`,
      materials: materials.size,
      scale: `1:${(1 / scale).toFixed(2)}`
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const toggleWireframe = (enabled: boolean) => {
    if (currentModel) {
      currentModel.traverse((child: any) => {
        if (child.isMesh) {
          child.material.wireframe = enabled
        }
      })
    }
  }

  const updateMixer = (delta: number) => {
    if (mixer) {
      mixer.update(delta)
    }
  }

  const playAnimation = (index: number) => {
    if (!mixer || !animations.value[index]) return

    if (currentAction) {
      currentAction.stop()
    }

    currentAction = mixer.clipAction(animations.value[index])
    currentAction.play()
    isPlaying.value = true
  }

  const toggleAnimation = () => {
    if (!currentAction) return

    if (isPlaying.value) {
      currentAction.paused = true
      isPlaying.value = false
    } else {
      currentAction.paused = false
      isPlaying.value = true
    }
  }

  const stopAnimation = () => {
    if (currentAction) {
      currentAction.stop()
      isPlaying.value = false
    }
  }

  return {
    modelInfo,
    animations,
    isPlaying,
    loadModel,
    toggleWireframe,
    updateMixer,
    playAnimation,
    toggleAnimation,
    stopAnimation
  }
}
