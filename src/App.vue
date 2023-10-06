<template>
  <div id="app">
    <h1>Hello Vue 2 App</h1>
  </div>
</template>

<script>
import { executeAllTests } from './allTests';

export default {
  created() {
    executeAllTests();
  },
};
</script>