<template>
  <div class="logo-wrap">
    <!-- <img class="logo" :src="logoUrl" /> -->
    <span>SCRM</span>
  </div>
</template>
<script setup>
import logoUrl from "@/assets/images/common/logo.png";
</script>
<style lang="less" scoped>
.logo-wrap {
  width: 104px;
  height: 40px;
  flex-shrink: 0;
  .logo {
    width: 100%;
    height: 100%;
  }
  span {
    display: inline-block;
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
    font-weight: 600;
    line-height: 40px;
    margin-left: 18px;
  }
}
</style>
