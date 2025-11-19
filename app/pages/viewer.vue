<template>
  <div class="viewer-page">
    <header class="header">
      <h1>🏗️ Visualizador 3D de Modelos da Kempetro Engenharia</h1>
      <p>Explore modelos CAD em tempo real com Nuxt + TresJS</p>
    </header>
    
    <ModelViewer />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Visualizador 3D'
})
</script>

<style scoped>
.viewer-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #e69113 0%, #4b443b 100%);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.header p {
  margin: 5px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
}
</style>
