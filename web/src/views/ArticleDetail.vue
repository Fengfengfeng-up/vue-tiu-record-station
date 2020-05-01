<template>
  <div class="page-article mt-2" v-if="model" @touchmove="noScroll">
    <div class="bg-white px-4 pt-4 pb-5">
      <h4 class="title m-0 pb-3 fs-xxl text-black">{{ model.title }}</h4>
      <div class="pb-1">
        <span class="text-info">{{model.author}}</span>
        <span class="text-grey-2 pl-2 pr-1">【{{model.category_name[0]}}】</span>
        <span class="text-grey">{{model.date}}</span>
      </div>
      <vue-editor
        class="pt-4 pb-6 body"
        v-model="model.body"
        disabled
        :editorToolbar="customToolbar"
      ></vue-editor>

      <div
        class="picking py-3 px-3 d-flex jc-around"
        :class="{'on': model.isPicked}"
        @click="pick(model._id, model.isPicked? --model.like : ++model.like, model.isPicked = !model.isPicked)"
      >
        <i class="iconfont icon-dianzan text-grey" :class="{'text-black': model.isPicked}"></i>
        <span>{{model.like}}</span>
      </div>
    </div>
    <!-- end of article -->

    <div class="article-comments bg-white-1 px-4 pb-2">
      <div class="d-flex jc-between py-4 mb-1">
        <span class="text-grey">精选评论</span>
        <span class="text-blue-1" @click="onWrite">写评论</span>
      </div>

      <div class="mb-4" v-for="(comment, l) in model.comments" :key="l">
        <div class="content text-dark-3">{{comment.content}}</div>
        <div class="text-grey fs-sm pb-2 text-right">{{comment.date}}</div>
      </div>
    </div>
    <!-- end of comments -->

    <div class="recommand border-top bg-white-1 link p-4 pb-5 mt-4">
      <div class="d-flex ai-center border-bottom pb-3">
        <i class="iconfont icon-xiangguan fs-xxl"></i>
        <span class="text-dark-3 pt-1 fs-xl ml-1">相关推荐</span>
      </div>
      <div class="pt-3">
        <router-link
          class="pt-2 mb-2 d-flex jc-between"
          :class="{'mt-1': m != 0}"
          tag="div"
          v-for="(item, m) in model.related"
          :key="m"
          :to="`/articles/${category}/${item._id}`"
        >
          <span class="text-ellipsis mr-3">{{item.title}}</span>
          <span class="fs-sm text-grey-1 ml-3">{{ item.date}}</span>
        </router-link>
      </div>
    </div>
    <!-- end of related -->

    <form class="article-write-comment bg-white-1 border-top" :class="{'on-write': wireStatus}">
      <div class="bg-white d-flex jc-between ai-center pt-3 p-4">
        <i class="iconfont icon-close fs-xxxl" @click="closeAndSubmit"></i>
        <span class="fs-lg">写评论</span>
        <span
          class="commit py-2 px-3"
          :class="{'text-grey bg-white-2': !comments.content,'bg-red-1 text-white': !!comments.content}"
          @click="submitComment"
        >提交</span>
      </div>
      <textarea
        v-reset-page
        @blur="onBlur"
        ref="focusTextarea"
        class="fs-lg px-4"
        cols="30"
        rows="10"
        placeholder="想说点什么..."
        v-model="comments.content"
      ></textarea>

      <div v-show="newComments.length > 0" class="new-coment-list mx-4 pb-3">
        <div class="text-grey-1 fs-sm py-3">我的评论</div>
        <div class="mb-3 d-flex jc-between ai-center" v-for="(cmt, e) in newComments" :key="e">
          <span class="new-content text-dark-3 fs-lg text-ellipsis">{{cmt.content}}</span>
          <span class="text-grey text-right">{{cmt.date}}</span>
        </div>
      </div>

      <div
        v-if="submitStatus != 0"
        class="submit-animate text-center py-4"
        :class="{'bg-black-9': submitStatus === 1,'bg-dark-1': submitStatus === 2}"
      >
        <div class="mt-2">
          <i v-if="submitStatus === 1" class="iconfont icon-jiazaizhong1"></i>
          <i v-else class="iconfont icon-gou text-white"></i>
        </div>
        <div class="on-load mt-4 text-white fs-sm">{{submitStatus === 1 ? '正在加载....' : '已评论'}}</div>
      </div>
    </form>
    <!-- end of write-comments -->

    <m-cover id="cover" @click.native="closeAndSubmit"></m-cover>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { mapMutations } from "vuex";
export default {
  props: {
    category: { required: true },
    id: { required: true }
  },
  data() {
    return {
      model: null,
      customToolbar: [[]],
      like: false,
      wireStatus: false,
      blurStatus: false,
      submitStatus: 0,
      newComments: [], // 用于显示和提交
      comments: {
        // 仅用于缓存数据
        content: ""
      }
    };
  },

  components: {
    VueEditor
  },
  watch: {
    id: "fetch" // 监听id变化 执行 fetch 方法
  },
  methods: {
    ...mapMutations(["onLoading", "onCover"]),
    noScroll(event) {
      // 编辑状态时，阻止页面滚动行为
      if (this.wireStatus && !this.blurStatus) {
        event.preventDefault();
      }
    },
    onBlur() {
      // 键盘弹出后底部会撑开一段高度，键盘消失后，需要短暂的时间让页面能够滚动回到原来的位置
      this.blurStatus = true;
      setTimeout(() => {
        this.blurStatus = false;
      }, 500);
    },
    async fetch() {
      this.onLoading();

      const res = await this.$http.get(`articles/list/${this.id}`);
      this.model = res.data;

      // console.log(this.model.isPicked)
      this.onLoading();
    },
    async pick(id, like) {
      let data = [id, like];
      const res = await this.$http.post("update/article", data);
      // console.log(res.data)
    },
    submitComment() {
      if (!this.comments.content) {
        return;
      }

      let content = JSON.parse(JSON.stringify(this.comments.content));

      this.newComments.unshift({
        content,
        date: new Date()
          .toLocaleTimeString()
          .split(":")
          .splice(0, 2)
          .join(":")
      });

      // 提交动画
      this.submitStatus = 1; // 出现转圈，提示 提交中
      setTimeout(() => {
        this.submitStatus = 2; // 出现勾，提示 评论成功
        setTimeout(() => {
          this.submitStatus = 0; // 动画结束
        }, 1000);
      }, 800);

      this.comments.content = "";

      // 上传数据在关闭评论框时上传，减少上传数据
    },
    async closeAndSubmit() {
      this.onCover(); // 关闭遮罩层
      this.comments.content = "";

      this.wireStatus = !this.wireStatus;

      if (this.newComments.length <= 0) {
        return;
      }
      // 上传数据
      let data = JSON.parse(JSON.stringify(this.newComments));

      data.map(item => {
        // 真正上传的数据
        item.date = new Date()
          .toLocaleString()
          .split(" ")[0]
          .split("/")
          .join(".");
      });

      if (data.length > 1) {
        data = data.reverse();
      }

      // console.log(data)

      await this.$http.post(`article/comment/${this.id}`, data);

      this.newComments = [];
    },
    onWrite() {
      this.onCover(); // 打开遮罩层

      this.wireStatus = !this.wireStatus;
      this.$refs.focusTextarea.focus();
    }
  },
  created() {
    this.id && this.category && this.fetch();
  }
};
</script>

<style lang="scss">
.page-article {
  .title {
    line-height: 1.6rem;
  }
  .picking {
    width: 7rem;
    margin: 0 auto;
    border: 1px solid #7a7a80;
    border-radius: 3rem;
    transition: all 0.3s;

    &.on {
      border-color: #000;

      & > i {
        transition: all 0.3s;
      }
    }
  }

  .recommand {
    border-radius: 0.384615rem 0.384615rem 0 0;
  }

  .article-comments {
    width: 100vw;
    .content {
      line-height: 1.5rem;
      letter-spacing: 0.076923rem;
    }
  }

  .article-write-comment {
    width: 100vw;
    height: 0;
    position: absolute;
    bottom: 0;
    z-index: 888;
    border-radius: 8px 8px 0 0;
    transition: all 0.5s;
    overflow: hidden;

    &.on-write {
      height: auto;
    }

    .commit {
      border-radius: 0.384615rem;
      transition: all 0.5s;
    }

    textarea {
      width: 100%;
      border: none;
    }

    .new-coment-list {
      height: 20rem;
      overflow: scroll;

      .new-content {
        max-width: 20rem;
      }
    }

    .submit-animate {
      height: 8rem;
      width: 8rem;

      position: absolute;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 0.384615rem;
      z-index: 999;

      .icon-gou,
      .icon-jiazaizhong1 {
        font-size: 2.6rem !important;

        /* animation: curcle 1s infinite;
        @keyframes curcle {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
          }
        }*/
      }

      .on-load {
        letter-spacing: 0.038462rem;
      }
    }
  }

  .body {
    img {
      max-width: 100%;
      height: auto;
    }
    iframe {
      width: 100%;
      height: auto;
    }
  }
}

.ql-editor.ql-blank {
  padding: 0;
  font-size: 1.076923rem;
}
.ql-toolbar.ql-snow {
  display: none;
}
#quill-container.ql-container.ql-snow.ql-disabled {
  border: none;
}
</style>