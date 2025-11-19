<template>
  <div class="home-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <span class="logo-icon">🏗️</span>
          <span class="logo-text">KEMPETRO</span>
        </div>
        <ul class="nav-menu">
          <li><a href="#home" class="nav-link active">Home</a></li>
          <li><a href="#tecnologias" class="nav-link">Tecnologias</a></li>
          <li><NuxtLink to="/viewer" class="nav-link btn-viewer">Visualizador 3D</NuxtLink></li>
        </ul>
      </div>
    </nav>

    <section id="home" class="hero">
      <div class="hero-container">
        <h1 class="hero-title">
          Visualizador 3D da <br>
          <span class="highlight">Kempetro Engenharia</span>
        </h1>
        <p class="hero-subtitle">
          Explore modelos CAD em tempo real com tecnologia de ponta
        </p>
        <div class="hero-actions">
          <NuxtLink to="/viewer" class="btn btn-primary">
            <span>Acessar Visualizador</span>
            <span class="arrow">→</span>
          </NuxtLink>
          <a href="#tecnologias" class="btn btn-secondary">Saiba Mais</a>
        </div>
      </div>
    </section>

    <section id="tecnologias" class="section-tech">
      <div class="container">
        <h2 class="section-title">Stack Tecnológico</h2>
        <div class="tech-grid">
          <div class="tech-card">
            <div class="tech-logo">N</div>
            <h4>Nuxt 3</h4>
            <p>Framework Vue.js com SSR</p>
          </div>
          <div class="tech-card">
            <div class="tech-logo">3D</div>
            <h4>Three.js</h4>
            <p>Biblioteca 3D WebGL</p>
          </div>
          <div class="tech-card">
            <div class="tech-logo">TS</div>
            <h4>TypeScript</h4>
            <p>Tipagem estática</p>
          </div>
          <div class="tech-card">
            <div class="tech-logo">⚡</div>
            <h4>Vite</h4>
            <p>Build tool ultrarrápido</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>© 2025 Kempetro Engenharia - POC Nuxt.js 3D Viewer</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Kempetro - Visualizador 3D de Engenharia'
})
</script>

<style scoped src="~/assets/css/home.css"></style>
