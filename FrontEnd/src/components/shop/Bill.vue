<template>
  <el-col class="p-2">
    <el-row>
      <el-table :data="$store.state.bill" style="width: 100%">
        <el-table-column prop="name" label="Tên"> </el-table-column>
        <el-table-column prop="number" label="SL"> </el-table-column>
        <el-table-column prop="price" label="Đơn giá"></el-table-column>
        <el-table-column label="Tác vụ">
          <template slot-scope="scope">
            <el-button
              type="danger"
              @click="Del(scope.row.name)"
              icon="el-icon-error"
              :disabled="$store.state.step<=2?false:true"
              plain
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="mt-1">
      <strong>Tạm tổng:</strong>
      <el-alert class="mt-1" :title="TongGia" type="success" :closable="false">
      </el-alert>
    </el-row>
    <el-row class="mt-1">
      <strong>Giảm giá:</strong>
      <el-alert
        class="mt-1"
        :title="'- ' + $store.state.dis"
        type="info"
        :closable="false"
      >
      </el-alert>
    </el-row>
    <el-row class="mt-1">
      <strong>Giá cuối: {{ TongGia - $store.state.dis }}</strong>
    </el-row>
    <el-row>
      <div v-if="$store.state.userInfo.role == 'buyer'" class="mt-2">
        <el-button type="primary" icon="el-icon-refresh-right" plain
          >Cập nhật</el-button
        >
        <el-button
          v-if="$store.state.step == 0"
          type="primary"
          icon="el-icon-finished"
          @click="createBill()"
          plain
          >Thương lượng</el-button
        >
        <el-button
          v-if="$store.state.step == 1"
          type="primary"
          icon="el-icon-finished"
          @click="changeStatus()"
          plain
          >Chốt đơn</el-button
        >
        <el-button
          v-if="$store.state.step == 2"
          type="primary"
          icon="el-icon-finished"
          @click="$store.state.step += 1"
          plain
          disabled
          >Chờ người bán đồng ý</el-button
        >
      </div>
      <div v-if="$store.state.userInfo.role == 'seller'" class="mt-2">
        <el-popover
          v-if="$store.state.step == 1"
          placement="right"
          width="400"
          trigger="click"
        >
          <el-col>
            <el-input
              placeholder="Tên hàng"
              v-model="add.name"
              class="mt-2"
            ></el-input>
            <el-input
              placeholder="Đơn giá"
              v-model="add.price"
              class="mt-2"
            ></el-input>
            <el-input-number
              :min="0"
              v-model="add.number"
              class="mt-2"
            ></el-input-number>
            <el-button type="primary" class="mt-2 ml-2" @click="addItem()" plain
              >Thêm vào</el-button
            >
          </el-col>
          <el-button
            slot="reference"
            type="success"
            icon="el-icon-circle-plus-outline"
            plain
            >Thêm hàng</el-button
          >
        </el-popover>
        <el-popover
          v-if="$store.state.step == 1"
          placement="right"
          width="400"
          trigger="click"
        >
          <el-col>
            <el-input
              placeholder="Đơn giá"
              v-model="dis"
              class="mt-2"
            ></el-input>
            <el-button type="primary" class="mt-2 ml-2" @click="addDis()" plain
              >Thêm vào</el-button
            >
          </el-col>
          <el-button
            class="ml-2"
            slot="reference"
            type="success"
            icon="el-icon-s-ticket"
            plain
            >Thêm giảm giá</el-button
          >
        </el-popover>
        <el-button
          v-if="$store.state.step == 2 || $store.state.step == 3"
          type="danger"
          icon="el-icon-close"
          @click="RemoveBill()"
          plain
          >Hủy đơn</el-button
        >
        <el-button
          v-if="$store.state.step == 2"
          type="primary"
          icon="el-icon-finished"
          @click="changeStatus()"
          plain
          >Nhận đơn hàng</el-button
        >
        <el-button
          v-if="$store.state.step == 3"
          type="primary"
          icon="el-icon-finished"
          @click="changeStatus()"
          plain
          >Đã giao</el-button
        >
      </div>
    </el-row>
  </el-col>
</template>

<script>
export default {
  data() {
    return {
      add: { name: "", price: "", number: "" },
      dis: 0,
      tableData: [
        {
          number: "1",
          name: "Tom",
          address: "1000",
        },
        {
          number: "2",
          name: "Tom",
          address: "2000",
        },
        {
          number: "2",
          name: "Tom",
          address: "3000",
        },
        {
          number: "1",
          name: "Tom",
          address: "4000",
        },
      ],
    };
  },
  created() {},
  methods: {
    Del(name) {
      for (let i in this.$store.state.bill) {
        if (this.$store.state.bill[i].name == name) {
          this.$store.state.bill.splice(i, 1);
          break;
        }
      }
      this.axios
        .patch(
          "/bill/" + this.$store.state.billID + "/removeItems",
          {
            itemNames: [name],
          },
          {
            headers: {
              "Content-Type": "application/json",
              crossDomain: true,
            },
          }
        )
        .then((res) => {
          this.$store.state.noti = name + " đã bị xóa";
        });
    },
    createBill() {
      let res = 0;
      for (let i in this.$store.state.bill) {
        res +=
          this.$store.state.bill[i].price * this.$store.state.bill[i].number;
      }
      console.log(this.$store.state.userInfo);
      let items = this.$store.state.bill;
      this.axios
        .post(
          "/bill",
          JSON.stringify({
            seller: this.$route.params.id,
            buyer: this.$store.state.userInfo.id,
            status: this.$store.state.step + 1,
            items,
            chargeInfo: {
              totalPrice: res,
            },
          }),
          {
            headers: {
              "Content-Type": "application/json",
              crossDomain: true,
            },
          }
        )
        .then((res) => {
          this.$store.state.billID = res.data.data.bill._id;
          this.$store.state.step += 1;
          this.$store.state.noti = "Đơn hàng đã được tạo";
        })
        .catch(function (e) {
          console.log(e);
        });
    },
    changeStatus() {
      console.log(this.$store.state.billID);
      this.axios
        .patch(
          "/bill/" + this.$store.state.billID,
          {
            status: this.$store.state.step + 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
              crossDomain: true,
            },
          }
        )
        .then((res) => {
          if (this.$store.state.step == 1)
            this.$store.state.noti = "Đơn hàng đã được người mua xác nhận";
          if (this.$store.state.step == 2)
            this.$store.state.noti = "Đơn hàng đã được người bán chốt";
          if (this.$store.state.step == 3)
            this.$store.state.noti = "Đơn hàng đã được giao";
          this.$store.state.step += 1;
        });
    },
    async addItem() {
      if (this.add.number == 0 || this.add.name == "" || this.add.price == "")
        return;

      await this.axios
        .patch(
          "/bill/" + this.$store.state.billID + "/updateItems",
          {
            items: [
              {
                name: this.add.name,
                number: this.add.number,
                price: this.add.price,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              crossDomain: true,
            },
          }
        )
        .then((res) => {
          this.$store.state.bill.push(this.add);
          this.$store.state.noti =
            "Đã thêm " + this.add.name + " với số lượng là " + this.add.number;
        })
        .catch((e) => {});
      this.add = { name: "", price: "", number: "" };
    },
    addDis() {
      this.$store.state.dis += Number(this.dis);
      let res = 0;

      for (let i in this.$store.state.bill) {
        res +=
          this.$store.state.bill[i].price * this.$store.state.bill[i].number;
        console.log(res);
      }

      this.axios
        .patch(
          "/bill/" + this.$store.state.billID,
          {
            chargeInfo: {
              totalPrice: res,
              totalDiscount: Number(this.$store.state.dis),
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              crossDomain: true,
            },
          }
        )
        .then((res) => {
          this.$store.state.noti =
            "Đơn hàng đã được giảm " + this.$store.state.dis;
        })
        .catch((e) => {});
    },
    RemoveBill() {
      this.$store.state.step = 0;
      this.axios
        .delete("/bill/" + this.$store.state.billID, {
          headers: {
            "Content-Type": "application/json",
            crossDomain: true,
          },
        })
        .then((res) => {
          this.$store.state.noti = "Đơn hàng đã bị hủy";
          console.log("xoa_done");
        });
    },
  },
  computed: {
    TongGia() {
      let res = 0;
      for (let i in this.$store.state.bill) {
        res +=
          this.$store.state.bill[i].price * this.$store.state.bill[i].number;
      }
      return res;
    },
  },
};
</script>