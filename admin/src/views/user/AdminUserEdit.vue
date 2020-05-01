<template>
  <div>
    <h1>{{ id ? "编辑" : "新增" }}管理员</h1>
    <el-form
      :model="model"
      status-icon
      :rules="rules"
      ref="model"
      label-width="100px"
      style="width:400px;"
      @submit.native.prevent="save"
    >
      <el-form-item label="昵称" prop="name">
        <el-input v-model="model.name" @change="checkValue"></el-input>
      </el-form-item>

      <el-form-item label="账号" prop="username">
        <el-input v-model="model.username" @change="checkValue"></el-input>
      </el-form-item>

      <el-form-item :label="isNew" prop="password">
        <el-input type="password" v-model="model.password" autocomplete="off" @change="checkValue"></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="model.checkPass" autocomplete="off" @change="checkValue"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" :disabled="submitState" native-type="submit">提交</el-button>
        <el-button @click="resetForm('model')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    // 由路由传来的id
    id: {}
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("昵称不能为空"));
      }
      setTimeout(() => {
        callback();
      }, 500);
    };

    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      setTimeout(() => {
        callback();
      }, 500);
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.model.checkPass !== "") {
          this.$refs.model.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.model.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        this.submitState = false;
        callback();
      }
    };
    return {
      model: {
        name: "",
        username: "",
        password: ""
      },
      checkPass: "",
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        username: [{ validator: checkUsername, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      submitState: false,
      isNew: "密码"
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async save() {
      let res;
      if (this.id) {
        console.log("修改");
        res = await this.$http.put(`rest/admin_users/${this.id}`, this.model); // 修改
      } else {
        res = await this.$http.post("rest/admin_users", this.model); // 新增
      }
      console.log(res.data);

      this.$router.push("/admin_users/list");

      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/admin_users/${this.id}`); 
      this.model = res.data;
      console.log(res.data);
    },
    checkValue() {
      if (!this.id) {
        if (!this.model.name || !this.model.username || !this.model.password) {
          this.submitState = true;
        }
      } else {
        if (!this.model.name || !this.model.username) {
          this.submitState = true;
        }
      }
    }
  },
  created() {
    this.id && this.fetch(); 
    if (this.id) {
      this.isNew = "新密码";
    }
  }
}
</script>