<template>
  <div class="home">
    <div class="banner-main">
      <div class="banner-main-text text-dark-2 text-center w-100">
        <div>When your gaze into this world</div>
        <div>it's also watching you.</div>
      </div>
    </div>

    <!-- lastedPhotos -->
    <m-main-swiper :swiperOption="swiperOption" :data="lastedPhotos">
      <template #like="{item}">
        <div
          @click="pick(item.title, item.isPicked = !item.isPicked, item.isPicked? ++item.like : --item.like)"
        >
          <i
            class="iconfont fs-sm text-red-1 pr-1"
            :class="{'icon-xinaixin': item.isPicked, 'icon-xin': !item.isPicked}"
          ></i>
          <span>{{ item.like }}</span>
        </div>
      </template>
    </m-main-swiper>

    <!-- prevPhotos -->
    <m-main-swiper :swiperOption="swiperOption" isPrev :data="prevPhotos">
      <template #like="{item}">
        <div
          class="text-black"
          @click="pick(item.title, item.isPicked = !item.isPicked, item.isPicked? ++item.like : --item.like)"
        >
          <template>
            <i
              class="iconfont fs-sm text-red-1 pr-1"
              :class="{'icon-xinaixin': item.isPicked, 'icon-xin': !item.isPicked}"
            ></i>
            {{item.like}}
          </template>
        </div>
      </template>
    </m-main-swiper>

    <!-- mainPhotos -->
    <div class="photos-wrap bg-white pt-5 mt-5">
      <div class="photos-more d-flex jc-between p-4">
        <h2 class="m-0 fs-xxl">记录美好瞬间</h2>
        <router-link to="/photos/people" class="fs-lg d-flex text-grey-1">
          更多
          <i class="iconfont icon-you fs-sm"></i>
        </router-link>
      </div>

      <router-link
        tag="div"
        :to="`/photos/${item.categories_name[1]}/${item._id}`"
        class="photo"
        v-for="(item, i) in photosCats"
        :key="i"
      >
        <img v-lazy="item.items[0].img" class="w-100" :alt="item.title" />
        <div class="tip d-flex jc-between pt-3 pb-4 h-100">
          <span class="photo-category text-white bg-black">{{item.categories_name[0]}}</span>
          <span class="photo-title fs-xl text-white">{{item.title}}</span>
        </div>
      </router-link>
    </div>

    <div class="articles-wrap bg-white px-4 pt-8 pb-6">
      <div class="d-flex jc-between">
        <h2 class="m-0 pb-2 fs-xxl">最新文章</h2>
        <router-link to="/articles/study" class="fs-lg d-flex text-grey-1">
          更多
          <i class="iconfont icon-you fs-sm"></i>
        </router-link>
      </div>

      <router-link
        tag="div"
        :to="`/articles/${item.category_name[1]}/${item._id}`"
        class="article"
        v-for="(item, i) in articlesCats"
        :key="i"
      >
        <div class="article-item pr-4">
          <p class="fs-md m-0 pt-4 pb-2 text-grey">{{item.date}}</p>
          <p class="fs-xl m-0 text-grey-1">【{{item.category_name[0]}}】 {{item.title}}</p>
        </div>
      </router-link>
    </div>

    <div class="comments px-4 pt-4 pb-5 mt-5 bg-white-1">
      <h3 class="m-0 py-3 fs-xxl">留言板</h3>
      <p class="text-dark pb-3 fs-lg">网络一线牵，珍惜这段缘。</p>
      <span
        class="text-red-1 py-2 px-3 entry"
        :class="{'text-white bg-red-1': into}"
        @click="go"
      >点我进入</span>
    </div>
  </div>
</template>

<script>
// import dayjs from "dayjs"; // 使用 dayjs 处理时间

export default {
/*   filters: {
    date(val) {
      return dayjs(val).format("MM/DD"); // 将 val 格式化为 08/15 形式
    }
  }, */
  data() {
    return {
      openStatus: false,
      swiperOption: {
        autoplay: {
          delay: 3000, //自动切换的时间间隔，单位ms
          stopOnLastSlide: false, //当切换到最后一个slide时停止自动切换
          disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay。
          reverseDirection: true, //开启反向自动轮播。
          waitForTransition: true //等待过渡完毕。自动切换会在slide过渡完毕后才开始计时。
        }
      },
      swiperSlides: [1, 2, 3],
      newsCats: [],
      heroesCats: [],
      videosCats: [],
      strategiesCats: [],
      prevPhotos: {},
      lastedPhotos: {},
      photosCats: [],
      into: false,
      articlesCats: []
    };
  },
  methods: {
    async pick(title, isPicked, like) {
      // 点赞

      let data = [title, like];
      const res = await this.$http.post("update/home", data);

      // console.log(res.data);

    },
    go() {
      this.into = !this.into;
      this.$router.push("/comments");
    },
    async fetchBannersCats() {
      const res = await this.$http.get("ads/list");
      [this.lastedPhotos, this.prevPhotos] = res.data;
    },
    async fetchPhotosCats() {
      const res = await this.$http.get("mainphotos/list");
      this.photosCats = res.data;
    },
    async fetchArticlesCats() {
      const res = await this.$http.get("mainarticles/list");
      this.articlesCats = res.data;
    }
  },
  created() {
    this.fetchBannersCats();
    this.fetchPhotosCats();
    this.fetchArticlesCats();
  }
};
</script>

<style lang="scss">
@import "../assets/scss/variables";

.banner-main {
  height: 40rem;
  background: url("../assets/images/4.jpg") no-repeat center;
  background-size: 180% auto;
  position: relative;

  .banner-main-text {
    font-weight: bold;
    font-size: 1.9rem;
    line-height: 1.6rem;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    position: absolute;
    bottom: 3rem;
    left: 0;
    & > div {
      line-height: 2.2rem;
    }
  }
}

.photos-wrap {
  .photo {
    position: relative;

    .tip {
      position: absolute;
      left: 1rem;
      top: 0;
      flex-direction: column;

      .photo-category {
        width: fit-content;
        padding: 0.230769rem;
      }

      .photo-title {
        font-weight: bold;
      }
    }
  }
}

.comments {
  .entry {
    border: 1px solid map-get($colors, "red-1");
    border-radius: 5px;
  }
}
</style>
