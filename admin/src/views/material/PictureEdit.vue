<template>
  <div>
    <h1>{{ id ? "修改" : "新" }}素材</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="标题"  style="width: 500px">
        <el-input v-model="model.title" placeholder="今天是什么系列呢" ></el-input>
      </el-form-item>
      <el-form-item label="分类" style="width: 500px;margin-top: 1rem">
        <el-select
          filterable
          multiple
          clearable
          v-model="model.categories_id"
          @change="getCategory"
        >
          <el-option 
            v-for="item in parents" 
            :key="item._id" 
            :label="item.name" 
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作者"  style="width: 500px;margin-top: 1rem">
        <el-input v-model="model.author" placeholder="你一定有个响亮的名字"></el-input>
      </el-form-item>
      <el-form-item label="描述" style="width: 500px;margin-top: 1rem">
        <el-input v-model="model.desc" type="textarea" placeholder="单纯就好看吗？~"></el-input>
      </el-form-item>
      <el-form-item label="拍摄时间" style="width: 500px;margin-top: 1rem">
        <el-input v-model="model.date" placeholder="快告诉我们呀"></el-input>
      </el-form-item>
      <el-form-item label="拍摄地点" style="width: 500px;margin-top: 1rem">
        <el-input v-model="model.location" placeholder="到底是哪呢"></el-input>
      </el-form-item>
      <el-form-item label="获赞数" style="width: 500px;margin-top: 1rem">
        <el-input v-model="model.like" placeholder="只能是数字噢"></el-input>
      </el-form-item>

      <el-form-item label="关联文章" style="width: 500px;margin-top: 1rem">
        <el-select 
        filterable
         v-model="model.article_id" 
         @change="getTitle">
          <el-option 
          v-for="item in articles" 
          :key="item._id" 
          :label="item.title" 
          :value="item._id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :md="24" v-for="(item, i) in model.items" :key="i">
            <el-form-item style="margin-top: 1rem">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="res => $set(item, 'img', res.url)"
              >
                <img v-if="item.img" :src="item.img" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item>
              <el-button size="mini" type="danger" @click="model.items.splice(i,1)">不要这张</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item style="margin-top: 1rem;">
        <el-button type="primary" @click="model.items.push({},)">添加图片</el-button>
        <el-button type="primary" native-type="submit" plain>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      model: {
        items: []
      },
      parents: [],
      articles: []
    };
  },
  methods: {
    getCategory(value) {
      let selectedCategory = []

      for (let i in this.parents) {
        for (let k in value) {
          if(this.parents[i]._id === value[k]) {
            selectedCategory.push(this.parents[i].name)
            selectedCategory[k-1] += " / " 
          }
        }
      }
      
      this.model.categories_name = selectedCategory
    },
    getTitle(value) {
      // 这里的value为选中的 el-option 的 value
      if(!value) return;
      let selectedArticle = this.articles.find(article => {
        return article._id == value;
      });
      this.model.article_title = selectedArticle.title; // 将选中的文章名加入model中
    },
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/pictures/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/pictures", this.model);
      }

      this.$router.push("/pictures/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/pictures/${this.id}`);
      this.model = Object.assign({}, this.model, res.data);
    },
    async fetchParents() {
      const res = await this.$http.get(`rest/categories`);
      this.parents = res.data;
    },
    async fetchArticles() {
      const res = await this.$http.get(`rest/pictures`);
      this.articles = res.data;
    }
  },
  created() {
    this.id && this.fetch();
    this.fetchParents();
    this.fetchArticles();
  }
};
</script>