<template>
  <div>
    <AppHeader />

    <div class="bg-light">
      <RouterView />
    </div>

    <footer id="footer" class="py-3 bg-dark position-relative start-0 end-0 bottom-0">
      <div class="container">
        <p class="m-0 text-center text-white">
          Copyright &copy; Your Website {{ new Date().getFullYear() }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import { RouterView } from 'vue-router'

export default {
  name: 'CustomerLayout',
  components: {
    AppHeader,
    RouterView
  }
}
</script>
