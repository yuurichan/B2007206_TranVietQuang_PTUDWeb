<template>
  <div class="container container-fluid py-4">
    <div class="row">
      <div class="col col-4">
        <div class="card border-secondary shadow shadow-sm bg-light">
          <div class="card-body">
            <h5 class="card-title">Khách hàng <i class="fa fa-users"></i></h5>

            <p class="card-text">Quản lý thông tin khách hàng</p>

            <RouterLink to="/admin/customers" class="btn btn-secondary"> Xem </RouterLink>
          </div>
        </div>
      </div>

      <div class="col col-4">
        <div class="card border-secondary shadow shadow-sm bg-light">
          <div class="card-body">
            <h5 class="card-title">Hàng hóa <i class="fa fa-box"></i></h5>

            <p class="card-text">Quản lý thông tin hàng hóa</p>

            <RouterLink to="/admin/products" class="btn btn-secondary"> Xem </RouterLink>
          </div>
        </div>
      </div>

      <div class="col col-4">
        <div class="card border-secondary shadow shadow-sm bg-light">
          <div class="card-body">
            <h5 class="card-title">Đơn hàng <i class="fa fa-file-invoice"></i></h5>

            <p class="card-text">Quản lý đơn hàng</p>

            <RouterLink to="/admin/invoices" class="btn btn-secondary"> Xem </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminView'
}
</script>
