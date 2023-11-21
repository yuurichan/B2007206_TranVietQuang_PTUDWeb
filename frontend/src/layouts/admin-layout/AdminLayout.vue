<template>
  <div class="wrapper">
    <AdminHeader />
    <div class="inner">
      <AdminSidebar />
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import AdminHeader from '@/components/AdminHeader.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { useUserStore } from '@/stores/user'
import { RouterView } from 'vue-router'

export default {
  name: 'AdminLayout',
  components: { RouterView, AdminHeader, AdminSidebar },
  data() {
    const userStore = useUserStore()
    return { userStore }
  },
  computed: {
    isAdmin() {
      return this.userStore.isAdmin()
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.inner {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow: auto;
}
</style>
