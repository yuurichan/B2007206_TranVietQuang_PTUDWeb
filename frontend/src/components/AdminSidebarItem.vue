<template>
  <RouterLink :to="$props.path" class="item">
    <i :class="$props.icon"></i>
    <span :class="{ show: $props.showTitle }">{{ $props.title }}</span>
  </RouterLink>
</template>

<script>
export default {
  name: 'AdminSidebarItem',
  props: {
    title: String,
    icon: String,
    path: String,
    showTitle: Boolean
  }
}
</script>

<style scoped>
.item {
  display: flex;
  color: #fff;
  text-decoration: none;
  gap: 15px;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #555;
  height: 64px;
}

.item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  transition: 0.6s ease;
}

.item span.show {
  opacity: 1;
}
</style>
