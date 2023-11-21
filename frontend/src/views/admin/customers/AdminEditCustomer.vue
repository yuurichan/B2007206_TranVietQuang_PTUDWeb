<template>
  <div class="container py-4">
    <div class="card" v-if="customer">
      <div class="card-header">Cập nhật tài khoản</div>

      <div class="card-body">
        <vee-form
          :validation-schema="validationScheme"
          v-slot="{ errors }"
          :initial-values="customer"
          @submit="handleUpdate"
        >
          <div class="mb-3">
            <label for="ten" class="form-label">Họ tên</label>
            <field
              name="ten"
              id="ten"
              class="form-control"
              :class="{ 'is-invalid': errors.ten }"
              placeholder="Họ và tên"
            />
            <error-message name="ten" class="invalid-feedback" />
          </div>

          <div class="mb-3">
            <label for="sdt" class="form-label">Số điện thoại</label>
            <field
              name="sdt"
              id="sdt"
              class="form-control"
              :class="{ 'is-invalid': errors.sdt }"
              placeholder="Số điện thoại"
            />
            <error-message name="sdt" class="invalid-feedback" />
          </div>

          <div class="mb-3">
            <label for="diachi" class="form-label">Địa chỉ</label>
            <field
              name="diachi"
              id="diachi"
              class="form-control"
              :class="{ 'is-invalid': errors.diachi }"
              placeholder="Địa chỉ"
            />
            <error-message name="diachi" class="invalid-feedback" />
          </div>

          <div class="mb-3">
            <label for="username" class="form-label">Tên đăng nhập</label>
            <field
              name="username"
              id="username"
              class="form-control"
              :class="{ 'is-invalid': errors.username }"
              placeholder="Tên đăng nhập"
            />
            <error-message name="username" class="invalid-feedback" />
          </div>

          <button class="btn btn-primary" type="submit">Cập nhật</button>
          <RouterLink to="/admin/customers" class="btn"> Quay lại </RouterLink>
        </vee-form>
      </div>
    </div>

    <div class="spinner-border" v-else></div>
  </div>
</template>

<script>
import khachhangService from '@/services/khachhang.service'
import { Field, Form as VeeForm } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'

const validationScheme = yup.object().shape({
  ten: yup
    .string()
    .required('Vui lòng nhập họ tên')
    .min(3, 'Họ tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ tên không được dài quá 50 ký tự'),
  sdt: yup.string().required('Vui lòng nhập số điện thoại'),
  diachi: yup.string().required('Vui lòng nhập địa chỉ'),
  username: yup
    .string()
    .required('Vui lòng nhập tên đăng nhập')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(10, 'Tên đăng nhập không được dài quá 10 ký tự')
})

export default {
  name: 'AdminEditCustomer',
  components: { VeeForm, Field },
  data() {
    const customer = ref(null)

    return { customer, validationScheme }
  },
  async beforeMount() {
    this.customer = (await khachhangService.getById(this.$route.params.id)).khach
  },
  methods: {
    async handleUpdate(values) {
      try {
        await khachhangService.updateById(values.id, values)
        this.$toast.success('Cập nhật khách hàng thành công')
        this.$router.back()
      } catch (error) {
        this.$toast.error(error.message)
      }
    }
  }
}
</script>
