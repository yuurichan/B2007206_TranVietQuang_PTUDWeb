<script>
import AdminLayout from './layouts/admin-layout/AdminLayout.vue'
import CustomerLayout from './layouts/customer-layout/CustomerLayout.vue'

export default {
  components: {
    CustomerLayout,
    AdminLayout
  }
}
</script>

<template>
  <AdminLayout v-if="$route.fullPath.split('/')[1] === 'admin'" />
  <CustomerLayout v-else />
</template>
