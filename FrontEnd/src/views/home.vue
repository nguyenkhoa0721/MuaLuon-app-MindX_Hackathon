<template>
  <div>
    <navbar></navbar>
    <div class="p-3">
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <el-card shadow="hover">
              <i class="el-icon-goblet"></i>
              Đồ gia dụng
            </el-card>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <el-card shadow="hover">
              <i class="el-icon-mobile-phone"></i>
              Hàng điện tử
            </el-card>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <el-card shadow="hover">
              <i class="el-icon-sugar"></i>
              Tạp hóa
            </el-card>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <el-card shadow="hover">
              <i class="el-icon-tableware"></i>
              Quán ăn
            </el-card>
          </div></el-col
        >
      </el-row>
      <el-row class="py-3 mt-3">
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="(item, index) in listSale" :key="index">
            <img :src="item" style="width: 100%" />
          </el-carousel-item>
        </el-carousel>
      </el-row>
      <el-row>
        <el-button icon="el-icon-location-outline"
          >Vị trí: 07 Đống Đa, TP Kon Tum, Kon Tum</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-shopping-cart-full"
          @click="$router.push('/listchat')"
          >Đơn hàng của bạn</el-button
        >
        <el-button type="success" icon="el-icon-tickets">Mã giảm giá</el-button>
      </el-row>
      <el-row class="py-3 px-1">
        <list></list>
      </el-row>
    </div>
  </div>
</template>
<script>
import home from "./home.vue";
import navbar from "./navbar.vue";
import list from "./../components/home/List.vue";
export default {
  components: {
    home,
    navbar,
    list,
  },
  data() {
    return {
      activeName: "first",
      listSale: [
        "https://jobsgo.vn/blog/wp-content/uploads/2019/06/32-cau-hoi-phong-van-sales.png",
        "https://png.pngtree.com/png-clipart/20190516/original/pngtree-flash-sale-banner-abstract-gradient-background-png-image_3698307.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTIvE3jwUtPMMV1URFwn87nFiaq75BQtB2VhA&usqp=CAU",
        "https://i.gadgets360cdn.com/large/big-billion-days-2018-best-deals_1539159124618.jpg",
      ],
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
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
<style  scoped>
.bg {
  height: 100vh;
}
.fh {
  overflow: auto;
  height: calc(100vh - 56px);
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>