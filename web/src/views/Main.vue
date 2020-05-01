<template>
  <div
    class="main"
    @touchmove="noTouchMove"
    :class="{no_scroll: openMenu || this.$store.state.load}"
  >
    <div
      class="topbar bg-white pt-3 pb-1 px-3 d-flex ai-center"
      :class="{'bg-black': !child, 'home': child}"
    >
      <router-link to="/" class="pl-2">
        <img class="logo" src="../assets/logo1.png" height="35" />
      </router-link>
      <div class="px-2 ml-1 fs-lg flex-1">
        <router-link
          to="/"
          tag="div"
          :class="{'text-white': !child, 'text-dark': child, 'text-center': /comments/.test($route.path)}"
        >
          <span
            :class="{'fs-xxl': /comments/.test($route.path)}"
          >{{ /comments/.test($route.path) ? 'THIS IS US' : 'TIU'}}</span>
        </router-link>

        <router-link
          to="/"
          tag="div"
          class="fs-xxs"
          :class="{'text-white-2': !child, 'text-grey-2': child}"
          v-if="!(/comments/.test($route.path))"
        >
          <span>记录小站</span>
        </router-link>
      </div>
      <div v-if="child" class="mr-1 menu-btn" :class="{close: openMenu}" @click="changeMenu"></div>
      <i
        v-else-if="$route.path==='/comments'"
        @click="$router.push('/comments/write')"
        class="mr-1 iconfont icon-icon-test text-white fs-xxxxl"
      ></i>
      <i
        v-else
        @click="/(\/photos\/\w{0,11}$){1}/.test($route.path)? $router.push('/') : $router.go(-1)"
        class="mr-1 iconfont icon-right fs-xxxxl text-white"
      ></i>
    </div>

    <m-cover @click.native="changeMenu"></m-cover>

    <div class="nav-wrap border-left bg-light-2" :class="{show: openMenu, killed: killMenu}">
      <div
        class="nav d-flex"
        :class="{show :menuIndex === 2 || menuIndex === 3 || menuIndex === 4}"
      >
        <ul class="nav-list main">
          <li class="on" @click="changeMenu">
            <router-link tag="div" class="nav-item px-4 fs-xl d-flex text-dark-1" to="/">
              <span>主页</span>
              <i class="iconfont icon-zhuye1"></i>
            </router-link>
          </li>
          <li @click="menuIndex=2">
            <div class="nav-item px-4 fs-xl d-flex text-dark-1">
              <span>图集</span>
              <i class="iconfont icon-you"></i>
            </div>
          </li>
          <li @click="menuIndex=3">
            <div class="nav-item px-4 fs-xl d-flex text-dark-1">
              <span>文章</span>
              <i class="iconfont icon-you"></i>
            </div>
          </li>
          <li @click="changeMenu">
            <router-link
              tag="div"
              class="nav-item px-4 fs-xl d-flex text-dark-1 bg-white-2"
              to="/comments"
            >
              <span>留言板</span>
            </router-link>
          </li>
        </ul>
        <div class="nav-list-images d-flex" :class="{show_next: artistc}" v-if="menuIndex===2">
          <ul class="nav-list child">
            <li @click="menuIndex=1">
              <router-link tag="div" to class="nav-item px-4 fs-xl bg-red-1 text-white">
                <span id="back">&lt;</span>
                <span>返回</span>
              </router-link>
            </li>
            <li>
              <div class="nav-item px-4 fs-xl text-black">
                <span id="choose">&gt;</span>
                <span>选一个吧~</span>
              </div>
            </li>
            <!-- 如果要添加人像下属分类在此li 添加点击事件触发 artistc = !artistc -->
            <li @click="changeMenu">
              <router-link
                to="/photos/people"
                tag="div"
                class="nav-item child pl-6 pr-4 fs-xl d-flex text-dark-1"
              >
                <span>人像</span>
                <!-- <i class="iconfont icon-you"></i> -->
              </router-link>
            </li>
            <li @click="changeMenu">
              <router-link
                to="/photos/animal"
                tag="div"
                class="nav-item child pl-6 pr-4 fs-xl text-dark-1"
              >
                <span>小动物</span>
              </router-link>
            </li>
            <li @click="changeMenu">
              <router-link
                to="/photos/black_white"
                tag="div"
                class="nav-item child pl-6 pr-4 fs-xl text-dark-1"
              >
                <span>黑白</span>
              </router-link>
            </li>
            <li @click="changeMenu">
              <router-link
                to="/photos/view"
                tag="div"
                class="nav-item child px-6 pr-4 fs-xl text-dark-1"
              >
                <span>风光</span>
              </router-link>
            </li>
            <li @click="changeMenu">
              <router-link
                to="/photos/others"
                tag="div"
                class="nav-item child px-6 pr-4 fs-xl text-dark-1"
              >
                <span>其他</span>
              </router-link>
            </li>
          </ul>
          <!-- <ul class="nav-list child images-artistc-photos">
            <li @click="artistc = !artistc">
              <router-link tag="div" to class="nav-item px-4 fs-xl bg-red-1 text-white">
                <span id="back">&lt;</span>
                <span>返回</span>
              </router-link>
            </li>
            <li>
              <div class="nav-item px-4 fs-xl text-black">
                <span id="choose">&gt;</span>
                <span>选一个吧~</span>
              </div>
            </li>
            <li>
              <router-link to tag="div" class="nav-item child pl-6 pr-4 fs-xl text-dark-1">
                <span>写实</span>
              </router-link>
            </li>
            <li>
              <router-link to tag="div" class="nav-item child pl-6 pr-4 fs-xl text-dark-1">
                <span>校园</span>
              </router-link>
            </li>
            <li>
              <router-link to tag="div" class="nav-item child pl-6 pr-4 fs-xl text-dark-1">
                <span>古风</span>
              </router-link>
            </li>
            <li>
              <router-link to tag="div" class="nav-item child pl-6 pr-4 fs-xl d-flex text-dark-1">
                <span>街拍</span>
              </router-link>
            </li>
            <li>
              <router-link to tag="div" class="nav-item child px-6 pr-4 fs-xl text-dark-1">
                <span>萝莉</span>
              </router-link>
            </li>
          </ul>-->
        </div>
        <ul v-else class="nav-list child articles">
          <li @click="menuIndex=1">
            <router-link tag="div" to class="nav-item px-4 fs-xl bg-red-1 text-white">
              <span id="back">&lt;</span>
              <span>返回</span>
            </router-link>
          </li>
          <li>
            <div class="nav-item px-4 fs-xl text-black">
              <span id="choose">&gt;</span>
              <span>选一个吧~</span>
            </div>
          </li>
          <li @click="changeMenu">
            <router-link
              to="/articles/study"
              tag="div"
              class="nav-item child pl-6 pr-4 fs-xl text-dark-1"
            >
              <span>学习</span>
            </router-link>
          </li>
          <li @click="changeMenu">
            <router-link
              to="/articles/life"
              tag="div"
              class="nav-item child pl-6 pr-4 fs-xl text-dark-1"
            >
              <span>生活</span>
            </router-link>
          </li>
          <li @click="changeMenu">
            <router-link
              to="/articles/story"
              tag="div"
              class="nav-item child pl-6 pr-4 fs-xl d-flex text-dark-1"
            >
              <span>故事</span>
            </router-link>
          </li>
          <li @click="changeMenu">
            <router-link
              to="/articles/emotion"
              tag="div"
              class="nav-item child px-6 pr-4 fs-xl text-dark-1"
            >
              <span>情感</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />

    <loading v-if="this.$store.state.load"></loading>

    <div class="footer">
      <div class="d-flex jc-between ai-center bg-grey-3 py-4 px-4">
        <div>
          <i class="iconfont icon-QQ mr-2" @click="tool = 'qq', isShowTool = true "></i>
          <i class="iconfont icon-weixin" @click="tool = 'weixin', isShowTool = true"></i>
        </div>
        <div class="text-black motto">
          <span class="our">OUR</span>
          <span class="contact pl-1">contact</span>
        </div>
      </div>
      <div class="bread bg-dark-1 text-center text-white">
        <p class="m-0">Thank you for coming | 2020</p>
      </div>
    </div>

    <div :class="{show: isShowTool}" @click="isShowTool = false" class="qr bg-white">
      <img v-if="tool == 'qq'" src="../assets/images/qq.jpg" />
      <img v-else src="../assets/images/wx.jpg" />
    </div>
  </div>
</template>

<script>
import loading from "../components/Loading";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      openMenu: false,
      index: 0,
      menuIndex: 1,
      artistc: false,
      killMenu: false,
      tool: "",
      isShowTool: false
    };
  },
  computed: {
    child() {
      return this.$route.path === "/";
    }
  },
  components: {
    loading
  },
  methods: {
    ...mapMutations(["onCover"]),
    changeMenu() {
      if(this.isShowTool) {
        return
      }
      this.openMenu = !this.openMenu;

      if (!this.openMenu) {
        this.onCover();
        this.killMenu = true;
      } else {
        this.onCover();

        this.killMenu = false;
      }
      this.menuIndex = 1;
    },

    noTouchMove(e) {
      if (this.isShowTool) {
        e.preventDefault();
      }
    }
  }
};
</script>

<style lang="scss">
.main {
  position: relative;

  &.no_scroll {
    height: 100vh;
    overflow: hidden;
  }
}

.qr {
  position: fixed;
  width: 100vw;
  height: calc(100vh - 10rem);
  top: 4.272308rem;
  bottom: 6.015385rem;
  left: 100%;
  z-index: 999;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease-in;

  &.show {
    visibility: visible;
    left: 0;
    // height: calc(100vh - 10.4rem);
    opacity: 1;
  }

  img {
    width: 100%;
    transform: scale(0.6);
  }
}

.topbar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 990;

  &.home {
    border-bottom: 1px solid #f9f9f9;
  }

  .logo {
    border-radius: 20% 20% 0 20%;
  }

  .menu-btn {
    width: 2.3rem;
    height: 2.3rem;
    background: url("../assets/images/btn-spmenu.png") no-repeat;
    background-size: contain;
  }

  .close {
    background: url("../assets/images/btn-close.png") no-repeat;
    background-size: contain;
  }

  .icon-right,
  .icon-icon-test {
    font-weight: bolder;
  }
}

.footer {
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;

  .motto {
    font-size: 1.769231rem;
  }

  .our {
    font-weight: 900;
    letter-spacing: -1px;
  }

  .icon-QQ,
  .icon-weixin {
    font-size: 1.923077rem;
    transform: scaleX(1.2);
  }
}
</style>
