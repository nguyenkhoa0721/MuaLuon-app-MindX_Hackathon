</<template>
    <div class="limiter">
        <div class="container-login">
            <form class="login-form pt-5">
                <span class="login-form-title">
                    <h1>LOGIN</h1>
                </span>
                <div class="wrap-input validate-input">
                    <input class="input" type="email" name="email" placeholder="Email" v-model="username">
                    <span class="focus-input"></span>
                    <span class="symbol-input">
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                    </span>
                </div>
                <!--Pass-->
                <div class="wrap-input validate-input">
                    <input class="input" type="password" name="pass" placeholder="Password" v-model="password">
                    <span class="focus-input"></span>
                    <span class="symbol-input">
                        <i class="fa fa-lock" aria-hidden="true"></i>
                    </span>
                </div>
                <!--Button-->
                <div class="container-login-form-btn">
                    <button class="login-form-btn" @click.prevent="login">
                        Đăng nhập
                    </button>
                </div>
                <!--Forgot-->
                <div class="text-center pt-2">
                    <a class="txt" href="#" @click="forgotCom">
                        Quên mật khẩu
                    </a>
                </div>
                <!--Regis-->
                <div class="text-center pt-1">
                    <span class="txt0">
                        Chưa có tài khoản?
                    </span>
                    <a class="txt" href="#" @click="signupCom">
                        Đăng ký
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            username:'',
            password:''
        };
    },
    methods:{
        login: function() {
            this.axios.post(
                '/user/login', 
                JSON.stringify({
                    email: this.username,
                    password: this.password
                }),
                {
                headers: {
                    "Content-Type": "application/json",crossDomain: true
                }
            })
            .then(res => {
                  this.username='';
                  this.password='';
                  this.checkLogin();
                  this.$router.push('/listchat');
            })
            .catch(e => {
                if(e.response.status == 401){
                  this.$message({
                    showClose: true,
                    message: 'Email hoặc mật khẩu không đúng',
                    type: 'error'
                  });
                }
            })
        },
        signupCom: function(){
            this.$store.state.loginCom='signup';
        },
        forgotCom: function(){
            this.$store.state.loginCom='forgot';
        },
        checkLogin(){
            this.axios.get(
                '/user/islogged', 
                {
                headers: {
                    "Content-Type": "application/json",crossDomain: true
                }
            })
            .then(res =>{
                if (res.data.fuser){
                    this.$store.state.loginCom='auth'
                    this.$store.state.user=res.data.fuser.username;
                    this.$store.state.userid=res.data.fuser.id;
                    this.$store.state.userInfo=res.data.fuser
                    return false
                }
                else{
                    this.$store.state.loginCom='login'
                    return true
                }
            })
        }
    }
}

</script>
<style scoped>


/*//////////////////////////////////////////////////////////////////
[ RESTYLE TAG ]*/

* {
	margin: 0px; 
	padding: 0px; 
	box-sizing: border-box;
}

body, html {
}

/*---------------------------------------------*/
a {
	font-size: 14px;
	line-height: 1.7;
	color: #666666;
	margin: 0px;
	transition: all 0.4s;
	-webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
}

a:focus {
	outline: none !important;
}

a:hover {
	text-decoration: none;
  
}

/*---------------------------------------------*/
h1,h2,h3,h4,h5,h6 {
	margin: 0px;
}

p {
	font-size: 14px;
	line-height: 1.7;
	color: #666666;
	margin: 0px;
}

ul, li {
	margin: 0px;
	list-style-type: none;
}


/*---------------------------------------------*/
input {
	outline: none;
	border: none;
}

textarea {
  outline: none;
  border: none;
}

textarea:focus, input:focus {
  border-color: transparent !important;
}

input:focus::-webkit-input-placeholder { color:transparent; }
input:focus:-moz-placeholder { color:transparent; }
input:focus::-moz-placeholder { color:transparent; }
input:focus:-ms-input-placeholder { color:transparent; }

textarea:focus::-webkit-input-placeholder { color:transparent; }
textarea:focus:-moz-placeholder { color:transparent; }
textarea:focus::-moz-placeholder { color:transparent; }
textarea:focus:-ms-input-placeholder { color:transparent; }

input::-webkit-input-placeholder { color: #999999; }
input:-moz-placeholder { color: #999999; }
input::-moz-placeholder { color: #999999; }
input:-ms-input-placeholder { color: #999999; }

textarea::-webkit-input-placeholder { color: #999999; }
textarea:-moz-placeholder { color: #999999; }
textarea::-moz-placeholder { color: #999999; }
textarea:-ms-input-placeholder { color: #999999; }

/*---------------------------------------------*/
button {
	outline: none !important;
	border: none;
	background: transparent;
}

button:hover {
	cursor: pointer;
}

iframe {
	border: none !important;
}


/*//////////////////////////////////////////////////////////////////
[ Utility ]*/
.txt0 {
  line-height: 1.5;
}

.txt {
  font-size: 14px;
  color: #7952b3;
}


/*//////////////////////////////////////////////////////////////////
[ login ]*/

.limiter {
 
}

.container-login {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}

.wrap-login {
  width: 960px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 177px 130px 33px 95px;
}

/*------------------------------------------------------------------
[  ]*/
.login-pic {
  width: 316px;
}

.login-pic img {
  max-width: 100%;
}


/*------------------------------------------------------------------
[  ]*/
.login-form {
  width: 400px;
}

.login-form-title {
  font-size: 30px;
  color: #000000;
  line-height: 1.2;
  text-align: center;

  width: 100%;
  display: block;
  padding-bottom: 40px;
}


/*---------------------------------------------*/
.wrap-input {
  position: relative;
  width: 100%;
  z-index: 1;
  margin-bottom: 10px;
}

.input {
  font-size: 15px;
  line-height: 1.5;
  color: #000000;

  display: block;
  width: 100%;
  background: #e6e6e6;
  height: 50px;
  border-radius: 25px;
  padding: 0 30px 0 68px;
}


/*------------------------------------------------------------------
[ Focus ]*/
.focus-input {
  display: block;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 0px 0px;
  color: rgba(121,82,179, 0.8);
}

.input:focus + .focus-input {
  animation: anim-shadow 0.5s ease-in-out forwards;
}

@-webkit-keyframes anim-shadow {
  to {
    box-shadow: 0px 0px 70px 25px;
    opacity: 0;
  }
}

@keyframes anim-shadow {
  to {
    box-shadow: 0px 0px 70px 25px;
    opacity: 0;
  }
}

.symbol-input {
  font-size: 15px;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-left: 35px;
  pointer-events: none;
  color: #666666;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.input:focus + .focus-input + .symbol-input {
  color: #7952b3;
  padding-left: 28px;
}

/*------------------------------------------------------------------
[ Button ]*/
.container-login-form-btn {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 20px;
  margin: auto;
}

.login-form-btn {
  font-size: 15px;
  line-height: 1.5;
  color: #fff;
  text-transform: uppercase;

  width: 100%;
  height: 50px;
  border-radius: 25px;
  background: #a66ff7;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.login-form-btn:hover {
  background: #7952b3;
}



/*------------------------------------------------------------------
[ Responsive ]*/



@media (max-width: 992px) {
  .wrap-login {
    padding: 177px 90px 33px 85px;
  }

  .login-pic {
    width: 35%;
  }

  .login-form {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .wrap-login {
    padding: 100px 80px 33px 80px;
  }

  .login-pic {
    display: none;
  }

  .login-form {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .wrap-login {
    padding: 100px 15px 33px 15px;
  }
}


/*------------------------------------------------------------------
[ Alert validate ]*/

.validate-input {
  position: relative;
}

.alert-validate::before {
  content: attr(data-validate);
  position: absolute;
  max-width: 70%;
  background-color: white;
  border: 1px solid #c80000;
  border-radius: 13px;
  padding: 4px 25px 4px 10px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 8px;
  pointer-events: none;

  color: #c80000;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;

  visibility: hidden;
  opacity: 0;

  -webkit-transition: opacity 0.4s;
  -o-transition: opacity 0.4s;
  -moz-transition: opacity 0.4s;
  transition: opacity 0.4s;
}

.alert-validate::after {
  content: "\f06a";
  display: block;
  position: absolute;
  color: #c80000;
  font-size: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 13px;
}

.alert-validate:hover:before {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 992px) {
  .alert-validate::before {
    visibility: visible;
    opacity: 1;
  }
}
</style>