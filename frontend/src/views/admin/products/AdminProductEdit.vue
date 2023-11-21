<template>
  <div class="container py-4">
    <div class="spinner-border" v-if="isLoading"></div>

    <vee-form
      style="min-width: 100%"
      v-else
      class="card"
      :validation-schema="productValidationScheme"
      :initial-values="product"
      v-slot="{ errors, values }"
      @submit="updateProduct"
    >
      <h5 class="card-header">
        Cập nhật sản phẩm <strong>{{ product.ten }}</strong>
      </h5>

      <div class="card-body">
        <div class="mb-2">
          <label for="ten">
            Tên hàng hóa
            <span class="text-danger">*</span>
          </label>
          <Field
            type="text"
            class="form-control"
            name="ten"
            id="ten"
            :class="{ 'is-invalid': errors.ten }"
          />
          <ErrorMessage name="ten" class="invalid-feedback" />
        </div>

        <div class="mb-2">
          <label for="mota">
            Mô tả
            <span class="text-danger">*</span>
          </label>
          <Field
            as="textarea"
            class="form-control"
            name="mota"
            id="mota"
            :class="{ 'is-invalid': errors.mota }"
          />
          <ErrorMessage name="mota" class="invalid-feedback" />
        </div>

        <div class="mb-2">
          <label for="gia">
            Giá
            <span class="text-danger">*</span>
          </label>
          <Field
            type="number"
            class="form-control"
            name="gia"
            id="gia"
            :class="{ 'is-invalid': errors.gia }"
          />
          <span v-if="values.gia">
            {{ vndFormat(values.gia) }}
          </span>
          <ErrorMessage name="gia" class="invalid-feedback" />
        </div>

        <div class="mb-2">
          <label for="soluong"> Số lượng </label>
          <Field
            type="number"
            class="form-control"
            name="soluong"
            id="soluong"
            :class="{ 'is-invalid': errors.soluong }"
          />
          <ErrorMessage name="soluong" class="invalid-feedback" />
        </div>

        <div class="mb-2">
          <label for="ghichu"> Ghi chú </label>
          <Field
            as="textarea"
            class="form-control"
            name="ghichu"
            id="ghichu"
            :class="{ 'is-invalid': errors.ghichu }"
          />
          <ErrorMessage name="ghichu" class="invalid-feedback" />
        </div>

        <div class="upload-toolbar">
          <label class="btn btn-success btn-sm">
            <i class="fa fa-file-upload"></i>
            Thêm ảnh
            <input type="file" accept="image/*" hidden @change="addImage" />
          </label>
        </div>

        <div class="file-list py-3">
          <div class="container container-fluid">
            <div class="row">
              <div class="col col-12 col-md-6 col-lg-4" v-for="image in images" :key="image._id">
                <div class="card mb-2">
                  <h4
                    class="card-header"
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                  >
                    {{ image.ten }}
                  </h4>
                  <img
                    :src="fileService.getFileUrl(image.path)"
                    :alt="image.ten"
                    loading="lazy"
                    class="card-img-top"
                    style="height: 200px; object-fit: cover"
                  />

                  <div class="card-body">
                    <button
                      class="btn btn-danger btn-sm"
                      type="button"
                      @click="deleteImage(image.id)"
                    >
                      <i class="fa fa-trash"></i>
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!images.length">Bạn chưa tải lên ảnh nào</div>
            </div>
          </div>
        </div>

        <button class="btn btn-primary" type="submit">Cập nhật</button>
        <RouterLink to="/admin/products" class="btn btn-link"> Quay lại </RouterLink>
      </div>
    </vee-form>
  </div>
</template>

<script>
import hanghoaService from '@/services/hanghoa.service'
import { ref } from 'vue'
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'
import { productValidationScheme } from '@/yup/productValidationScheme'
import vndFormat from '@/utils/vndFormat'
import fileService from '@/services/file.service'

export default {
  name: 'AdminProductEdit',
  components: {
    VeeForm,
    Field,
    ErrorMessage
  },
  data() {
    const isLoading = ref(true)
    const product = ref(null)
    const images = ref([])

    return {
      isLoading,
      product,
      productValidationScheme,
      fileService,
      images
    }
  },
  methods: {
    async getProductData() {
      try {
        this.isLoading = true
        this.product = await hanghoaService.getById(this.$route.params.id)
        this.images = this.product.images
      } catch (error) {
        this.$toast.error(error.message)
      } finally {
        this.isLoading = false
      }
    },
    async updateProduct(values) {
      try {
        await hanghoaService.updateById(this.$route.params.id, values)
        this.$toast.success('Cập nhật sản phẩm thành công')
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
    async addImage(event) {
      try {
        const file = event.target.files[0]
        if (!file) throw new Error('No file selected')

        const res = await hanghoaService.addImage(this.$route.params.id, file)
        this.images.push(res)
        this.$toast.success('Đã thêm ảnh sản phẩm')
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
    async deleteImage(imageId) {
      try {
        await hanghoaService.deleteImage(this.$route.params.id, imageId)

        this.images = this.images.filter((image) => image.id !== imageId)
        this.$toast.info('Đã xóa ảnh sản phẩm')
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
    vndFormat
  },
  beforeMount() {
    this.getProductData()
  }
}
</script>

<style scoped>
.file-list {
  height: 50vh;
  overflow: auto;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
}

.upload-toolbar {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style>
