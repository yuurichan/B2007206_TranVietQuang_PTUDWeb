<template>
  <div class="container container-fluid py-2">
    <h2 class="py-2">Danh sách khách hàng</h2>

    <div style="display: flex; justify-content: space-between; align-items: center">
      <ul class="pagination">
        <li
          class="page-item"
          :class="{
            disabled: isFirstPage
          }"
          @click="prevPage"
        >
          <a class="page-link" href="#" aria-label="Previous">
            <i class="fa fa-angle-left"></i>
          </a>
        </li>
        <li
          class="page-item"
          v-for="item in total"
          :class="{ active: page === item }"
          :key="item"
          @click="page = item"
        >
          <a class="page-link" href="#">{{ item }}</a>
        </li>
        <li
          class="page-item"
          :class="{
            disabled: isLastPage
          }"
          @click="nextPage"
        >
          <a class="page-link" href="#" aria-label="Next">
            <i class="fa fa-angle-right"></i>
          </a>
        </li>
      </ul>

      <div class="d-flex gap-1">
        <select v-model="pageSize" class="form-select" style="width: 150px">
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

        <button
          type="button"
          class="btn btn-secondary"
          :class="{ 'btn-warning': isOpenFilter }"
          @click="isOpenFilter = !isOpenFilter"
        >
          <i class="fa fa-filter"></i>
        </button>
      </div>
    </div>

    <FilterComponent
      v-if="isOpenFilter"
      title="Tìm khách hàng"
      :items="[
        { name: 'ten', title: 'Họ tên' },
        { name: 'sdt', title: 'Số điện thoại' },
        { name: 'diachi', title: 'Địa chỉ' }
      ]"
      v-model="filter"
    />

    <div class="spinner-border" v-if="isLoading"></div>

    <div v-else class="table-container">
      <table class="table table-responsive">
        <thead class="table-light" style="position: sticky; top: 0; z-index: 100">
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Ngày tạo</th>
            <th>Cập nhật</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody v-auto-animate>
          <tr v-for="customer in customers" :key="customer.id">
            <td>{{ customer.id }}</td>
            <td>{{ customer.ten }}</td>
            <td>{{ customer.sdt }}</td>
            <td>{{ customer.diachi }}</td>
            <td>{{ formatDate(customer.createdAt) }}</td>
            <td>{{ formatDate(customer.updatedAt) }}</td>
            <td>
              <RouterLink
                :to="`/admin/customers/${customer.id}/edit`"
                class="btn btn-secondary btn-sm"
              >
                <i class="fa fa-pencil"></i>
                Sửa
              </RouterLink>
            </td>
            <td>
              <RouterLink
                :to="`/admin/customers/${customer.id}/delete`"
                class="btn btn-danger btn-sm"
              >
                <i class="fa fa-trash"></i>
                Xóa
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import khachHangService from '@/services/khachhang.service'
import dayjs from 'dayjs'
import FilterComponent from '@/components/FilterComponent.vue'

export default {
  name: 'AdminCustomers',
  data() {
    const customers = ref([])
    const pageSize = ref(50)
    const total = ref([])
    const page = ref(1)
    const isLoading = ref(false)
    const isOpenFilter = ref(false)
    const filter = ref({
      searchBy: 'ten'
    })

    return {
      customers,
      pageSize,
      total,
      page,
      isLoading,
      isOpenFilter,
      filter
    }
  },
  beforeMount() {
    this.updateCustomerList()
    this.$watch('pageSize', this.updateCustomerList)
    this.$watch('page', this.updateCustomerList)
    this.$watch('isOpenFilter', this.updateCustomerList)
    this.$watch('filter', this.updateCustomerList)
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('HH:mm, DD/MM/YYYY')
    },
    async updateCustomerList() {
      try {
        this.isLoading = true
        const params = {
          pageSize: this.pageSize,
          page: this.page
        }
        if (this.isOpenFilter) {
          params.searchBy = this.filter.searchBy
          params.term = this.filter.term
        }
        const res = await khachHangService.getAll(params)
        this.customers = res.data
        const totalPages = Math.ceil(res.totalRows / this.pageSize)
        this.total = Array.from({ length: totalPages }, (_, i) => i + 1)
      } catch (error) {
        this.$toast.error(error.message)
      } finally {
        this.isLoading = false
      }
    },
    nextPage() {
      if (this.page < this.total.length) {
        this.page++
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--
      }
    }
  },
  computed: {
    isFirstPage() {
      return this.page === 1
    },
    isLastPage() {
      return this.page === this.total.length
    }
  },
  components: { FilterComponent }
}
</script>

<style scoped>
.table-container {
  max-height: 70vh;
  overflow: auto;
}
</style>
