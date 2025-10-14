<template>
  <div class="g-main">
    <el-container class="g-container">
      <!-- 侧边栏 -->
      <div class="sidebar" v-if="isSidebar">
        <div class="sidebar-header">
          <img class="sidebar-header-img" src="@/assets/images/login/logo.png" alt="" />
        </div>
        <div class="sidebar-content">
          <sidebar />
        </div>
      </div>
      <div class="g-router-view">
        <div class="top-wrap">
          <t-header />
        </div>
        <!-- <div class="breadcrumb-container">
          <hamburger id="hamburger-container" class="hamburger-container" />
          <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        </div> -->
        <div class="main">
          <router-view />
        </div>
      </div>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from "./components/TSideBar/index.vue";
import THeader from "./components/THeader/index.vue";
import Breadcrumb from "./components/Breadcrumb/index.vue";
import Hamburger from "./components/Hamburger/index.vue";
import { computed } from "vue";
import useUser from "@/store/modules/user";
import usePermission from "@/store/modules/permission";
// const visiableSidebarRouters = computed(() => {
//   const visibleRoutes = usePermission().sidebarRouters.filter((e) => !e.hidden);
//   return !!(visibleRoutes && visibleRoutes.length);
// })
const isCollapse = computed(() => useUser().isCollapse);
const isSidebar = computed(() => {
  return isCollapse.value;
});
</script>

<style lang="less" scoped>
.g-main {
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .g-container {
    display: flex;
    flex: 1;
    height: calc(100% - 60px);
    .g-router-view {
      height: 100%;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .top-wrap {
        height: 60px;
        flex-shrink: 0;
      }
      .main {
        flex: 1;
        padding: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background: #E1EDFF;
      }
      // .breadcrumb-container {
      //   flex-shrink: 0;
      //   display: flex;
      //   align-items: center;
      //   height: 50px;
      //   line-height: 50px;
      // }
    }
    .sidebar {
      width: 200px;
      height: 100%;
      flex-shrink: 0;
      background: #fff;
      box-shadow: 0px 2px 4px -2px rgba(0, 0, 0, 0.1),0px 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      &-header {
        width: 100%;
        flex-shrink: 0;
        &-img {
          width: 100%;
          height: 100%;
        }
      }
      // &.isCollapse {
      //   width: 200px;
      //   .sidebar-content {
      //     height: 100%;
      //     overflow: hidden;
      //     overflow-y: auto;
      //     padding: 0 25px;
      //   }
      // }
      .sidebar-content {
        flex: 1;
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        padding: 0;
      }
    }
  }
}
</style>
