<template>
  <group ref="modelGroup">
    <primitive :object="model" />
  </group>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import * as THREE from 'three'

interface Props {
  modelPath: string
}

const props = withDefaults(defineProps<Props>(), {
  modelPath: '/models/sample-box.gltf'
})

const model = ref<THREE.Group | null>(null)

const loadModel = async (path: string) => {
  try {
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshPhongMaterial({ color: 0x667eea })
    const mesh = new THREE.Mesh(geometry, material)
    
    const group = new THREE.Group()
    group.add(mesh)
    
    model.value = group
    console.log('Modelo carregado com sucesso:', path)
  } catch (error) {
    console.error('Erro ao carregar modelo:', error)
  }
}

loadModel(props.modelPath)

watch(() => props.modelPath, (newPath: string) => {
  loadModel(newPath)
})
</script>
