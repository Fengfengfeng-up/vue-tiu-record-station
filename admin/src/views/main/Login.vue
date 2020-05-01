<template>
  <div>
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>
<script>

export default {
  data() {
    return {
      model:{}
    }
  },
  methods: {
    async login() {
      const res = await this.$http.post('login', this.model)
      
      localStorage.token = res.data.token 

      const res2 = await this.$http.get('rest/admin_users')
      let currentUsername = this.model.username
      let currentUser
      for(let i in res2.data) {
        if(res2.data[i].username == currentUsername) {
          currentUser =  res2.data[i]
        } else {
          continue
        }
      }
      this.$message({
        type: 'success',
        message: '登录成功'
      })
      localStorage.setItem("adminUser", JSON.stringify(currentUser))
      console.log(currentUser)
      this.$router.push('/')
    },


  }
}
</script>
<style>
  .login-card {
    width: 25rem;
    margin: 5rem auto;
  }
</style>