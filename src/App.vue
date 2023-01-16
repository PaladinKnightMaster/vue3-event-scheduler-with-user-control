<script setup>
import { Nav, Alert } from '@/components';
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<template>
  <v-app class="app-container" :class="authStore.user && 'bg-light'">
    <Nav />
    <Alert />
    <div class="container pt-4 pb-4">
        <router-view />
    </div>
  </v-app>
</template>

<style>
@import '@/assets/base.css';
</style>