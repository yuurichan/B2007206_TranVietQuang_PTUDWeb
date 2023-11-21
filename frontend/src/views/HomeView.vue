<template>
  <main>
    <!-- Header-->
    <header class="bg-dark py-5">
      <div class="container px-4 px-lg-5 my-5">
        <div class="text-center text-white">
          <h1 class="display-4 fw-bolder">Go Retro!</h1>
          <p class="lead fw-normal text-white-50 mb-0">A place for all your gaming needs</p>
        </div>
      </div>
    </header>
    <!-- Section-->
    <section class="py-5">
      <div class="container px-2 px-lg-5">
        <div>
          <div class="d-flex align-items-end mb-2">
            <h3 style="font-weight: bold">Danh Sách Sản Phẩm</h3>
          </div>
          <div class="d-flex align-items-end mb-2 gap-2">
            <div style="width: 250px">
              <label>Sắp xếp theo</label>
              <select
                required
                placeholder="Chon trường sắp xếp"
                class="form-select"
                v-model="sortBy"
              >
                <option value="" disabled selected>Chọn trường để sắp xếp</option>
                <option value="gia">Giá</option>
                <option value="ten">Tên</option>
                <option value="createdAt">Ngày tạo</option>
              </select>
            </div>
            <div v-if="sortBy">
              <div @click="toggleDirection" class="btn btn-secondary" v-if="direction === 1">
                <i class="fa-solid fa-sort-up"></i>
                Tăng dần (A-Z, 0-9)
              </div>
              <div @click="toggleDirection" class="btn btn-secondary" v-if="direction === -1">
                <i class="fa-solid fa-sort-down"></i>
                Giảm dần (Z-A, 9-0)
              </div>
            </div>

            <button
              @click="toggleSearchingPanel"
              class="btn btn-primary"
              :class="{ 'btn-warning': isSearching }"
            >
              <i class="fa-solid fa-filter"></i>
            </button>
          </div>

          <FilterComponent
            v-if="isSearching"
            class="animate__animated animate__faster animate__fadeInDown filter-component"
            v-model="filter"
            title="Tìm kiếm sản phẩm"
            :items="[
              { name: 'ten', title: 'Tên' },
              { name: 'mota', title: 'Mô tả' }
            ]"
          />
        </div>

        <div
          v-auto-animate
          id="product-list-container"
          class="row gx-2 gx-lg-2 row-cols-3 row-cols-md-5 row-cols-xl-6 gap-2"
        >
          <ProductCard
            v-for="product in products"
            class="col mb-5"
            :key="product.id"
            :product="product"
          />
        </div>
        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 5px">
          <ul class="pagination" style="margin-bottom: 0">
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
              <a style="z-index: 0" class="page-link" href="#">{{ item }}</a>
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

          <select v-model="pageSize" class="form-select" style="width: 150px">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import hanghoaService from '@/services/hanghoa.service'
import fileService from '@/services/file.service'
import vndFormat from '@/utils/vndFormat'
import FilterComponent from '@/components/FilterComponent.vue'
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'HomeView',
  components: {
    FilterComponent,
    ProductCard
  },
  data() {
    const products = ref([])
    const pageSize = ref(5)
    const total = ref([])
    const page = ref(1)
    const filter = ref({ searchBy: 'ten', term: '' })
    const isLoading = ref(false)
    const sortBy = ref('')
    const direction = ref(1)
    const isSearching = ref(false)

    return {
      products,
      pageSize,
      total,
      page,
      isLoading,
      filter,
      sortBy,
      direction,
      isSearching
    }
  },
  beforeMount() {
    this.updateProductList()
  },
  watch: {
    pageSize() {
      this.updateProductList()
    },
    page() {
      this.updateProductList()
    },
    filter() {
      this.updateProductList()
    },
    sortBy() {
      this.updateProductList()
    },
    direction() {
      this.updateProductList()
    }
  },
  methods: {
    async updateProductList() {
      try {
        this.isLoading = true

        const res = await hanghoaService.getAll({
          page: this.page,
          pageSize: this.pageSize,
          ...this.filter,
          sortBy: this.sortBy,
          direction: this.direction
        })

        this.products = res.data
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
    },
    toggleDirection() {
      this.direction = this.direction === 1 ? -1 : 1
    },
    vndFormat,
    getImage(path) {
      return fileService.getFileUrl(path)
    },
    async toggleSearchingPanel() {
      if (this.isSearching) {
        const panel = document.querySelector('.filter-component')
        panel.classList.add('animate__fadeOutUp')
        setTimeout(() => {
          this.isSearching = !this.isSearching
          panel.classList.remove('animate__fadeOutUp')
        }, 800)
        return
      }
      this.isSearching = !this.isSearching
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
