const formater = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

export default function vndFormat(raw) {
  return formater.format(raw)
}
