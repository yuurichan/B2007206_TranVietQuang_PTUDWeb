<template>
  <main>
    <div v-if="data" class="container">
      <div class="mt-5 row justify-content-between">
        <h1 class="col-6">
          Đơn hàng #<span style="font-weight: bold">{{ data.id }}</span>
        </h1>
      </div>
      <div class="row">
        <div class="col-12">
          <h4>Thông tin đơn hàng</h4>
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>Ngày đặt hàng</th>
                <th>Ngày giao hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ formatTime(data.ngayDH) }}</td>
                <td><VueDatePicker :format="format" v-model="data.ngayGH" /></td>
                <td>{{ vndFormat(tongtien) }}</td>
                <td>
                  <select class="form-select" v-model="data.trangThaiDH">
                    <option value="received">Chưa Xử Lý</option>
                    <option value="processing">Đang Xử Lý</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row my-5 justify-content-between">
        <div class="col col-6">
          <h4>Thông tin khách hàng</h4>
          <table class="table table-responsive">
            <thead>
              <tr>
                <th>Tên</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ data.kh.ten }}</td>
                <td>{{ data.kh.sdt }}</td>
                <td>{{ data.kh.diachi }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col col-6">
          <h4>Thông tin nhân viên</h4>
          <table class="table table-responsive">
            <thead>
              <tr>
                <th>Tên</th>
                <th>SĐT</th>
                <th>Địa chỉ</th>
                <th>Cập nhật cuối</th>
              </tr>
            </thead>
            <tbody v-if="data.nv">
              <tr>
                <td>{{ data.nv.ten }}</td>
                <td>{{ data.nv.sdt }}</td>
                <td>{{ data.nv.diachi }}</td>
                <td>{{ formatTime(data.updatedAt) }}</td>
              </tr>
            </tbody>
            <tr v-if="!data.nv">
              <td class="text-center" colspan="4">
                <i class="fa-solid fa-clipboard-user"></i>
                Đơn hàng chưa được xử lý!
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="row mt-5">
        <h2>Chi Tiết Đơn Hàng</h2>
        <div class="col col-12 list-container">
          <div class="items-container">
            <table class="table">
              <thead>
                <tr>
                  <th class="text-center" scope="col">Ảnh</th>
                  <th class="text-center" scope="col">Hàng</th>
                  <th class="text-center" scope="col">Giá</th>
                  <th class="text-center" scope="col">Giảm Giá</th>
                  <th class="text-center" scope="col">Số Lượng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="chitiet of data.chitiets" class="item">
                  <th scope="row">
                    <div class="d-flex justify-content-center">
                      <div class="item-image">
                        <img
                          class="detail-image"
                          v-if="chitiet.hanghoa.images && chitiet.hanghoa.images.length > 0"
                          :src="getImage(chitiet.hanghoa.images[0].path)"
                        />
                      </div>
                    </div>
                  </th>
                  <td>{{ chitiet.hanghoa.ten }}</td>
                  <td>{{ vndFormat(chitiet.hanghoa.gia) }}</td>
                  <td>
                    <div v-if="editingId !== chitiet.id">
                      {{ chitiet.giamgia ? vndFormat(chitiet.giamgia) : vndFormat(0) }}
                    </div>
                    <div v-else>
                      <input
                        class="form-control"
                        placeholder="Giảm giá"
                        type="number"
                        v-model="editingPayload.giamgia"
                        min="0"
                        :max="chitiet.hanghoa.gia"
                      />
                      <em v-if="editingPayload.giamgia">{{ vndFormat(editingPayload.giamgia) }}</em>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex justify-content-center">
                      <div class="item-quantity">
                        <div v-if="editingId !== chitiet.id">
                          {{ chitiet.soluong }}
                        </div>
                        <div v-else>
                          <input
                            class="form-control"
                            placeholder="Giảm giá"
                            type="number"
                            v-model="editingPayload.soluong"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      @click="() => updateRow(chitiet.id)"
                      v-if="editingId === chitiet.id"
                      class="btn btn-info"
                    >
                      Lưu
                    </button>
                    <button v-else class="btn btn-info">
                      <i @click="() => selectEdit(chitiet.id)" class="fa-solid fa-pencil"></i>
                    </button>
                    <button v-if="editingId === chitiet.id" class="btn btn-danger ms-2">
                      <span @click="cancelEdit" v-if="editingId === chitiet.id">Hủy</span>
                    </button>
                    <button @click="() => removeRow(chitiet.id)" v-else class="btn btn-danger ms-2">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <button @click="update" class="btn btn-primary">
          <i class="fa-solid fa-check"></i>
          Cập nhật
        </button>
      </div>
    </div>
  </main>
</template>
<style>
.detail-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}
.items-container td {
  text-align: center;
  vertical-align: middle;
}
</style>
<script>
import dathangService from '@/services/dathang.service'
import fileService from '@/services/file.service'
import dayjs from 'dayjs'
import vndFormat from '@/utils/vndFormat'
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
export default {
  components: { VueDatePicker },
  methods: {
    async getDetail() {
      const id = this.$route.params.id
      const { data, tongtien } = await dathangService.getDetail(id)
      this.data = data
      this.tongtien = tongtien
    },
    formatTime(date) {
      return dayjs(date).format('DD/MM/YYYY-HH:mm')
    },
    getImage(path) {
      return fileService.getFileUrl(path)
    },
    vndFormat,
    format(date) {
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()

      return `${day}/${month}/${year}`
    },
    // calcDiscount(data) {
    //   let discount = 0
    //   if (!data) return discount
    //   for (ct in data.chitiet) {
    //     discount += ct.giamgia
    //   }
    //   return discount
    // },
    async update() {
      console.log(this.data)
      try {
        await dathangService.update(this.data._id, {
          ngayGH: this.data.ngayGH,
          trangThaiDH: this.data.trangThaiDH
        })
        this.$toast.success('Cập nhật thành công', {
          duration: 2000
        })
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 2000
        })
      }
    },
    selectEdit(id) {
      const chitiet = this.data.chitiets.find((e) => e.id === id)
      this.editingPayload = {
        giamgia: chitiet.giamgia,
        soluong: chitiet.soluong
      }
      this.editingId = id
    },
    cancelEdit() {
      this.editingId = null
      this.editingPayload = {}
    },
    async updateRow(id) {
      try {
        await dathangService.updateChiTiet(id, this.editingPayload)
        this.cancelEdit()
        await this.update()
        await this.getDetail()
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 2000
        })
      }
    },
    async removeRow(id) {
      try {
        await dathangService.xoaChiTiet(id)

        this.cancelEdit()
        await this.update()
        await this.getDetail()
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 2000
        })
      }
    }
  },
  data() {
    const data = ref(null)
    const editingId = ref(null)
    const editingPayload = {}
    const tongtien = ref(0)
    return { data, tongtien, editingId, editingPayload }
  },
  mounted() {
    this.getDetail()
  },
  computed: {
    formatStatus() {
      if (!this.data) return ''
      if (this.data.trangThaiDH == 'received') {
        return 'Chưa xử lý'
      } else if (this.data.trangThaiDH == 'processing') {
        return 'Đang xử lý'
      } else if (this.data.trangThaiDH == 'completed') {
        return 'Đã hoàn thành'
      }
      return 'Đã hủy'
    }
  }
}
</script>
