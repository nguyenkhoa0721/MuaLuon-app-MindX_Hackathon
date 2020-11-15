<template>
  <nav
    class="navbar navbar-expand-md navbar-light shadow-sm"
    style="padding-top: 5px; padding-bottom: 3px"
  >
    <button
      class="navbar-toggler navbar-toggler-right border-0"
      type="button"
      data-toggle="collapse"
      data-target="#navbar6"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand text-primary d-none d-md-block" href="#">
      <img src="/../../../static/img/icon2.png" class="mb-1" width="25" />
      <b>MUA LUÔN</b>
    </a>
    <div class="collapse navbar-collapse" id="navbar6">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="/" @click.prevent="$router.push('/')"
            >Trang chủ</a
          >
        </li>
        <li class="nav-item" v-if="$store.state.userInfo.role=='seller'">
          <a class="nav-link" href="/" @click.prevent="$router.push('/id/'+$store.state.userInfo.id)"
            >Gian hàng của tôi</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/" @click.prevent="$router.push('/')"
            >Trợ giúp</a
          >
        </li>
        <li class="nav-item">
          <el-input placeholder="Sản phẩm cần tìm" v-model="input2">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" v-if="this.$store.state.loginCom != 'auth'">
          <a class="nav-link" href="/login">Đăng ký/Đăng nhập</a>
        </li>
        <div class="btn-group ml-2" v-if="this.$store.state.loginCom == 'auth'">
          <a
            class="navbar-brand d-none d-md-block"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              :src="
                this.$store.state.server +
                'static/avatars/avatar-' +
                this.$store.state.userInfo.id +
                '.png'
              "
              height="32px"
              width="32px"
              class="rounded-circle mb-1"
            />
            <i class="el-icon-caret-bottom text-primary"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" type="button" href="/me">
              <i class="fa fa-user-o" aria-hidden="true"></i> Thông tin cá nhân
            </a>
            <button class="dropdown-item" type="button" @click="LogOut">
              <i class="fa fa-sign-out" aria-hidden="true"></i> Đăng xuất
            </button>
          </div>
        </div>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  methods: {
    LogOut: function () {
      this.axios
        .get("/user/logout", {
          headers: {
            "Content-Type": "application/json",
            crossDomain: true,
          },
        })
        .then((res) => {
          this.$store.state.loginCom = "login";
          this.$router.push("/login");
        });
    },
  },
};
</script>