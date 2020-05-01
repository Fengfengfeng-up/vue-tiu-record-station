<template>
  <div class="swiper prev-photo py-4" :class="{'bg-white pb-2': isPrev, 'px-4a pb-5': !isPrev}">
    <h1 class="motto text-center mb-0 pb-2" :class="{'mt-1': !isPrev}">{{data.name}}</h1>
    <swiper :options="swiperOption">
      <swiper-slide v-for="(item, i) in data.items" :key="i" class="swiper-inner bg-white pb-3">
        <img class="w-100 photo" :class="{'lasted': isPrev}" v-lazy="item.image" alt />
        <div
          class="relative px-4"
          :class="{'mx-2 pb-3 pt-4 text-dark-1': isPrev, 'py-3': !isPrev}"
        >
          <div v-if="!isPrev" class="text-dark-1 fs-lg pt-3">{{item.date}}</div>
          <h4 v-if="!isPrev" class="desc fs-xl m-0 pt-2 mb-4">{{item.desc}}</h4>
          <h3 v-if="isPrev" class="title fs-xxl">{{item.title}}</h3>
          <p class="desc fs-lgl" v-if="isPrev">{{item.desc}}</p>
          <div class="text-dark-1 d-flex jc-between">
            <span>{{item.location}}</span>
            <slot name="like" :item="item" >
            </slot>
          </div>
        </div>
      </swiper-slide>
      
      
    </swiper>
  </div>
</template>

<script>
export default {
  props: {
    isPrev: { type: Boolean },
    swiperOption: { type: Object },
    data: { type: Object, required: true },
    isDetail: { type: Boolean }
  }
};
</script>