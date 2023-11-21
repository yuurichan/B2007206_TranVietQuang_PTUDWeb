<template>
  <div class="container" style="max-width: 560px">
    <vee-form
      class="card my-4"
      :validation-schema="productValidationScheme"
      v-slot="{ errors, values }"
      @submit="submit"
    >
      <h4 class="card-header">Thêm hàng hóa</h4>

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

        <button class="btn btn-primary" type="submit">Tạo</button>
        <RouterLink to="/admin/products" class="btn btn-link">
          <i class="fa fa-angle-left"></i> Quay lại
        </RouterLink>
      </div>
    </vee-form>
  </div>
</template>

<script>
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'
import { productValidationScheme } from '@/yup/productValidationScheme.js'
import hangHoaService from '@/services/hanghoa.service'
import vndFormat from '@/utils/vndFormat'

export default {
  name: 'AdminCreateProduct',
  components: { VeeForm, Field, ErrorMessage },
  data() {
    return { productValidationScheme }
  },
  methods: {
    async submit(values) {
      try {
        const newProduct = await hangHoaService.create(values)

        this.$toast.success('Thêm hàng hóa thành công')
        this.$router.push(`/admin/products/${newProduct.id}/edit`)
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
    vndFormat
  }
}
</script>
@/yup/productValidationScheme
