<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-header style="text-align: right; font-size: 12px">
      <em id="LOGO">YMU Photography Station</em>
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 20px; font-size: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="$router.push(`/admin_users/edit/${adminUser._id}`)">修改信息</el-dropdown-item>
          <el-dropdown-item @click.native="quit">安全退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span id="user">欢迎您，{{ adminUser.name }}</span>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router unique-opened :default-active="$route.path" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-collection"></i>内容管理
            </template>

            <el-menu-item-group>
              <template slot="title">
                <i class="el-icon-picture" />图片素材
              </template>
              <el-menu-item index="/images/create">新素材</el-menu-item>
              <el-menu-item index="/images/list">素材列表</el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group>
              <template slot="title">
                <i class="el-icon-camera-solid" />工作室作品
              </template>
              <el-menu-item index="/pictures/create">新作品</el-menu-item>
              <el-menu-item index="/pictures/list">作品列表</el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group>
              <template slot="title">
                <i class="el-icon-s-order" />文章
              </template>
              <el-menu-item index="/articles/create">新文章</el-menu-item>
              <el-menu-item index="/articles/list">文章列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-message"></i>运营管理
            </template>

            <el-menu-item-group>
              <template slot="title">
                <i class="el-icon-s-flag" />主页轮播图
              </template>
              <el-menu-item index="/ads/create">新建轮播图</el-menu-item>
              <el-menu-item index="/ads/list">轮播图列表</el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group>
              <template slot="title">
                <i class="el-icon-s-data" />留言管理
              </template>
              <el-menu-item index="/comments/list">留言列表</el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group>
              <template slot="title">
                <i class="el-icon-user-solid" />用户管理
              </template>
              <el-menu-item index="/users/list">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>系统设置
            </template>

            <el-menu-item-group>
              <template slot="title">
                <i class="el-icon-s-management" />内容分类
              </template>
              <el-menu-item index="/categories/create">新建分类</el-menu-item>
              <el-menu-item index="/categories/list">分类列表</el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group>
              <template slot="title">
                <i class="el-icon-s-custom" />管理员
              </template>
              <el-menu-item index="/admin_users/create">增加管理员</el-menu-item>
              <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      adminUser: {}
    };
  },
  methods: {
    quit() {
      this.$confirm("您确定要退出吗？", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          localStorage.clear();
          this.$router.push("/login");
        })
        .catch(action => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  },
  created() {
    if (localStorage.adminUser) {
      this.adminUser = JSON.parse(localStorage.adminUser);
    }
    // console.log(localStorage.adminUser);
    // console.log(this.adminUser);
  }
};
</script>

<style>
.el-header {
  background: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

#user {
  font-size: 15px;
}

#LOGO {
  font-size: 25px;
  font-weight: 600;
  text-shadow: 0 1px 2px #fff;
  color: #333;
  float: left;
}
</style>

