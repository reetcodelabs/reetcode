<template>
  <h1>Hello {{ msg }}</h1>
</template>

<script setup lang="ts">
import { ref } from "vue";
const msg = ref<string>("world");
</script>
