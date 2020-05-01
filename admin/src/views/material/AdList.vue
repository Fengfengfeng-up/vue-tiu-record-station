<template>
  <div>
    <h1>轮播图列表</h1>
    <el-table :data="model" style="width: 100%" max-height="500">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="数量">{{ count }}</el-table-column>
      <el-table-column prop="_id" label="ID"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="$router.push(`/ads/edit/${scope.row._id}`)"
          >编辑</el-button>
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
      model: [],
      count: 0
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/ads");
      this.model = res.data
      this.count = this.model[0].items.length
    },

    remove(row) {
      this.$confirm(`是否确定要删除 "${row.name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await this.$http.delete(`rest/ads/${row._id}`)
        
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