<template>
  <main>
    <div class="container-fluid mx-auto p-2">
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
            @click="toglgeFilter"
          >
            <i class="fa fa-filter"></i>
          </button>
        </div>
      </div>
      <FilterComponent
        class="animate__animated animate__faster animate__fadeInDown filter-component"
        v-if="isOpenFilter"
        v-model="filter"
        title="Danh sách đơn hàng"
        :items="[
          { name: 'kh.ten', title: 'Tên Khách Hàng' },
          { name: 'kh.sdt', title: 'Số điện thoại' },
          { name: 'kh.diachi', title: 'Địa chỉ' }
        ]"
      ></FilterComponent>

      <div class="px-2">
        <table class="table table-responsive table-hover">
          <thead class="table-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ngày Đặt Hàng</th>
              <th scope="col">Ngày Giao Hàng</th>
              <th scope="col">Khách Hàng</th>
              <th scope="col">Địa chỉ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              @dblclick="() => viewDetail(invoice._id)"
              v-if="invoices"
              v-for="invoice in invoices"
            >
              <td>{{ invoice.id }}</td>
              <td>{{ formatDate(invoice.ngayDH) }}</td>
              <td>{{ invoice?.ngayGH ? formatDate(invoice?.ngayGH) : 'Chưa có' }}</td>
              <td>{{ invoice?.kh.ten }}</td>
              <td>{{ invoice?.kh.diachi }}</td>
              <td>
                <div class="d-flex justify-content-round gap-2">
                  <RouterLink :to="`/admin/invoices/${invoice._id}`">
                    <button class="btn btn-info">
                      <i class="fa-solid fa-pencil"></i>
                      Sửa
                    </button>
                  </RouterLink>
                  <RouterLink :to="`/admin/invoices/${invoice._id}/delete`">
                    <button class="btn btn-danger">
                      <i class="fa-solid fa-trash"></i>
                      Xóa
                    </button>
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<style></style>
<script>
import dayjs from 'dayjs'
import { ref } from 'vue'
import FilterComponent from '@/components/FilterComponent.vue'
import dathangService from '@/services/dathang.service'
export default {
  data() {
    const invoices = ref([])
    const pageSize = ref(50)
    const total = ref([])
    const page = ref(1)
    const isLoading = ref(false)
    const isOpenFilter = ref(false)
    const filter = ref({
      searchBy: 'ten'
    })

    return {
      invoices,
      pageSize,
      total,
      page,
      isLoading,
      isOpenFilter,
      filter
    }
  },
  components: {
    FilterComponent
  },
  methods: {
    toglgeFilter() {
      if (this.isOpenFilter) {
        const panel = document.querySelector('.filter-component')
        panel.classList.add('animate__fadeOutUp')
        setTimeout(() => {
          this.isOpenFilter = !this.isOpenFilter
          panel.classList.remove('animate__fadeOutUp')
        }, 300)
        return
      }
      this.isOpenFilter = !this.isOpenFilter
    },
    formatDate(date) {
      return dayjs(date).format('HH:mm, DD/MM/YYYY')
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
    },
    async updateInvoiceList() {
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
        const { data, total } = await dathangService.getOrders(params)
        this.invoices = data
        const totalPages = Math.ceil(total / this.pageSize)
        this.total = Array.from({ length: totalPages }, (_, i) => i + 1)
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    viewDetail(id) {
      this.$router.push(`/admin/invoices/${id}`)
    }
  },
  beforeMount() {
    this.updateInvoiceList()
  },
  watch: {
    pageSize() {
      this.updateInvoiceList()
    },
    page() {
      this.updateInvoiceList()
    },
    isOpenFilter() {
      this.updateInvoiceList()
    },
    filter() {
      this.updateInvoiceList()
    }
  },
  computed: {
    isFirstPage() {
      return this.page === 1
    },
    isLastPage() {
      return this.page === this.total.length
    }
  }
}
</script>
