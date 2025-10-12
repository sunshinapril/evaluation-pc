<template>
  <div class="g-main">
    <div class="top-wrap">
      <t-header />
    </div>
    <el-container class="g-container">
      <!-- 侧边栏 -->
      <div class="sidebar" v-if="isSidebar">
        <!-- <div class="sidebar"> -->
        <div class="sidebar-content">
          <sidebar />
        </div>
      </div>
      <div class="g-router-view">
        <div class="breadcrumb-container">
          <hamburger id="hamburger-container" class="hamburger-container" />
          <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        </div>
        <router-view />
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
  .top-wrap {
    height: 50px;
    flex-shrink: 0;
    border-bottom: 8px solid #f0f2f5;
  }
  .g-container {
    display: flex;
    flex: 1;
    height: calc(100% - 60px);
    .g-router-view {
      height: 100%;
      flex: 1;
      margin-left: 20px;
      margin-right: 10px;
      overflow: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      .breadcrumb-container {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
      }
    }
    .sidebar {
      width: 200px;
      height: 100%;
      flex-shrink: 0;
      overflow: visible;
      padding-bottom: 20px;
      background: #f7fafd;
      position: relative;
      box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, 0.13);
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
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        padding: 0;
      }
    }
  }
}
</style>
