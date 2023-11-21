<template>
  <RouterLink :to="`/products/${$props.product.id}`" class="card" style="text-decoration: none">
    <img
      v-if="$props.product.images.length"
      :src="fileService.getFileUrl($props.product.images[0]?.path)"
      :alt="$props.product.ten"
      class="card-img-top"
      style="aspect-ratio: 1; object-fit: cover"
    />
    <div
      v-else
      class="card-img-top"
      style="aspect-ratio: 1; display: flex; justify-content: center; align-items: center"
    >
      <i class="fa fa-image fa-5x text-secondary"></i>
    </div>

    <div class="card-body">
      <h4 class="card-title">{{ $props.product.ten }}</h4>
      <span>{{ vndFormat($props.product.gia) }}</span>
    </div>
  </RouterLink>
</template>

<script>
import { RouterLink } from 'vue-router'
import fileService from '@/services/file.service'
import vndFormat from '@/utils/vndFormat'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: { RouterLink },
  data() {
    return {
      fileService
    }
  },
  methods: {
    vndFormat
  }
}
</script>
