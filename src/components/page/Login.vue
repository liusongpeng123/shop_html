<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="name">
          <el-input v-model="param.name" placeholder="name">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
          <el-row align="center">
            <el-button type="primary" @click="submitForm()">登录</el-button>
            <el-button type="primary" @click="dialogFormVisible = true">注册</el-button>
          </el-row>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>




    <el-dialog title="用户信息注册" :visible.sync="dialogFormVisible" align="center">
      <el-form :model="user"  label-width="80px" >
        <el-form-item label="账号" style="width: 600px" >
          <el-input v-model="user.name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" style="width: 600px" >
          <el-input v-model="user.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" style="width: 600px" >
          <el-input type="password"  v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" style="width: 600px" >
          <el-radio-group v-model="user.sex">
            <el-radio label="1" >男</el-radio>
            <el-radio label="2" >女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学历" style="width: 600px">
          <el-select v-model="user.eduId" placeholder="请选择学历">
            <el-option label="小学" value="1"></el-option>
            <el-option label="中学" value="2"></el-option>
            <el-option label="高中" value="3"></el-option>
            <el-option label="大学" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="部门" style="width: 600px">
          <el-select v-model="user.deptId" placeholder="请选择部门">
            <el-option label="教育部" value="1"></el-option>
            <el-option label="维修部" value="2"></el-option>
            <el-option label="人事部" value="3"></el-option>
            <el-option label="财务部" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" style="width: 600px" >
          <el-input type="phone"  v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" style="width: 600px" >
          <el-input type="email"  v-model="user.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" style="width: 600px" >
          <el-input type="idCard"  v-model="user.idCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" style="width: 600px">
        <el-date-picker
          v-model="user.birthday"
          align="right"
          type="date"
          placeholder="请选择出生日期"
          :picker-options="pickerOptions">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="头像" prop="imgpath" style="width: 600px" >
          <img  :src="user.imgpath" class="avatar" width="50px">
          <el-upload
            class="upload-demo"
            action="http://localhost:8080/api/user/load"
            :on-success="imgCallBack"
            name="img" style="width: 440px"
            list-type="picture">
            <el-button plain type="primary" class="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="zuce()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
          return{
            pickerOptions: {
              disabledDate(time) {
                return time.getTime() > Date.now();
              },
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: '昨天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }, {
                text: '一周前',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }]
            },
            dialogFormVisible:false,
            user:{},
            param: {
              name: "",
              password: "",
            },
            rules: {
              name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
              password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
          }
        }, methods: {
        submitForm() {
          this.$refs.login.validate(valid => {
            if (valid) {
              debugger;
              console.log(this.param);
              this.$axios.get("http://localhost:8080/api/user/queryUserByName?name="+this.param.name+"&password="+this.param.password).then(rs=>{
                    // 100 密码错误，200 登录成功，  300 账号不存在
                if(rs.data.message==100){
                  this.$message.success('密码错误');
                }else if(rs.data.message==200){
                  this.$message.success('登录成功');
                  localStorage.setItem('ms_username', this.param.name);
                  this.$router.push('/');
                }else if(rs.data.message==300){
                  this.$message.success('账号不存在');
                }
              }).catch(err=>console.log("登录异常"));

            } else {
              this.$message.error('请输入账号和密码');
              console.log('error submit!!');
              return false;
            }
          });
        },
        imgCallBack:function(response, file, fileList){ //图片上传的回调函数
          // 赋值
          this.user.imgpath=response.data;
        },
        zuce(){
          this.$axios.post("http://localhost:8080/api/user/addUser",this.$qs.stringify(this.user)).then(rs=>{

              if(rs.data.message==200){
                  alert("账号已存在");
              }else if (rs.message==300){
                alert("用户注册成功");
                this.dialogFormVisible=false;
              }
          }).catch(err=>console.log("注册失败"))
        },
      },
    }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
  }
  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }
  .ms-content {
    padding: 30px 30px;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }
  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }
</style>
