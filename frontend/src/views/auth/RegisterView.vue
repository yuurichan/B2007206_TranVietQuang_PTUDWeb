<template>
  <div class="container py-4 animate__animated animate__fadeInDown">
    <vee-form
      class="card p-4 shadow shadow-sm"
      @submit="register"
      :validation-schema="validationScheme"
      v-slot="{ errors, isSubmitting }"
    >
      <h2>Đăng ký</h2>

      <div class="mb-3">
        <label for="ten" class="form-label">Họ tên</label>
        <field
          name="ten"
          id="ten"
          class="form-control"
          :class="{ 'is-invalid': errors.ten }"
          placeholder="Họ và tên"
        />
        <error-message name="ten" class="invalid-feedback animate__animated animate__headShake" />
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
        <error-message name="sdt" class="invalid-feedback animate__animated animate__headShake" />
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
        <error-message
          name="diachi"
          class="invalid-feedback animate__animated animate__headShake"
        />
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
        <error-message
          name="username"
          class="invalid-feedback animate__animated animate__headShake"
        />
      </div>

      <div class="mb-3">
        <label for="inputPassword" class="col-form-label">Mật khẩu</label>
        <field
          name="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          id="inputPassword"
          placeholder="Mật khẩu"
        />
        <error-message
          name="password"
          class="invalid-feedback animate__animated animate__headShake"
        />
      </div>

      <div class="mb-3">
        <label for="cfPassword" class="col-form-label">Xác nhận mật khẩu</label>
        <field
          name="cfPassword"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.cfPassword }"
          id="cfPassword"
          placeholder="Xác nhận mật khẩu"
        />
        <error-message
          name="cfPassword"
          class="invalid-feedback animate__animated animate__headShake"
        />
      </div>

      <button class="btn btn-primary" :disabled="isSubmitting" type="submit">Đăng ký</button>

      <p class="text text-dark py-2">
        Bạn đã có tài khoản?
        <router-link to="/auth/login">Đăng nhập ngay</router-link>
      </p>
    </vee-form>
  </div>
</template>

<style scoped>
form {
  width: 480px;
  max-width: 100%;
  margin: 0 auto;
}
</style>

<script>
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { RouterLink } from 'vue-router'
import authService from '@/services/auth.service'
import { useUserStore } from '@/stores/user'

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
    .max(10, 'Tên đăng nhập không được dài quá 10 ký tự'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(20, 'Mật khẩu không được dài quá 10 ký tự'),
  cfPassword: yup
    .string()
    .required('Vui lòng xác nhận lại mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
})

export default {
  name: 'RegisterView',
  components: {
    VeeForm,
    Field,
    ErrorMessage,
    RouterLink
  },
  data() {
    const userStore = useUserStore()

    return {
      validationScheme,
      userStore
    }
  },
  methods: {
    async register(value) {
      try {
        const { accessToken } = await authService.register(value)

        this.userStore.setAccessToken(accessToken)

        const res = await authService.auth()

        this.userStore.setUser(res)

        this.$router.push('/')
      } catch (error) {
        this.$toast.error(error.message)
      }
    }
  }
}
</script>
