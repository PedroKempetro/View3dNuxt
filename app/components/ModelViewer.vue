<template>
  <div class="model-viewer-container">
    <canvas ref="canvasRef" class="canvas-wrapper"></canvas>

    <!-- Painel de controles -->
    <div class="controls-panel">
      <h3>⚙️ Controles</h3>
      
      <!-- Upload de Modelo -->
      <div class="control-group">
        <label>📤 Upload de Modelo:</label>
        <input 
          type="file" 
          accept=".glb,.gltf" 
          @change="handleFileUploadEvent"
          class="file-input"
        />
      </div>

      <!-- Seletor de Modelo -->
      <div class="control-group">
        <label>Ou selecione um modelo:</label>
        <select v-model="modelPath" @change="onModelChange">
          <option value="/models/cad.glb">Modelo CAD 1</option>
          <option value="/models/cad2.glb">Modelo CAD 2 (Casa Rosa)</option>
          <option value="/models/sample-box.gltf">Modelo de Exemplo (Box)</option>
        </select>
      </div>

      <!-- Informações do Modelo -->
      <div class="info-section" v-if="modelLoader.modelInfo.value">
        <h4>📊 Informações do Modelo</h4>
        <div class="info-item">
          <span class="label">Arquivo:</span>
          <span class="value">{{ modelLoader.modelInfo.value.fileName }}</span>
        </div>
        <div class="info-item">
          <span class="label">Tamanho:</span>
          <span class="value">{{ modelLoader.modelInfo.value.fileSize }}</span>
        </div>
        <div class="info-item">
          <span class="label">Vértices:</span>
          <span class="value">{{ modelLoader.modelInfo.value.vertices }}</span>
        </div>
        <div class="info-item">
          <span class="label">Faces:</span>
          <span class="value">{{ modelLoader.modelInfo.value.faces }}</span>
        </div>
        <div class="info-item">
          <span class="label">Dimensões:</span>
          <span class="value">{{ modelLoader.modelInfo.value.dimensions }}</span>
        </div>
        <div class="info-item">
          <span class="label">Materiais:</span>
          <span class="value">{{ modelLoader.modelInfo.value.materials }}</span>
        </div>
      </div>

      <!-- Controles de Visualização -->
      <div class="control-group">
        <h4>🎨 Visualização</h4>
        <button @click="handleResetCamera" class="btn-control">🔄 Resetar Câmera</button>
        <button @click="handleToggleWireframe" class="btn-control">
          {{ showWireframe ? '🔲 Modo Sólido' : '🔳 Wireframe' }}
        </button>
        <button @click="handleToggleGrid" class="btn-control">
          {{ showGrid ? '❌ Ocultar Grid' : '✅ Mostrar Grid' }}
        </button>
      </div>

      <!-- Screenshot -->
      <div class="control-group">
        <h4>📸 Captura</h4>
        <button @click="handleTakeScreenshot" class="btn-control btn-screenshot">
          📷 Tirar Screenshot
        </button>
      </div>

      <div class="control-group" v-if="modelLoader.modelInfo.value">
        <h4>📏 Medições</h4>
        <div class="info-item">
          <span class="label">Escala:</span>
          <span class="value">{{ modelLoader.modelInfo.value.scale }}</span>
        </div>
      </div>

      <div class="control-group" v-if="modelLoader.animations.value.length > 0">
        <h4>🎬 Animações</h4>
        <select v-model="selectedAnimation" @change="handlePlayAnimation" class="animation-select">
          <option value="">Selecione uma animação</option>
          <option v-for="(anim, index) in modelLoader.animations.value" :key="index" :value="index">
            {{ anim.name || `Animação ${index + 1}` }}
          </option>
        </select>
        <div class="animation-controls">
          <button @click="handleToggleAnimation" class="btn-control btn-small">
            {{ modelLoader.isPlaying.value ? '⏸️ Pausar' : '▶️ Play' }}
          </button>
          <button @click="handleStopAnimation" class="btn-control btn-small">⏹️ Stop</button>
        </div>
      </div>

      <div class="info-text">
        <p>💡 Dica: Use o mouse para rotacionar, scroll para zoom</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
const modelPath = ref('/models/cad.glb')
const showWireframe = ref(false)
const showGrid = ref(true)
const selectedAnimation = ref('')

const threeScene = useThreeScene(canvasRef)
const modelLoader = useModelLoader(() => threeScene.scene)
const fileUpload = useFileUpload()

const startAnimationLoop = () => {
  const animate = () => {
    requestAnimationFrame(animate)
    
    const delta = threeScene.clock.getDelta()
    modelLoader.updateMixer(delta)
    
    if (threeScene.controls && threeScene.renderer && threeScene.scene && threeScene.camera) {
      threeScene.controls.update()
      threeScene.renderer.render(threeScene.scene, threeScene.camera)
    }
  }
  animate()
}

const loadInitialModel = async () => {
  try {
    await modelLoader.loadModel(modelPath.value)
  } catch (error) {
    console.error('Erro ao carregar modelo inicial:', error)
  }
}

const handleFileUploadEvent = (event: Event) => {
  fileUpload.handleFileUpload(event, async (url, fileSize) => {
    try {
      await modelLoader.loadModel(url, fileSize)
    } catch (error) {
      console.error('Erro ao carregar arquivo:', error)
    }
  })
}

const onModelChange = async () => {
  try {
    await modelLoader.loadModel(modelPath.value)
  } catch (error) {
    console.error('Erro ao trocar modelo:', error)
  }
}

const handleResetCamera = () => {
  threeScene.resetCamera()
}

const handleToggleWireframe = () => {
  showWireframe.value = !showWireframe.value
  modelLoader.toggleWireframe(showWireframe.value)
}

const handleToggleGrid = () => {
  showGrid.value = !showGrid.value
  threeScene.toggleGrid(showGrid.value)
}

const handleTakeScreenshot = () => {
  const dataURL = threeScene.takeScreenshot()
  const link = document.createElement('a')
  link.download = `screenshot-${Date.now()}.png`
  link.href = dataURL
  link.click()
  console.log('📸 Screenshot salvo!')
}

const handlePlayAnimation = () => {
  if (selectedAnimation.value === '') return
  const index = parseInt(selectedAnimation.value)
  modelLoader.playAnimation(index)
}

const handleToggleAnimation = () => {
  modelLoader.toggleAnimation()
}

const handleStopAnimation = () => {
  modelLoader.stopAnimation()
}

onMounted(() => {
  threeScene.initScene()
  startAnimationLoop()
  loadInitialModel()
})

onUnmounted(() => {
  threeScene.cleanup()
})
</script>

<style scoped src="~/assets/css/ModelViewer.css"></style>
