<template>
  <div class="image-container">
    <img
      class="image"
      :style="{ width: width, height: height }"
      :src="url"
      :alt="alt"
    />
    <p class="copyright" v-if="copyright">图片来源于网络</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  width: {
    type: [Number, String]
  },
  height: {
    type: [Number, String]
  },
  copyright: Boolean
});
</script>

<style lang="scss">
.image-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;

  .image {
    object-fit: cover;
  }

  .copyright {
    margin-top: 8px;
    line-height: 1;
    color: #8cc4fc;
  }
}
</style>
