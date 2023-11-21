<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="confirmOrder"
    tabindex="-1"
    aria-labelledby="confirmOrderLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmOrderLabel">Xác nhận đơn hàng</h5>
        </div>
        <div class="modal-body">
          <p>Đơn hàng của bạn bên dưới sẽ được lưu, vui lòng xác nhận:</p>
          <ul v-if="hhMap && chitietsProp" v-auto-animate>
            <li v-for="chitiet in chitietsProp">
              <div>
                <span style="font-weight: bold">{{ hhMap.get(chitiet.id)?.ten }}: </span>
                <span
                  >{{ vndFormat(hhMap.get(chitiet.id)?.gia) }} x {{ chitiet?.soluong }} =
                  {{ vndFormat(hhMap.get(chitiet.id)?.gia * chitiet?.soluong) }}</span
                >
              </div>
            </li>
          </ul>
          <p>
            Tổng cộng thành tiền: <span style="font-weight: bold">{{ vndFormat(getTotal()) }}</span>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy Bỏ</button>
          <button @click="placeOrder" type="button" class="btn btn-primary">Xác nhận</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vndFormat from '@/utils/vndFormat'
import { ref } from 'vue'
import dathangService from '@/services/dathang.service'
import { useCartStore } from '@/stores/cart'
const cartStore = useCartStore()
export default {
  name: 'ConfirmModal',
  props: {
    chitietsProp: Object,
    hhMap: Object
  },
  methods: {
    vndFormat,
    getTotal() {
      if (!this.chitietsProp || !this.hhMap || this.hhMap.size == 0) return 0
      let total = 0
      for (const chitiet of this.chitietsProp) {
        const hh = this.hhMap.get(chitiet.id)
        total += hh.gia * chitiet.soluong
      }
      return total
    },
    async placeOrder() {
      try {
        if (!this.chitietsProp || this.chitietsProp.length == 0) {
          this.$toast.error('Bạn chưa thêm gì vào giỏ!', { position: 'top-right' })
          return
        }
        await dathangService.placeOrder({
          chitiets: this.chitietsProp.map((chitiet) => {
            const hh = this.hhMap.get(chitiet.id)
            return {
              mahh: hh._id,
              soluong: chitiet.soluong
            }
          })
        })
        this.$toast.success('Đặt hàng thành công', {
          duration: 3000
        })
        cartStore.clearCart()
        window.location.reload()
        const closeButton = document.querySelector('button[data-bs-dismiss=modal]')
        closeButton.click()
      } catch (error) {
        this.$toast.error(error.message, { position: 'top-right' })
      }
    }
  }
}
</script>
