<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <vee-form
          :validation-schema="validationSchema"
          class="w-100"
          @submit="submit"
          v-slot="{ errors }"
        >
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <i class="fa-solid fa-lock"></i>

              Đổi mật khẩu
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mt-3">
              <label for="ten" class="form-label">Mật khẩu hiện tại</label>
              <field
                type="password"
                name="password"
                id="password"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <error-message
                name="password"
                class="invalid-feedback animate__animated animate__headShake"
              />
            </div>
            <div class="mt-3">
              <label for="newPassword" class="form-label">Mật khẩu mới</label>
              <field
                type="password"
                name="newPassword"
                id="newPassword"
                class="form-control"
                :class="{ 'is-invalid': errors.newPassword }"
                placeholder="Nhập mật khẩu mới"
              />
              <error-message
                name="newPassword"
                class="invalid-feedback animate__animated animate__headShake"
              />
            </div>
            <div class="mt-3">
              <label for="checkNewPassword" class="form-label">Nhập lại mật khẩu mới</label>
              <field
                type="password"
                name="checkNewPassword"
                id="checkNewPassword"
                class="form-control"
                :class="{ 'is-invalid': errors.checkNewPassword }"
                placeholder="Nhập lại mật khẩu mới"
              />
              <error-message
                name="checkNewPassword"
                class="invalid-feedback animate__animated animate__headShake"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy Bỏ</button>
            <button type="submit" class="btn btn-primary">Lưu</button>
          </div>
        </vee-form>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth.service'
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'

import * as yup from 'yup'
const validationSchema = yup.object().shape({
  password: yup.string().required('Vui lòng nhập mật khẩu'),
  newPassword: yup.string().required('Vui lòng nhập mật khẩu mới'),
  checkNewPassword: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu mới')
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu không khớp')
})
export default {
  name: 'ChangePasswordModal',
  components: {
    VeeForm,
    Field,
    ErrorMessage
  },
  data: () => ({
    validationSchema
  }),
  methods: {
    async submit(value) {
      try {
        delete value.checkNewPassword
        const result = await authService.changePassword(value)
        this.$toast.success(result.message, {
          duration: 3000
        })
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 3000
        })
      }
    }
  }
}
</script>
