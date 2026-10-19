<template>
  <main class="study-page">
    <h1>Vue 学习页面</h1>
    <p>这是通过 Vue Router 打开的新页面。</p>
    <p>当前学习章节：{{ props.chapter }}</p>
    <RouterLink :to="{ name: 'home' }">返回首页</RouterLink>
  </main>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    chapter?: string
  }>(),
  {
    chapter: 'basics',
  },
)
</script>
<style scoped>
.study-page {
  min-height: 100vh;
  padding: 40px;
}
</style>
