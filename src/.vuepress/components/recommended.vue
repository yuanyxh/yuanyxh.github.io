<template>
  <div class="recommended-container">
    <template v-for="item in pages" :key="item.key">
      <a class="note" :href="item.path" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
      <br />
    </template>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, defineProps } from 'vue';
import { usePagesData } from '@vuepress/client';
// @ts-ignore
import { formatTime } from '../utils/index.ts';

const pages = ref([] as { path: string, title: string }[]);

const props = defineProps({
  prefix: String
})

function getPagesData() {
  const data = usePagesData();

  const pages_promise = [];
  for (const key in data.value) {
    // @ts-ignore
    pages_promise.push((data.value[key] as Function)());
  }

  Promise.all(pages_promise)
    .then(res => {
      // @ts-ignore
      const list = res.filter(item => item.path.startsWith(props.prefix))
        // @ts-ignore
        .map(item => ({ ...item, frontmatter: { ...item.frontmatter, date: formatTime(item.frontmatter.date) }}));

      // @ts-ignore
      pages.value = list.sort((a, b) => b.frontmatter.date - a.frontmatter.date).slice(0, 3) as {
        path: string,
        title: string
      }[];
  });
}

getPagesData();
</script>

<style lang="scss">
.recommended-container {
  margin-top: 15px;
  margin-left: 15px;
  width: 100%;

  .note {
    line-height: 1.4em;
  }
}
</style>
