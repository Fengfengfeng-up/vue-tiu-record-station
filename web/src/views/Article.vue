<template>
  <div class="aticles pb-3">
    <div class="d-flex jc-between text-center bg-white border-bottom">
      <div
        class="flex-1 fs-xl text-grey-2 pt-4 pb-3"
        :class="{'text-black onthis': index === i}"
        @click="$refs.mySwiper.swiper.slideTo((index = i))"
        v-for="(cat, i) in model"
        :key="i"
      >{{cat.name}}</div>
    </div>

    <div class="swiper">
      <swiper
        :options="swiperOption"
        ref="mySwiper"
        @slide-change="() => index = $refs.mySwiper.swiper.activeIndex"
      >
        <swiper-slide v-for="(item, k) in model" :key="k">
          <van-list
            :immediate-check="false"
            v-model="loading"
            :finished="finished"
            :finished-text="index === 0 ? '———— 我是有底线的 ————' : '———— 我也是有底线的 ————'"
            @load="onLoad"
            :offset="100"
          >
            <div
              :class="{'mb-4': j === (item.articleList.length-1), 'mt-1': j != 0}"
              class="p-4 mb-2 pb-3 bg-white"
              v-for="(article, j) in item.articleList"
              :key="j"
              @click="$router.push(`/articles/${category}/${article._id}`)"
            >
              <h4 class="m-0 fs-xl text-black title">{{article.title}}</h4>
              <p v-html="article.body" class="text-ellipsis-3 fs-lg text-dark-3"></p>
              <div class="fs-xs text-grey pt-1">
                <span>{{article.author}}</span>
                <span class="ml-2 pl-1">{{article.pageview ? article.pageview : 0}} 阅读</span>
                <span class="ml-2 pl-1">{{article.comments ? article.comments.length : 0}} 评论</span>
                <span class="ml-2">{{article.like}}赞</span>
              </div>
            </div>
          </van-list>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: {
    category: { requried: true }
  },
  data() {
    return {
      model: [],
      index: 0,
      loading: false,
      finished: false,
      fetchMoreCount: 1,
      swiperOption: {
        autoHeight: true
      }
    };
  },
  watch: {
    index() {
      window.scrollTo(0, 0);
      this.fetchMoreCount = 1;

      if (this.model[this.index].isEmpty) {
        // 如果剩余长度小于每次加载必需长度，则停止 loading
        this.finished = true;
      } else {
        this.finished = false;
      }
    }
  },
  methods: {
    ...mapMutations(["onLoading"]),
    
    async onLoad() {

      // 单个分类数据全部加载完成
      if (this.model[this.index].articleList.length >= 12) {
        this.finished = true;

        this.model[this.index].isEmpty = true; // 修改单个分类的 isEmty 为 true，防止切换时再次加载数据
      }

      // 异步更新数据
      console.log(this.fetchMoreCount)
      const leftLength = await this.fetchMore();

      // this.fetchMoreCount++;

      console.log(leftLength)

      if (leftLength < 5) {
        // 如果剩余长度小于每次加载必需长度，则停止 loading
        this.finished = true;

        this.model[this.index].isEmpty = true; // 修改单个分类的 isEmty 为 true，防止切换时再次加载数据
      }

      // 加载状态结束
      this.loading = false;
    },

    async fetchMore() {
      const res = await this.$http.get(
        `articles/more/${this.index}${this.fetchMoreCount++}`
      );
      
      let leftLength = res.data.pop();
      let data = res.data;

      this.model[this.index].articleList.push(...data); // 录入对应的数据

      // console.log(this.model[this.index].articleList.length)
      

      return leftLength;
    },

    async fetch() {
      this.onLoading();

      const res = await this.$http.get("articles/list");
      this.model = res.data;
      // console.log(this.model)

      let cats = ["study", "life", "story", "emotion"];
      this.index = cats.indexOf(this.category);

      this.$refs.mySwiper.swiper.slideTo(this.index);

      this.onLoading();
    }
  },
  created() {
    this.category && this.fetch();
  }
};
</script>

<style lang="scss">
.aticles {
  min-height: calc(100vh - 10.4rem);
  .onthis {
    position: relative;
    font-weight: 600;
  }
  .onthis::after {
    display: inline-block;
    content: "";
    width: 1.2rem;
    height: 3px;
    background: #cc0000;
    position: absolute;
    bottom: 0;
    left: calc(50% - 0.6rem);
  }

  .title {
    line-height: 1.6rem;
  }
}
</style>