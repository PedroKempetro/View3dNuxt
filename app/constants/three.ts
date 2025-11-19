import type { SceneConfig, LightConfig } from '~/types/three'

export const SCENE_CONFIG: SceneConfig = {
  backgroundColor: 0xf0f0f0,
  cameraPosition: [0, 5, 10],
  gridSize: 20,
  gridDivisions: 20,
  autoRotate: true,
  autoRotateSpeed: 5
}

export const LIGHT_CONFIG: LightConfig = {
  ambientIntensity: 0.8,
  directionalIntensity: 1,
  pointIntensity: 0.5
}

export const CAMERA_CONFIG = {
  fov: 75,
  near: 0.1,
  far: 1000
}

export const MODEL_CONFIG = {
  defaultScale: 10,
  acceptedFormats: ['.glb', '.gltf'],
  acceptedMimeTypes: 'model/gltf-binary,model/gltf+json'
}

export const UI_COLORS = {
  primary: '#ff6b00',
  primaryHover: '#ff8534',
  dark: '#1a1a1a',
  light: '#ffffff',
  gray: '#f0f0f0'
}
