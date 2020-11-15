<template>
  <div>
    <navbar />
    <div class="container py-5" v-if="$store.state.userInfo.avt">
      <div class="row">
        <div class="col-lg-3">
          <img
            class="rounded-circle"
            height="250px"
            width="250px"
            :src="
              this.$store.state.server +
              'static/avatars/avatar-' +
              this.$store.state.userInfo.id +
              '.png'
            "
          />
          <div class="row">
            <el-upload
              class="mx-auto mt-2"
              :show-file-list="false"
              :action="this.$store.state.server + 'api/v1/user/updateUser'"
              :with-credentials="true"
              :before-upload="onSelect"
              :on-success="success"
            >
              <el-button size="small" type="primary">Click to upload</el-button>
            </el-upload>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="row-lg-12">
            <el-form label-width="120px">
              <el-form-item label="Tên">
                <el-input v-model="name"></el-input>
              </el-form-item>
              <el-form-item label="Email">
                <el-input
                  type="email"
                  v-model="this.$store.state.userInfo.email"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="Username">
                <el-input
                  v-model="this.$store.state.userInfo.username"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="Giới tính">
                <el-select v-model="gender" placeholder="Select">
                  <el-option
                    v-for="item in lgender"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Ngày sinh">
                <el-date-picker
                  v-model="date"
                  type="date"
                  placeholder="Chọn ngày"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Bio">
                <el-input v-model="bio"></el-input>
              </el-form-item>
              <el-form-item label="Vai trò: ">
                <el-select v-model="role" placeholder="Select">
                  <el-option
                    v-for="item in lrole"
                    :key="item.index"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateInfo">Lưu</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="row-lg-12 pt-2">
            <el-form label-width="120px">
              <el-form-item label="Mật khẩu cũ">
                <el-input v-model="oldpass" type="password"></el-input>
              </el-form-item>
              <el-form-item label="Mật khẩu mới">
                <el-input v-model="newpass" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updatePass">Lưu</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="col-lg-3"></div>
      </div>
    </div>
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
      name: this.$store.state.userInfo.name,
      username: this.$store.state.userInfo.username,
      email: this.$store.state.userInfo.email,
      phone: this.$store.state.userInfo.phone,
      date: this.$store.state.userInfo.birth,
      country: this.$store.state.userInfo.address,
      lcountry: [],
      role: this.$store.state.userInfo.role,
      lrole: [{ name: "Seller" }, { name: "Buyer" }],
      gender: this.$store.state.userInfo.gender,
      lgender: [{ name: "Nam" }, { name: "Nữ" }, { name: "Khác" }],
      file: "",
      bio:"",
      message: "",
      avtchange: 0,
      oldpass: "",
      newpass: "",
    };
  },
  watch: {
    isFetch(n, o) {
      (this.name = this.$store.state.userInfo.name),
        (this.phone = this.$store.state.userInfo.phone),
        (this.date = this.$store.state.userInfo.birth),
        (this.country = this.$store.state.userInfo.address),
        (this.role = this.$store.state.userInfo.role),
        (this.gender = this.$store.state.userInfo.gender);
    },
  },
  created() {
    this.axios
      .get(this.$store.state.server + "utils/country.json")
      .then((res) => {
        this.lcountry = res.data;
      })
      .catch(function (err) {
        console.log("error");
      });
  },
  methods: {
    updateInfo() {
      this.axios
        .patch(
          "/user/updateuser",
          {
            name: this.name,
            bio: this.bio,
            phone: this.phone,
            gender: this.gender,
            birth: this.date,
            address: this.country,
            role: this.role,
          },
          {
            headers: {
              "Content-Type": "application/json",
              crossDomain: true,
            },
          }
        )
        .then((res) => {
          this.$message({
            showClose: true,
            message: "Cập nhật thành công",
            type: "success",
          });
          this.GetUserInfo();
        });
    },
    updatePass() {
      this.axios
        .patch(
          "/user/updatepassword",
          {
            oldpassword: this.oldpass,
            newpassword: this.newpass,
          },
          {
            headers: {
              "Content-Type": "application/json",
              crossDomain: true,
            },
          }
        )
        .then((res) => {
          this.$message({
            showClose: true,
            message: "Cập nhật thành công",
            type: "success",
          });
        })
        .catch((e) => {
          if (e.response.status == 401) {
            this.$message({
              showClose: true,
              message: "Mật khẩu cũ không đúng",
              type: "error",
            });
          }
        });
    },
    onSelect(file) {
      if (file.size > 1024 * 1024 * 2) {
        this.$message({
          showClose: true,
          message: "File có dung lượng quá lớn (> 2MB)",
          type: "warning",
        });
        return false;
      }
      return true;
    },
    success() {
      this.$message({
        showClose: true,
        message: "Cập nhật thành công",
        type: "success",
      });
      this.GetUserInfo();
    },
    GetUserInfo() {
      this.axios
        .get("/user/", {
          headers: {
            "Content-Type": "application/json",
            crossDomain: true,
          },
        })
        .then((res) => {
          if (res.data.fuser) {
            this.$store.state.userInfo = res.data.fuser;
          }
        });
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
  computed: {
    isFetch() {
      return this.$store.state.userInfo.name;
    },
  },
};
</script>