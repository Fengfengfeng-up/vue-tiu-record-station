<template>
  <div class="photo-detail bg-dark-1">
    <div class="swiper">
      <swiper
        :options="swiperOption"
        ref="mySwiper"
        @slide-change="() => active = $refs.mySwiper.swiper.activeIndex"
        class="show-swiper"
      >
        <swiper-slide v-for="(item, i) in photos" :key="i" class="swiper-inner bg-white">
          <div class="swiper-item">
            <img class="w-100" v-lazy="item.items[0].img" alt />

            <div class="relative p-4 mx-2 text-dark-1">
              <div class="text-dark-1 fs-lg pt-3">{{item.date}}</div>
              <h3 class="title fs-xxl">{{item.title}}</h3>
              <p class="desc fs-lgl mb-0">{{item.desc}}</p>
              <div class="text-dark-1 d-flex jc-between">
                <span>{{item.location}}</span>
                <div
                  @click="pick(item._id, item.isPicked = !item.isPicked,item.isPicked? ++item.like : --item.like)"
                >
                  <i
                    class="iconfont fs-sm text-red-1 pr-1"
                    :class="{'icon-xinaixin': item.isPicked, 'icon-xin': !item.isPicked}"
                  ></i>
                  {{item.like}}
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>

        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
        <div class="swiper-button-prev swiper-button-white" slot="button-next"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    category: { required: true },
    id: { required: true }
  },
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          type: "" //分式指示器
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },

        slidesPerView: "auto",
        watchSlidesProgress: true, // 设定slide与左边框的预设偏移量（单位px）
        slidesOffsetBefore: 0, // 设置slide之间的距离（单位px）
        spaceBetween: 0,
        centeredSlides: true,
        init: false,
        on: {
          progress: function() {
            for (let i = 0; i < this.slides.length; i++) {
              const slide = this.slides.eq(i);
              const slideProgress = this.slides[i].progress;
              const scale = 1 - Math.abs(slideProgress) / 5; // 缩放权重值，随着progress由中向两边依次递减，可自行调整
              slide.transform(`scale3d(${scale}, ${scale}, 1)`);
            }
          }
        }
      },

      count: 0,
      isPicked: false,
      photos: [],
      active: 0,
      bgColor: ""
    };
  },
  methods: {
    ...mapMutations([
      'onLoading'
    ]),
    async fetch() {
      this.onLoading()

      const res = await this.$http.get(`photos/${this.category}`);
      this.photos = res.data;

      let ids = this.photos.map(item => {
        return item._id;
      });

      let clickedId = ids.indexOf(this.id); // 被点击的图片 id

      this.swiper.init();
      this.$refs.mySwiper.swiper.slideTo(clickedId); // 跳转到对应的 id

      this.onLoading()
    },
    async pick(id, isPicked, like) {
      // 点赞

      let data = [id, like];
      const res = await this.$http.post("update/photo", data);

      // console.log(res.data);
    },

    initSwiper() {
      this.$nextTick(async () => {
        await this.swiper.init(); // 现在才初始化
        await this.swiper.slideTo(this.activeItemIndex);
      });
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    this.initSwiper();
  },
  created() {
    this.category && this.id && this.fetch();
    // this.bgColor = this.category;
  }
};
</script>

<style lang="scss" scoped >
.swiper-button-prev,
.swiper-button-next {
  top: 30% !important;
  transform: scale(0.5);
}
.swiper {
  width: 100%;
  height: calc(100vh - 10rem);
  top: 0;
  position: relative;
  overflow: hidden;

  .show-swiper {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0 auto;

    .swiper-slide {
      width: 30.769231rem;
      transition: all 0.4s cubic-bezier(.4, 0, .2, 1);

    }
  }
}
</style>