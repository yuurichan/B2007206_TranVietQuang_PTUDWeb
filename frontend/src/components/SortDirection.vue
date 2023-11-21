<template>
  <span>
    <i
      class="fa"
      :class="{
        'fa-angle-up': $props.direction === 1,
        'fa-angle-down': $props.direction === -1
      }"
    ></i>
  </span>
</template>

<script>
export default {
  name: 'SortDirection',
  props: {
    direction: {
      type: Number,
      required: true
    }
  }
}
</script>
