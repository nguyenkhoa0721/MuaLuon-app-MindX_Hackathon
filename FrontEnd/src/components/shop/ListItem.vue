<template>
  <div>
    <el-row class="pt-3 px-3">
      <el-col :span="5">
        <el-button
          type="primary"
          plain
          :disabled="$store.state.userInfo.role == 'seller' ? false : true"
          @click="dialogFormVisible = true"
        >
          Thêm sản phẩm
        </el-button>
      </el-col>
      <el-col :span="19">
        <el-input
          placeholder="Please input"
          v-model="inputSearch"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-row v-if="isFetch == true" :gutter="20" class="p-3">
      <el-col :span="6" v-for="(el, index) in filter" :key="index" class="mb-3">
        <el-card :body-style="{ padding: '0px' }">
          <img
            :src="$store.state.server + 'static/goods/' + el.image"
            class="image"
          />
          <div style="padding: 10px">
            <el-row>
              <span>Tên: {{ el.name }}</span
              ><br />
              <time>Giá: {{ el.price }}</time>
            </el-row>
            <el-row>
              <el-input-number
                class="mt-1"
                size="small"
                @change="updateBill(index)"
                v-model="number[index]"
                :min="0"
                :disabled="
                  $store.state.step > 1 ||
                  $store.state.userInfo.role == 'seller'
                    ? true
                    : false
                "
              ></el-input-number>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="Thêm hàng mới" :visible.sync="dialogFormVisible" v-show="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Tên sản phẩm" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Đơn giá" :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Hình ảnh sản phẩm" :label-width="formLabelWidth">
          <input
            type="file"
            id="file"
            ref="file"
            v-on:change="handleFileUpload()"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addNewGood()"
          >Thêm sản phẩm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentDate: new Date(),
      list: [],
      isFetch: false,
      number: [],
      inputSearch: "",
      dialogFormVisible: false,
      form: [],
      file: "",
    };
  },
  created() {
    let url = "/user/" + this.$store.state.userInfo._id + "/goods";
    if (this.$store.state.userInfo.role == "buyer")
      url = "/user/" + this.$route.params.id + "/goods";
    this.axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          crossDomain: true,
        },
      })
      .then((res) => {
        this.list = res.data.data.goods;
      });
    let tmp = this.list;
    tmp.forEach((el, i) => {
      tmp[i].number = 0;
    });
    this.list = tmp;
    this.number = new Array(tmp.length).fill(0);
    this.isFetch = true;
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async addNewGood() {
      let formData = new FormData();
      formData.append("image", this.file);
      formData.append("name", this.form.name);
      await formData.append("price", this.form.price);
      this.axios
        .patch("/user/addGood/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function () {
          this.dialogFormVisible = false
        })
        .catch(function (e) {
          this.dialogFormVisible = false
          console.log(e);
        });
    },
    updateBill(i) {
      if (this.number[i] > 0) {
        for (let index in this.$store.state.bill) {
          if (this.$store.state.bill[index].name == this.list[i].name) {
            this.$store.state.bill[index].number = this.number[i];
            return;
          }
        }
        this.$store.state.bill.push({
          name: this.list[i].name,
          price: this.list[i].price,
          number: this.number[i],
        });
      } else {
        for (let index in this.$store.state.bill) {
          if (this.$store.state.bill[index].name == this.list[i].name) {
            this.$store.state.bill.splice(index, 1);
            return;
          }
        }
      }
    },
  },
  computed: {
    filter() {
      return this.list.filter((el) => {
        return el.name
          .toLowerCase()
          .trim()
          .includes(this.inputSearch.toLowerCase().trim());
      });
    },
  },
};
</script>
<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>