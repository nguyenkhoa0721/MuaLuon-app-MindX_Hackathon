<template>
  <div>
    <navbar></navbar>
    <el-row :gutter="50">
      <el-col class="px-5 pt-3" :span="12">
        <h1>Hàng chờ</h1>
        <el-card class="box-card mt-2" v-for="(el, index) in process" :key="index">
          <div slot="header" class="clearfix">
            <span>Mã đơn hàng #{{ el.id }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="goToChat(el)"
              >VÀO CHAT</el-button
            >
          </div>
          <el-row>
            <span class="text-success"
              ><i class="el-icon-edit"></i> Trạng thái:
            </span>
            <span v-if="el.status == 1" class="text-warning"
              >Đang chờ bạn chốt đơn</span
            >
            <span v-if="el.status == 2" class="text-warning"
              >Đang chờ người bán chốt đơn</span
            >
            <span v-if="el.status == 3" class="text-success"
              >Đợi giao hàng</span
            >
          </el-row>
        </el-card>
      </el-col>
      <el-col class="px-5 pt-3" :span="12">
        <h1>Lịch sử</h1>
        <el-card class="box-card mt-2" v-for="(el, index) in done" :key="index">
          <div slot="header" class="clearfix">
            <span>Mã đơn hàng #{{ el.id }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="goToChat(el)"
              >VÀO CHAT</el-button
            >
          </div>
          <el-row>
            <span class="text-success"
              ><i class="el-icon-edit"></i> Trạng thái: Hoàn thành
            </span>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import navbar from "./navbar.vue";
export default {
  components: {
    navbar,
  },
  data() {
    return {
      allBills: [],
    };
  },
  created() {
    this.axios
      .get("/user/" + this.$store.state.userInfo.id + "/bills")
      .then((res) => {
        this.allBills = res.data.data.bills;
      })
      .catch(function (e) {
        console.log(e);
      });
  },
  methods: {
    goToChat(el) {
      this.$store.state.billID = el._id;
      if (this.$store.state.userInfo.role == "seller")
        this.$router.push("/id/" + el.buyer);
      else if (this.$store.state.userInfo.role == "buyer")
        this.$router.push("/id/" + el.seller);
    },
  },
  computed: {
    process() {
      let tmp = [];
      for (let i in this.allBills) {
        if (this.allBills[i].status < 4) {
          tmp.push(this.allBills[i]);
        }
      }
      return tmp;
    },
    done() {
      let tmp = [];
      for (let i in this.allBills) {
        if (this.allBills[i].status == 4) {
          tmp.push(this.allBills[i]);
        }
      }
      return tmp;
    },
  },
};
</script>