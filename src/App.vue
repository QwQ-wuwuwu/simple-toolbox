<script setup>
import { ref, watchEffect } from 'vue'
import { provide } from 'vue'

const eyeCare = ref(localStorage.getItem('eye-care') === 'true')

function toggleEyeCare() {
  eyeCare.value = !eyeCare.value
  localStorage.setItem('eye-care', eyeCare.value)
}

watchEffect(() => {
  document.documentElement.classList.toggle('eye-care', eyeCare.value)
})

provide('eyeCare', { eyeCare, toggleEyeCare })
</script>

<template>
  <router-view />
</template>
