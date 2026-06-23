<script setup>
import Navbar from '@/components/layout/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main class="flex-1 pb-16 md:pb-0">
      <router-view />
    </main>
  </div>
</template>
