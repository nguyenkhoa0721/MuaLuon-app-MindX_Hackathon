<template>
  <div>
    <el-row class="m-3">
      <el-page-header
        @back="$router.push('/listchat')"
        :content="
          (o_user.role == 'buyer' ? 'Người mua' : 'Người bán') +
          ' - ' +
          o_user.name
        "
      >
      </el-page-header>
    </el-row>
    <el-row>
      <el-divider></el-divider>
    </el-row>
    <el-row>
      <!-- <el-col :span="3">
        <el-menu default-active="2" class="el-menu-vertical-demo fh">
          <el-menu-item v-for="index in 10" :key="index" :index="index">
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            ></el-avatar>
            <span class="ml-1">Shop so {{ index }}</span>
          </el-menu-item>
        </el-menu>
      </el-col> -->
      <div v-if="$route.params.id != $store.state.userInfo._id">
        <el-col :span="3">
          <el-menu default-active="1" class="el-menu-vertical-demo fh">
            <el-menu-item index="1" @click="com = 0">
              <i class="el-icon-menu"></i>
              Danh mục hàng
            </el-menu-item>
            <el-menu-item index="2" @click="com = 1">
              <i class="el-icon-chat-line-round"></i>
              Chat
            </el-menu-item>
            <el-menu-item index="3" @click="com = 2">
              <i class="el-icon-star-off"></i>
              Đánh giá
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="14" class="fh">
          <listItem v-show="com == 0" />
          <chat v-show="com == 1" />
        </el-col>
        <el-col :span="7" class="fh"><bill></bill></el-col>
      </div>
      <el-row v-else type="flex" justify="center">
        <el-col :span="14">
          <listItem />
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import bill from "./../components/shop/Bill.vue";
import listItem from "./../components/shop/ListItem.vue";
import chat from "./Chat.vue";
export default {
  components: {
    listItem,
    bill,
    chat,
  },
  data() {
    return {
      com: 0,
      o_user: [],
    };
  },

  created() {
    let url = "/bill/other/" + this.$route.params.id;
    if (this.$store.state.billID != "") {
      url = "/bill/" + this.$store.state.billID;
    }
    console.log(url);
    this.axios
      .get(url)
      .then((res) => {
        if (
          this.$store.state.userInfo.role == "seller" ||
          res.data.data.bill.status <= 5
        ) {
          this.$store.state.billID = res.data.data.bill._id;
          this.$store.state.bill = res.data.data.bill.items;
          this.$store.state.dis = res.data.data.bill.chargeInfo.totalDiscount;
          this.$store.state.step = res.data.data.bill.status;
        } else this.$store.state.bill = [];
      })
      .catch(function (e) {
        console.log(e);
      });
    console.log(url);
    this.axios
      .get("user/" + this.$route.params.id)
      .then((res) => {
        this.o_user = res.data.fuser;
      })
      .catch(function (e) {
        console.log(e);
      });
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>
<style scoped>
.fh {
  overflow: auto;
  height: calc(100vh - 74px);
}
.el-divider--horizontal {
  margin: 0px;
}
</style>