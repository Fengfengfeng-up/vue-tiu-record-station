<template>
  <div>
    <h1>素材列表</h1>
    <el-button @click="resetDateFilter">清除日期过滤器</el-button>
    <el-button @click="clearFilter">清除所有过滤器</el-button>
    <el-row style="float: right">
      <el-input v-model="tableDataName" placeholder="请输入标题或者作者" style="width:240px"></el-input>
      <el-button @click="doFilter">搜索</el-button>
      <el-button type="primary" plain round @click="openData">返回</el-button>
    </el-row>
    <el-table
      ref="filterTable"
      :data="tableDataEnd"
      style="width: 100%"
      max-height="500"
      :default-sort="{prop: 'createdAt', prop: 'like', prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="createdAt"
        width="200"
        sortable
        fixed
        label="上传日期"
        column-key="createdAt"
        :filters="dateArr"
        :filter-method="filterHandler"
      ></el-table-column>
      <el-table-column prop="title" width="150" label="标题"></el-table-column>
      <el-table-column prop="author" width="150" label="作者"></el-table-column>
      <el-table-column label="分类" width="150">
        <template slot-scope="scope">
          <span v-for="(category, i) in scope.row.categories_name" :key="i">{{ category }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="like" sortable width="150" label="获赞数"></el-table-column>
      <el-table-column prop="date" label="拍摄时间" sortable width="150"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            plain
            @click="$router.push(`/pictures/edit/${scope.row._id}`)"
          >编辑</el-button>
          <el-button type="danger" size="small" plain @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems"
      fixed
      style="margin-top: 30px"
    ></el-pagination>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      model: [],
      dateArr: [],
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 4,
      pageSize: 2,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false
    };
  },
  filters: {
    date(val) {
      return dayjs(val).format("YYYY-MM-DD");
    }
  },
  methods: {
    //前端搜索功能需要区分是否检索,因为对应的字段的索引不同
    //用两个变量接收currentChangePage函数的参数
    doFilter() {
      if (this.tableDataName == "") {
        this.$message.warning("查询条件不能为空！");
        return;
      }
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.model.forEach((value, index) => {
        if (value.title || value.author || value.categories_name) {
          if (
            value.title.indexOf(this.tableDataName) >= 0 ||
            value.author.indexOf(this.tableDataName) >= 0
          ) {
            this.filterTableDataEnd.push(value);
          }
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    openData() {
      this.fetch();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(1);
    },

    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.model);
        console.log(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
        console.log(this.tableDataEnd);
      }
    }, //组件自带监控当前页码

    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },

    resetDateFilter() {
      this.$refs.filterTable.clearFilter("createdAt");
    },

    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },

    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },

    async fetch() {
      const res = await this.$http.get("rest/pictures");

      this.model = res.data.map(item => {
        item.createdAt = dayjs(item.createdAt).format("YYYY-MM-DD");
        this.dateArr.push({ text: item.createdAt, value: item.createdAt }); // 筛选日期选项数组
        return item;
      });

      this.dateArr.sort();

      this.totalItems = this.model.length;
      if (this.totalItems > this.pageSize) {
        for (let index = 0; index < this.pageSize; index++) {
          this.tableDataEnd.push(this.model[index]);
        }
      } else {
        this.tableDataEnd = this.model;
      }

      // console.log(this.model);
    },
    remove(row) {
      this.$confirm(`是否确定要删除 "${row.title}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`rest/pictures/${row._id}`);
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

