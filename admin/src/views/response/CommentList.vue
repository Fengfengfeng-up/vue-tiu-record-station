<template>
  <div>
    <h1>留言列表</h1>
    <el-table :data="items" style="width: 100%" max-height="500">
      <el-table-column label="留言日期">{{ items.createdAt | date }}</el-table-column>
      <el-table-column prop="_id" label="ID"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <!-- <el-table-column prop="user_name" label="用户"></el-table-column> -->
      <!-- <el-table-column prop="like" label="获赞" ></el-table-column> -->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <!-- scope.row 表示当前这一行的数据  -->
          <el-button
            type="primary"
            size="small"
            @click="$router.push(`/articles/edit/${scope.row._id}`)"
          >编辑</el-button>
          <el-button type="primary" size="small" plain @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      items: []
    };
  },
  filters: {
    date(val) {
      return dayjs(val).format("MM/DD"); // 将 val 格式化为 08/15 形式
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/comments");
      this.items = res.data;
      console.log(res.data, "请求成功");
    },
    remove(row) {
      this.$confirm(`是否确定要删除文章 "${row.title}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`rest/comments/${row._id}`);
          console.log(res);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.fetch();
        })
        .catch(() => {});
    }
  },
  created() {
    this.fetch();
  }
};
</script>