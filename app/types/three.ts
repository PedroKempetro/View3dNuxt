export interface ModelInfo {
  fileName: string
  fileSize: string
  vertices: string
  faces: string
  dimensions: string
  materials: number
  scale: string
}

export interface SceneConfig {
  backgroundColor: number
  cameraPosition: [number, number, number]
  gridSize: number
  gridDivisions: number
  autoRotate: boolean
  autoRotateSpeed: number
}

export interface LightConfig {
  ambientIntensity: number
  directionalIntensity: number
  pointIntensity: number
}
