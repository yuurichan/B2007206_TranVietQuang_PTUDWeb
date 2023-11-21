<template>
  <div class="container py-4" v-if="invoice">
    <div class="card border-danger shadow shadow-sm" style="max-width: 480px; margin: 0 auto">
      <div class="card-header">Cảnh báo</div>
      <div class="card-body">
        <h5 class="card-title">
          Xóa đơn hàng #<span style="font-weight: bold">{{ invoice.id }}</span>
        </h5>
        <p class="card-text">Bạn có chắc chắn muốn xóa đơn hàng này không</p>

        <button class="btn btn-danger" @click="handleDelete">
          <span> Xác nhận xóa </span>
        </button>

        <RouterLink to="/admin/invoices" class="btn">Quay lại</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import dathangService from '@/services/dathang.service'
import { ref } from 'vue'

export default {
  name: 'AdminDeleteinvoice',
  data() {
    const invoice = ref(null)

    return { invoice }
  },
  methods: {
    async handleDelete() {
      try {
        await dathangService.deleteById(this.$route.params.id)

        this.$toast.info('Xóa đơn hàng thành công')
        this.$router.back()
      } catch (error) {
        this.$toast.error(error.message)
      }
    }
  },
  async beforeMount() {
    this.invoice = await (await dathangService.getDetail(this.$route.params.id)).data
    console.log(this.invoice)
  }
}
</script>
