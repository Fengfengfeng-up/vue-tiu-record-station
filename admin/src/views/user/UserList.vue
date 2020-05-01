<template>
  <div>
    <h1>用户列表</h1>
    <el-table :data="items">
      <el-table-column prop="name" label="昵称"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="avatar" label="头像"></el-table-column>
      <el-table-column prop="school" label="学校"></el-table-column>
      <el-table-column prop="college" label="学院"></el-table-column>
      <el-table-column prop="grade" label="年级"></el-table-column>
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/users");
      this.items = res.data;
      console.log(res.data,"请求成功")
    },
    remove(row) {
      this.$confirm(`是否确定要删除"${row.name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.delete(`rest/users/${row._id}`)
        console.log(res)
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.fetch()
      }).catch(() => {}); 
    }
  },
  created() {
    this.fetch()
  }
};
</script>