<template>
  <div class="write px-4 pt-2">
    <h4 class="p-4 text-black text-center">听说来到这的人（并写下留言）都是最酷的！</h4>
    <form>
      <textarea
        v-reset-page
        v-model="data.content"
        class="p-4 fs-xl flex-1 text-black"
        placeholder="告诉我一个关于你的秘密可好..."
        cols="20"
        rows="8"
        maxlength="90"
        @input="input(data.content)"
        :readonly="isCustomer"
      ></textarea>
      <span class="count text-grey px-3 py-3">{{worldCount}}/90</span>
    </form>
    <div
      class="text-center mt-4 px-4 py-3 text-white"
      @click="submit"
      :class="{'bg-danger': publish,'bg-red-1': !publish}"
    >{{message}}</div>

    <div class="check"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      publish: false,
      message: "发表",
      worldCount: 0,
      isCustomer: false,
      id: this.$route.path.split("/")[3],
      data: {
        content: "",
        date: new Date()
          .toLocaleDateString()
          .split("/")
          .join(".")
      }
    };
  },
  methods: {
    input(content) {
      this.message = "发送";
      this.worldCount = content.length;
    },
    async submit() {
      if (this.isCustomer) {
        this.isCustomer = false;
        this.data.content = "";
        this.worldCount = 0;
        this.message = "发送";
        return;
      } else {
        if (!this.data.content.replace(/(\s*$)/g, "")) {
          this.message = "它还是空的...";
          return;
        } else {
          this.publish = !this.publish;
          this.isCustomer = !this.isCustomer;

          this.message = "发表中...";
          const res = await this.$http.post("comment/submit", this.data);
          // console.log(res.data);

          setTimeout(() => {
            this.publish = !this.publish;
            this.message = "留言成功！ 请点击右上角返回查看";
            this.data.content = "";
            setTimeout(() => {
              this.isCustomer = !this.isCustomer;
              this.message = "发表";
            }, 3000);
          }, 500);
        }
      }
    },

    async fetchComment() {
      const res = await this.$http.get(`comments/${this.id}`);
      this.data.content = res.data.content;
      this.worldCount = this.data.content.length;
      // console.log(this.data.content);
    }
  },

  created() {
    if (this.id) {
      this.isCustomer = true;
      this.fetchComment();
      this.message = "点击我也写下你的心情吧...";
    } else {
      this.message = "发表";
    }
  }
};
</script>

<style lang="scss">
.write {
  height: calc(100vh - 10.31rem);
  form {
    position: relative;
    & > .count {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    textarea {
      width: 100%;
      border: none;
      border-radius: 8px;
      line-height: 1.8rem;
      resize: none;
    }
    & > div {
      border: 1px solid #cc0000;
      border-radius: 3px;
    }
  }
}
</style>

