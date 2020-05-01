<template>
  <van-pull-refresh
    class="comments-wrap text-center"
    :offset="150"
    success-duration="1000"
    animation-duration="800"
    success-text="刷新成功"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <van-list
      :immediate-check="false"
      v-model="loading"
      loading-text=" "
      :finished="finished"
      finished-text="———— 我是有底线的 ————"
      @load="onLoad"
      :offset="50"
    >
      <div
        v-for="(comment, i) in comments"
        :key="i"
        class="comment mx-3 my-5 px-6 pt-6 pb-5 bg-red-1 text-center"
        @click="$router.push(`/comments/write/${comment._id}`)"
        :class="`bg-comment-${Math.floor(Math.random() * 10 / 2)}`"
      >
        <p class="text-white text-ellipsis-3">{{comment.content}}</p>
        <span class="text-white-2 fs-sm">{{comment.date}}</span>
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      comments: [],
      loading: false,
      finished: false,
      refreshing: false,
      fecthCount: 1
    };
  },
  methods: {
    ...mapMutations(["onLoading"]),
    async fetch() {
      const res = await this.$http.get(`comments/list/${this.fecthCount}`);
      // console.log(res.data);

      let leftLength = res.data[res.data.length - 1]; // 6是每次加载的留言数量，写个大于6的数即可

      this.comments = [
        ...this.comments,
        ...res.data.splice(0, res.data.length - 1)
      ];

      this.fecthCount++;

      return leftLength;
    },

    async onLoad() {
      if (this.refreshing) {
        this.comments = [];
        this.refreshing = false;
      }

      // 异步更新数据
      const leftLength = await this.fetch();

      // 加载状态结束
      this.loading = false;

      if (leftLength < 6) {
        this.finished = true;
      }

      // 数据全部加载完成
      if (this.comments.length >= 36) {
        this.finished = true;
      }
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;

      this.fecthCount = 1; // 重置次数
      this.onLoad();
    }
  },
  async created() {
    this.onLoading();

    await this.fetch();

    this.onLoading();
  }
};
</script>

<style lang="scss">
.comments-wrap {
  min-height: calc(100vh - 10.4rem);
}

.van-pull-refresh__track {
  padding-bottom: 2rem;
}
.van-pull-refresh__head {
  height: 3rem;
  line-height: 3rem;
}
.van-list__finished-text {
  text-align: center;
  color: #b5b5bd;
}

.comment {
  height: 14rem;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.5s;

  &:first-of-type {
    margin-top: 0.5rem;
  }

  &::before {
    display: inline-block;
    position: absolute;
    content: "";
    width: 30px;
    height: 30px;
    border: 3px #fff;
    border-style: none none solid solid;
    transform: rotate(-45deg);
    top: 0;
    left: calc(50% - 15px);
    border-radius: 50%;
  }
}
</style>