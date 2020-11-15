<template>
    <div>
        <div class="py-5">
            <div class="container">
            <div class="row">
                <div class="mx-auto col-lg-6">
                <h1 class="mb-3">Đăng ký</h1>
                <el-form label-position="left" label-width="120px">
                    <el-form-item 
                        label="Tên"
                        :rules="[{ required: true}]">
                        <el-input v-model="name"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="Email"
                        :rules="[
                            { required: true, message: 'Please input email address', trigger: 'blur' },
                            { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
                        ]">
                        <el-input type="email" v-model="email"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="Username"
                        :rules="[{ required: true},{type: 'username'}]">
                        <el-input v-model="username"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="Mật khẩu"
                         :rules="[{ required: true},{type:'password'}]">
                        <el-input type="password" v-model="password"></el-input>
                    </el-form-item>
                    <el-form-item 
                        label="Giới tính"
                        :rules="[{ required: true}]">
                        <el-select v-model="gender" placeholder="Select">
                            <el-option
                            v-for="item in lgender"
                            :key="item.index"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="Ngày sinh"
                        :rules="[{ required: true}]">
                        <el-date-picker
                        v-model="date"
                        type="date"
                        placeholder="Chọn ngày">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item 
                        label="Quốc gia"
                        :rules="[{ required: true}]">
                        <el-select v-model="country" placeholder="Select">
                            <el-option
                            v-for="item in lcountry"
                            :key="item.index"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item 
                        label="Đang là"
                        :rules="[{ required: true}]">
                        <el-select v-model="job" placeholder="Select">
                            <el-option
                            v-for="item in ljob"
                            :key="item.index"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
    
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="mr-1" @click="signup">Đăng ký</el-button>
                    </el-form-item>
                </el-form>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
    import validator from 'validator';
    export default{
        data() {
            return {
                name:'',
                username:'',
                password:'',
                email:'',
                phone:'',
                date:'',
                country:'Viet Nam',
                lcountry:[],
                job:'Giáo viên',
                ljob:[{name:"Giáo viên"},{name:"Học sinh"},{name:"Sinh viên"},{name:"Khác"}],
                gender:'Nam',
                lgender:[{name:"Nam"},{name:"Nữ"},{name:"Khác"}]
            };
        },
        created(){
            this.axios.get(this.$store.state.server+'utils/country.json')
                .then(res=>{
                    this.lcountry=res.data
                })
                .catch(function (err) {
                    console.log("error")
                });
        },
        methods:{
            signup: function() {
                if (this.name==''||this.username==''||this.email==''||this.password==''){
                    this.$message({
                        showClose: true,
                        message: 'Form điền chưa đủ',
                        type: 'error'
                    })
                }
                else if (this.password.length<8){
                    this.$message({
                        showClose: true,
                        message: 'Password phải dài từ 8 kí tự trở lên',
                        type: 'error'
                    })
                }
                else if (validator.isEmail(this.email)==false){
                    this.$message({
                        showClose: true,
                        message: 'Địa chỉ email sai',
                        type: 'error'
                    })
                }
                else if (validator.isAlphanumeric(this.username,['en-US'])==false){
                    this.$message({
                        showClose: true,
                        message: 'username chỉ bao gồm chữ cái và chữ số, viết liền, không dấu',
                        type: 'error'
                    })
                }
                else{
                    this.axios.post(
                        'user/signup', 
                        JSON.stringify({
                            name: this.name,
                            username:this.username,
                            password: this.password,
                            email:this.email,
                            phone:this.phone,
                            date:this.date,
                            gender:this.gender,
                            address:this.address,
                            job:this.job
                        }),
                        {
                        headers: {
                            "Content-Type": "application/json",crossDomain: true
                        }
                    }).then(res=>{
                        this.$router.push('/dashboard');
                    }).catch(function(e){
                        this.$message({
                            showClose: true,
                            message: 'Email hoặc Username đã được đăng ký',
                            type: 'error'
                        })
                    })
                }
            },
            loginCom: function(){
                this.$store.state.loginCom='login';
            }
        }
    }

</script>