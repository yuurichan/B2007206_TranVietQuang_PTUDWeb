import * as yup from 'yup'

export const productValidationScheme = yup.object().shape({
  ten: yup.string().required('Tên sản phẩm không được để trống'),
  mota: yup.string().required('Mô tả sản phẩm không được để trống'),
  gia: yup
    .number()
    .required('Giá sản phẩm không được để trống')
    .positive('Giá sản phẩm phải là số dương'),
  soluong: yup.number().optional().min(0, 'Số lượng sản phẩm phải >= 0')
})
