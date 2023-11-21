<template>
  <nav>
    <button class="btn">ADMIN CP</button>
    <RouterLink to="/" class="btn btn-secondary">
      <i class="fa fa-globe"></i>
      Xem trang web
    </RouterLink>
  </nav>
</template>

<script>
export default {
  name: 'AdminHeader'
}
</script>

<style scoped>
nav {
  padding: 5px 20px;
  border-bottom: 1px solid #ddd;
  background: #fdfdfd;
}
</style>
