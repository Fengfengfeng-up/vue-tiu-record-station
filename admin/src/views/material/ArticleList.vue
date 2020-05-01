<template>
  <div>
    <h1>文章列表</h1>
    <el-table :data="items" style="width: 100%" max-height="500">
      <el-table-column label="发布日期" width="180" fixed>{{ items.createdAt | date }}</el-table-column>
      <el-table-column prop="date" width="180" label="收录日期"></el-table-column>
      <el-table-column prop="title" width="250" label="标题"></el-table-column>
      <el-table-column prop="author" width="180" label="作者"></el-table-column>
      <el-table-column prop="category_name" width="180" label="类别"></el-table-column>
      <el-table-column prop="like" width="180" label="获赞" ></el-table-column>
      <el-table-column prop="pageview" width="180" label="浏览量" ></el-table-column>
      <el-table-column prop="_id" width="180" label="ID" ></el-table-column>
      <el-table-column fixed="right" width="180" label="操作" >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            plain
            @click="$router.push(`/articles/edit/${scope.row._id}`)"
          >编辑</el-button>
          <el-button type="danger" size="small" plain @click="remove(scope.row)">删除</el-button>
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
      items: [],
    };
  },
  filters: {
    date(val) {
      return dayjs(val).format("YYYY-MM-DD"); // 将 val 格式化为 08/15 形式
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/articles");
      this.items = res.data;
    },
    remove(row) {
      this.$confirm(`是否确定要删除文章 "${row.title}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.delete(`rest/articles/${row._id}`)
        
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.fetch()
      }).catch(() => {}); // 如不写catch()，则在点击取消时会报错
    }
  },
  created() {
    this.fetch()
  }
};
</script>