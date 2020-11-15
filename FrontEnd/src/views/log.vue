<template>
    <div>
        <navbar/>
        <div>
            <SignUp v-if="$store.state.loginCom=='signup'"></SignUp>
            <LogIn v-if="$store.state.loginCom=='login'"></LogIn>
            <Forgot v-if="$store.state.loginCom=='forgot'"></Forgot>
            <div class="py-5 text-center" v-if="$store.state.loginCom=='auth'">
                <div class="container">
                <div class="row">
                    <div class="mx-auto col-lg-6 col-10">
                    <h1>Bạn đã đăng nhập</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 text-center" style="">
                    <div class="row">
                        <div class="col-md-12"><a class="btn btn-outline-dark" href="#" v-on:click="LogOut">Log out</a></div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Cookie from "js-cookie";
import SignUp from "./../components/login/SignUp.vue";
import LogIn from "./../components/login/LogIn.vue";
import navbar from "./navbar.vue";
export default {
  components: {
    SignUp,
    LogIn,
    navbar
  },
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
  beforeDestroy() {
    this.$store.state.loginCom == "login";
  },
};
</script>