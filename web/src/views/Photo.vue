<template>
  <div class="photos" :class="`bg-photos-${this.currentCategory}`">
    <div class="py-3">
      <h2 class="m-0 mt-4 py-3 text-center text-grey-3">留下来的，即是最珍贵</h2>
      <ul class="category fs-lg pt-2 pb-4 d-flex jc-between px-6 text-grey">
        <li v-for="(cat, k) in cats" :key="k">
          <span class="pr-2" :class="{'text-white': on === k}" @click="change(k)">{{cat[0]}}</span>
          <i v-if="k != cat.length * 2">/</i>
        </li>
      </ul>

      <div class="photos-items">
        <router-link
          v-for="(item, i) in photos"
          :key="i"
          :to="'/photos/'+ currentCategory + '/' + item._id "
          tag="div"
          class="item"
        >
          <img v-lazy="item.items[0].img" class="w-100" alt />
        </router-link>
      </div>


      <div class="get-more mt-6 pb-5 text-center text-grey d-flex jc-center ai-center">
        <div class="line border-bottom"></div>
        <span class="px-3" @click="getMore">{{ isEmpty ? "已经到底啦" : "点我加载更多" }}</span>
        <div class="line border-bottom"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    category: { type: String }
  },
  data() {
    return {
      on: 0,
      index: 0,
      cats: [],
      photos: [],
      more: false,
      moreCount: 0,
      isEmpty: null,
      currentCategory: "",

      // isScorllToBottom: false
    };
  },
  watch: {
    category() {
      this.fetch();
    }
  },
  methods: {

    async fetch() {
      if (this.category) {
        // 如果是从子路由过来
        let category = ["people", "animal", "black_white", "view", "others"];
        this.index = category.indexOf(this.category);
        this.on = this.index;

        this.currentCategory = this.category;
        category = null;
      }
      // 默认显示的数据
      const res = await this.$http.get("photos/list/category");
      

      // console.log(this.index)

      this.photos = res.data[this.index].splice(
        0,
        res.data[this.index].length - 1
      );

      this.isEmpty = res.data[this.index].pop();

      // console.log(this.photos,this.isEmpty)
    },
    change(k) {
      window.scrollTo(0, 0)
      // 切换分类
      if(k === this.index) {
        return 
      }

      this.on = k;
      this.index = k;
      
      let category = ["people", "animal", "black_white", "view", "others"];
      this.currentCategory = category[k];

      this.$router.push(`/photos/${this.currentCategory}`);

      this.moreCount = 0;
    },
    async getMore() {
      // 点击加载更多
      if (this.isEmpty) return; // 如果该分类下没有剩余数据，点击直接退出函数
      const res = await this.$http.get(
        `photos/list/${this.on}${this.moreCount}`
      );

      this.isEmpty = res.data.pop(); // 该值代表该分类下是否还有剩余图片

      this.photos = [...this.photos, ...res.data];

      this.more = true;
      this.moreCount = this.moreCount === 1 ? 0 : ++this.moreCount;
    },

    
    async fetchCat() {
      const res = await this.$http.get("category/photos");
      this.cats = res.data;
      this.englishCat = this.cats.map(cat => cat[1]);
    }
  },
  created() {
    this.fetchCat();
    this.category && this.fetch();
  }
};
</script>

<style lang="scss">
.photos {
  min-height: calc(100vh - 10.384615rem);
  // height: 100vh;
  .photos-items {
    width: 100vw;
    padding: 0 0.5rem;
    column-count: 3;
    column-gap: 0.5rem;
    column-width: auto;
  }
  .item {
    break-inside: avoid;
    margin-bottom: 0.25rem;
  }
}
</style>